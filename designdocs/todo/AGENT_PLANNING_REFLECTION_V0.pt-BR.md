# Visibilidade de Planejamento + Reflexão do Agente (v0)

**Data:** 2026-02-10  
**Status:** Rascunho (Draft)  
**Escopo:** Apenas Agente Autônomo (`AutonomousAgentChainRunner`)

## 1. Declaração do Problema

O loop atual do agente autônomo é funcional e simples, mas possui duas lacunas:

1. Não há um estado de plano explícito legível por máquina no loop ReAct.
2. A visibilidade do raciocínio é predominantemente focada em resumos de chamadas/resultados de ferramentas, com fraca reflexão no nível da iteração.

Hoje, o planejamento é implícito no texto do modelo e na ordem das ferramentas. A interface do usuário (`AgentReasoningBlock`) apenas vê sequências de texto de passos serializados, de modo que os usuários não conseguem rastrear claramente "qual é o plano atual" vs "o que acabou de acontecer".

## 2. Base Atual (O Que Temos)

- Loop ReAct com chamada de ferramenta nativa em `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts`.
- Estado/serialização do bloco de raciocínio em `src/LLMProviders/chainRunner/utils/AgentReasoningState.ts`.
- Renderização da interface de raciocínio em `src/components/chat-components/AgentReasoningBlock.tsx` e análise sintática em `src/components/chat-components/ChatSingleMessage.tsx`.
- Registro de ferramentas e modelo de metadados em `src/tools/ToolRegistry.ts` e `src/tools/builtinTools.ts`.

Isso já é uma base sólida para um planejador mínimo porque:

- O loop já suporta decisões interativas de ferramentas.
- O bloco de raciocínio já suporta histórico em rolagem (rolling) vs completo.
- Ferramentas já são tipadas com Zod e roteadas através de um único registro.

## 3. Objetivos

1. Adicionar uma primitiva mínima de planejamento (`write_todos`) que se encaixe no loop sequencial existente do ReAct.
2. Melhorar a visibilidade do raciocínio por iteração sem expor a cadeia de pensamento (chain-of-thought).
3. Manter a implementação robusta com o mínimo de estado novo.
4. Preparar um ponto de extensão limpo para futuros subagentes e encapsulamento de contexto.

## 4. Não-Objetivos (v0)

1. Sem orquestração multi-agente nesta fase.
2. Sem memória persistente de planejador entre os turnos.
3. Sem grafo complexo de dependências ou DAG de planejador.
4. Sem grande reescrita de interface (UI) do Bloco de Raciocínio.

## 5. Visão Geral do Design da v0

### 5.1 Adicionar uma Ferramenta de Planejador Mínima: `write_todos`

Introduzir uma ferramenta nativa leve que atualiza o checklist de execução do agente.

Semântica da ferramenta:

- Entrada é a captura atual completa de tarefas pendentes (semântica de substituição, não semântica de patch).
- A saída é um reconhecimento (acknowledgement) estruturado e compacto.
- Sem entrada/saída (I/O) de arquivos, sem mutação no vault, sem efeitos colaterais fora do estado de execução em memória.

Esquema de exemplo:

```ts
const writeTodosSchema = z.object({
  todos: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        content: z.string().min(1).max(140),
        status: z.enum(["pending", "in_progress", "completed"]),
      })
    )
    .min(1)
    .max(8),
  focus: z.string().max(40).optional(),
  note: z.string().max(200).optional(),
});
```

Payload de resultado de exemplo:

```json
{
  "ok": true,
  "revision": 3,
  "todoCount": 4,
  "inProgress": "read_note_context"
}
```

Por que semântica de substituição:

- Mais fácil para o modelo raciocinar a respeito.
- Transições de estado determinísticas.
- Nenhuma lógica de mesclagem/conflito no executor (runner).

### 5.2 Integração ao Loop ReAct (Mudanças Mínimas)

Em `runReActLoop`:

- Mantenha um único loop e um caminho de execução de ferramenta.
- Caso especial para `write_todos` antes da execução normal de uma ferramenta.
- Converta atualizações do planejador em eventos de raciocínio e um reconhecimento compacto na `ToolMessage`.

Pseudo-fluxo:

1. O modelo retorna `tool_calls`.
2. Se a chamada for `write_todos`, aplicar/atualizar o estado do planejador em memória.
3. Emitir passo(s) de raciocínio com prefixo `[Plan]`.
4. Empurrar mensagem de resultado de ferramenta para que o modelo possa continuar.
5. Continuar o loop inalterado para ferramentas normais.

Garantias de Contenção (Guardrails):

- Máximo de 2 iterações consecutivas exclusivas do planejador.
- Se o planejador entrar em loop, retornar erro de ferramenta: `"planner_overuse_execute_next_step"`.
- Se os argumentos do planejador forem inválidos, retornar erro de esquema e continuar o loop.

### 5.3 Melhor Visibilidade de Reflexão no Bloco de Raciocínio Existente

Manter o componente existente, mas tornar os passos mais legíveis, rotulando os eventos por fase (phase-tagging).

Tags de passos (apenas prefixo de string, não requer reescrita de UI):

- `[Plan]` atualizações de todos e ordenação de passos
- `[Act]` intenção de chamada de ferramenta
- `[Obs]` resumo de resultado de ferramenta
- `[Reflect]` reflexão iterativa e concisa do modelo

Detalhe de implementação:

