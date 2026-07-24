# Plano de Implementação do Bloco de Raciocínio do Agente

## Visão Geral

Substituir a atual faixa de chamada de ferramenta por um novo **Bloco de Raciocínio do Agente** - um bloco expansível de várias linhas que mostra o processo de raciocínio do agente durante a execução, e então se recolhe para "Pensou por N s" durante o streaming da resposta final.

---

## Referência de Design

**Durante o Loop do Agente (Expandido):**

```
┌──────────────────────────────────────────────────┐
│ ⠿ Raciocínio · 9s                                │
│                                                  │
│ • Buscando notas por "aprendizado de máquina"    │
│ • 5 notas relevantes encontradas, analisando     │
└──────────────────────────────────────────────────┘
```

**Durante a Resposta Final (Recolhido):**

```
┌──────────────────────────────────────────────────┐
│ ▸ Pensou por 12s                                 │
└──────────────────────────────────────────────────┘
```

**Após Conclusão da Resposta (Expansível):**

```
┌──────────────────────────────────────────────────┐
│ ▸ Pensou por 12s               [clique para abrir] │
└──────────────────────────────────────────────────┘
```

---

## Nomenclatura

| Termo                           | Descrição                                         |
| ------------------------------- | ------------------------------------------------- |
| **Bloco de Raciocínio do Agente**| O componente completo de interface do usuário     |
| **Passos de Raciocínio**        | Tópicos individuais (1-2 por iteração)            |
| **Cronômetro de Raciocínio**    | Contador de segundos decorridos                   |

---

## Arquitetura

### Máquina de Estados

```
┌─────────────┐   chamada de ferr. ┌─────────────┐
│   OCIOSO    │ ────────────────▶  │ RACIOCÍNIO  │
└─────────────┘                    └─────────────┘
                                         │
                                         │ inicia resposta final
                                         ▼
                                   ┌─────────────┐
                                   │  RECOLHIDO  │
                                   └─────────────┘
                                         │
                                         │ resposta completa
                                         ▼
                                   ┌─────────────┐
                                   │  COMPLETO   │
                                   └─────────────┘
```

### Fluxo de Dados

```
AutonomousAgentChainRunner
    │
    ├── onReasoningStart(timestamp)
    │       └── Inicia cronômetro, define status = REASONING
    │
    ├── onReasoningStep(summary: string)
    │       └── Adiciona marcador ao array de passos
    │
    ├── onReasoningEnd()
    │       └── Define status = COLLAPSED, para cronômetro
    │
    └── Streaming final via updateCurrentAiMessage
            └── Transmissão normal de texto (bloco fica recolhido)
```

---

## Fases de Implementação

### Fase 1: Modelo de Dados e Estado

**Arquivo:** `src/LLMProviders/chainRunner/utils/AgentReasoningState.ts` (novo)

```typescript
export interface ReasoningStep {
  timestamp: number;
  summary: string; // ex: "Buscando notas por 'IA'"
  toolName?: string;
}

export interface AgentReasoningState {
  status: "idle" | "reasoning" | "collapsed" | "complete";
  startTime: number | null;
  elapsedSeconds: number;
  steps: ReasoningStep[];
}

export function createInitialReasoningState(): AgentReasoningState {
  return {
    status: "idle",
    startTime: null,
    elapsedSeconds: 0,
    steps: [],
  };
}

// Serializa para formato de marcador (embutido na mensagem)
export function serializeReasoningBlock(state: AgentReasoningState): string {
  const data = {
    elapsed: state.elapsedSeconds,
    steps: state.steps.map((s) => s.summary),
  };
  return `<!--REASONING_BLOCK:${JSON.stringify(data)}-->`;
}

// Analisa formato de marcador
export function parseReasoningBlock(marker: string): { elapsed: number; steps: string[] } | null {
  const match = marker.match(/<!--REASONING_BLOCK:(.+?)-->/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}
```

### Fase 2: Atualização do AutonomousAgentChainRunner

**Arquivo:** `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts`

**Mudanças:**

1. Adicionar rastreamento de estado do raciocínio:

```typescript
private reasoningState: AgentReasoningState = createInitialReasoningState();
private reasoningTimerInterval: NodeJS.Timeout | null = null;
```

