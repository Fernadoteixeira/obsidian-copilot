# TODO: Redesign da Ferramenta Composer para Feedback Mais Rápido

**Data:** 2026-02-04
**Responsável:** @wenzhengjiang
**Status:** TODO

## Problema

As ferramentas do composer `writeToFile` e `replaceInFile` têm um problema significativo de UX (Experiência do Usuário): há uma **lacuna de mais de 30 segundos** entre a etapa de raciocínio inicial e qualquer feedback significativo sobre o que o agente pretende fazer.

### Causa Raiz

O fluxo atual exige que o modelo gere o **conteúdo inteiro do arquivo modificado** em uma única chamada de ferramenta:

```
Usuário: "Remova todos os cabeçalhos"
         ↓
Modelo recebe prompt + conteúdo completo do arquivo
         ↓
Modelo gera TODO O ARQUIVO modificado (mais de 30 segundos)
         ↓
Chamada da ferramenta emitida com o conteúdo completo
         ↓
A UI (Interface do Usuário) finalmente mostra "Escrevendo para o nome_do_arquivo..."
```

Durante esses mais de 30 segundos, o usuário não tem ideia do que o agente está planejando fazer.

### Esquema Atual da Ferramenta

```typescript
writeToFile({
  path: string,
  content: string | object, // ← TODO o conteúdo do arquivo gerado antecipadamente
  confirmation: boolean,
});
```

## Solução Proposta: Design de Ferramenta em Múltiplas Etapas

Dividir a operação do composer em duas fases:

### Fase 1: Declaração de Intenção (Rápida)

Uma chamada de ferramenta leve que declara a intenção sem gerar conteúdo:

```typescript
declareEditIntent({
  path: string,
  operation: "rewrite" | "modify" | "create",
  description: string, // ex., "Remover todos os cabeçalhos do documento"
});
```

Isso retornaria quase imediatamente (1-2 segundos) porque o modelo só precisa decidir O QUE fazer, não gerar todo o conteúdo.

**A UI mostra:** "Planejando remover todos os cabeçalhos de Daily-AI-Digest.md..."

### Fase 2: Geração de Conteúdo (Lenta, mas esperada)

Após a intenção ser confirmada, a geração do conteúdo completo acontece:

```typescript
executeEdit({
  path: string,
  content: string | object,
});
```

**A UI mostra:** "Gerando mudanças..." → "Escrevendo para o nome_do_arquivo..."

### Benefícios

1. **Feedback imediato**: O usuário sabe a intenção dentro de 1-2 segundos
2. **Oportunidade de cancelar**: O usuário pode abortar antes de uma geração custosa
3. **Melhor UX**: O progresso parece natural (planejando → executando)
4. **Etapas de raciocínio mais claras**: Cada fase tem etapas distintas e significativas

## Requisitos Adicionais

### Cache de Histórico de Diffs para Reversão Confiável

Fazer cache dos últimos N diffs (diferenças) por arquivo para habilitar a funcionalidade de desfazer/reverter (undo/revert) de maneira confiável:

- Armazenar diffs (não snapshots completos do arquivo) para minimizar o armazenamento
- Manter as últimas N alterações (ex., N=10) por caminho de arquivo
- Habilitar ações de "Reverter última alteração" e "Reverter para versão X"
- Limpar diffs antigos quando o limite for excedido (FIFO)

```typescript
interface DiffHistoryEntry {
  timestamp: number;
  path: string;
  diff: Change[]; // da biblioteca 'diff'
  description: string; // ex., "Remover todos os cabeçalhos"
}
```

### Modelo "Aplicador" (Apply) Dedicado

Considere usar um modelo separado que seja pequeno, rápido e barato, especificamente para aplicar diffs:

- **Modelo principal**: Gera a intenção e a descrição da edição (Fase 1)
- **Modelo aplicador**: Executa a transformação real no arquivo (Fase 2)

Benefícios:

- Execução mais rápida para a Fase 2 (modelo menor = inferência mais rápida)
- Menor custo (modelo barato para transformação mecânica)
- O modelo principal foca no entendimento, o modelo aplicador foca na execução
- Poderia ser usado um modelo com fine-tuning (ajuste fino) otimizado para transformações de código/texto

Candidatos: Gemini Flash Lite ou modelos comparáveis.

### Resultados Estruturados de Ferramentas

Atualmente, o ComposerTools retorna strings simples (plain strings) para erros/no-ops, o que torna a análise do resultado frágil:

```typescript
// Atual: Strings simples (frágil)
return `Arquivo é pequeno demais para usar essa ferramenta...`;
return `Texto de busca não encontrado no arquivo ${path}...`;
return `Nenhuma mudança feita em ${path}...`;
```

A UI de raciocínio (`AgentReasoningState.ts`) usa correspondência de string para detectar esses casos, o que quebra se as mensagens mudarem.

**Proposta:** Retornar resultados estruturados:

```typescript
interface ComposerToolResult {
  status: "success" | "rejected" | "no-op" | "error";
  message: string;
  path?: string;
}
```

Isso permite uma detecção confiável de status na UI de raciocínio sem correspondência frágil de strings.

## Arquivos Relacionados

- `src/tools/ComposerTools.ts` - Implementações atuais das ferramentas
- `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts` - Loop do ReAct
- `src/LLMProviders/chainRunner/utils/AgentReasoningState.ts` - Estado da UI de raciocínio

## Próximos Passos

1. Projetar a API de ferramenta em múltiplas etapas
2. Prototipar primeiro com `writeToFile`
3. Atualizar a UI de raciocínio para lidar com operações de duas fases
4. Testar com vários tamanhos de arquivos e operações
5. Lançar (roll out) para `replaceInFile`