- Reutilizar `addReasoningStep` e `allReasoningSteps` atuais.
- Adicionar um pequeno helper de extração para o texto de reflexão de `AIMessage.content` por iteração.
- Aplicar resumos curtos de reflexão (uma única frase, com tamanho máximo).

Isso oferece melhor visibilidade imediata com alterações mínimas no analisador/renderizador.

### 5.4 Atualizações de Prompt

Adicionar orientações de ferramenta para `write_todos` através dos metadados da ferramenta e seção de prompt do agente.

Regras:

1. Use `write_todos` para tarefas de várias etapas (>=2 ações significativas).
2. A primeira chamada do planejador deve acontecer antes da primeira ferramenta externa pesada quando a tarefa for não-trivial.
3. Mantenha os todos curtos e orientados à ação.
4. Atualize os status conforme a execução progride.
5. Não reescreva repetidamente todos inalterados.

## 6. Modelo de Dados (Estado Acessório da v0 Sidecar)

Adicionar estado em tempo de execução em memória em `AutonomousAgentChainRunner`:

```ts
interface PlannerState {
  revision: number;
  todos: Array<{ id: string; content: string; status: "pending" | "in_progress" | "completed" }>;
  focus?: string;
  updatedAt: number;
}

interface ReasoningEvent {
  phase: "plan" | "act" | "obs" | "reflect";
  summary: string;
  iteration: number;
  timestamp: number;
}
```

Nenhuma mudança de persistência é necessária para a v0. A persistência de chat atual já remove (strips) os marcadores de raciocínio.

## 7. Caminho de Extensibilidade: Cápsula de Contexto para Futuros Subagentes

Para suportar subagentes no futuro próximo sem redesenhar o loop, adicione uma abstração agora:

```ts
interface ContextCapsule {
  goal: string;
  planSnapshot?: PlannerState;
  keyFindings: string[];
  artifacts: Array<{ type: string; ref: string; summary: string }>;
  nextActions?: string[];
}
```

Uso na v0:

- Agente único cria isso em memória como subproduto (opcional, apenas para debug).

Uso de futuro subagente:

- Agente pai passa um objetivo focado.
- Subagente retorna apenas um compacto `ContextCapsule` (não a transcrição completa).
- Agente pai injeta o resumo da cápsula no próximo turno de decisão como um resultado de ferramenta.

Isso mantém o contexto encapsulado e o uso de tokens limitado.

## 8. Plano Mínimo de Alterações no Nível de Arquivo

1. Adicionar `src/tools/PlannerTools.ts` com a ferramenta `write_todos`.
2. Registrar a ferramenta em `src/tools/builtinTools.ts`.
3. Atualizar `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts`:
   - estado do sidecar planejador
   - manuseio especial para `write_todos`
   - eventos de raciocínio rotulados (`[Plan]/[Act]/[Obs]/[Reflect]`)
4. Opcionais e pequenas atualizações (helpers) em `src/LLMProviders/chainRunner/utils/AgentReasoningState.ts` para formatação de extração de reflexão.
5. Adicionar testes:
   - esquema/validação da ferramenta de planejador
   - comportamento do loop com chamadas de planejador isoladas + mistas (mixed tool calls)
   - regressão no uso de tags de passos de raciocínio

## 9. Critérios de Aceite

1. A consulta complexa de usuário mostra ao menos um `[Plan]`, um `[Act]`, e um `[Obs]` em passos de raciocínio.
2. Atualizações do planejador não quebram o comportamento normal de terminação do ReAct.
3. Agente continua terminando ao atingir limite de iterações/tempo limite assim como antes.
4. Nenhuma regressão em consultas não direcionadas a planejador.

## 10. Riscos e Mitigações

1. O modelo ignora a ferramenta do planejador:
   - Mitigação: o planejador é opcional; o loop ainda funciona exatamente como é hoje.
2. Spam do planejador:
   - Mitigação: limite de iterações consecutivas apenas para planejamento.
3. Inchaço de tokens (bloat) a partir de afazeres verbosos:
   - Mitigação: limites rígidos na contagem de itens e comprimento do texto.
4. Super-exposição do raciocínio oculto:
   - Mitigação: apenas permitir resumos curtos e concisos com reflexões operacionais (concise operational reflection summaries).

## 11. Implementação (Rollout)

1. Entregar escondido atrás de um seletor de acesso a recurso, ou "feature flag" (ex: `enableAgentPlannerV0`).
2. Habilitar primeiro para testes internos.
3. Validar em fluxos representativos: pesado em busca, leitura de nota e tarefas de edição (composer).
4. Habilitar por padrão após aprovação de estabilidade.

## 12. Questões Abertas

1. A ferramenta `write_todos` deve estar sempre ativada ou depender da configuração do usuário?
2. O estado de planejador deve ser exposto a alguma IU (UI) além da Bloco de Raciocínio (Reasoning Block)?
3. Nós deveríamos persistir o retrato (snapshot) do plano final para o metadados na mensagem a fim de diagnóstico (debugging)?

---

Esta versão (v0) mantém a arquitetura simples e enxuta: um loop seqüencial de ação contínua tipo ReAct, uma ferramenta compacta direcionada no controle dos próprios próximos passos, bem como a iluminação sobre todos raciocínios efetuados nos processos, além de servir a preparação pura de infraestrutura pra cápsulas contextuais com sub-agentes previstos futuramente.