2. Adicionar métodos auxiliares:

```typescript
private startReasoningTimer(updateFn: (message: string) => void): void {
  this.reasoningState = {
    status: 'reasoning',
    startTime: Date.now(),
    elapsedSeconds: 0,
    steps: [],
  };

  // Atualiza a cada 100ms para um cronômetro responsivo
  this.reasoningTimerInterval = setInterval(() => {
    if (this.reasoningState.startTime) {
      this.reasoningState.elapsedSeconds = Math.floor(
        (Date.now() - this.reasoningState.startTime) / 1000
      );
      // Emite bloco de raciocínio atualizado
      updateFn(this.buildReasoningBlockMarkup());
    }
  }, 100);
}

private addReasoningStep(summary: string): void {
  // Mantém apenas os últimos 2 passos para exibição concisa
  this.reasoningState.steps.push({
    timestamp: Date.now(),
    summary,
  });
  if (this.reasoningState.steps.length > 2) {
    this.reasoningState.steps.shift();
  }
}

private stopReasoningTimer(): void {
  if (this.reasoningTimerInterval) {
    clearInterval(this.reasoningTimerInterval);
    this.reasoningTimerInterval = null;
  }
  this.reasoningState.status = 'collapsed';
}

private buildReasoningBlockMarkup(): string {
  const { status, elapsedSeconds, steps } = this.reasoningState;

  if (status === 'idle') return '';

  // Usa marcador especial que o ChatSingleMessage irá analisar
  const stepsJson = JSON.stringify(steps.map(s => s.summary));
  return `<!--AGENT_REASONING:${status}:${elapsedSeconds}:${stepsJson}-->`;
}
```

3. Integrar ao loop do agente:

```typescript
async run(...) {
  // Inicia o cronômetro de raciocínio no começo
  this.startReasoningTimer(updateCurrentAiMessage);

  try {
    // ... loop do agente ...

    // Quando executando uma ferramenta:
    this.addReasoningStep(`Chamando ${toolName}...`);
    updateCurrentAiMessage(this.buildReasoningBlockMarkup());

    // Após resultado da ferramenta:
    this.addReasoningStep(this.summarizeToolResult(toolName, result));
    updateCurrentAiMessage(this.buildReasoningBlockMarkup());

    // Quando a resposta final começa:
    this.stopReasoningTimer();
    const collapsedBlock = this.buildReasoningBlockMarkup();

    // Stream de resposta final DEPOIS do bloco recolhido
    for await (const chunk of stream) {
      updateCurrentAiMessage(collapsedBlock + chunk);
    }

  } finally {
    this.stopReasoningTimer();
  }
}
```

4. Adicionar helper de sumarização de passos:

```typescript
private summarizeToolResult(toolName: string, result: any): string {
  switch (toolName) {
    case 'localSearch':
      const count = result?.documents?.length || 0;
      return `Encontradas ${count} nota${count !== 1 ? 's' : ''} relevante(s)`;
    case 'webSearch':
      return 'Resultados de busca da web recuperados';
    case 'getTimeRangeMs':
      return 'Intervalo de tempo calculado';
    default:
      return `Completou ${toolName}`;
  }
}
```

### Fase 3: Componente React

**Arquivo:** `src/components/chat-components/AgentReasoningBlock.tsx` (novo)

```tsx
import React, { useState, useEffect, useRef } from "react";

interface AgentReasoningBlockProps {
  status: "reasoning" | "collapsed" | "complete";
  elapsedSeconds: number;
  steps: string[];
  isStreaming: boolean;
}

export const AgentReasoningBlock: React.FC<AgentReasoningBlockProps> = ({
  status,
  elapsedSeconds,
  steps,
  isStreaming,
}) => {
  const [isExpanded, setIsExpanded] = useState(status === "reasoning");

  // Recolher automaticamente quando o estado mudar para collapsed
  useEffect(() => {
    if (status === "collapsed" || status === "complete") {
      setIsExpanded(false);
    } else if (status === "reasoning") {
      setIsExpanded(true);
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isActive = status === "reasoning";

  return (
    <div className="agent-reasoning-block">
      {/* Cabeçalho - sempre visível */}
      <div
        className="agent-reasoning-header"
        onClick={() => !isActive && setIsExpanded(!isExpanded)}
        style={{ cursor: isActive ? "default" : "pointer" }}
      >
        {/* Spinner ou chevron de expansão */}
        <span className="agent-reasoning-icon">
          {isActive ? (
            <LoadingSpinner />
          ) : (
            <span className={`chevron ${isExpanded ? "expanded" : ""}`}>▸</span>
          )}
        </span>

        {/* Título e cronômetro */}
        <span className="agent-reasoning-title">{isActive ? "Raciocínio" : "Pensou por"}</span>
        <span className="agent-reasoning-timer">{formatTime(elapsedSeconds)}</span>
      </div>

      {/* Passos - visíveis quando expandido */}
      {isExpanded && steps.length > 0 && (
        <ul className="agent-reasoning-steps">
          {steps.map((step, i) => (
            <li key={i} className="agent-reasoning-step">
              {step}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <span className="agent-reasoning-spinner">
    {/* Spinner de padrão braille 6 pontos */}
    <span className="spinner-dots">⠿</span>
  </span>
);
```

### Fase 4: Estilização CSS

**Arquivo:** `src/styles/tailwind.css` (anexar ao existente)

```css
/* Bloco de Raciocínio do Agente */
.agent-reasoning-block {
  margin: 8px 0;
  padding: 12px 16px;
  border-radius: var(--radius-m);
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  font-size: var(--font-ui-small);
}

.agent-reasoning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.agent-reasoning-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
}

.agent-reasoning-icon .chevron {
  transition: transform 0.15s ease;
  font-size: 10px;
}

.agent-reasoning-icon .chevron.expanded {
  transform: rotate(90deg);
}

.agent-reasoning-title {
  font-weight: var(--font-medium);
}

.agent-reasoning-timer {
  color: var(--text-faint);
}

.agent-reasoning-steps {
  margin: 8px 0 0 24px;
  padding: 0;
  list-style: disc;
}

.agent-reasoning-step {
  margin: 4px 0;
  color: var(--text-normal);
  line-height: 1.4;
}

/* Animação do Spinner */
.agent-reasoning-spinner .spinner-dots {
  display: inline-block;
  animation: reasoning-pulse 1s ease-in-out infinite;
}

@keyframes reasoning-pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
```

### Fase 5: Integração na Renderização da Mensagem

**Arquivo:** `src/components/chat-components/ChatSingleMessage.tsx`

**Mudanças:**

1. Adicionar analise do marcador de raciocínio:

```typescript
function parseAgentReasoningMarker(content: string): {
  hasReasoning: boolean;
  status: "reasoning" | "collapsed" | "complete";
  elapsedSeconds: number;
  steps: string[];
  contentAfter: string;
} | null {
  const match = content.match(/<!--AGENT_REASONING:(\w+):(\d+):(.+?)-->/);
  if (!match) return null;

  const [fullMatch, status, elapsed, stepsJson] = match;
  const steps = JSON.parse(stepsJson) as string[];

  return {
    hasReasoning: true,
    status: status as "reasoning" | "collapsed" | "complete",
    elapsedSeconds: parseInt(elapsed, 10),
    steps,
    contentAfter: content.replace(fullMatch, "").trim(),
  };
}
```

2. Atualizar lógica de renderização:

```typescript
// No render de ChatSingleMessage:
const reasoningData = parseAgentReasoningMarker(message.content);

return (
  <div className="chat-message">
    {/* Bloco de Raciocínio (se presente) */}
    {reasoningData?.hasReasoning && (
      <AgentReasoningBlock
        status={reasoningData.status}
        elapsedSeconds={reasoningData.elapsedSeconds}
        steps={reasoningData.steps}
        isStreaming={isStreaming}
      />
    )}

    {/* Conteúdo da Mensagem (após o marcador) */}
    <div className="message-content">
      {/* Renderizar remainingContent via markdown */}
    </div>
  </div>
);
```

### Fase 6: Remover Antiga Faixa de Chamada de Ferramentas

**Arquivos para modificar:**

1. `src/components/chat-components/ToolCallBanner.tsx` - Deletar ou descontinuar
2. `src/components/chat-components/toolCallRootManager.tsx` - Simplificar ou remover
3. `src/LLMProviders/chainRunner/utils/toolCallParser.ts` - Manter para retrocompatibilidade com mensagens salvas
4. `src/LLMProviders/chainRunner/utils/ThinkBlockStreamer.ts` - Remover tratamento de marcador de ferramenta

**Estratégia de descontinuação (deprecation):**

- Manter `parseToolCallMarkers()` para renderizar mensagens antigas
- Remover `createToolCallMarker()` e `updateToolCallMarker()`
- Não criar novos marcadores no executor (runner) de agente

### Fase 7: Desabilitar Bloco de Pensamento (Thinking) no Modo Agente

**Arquivo:** `src/LLMProviders/chainRunner/utils/ThinkBlockStreamer.ts`

Adicionar opção (flag) para pular extração de conteúdo de raciocínio no modo agente:

```typescript
export class ThinkBlockStreamer {
  private suppressThinkingContent: boolean;

  constructor(
    updateFn: (message: string) => void,
    options?: { suppressThinkingContent?: boolean }
  ) {
    this.updateFn = updateFn;
    this.suppressThinkingContent = options?.suppressThinkingContent ?? false;
  }

  processChunk(chunk: any): void {
    if (this.suppressThinkingContent) {
      // Pular o conteúdo de raciocínio, e extrair apenas texto
      // ... lógica simplificada ...
    } else {
      // ... lógica existente de bloco de pensamento ...
    }
  }
}
```

Em AutonomousAgentChainRunner:

```typescript
const streamer = new ThinkBlockStreamer(updateCurrentAiMessage, {
  suppressThinkingContent: true, // Modo agente usa AgentReasoningBlock
});
```

---

## Considerações de Desempenho

1. **Atualizações do Cronômetro**: Usar intervalo de 100ms para um aspecto fluído (responsive feel) sem renderizações excessivas
2. **Limite de Passos**: Manter apenas os 2 últimos passos para impedir inchaço no DOM
3. **Formato do Marcador**: Estrutura JSON compacta para que cause sobrecarga (overhead) mínima sobre a mensagem
4. **React Roots**: Adotar padrão atual (da faixa antiga) à permanência e constância sob instâncias do React

---

## Caminho de Migração

1. **Fase 1**: Adicionar o novo AgentReasoningBlock ao lado da faixa antiga de ferramentas
2. **Fase 2**: Testar de modo integral o funcionamento junto ao Agente para atestar retrocompatibilidade em mensagens salvas
3. **Fase 3**: Remover parte condizente do gerador das chamadas visuais no código (Tool call banner)
4. **Fase 4**: Limpar os métodos obsoletos e resquícios, após lançamento versão estável.

---

## Lista de Verificação (Checklist)

- [ ] Cronômetro e seus visuais operam suavemente sem intermitências na renderização (flicker)
- [ ] Listagens/Tópicos progridem de acordo a conclusão temporal no loop da ferramenta
- [ ] Fechamento ocorre logo na exibição da resposta natural em "Markdown"
- [ ] O recolher relata exata duração aferida sob finalização de raciocínio
- [ ] Funcionalidade por clique à exposição mantém funcional após todo o processo ter terminado
- [ ] Mensagens velhas exibindo `Banners de Ferramentas` funcionam adequadamente
- [ ] Ausência completa do padrão "Thinking Blocks" quando na ativação de "Agentes"
- [ ] Desempenho global (fluidez): não gera engasgos computacionais com o aglomerado repetitivo de iterações

---

## Resumo de Arquivos

| Arquivo                         | Ação                                      |
| ------------------------------- | ----------------------------------------- |
| `AgentReasoningState.ts`        | **Novo** - Gestão de Estado (State)       |
| `AgentReasoningBlock.tsx`       | **Novo** - Componente Base React          |
| `AutonomousAgentChainRunner.ts` | **Modificado** - Acoplar rastreador/timer |
| `ChatSingleMessage.tsx`         | **Modificado** - Renderizar o bloco nativo|
| `ThinkBlockStreamer.ts`         | **Modificado** - Injetar condicional      |
| `tailwind.css`                  | **Modificado** - Refinar CSS e classes    |
| `ToolCallBanner.tsx`            | **Descontinuado** - Retro-compatibilidade |
| `toolCallParser.ts`             | **Mantido** - Preservar mensagens antigas |
