# Aplicação do Orçamento de Tokens

## Índice

1. [Declaração do Problema](#declaração-do-problema)
2. [Arquitetura Atual de Compactação](#arquitetura-atual-de-compactação)
3. [Análise da Causa Raiz](#análise-da-causa-raiz)
4. [Plano de Correção](#plano-de-correção)
5. [Referências](#referências)

---

## Declaração do Problema

O proxy do modelo recebe solicitações com contagens de tokens excedendo em muito a janela de contexto do modelo (ex: 2.7M de tokens enviados para um modelo Vertex AI de 1M de tokens). Era esperado que o sistema de auto-compactação do plugin evitasse isso, mas ele falha porque **nenhum mecanismo de compactação verifica o payload montado total** — cada compactador protege apenas o seu próprio subconjunto.

```
ContextWindowExceededError: The input token count (2769478)
exceeds the maximum number of tokens allowed (1048575).
```

---

## Arquitetura Atual de Compactação

Existem **três mecanismos de compactação separados** no plugin. Nenhum deles aplica um orçamento total de tokens contra a configuração `autoCompactThreshold`.

### 1. Compactação de Contexto no Turno (ContextCompactor)

**Onde**: `ContextManager.processMessageContext()` (`src/core/ContextManager.ts:231-258`)
**Quando**: Toda vez que uma mensagem de usuário é processada, antes que o envelope seja construído.
**O que abrange**: L2 (contexto do turno anterior) + L3 (contexto do turno atual) combinados.
**O que NÃO abrange**: L1 (prompt do sistema), L4 (histórico do chat), L5 (mensagem do usuário).

```
Condição de acionamento:
  (processedUserMessage + contextPortion).length > autoCompactThreshold * 4

Onde:
  autoCompactThreshold = settings.autoCompactThreshold (padrão: 128.000 tokens)
  charThreshold = 128.000 * 4 = 512.000 caracteres
```

Quando acionado, `ContextCompactor.compact()` executa a sumarização LLM em map-reduce em blocos XML individuais maiores que 50k caracteres. A própria mensagem do usuário nunca é compactada.

**Limitação chave**: Essa verificação de limite mede `processedUserMessage + contextPortion` (o que é L5 + L2 + L3). Ela NÃO inclui:

- L1 (prompt do sistema) — tipicamente de 2k a 10k tokens
- L4 (histórico de chat) — potencialmente **centenas de milhares de tokens**

### 2. Compactação de Transporte do L2 (L2ContextCompactor)

**Onde**: `ContextManager.compactSegmentForL2()` (`src/core/ContextManager.ts:706-733`)
**Quando**: Quando segmentos do L3 do turno anterior são promovidos para o L2 no turno seguinte.
**O que faz**: Compressão determinística de estrutura+prévia (cabeçalhos + seções truncadas). Sem chamadas ao LLM.

Esta é uma operação **por segmento** que reduz cada artefato de contexto a um bloco `<prior_context>` com ~500 caracteres por seção. Isso evita que o L2 cresça de forma ilimitada conforme os turnos se acumulam.

### 3. Compactação do Histórico de Chat (ChatHistoryCompactor)

**Onde**: `MemoryManager.saveContext()` (`src/LLMProviders/memoryManager.ts:61-72`)
**Quando**: Após cada resposta do assistente, no momento de salvar na memória.
**O que faz**: Compacta os resultados de ferramentas (`localSearch`, `readNote`, etc.) nas respostas do assistente antes de salvar no `BufferWindowMemory`.

Isto compacta **apenas as porções de resultado de ferramenta** das mensagens do assistente. O restante do texto do assistente e todas as mensagens do usuário são armazenados de forma literal (verbatim).

### Resumo: O Que Cada Sistema Protege

| Sistema de Compactação             | Escopo                             | Ciente de Tokens?                 | Cobre o Payload Total?   |
| ---------------------------------- | ---------------------------------- | --------------------------------- | ------------------------ |
| ContextCompactor (no turno)        | Blocos XML de contexto L2 + L3     | Baseado em limite (est. de carac.)| Não — perde L1, L4, L5   |
| L2ContextCompactor (transporte)    | Segmentos L2 individuais           | Não — fixo por segmento           | Não — apenas por segment.|
| ChatHistoryCompactor (ao salvar)   | Result. de ferram. em msg assist.  | Não — tamanho fixo                | Não — só result. de ferr.|

---

## Análise da Causa Raiz

### O Problema Central: Sem Orçamento de Payload Total

A lacuna crítica é **sistêmica**: nenhum mecanismo de compactação verifica o payload montado total (L1+L2+L3+L4+L5) contra qualquer orçamento. Cada compactador protege apenas o seu próprio subconjunto, e nenhuma rede de segurança final existe.

### O Que o L4 Realmente Contém

É frequentemente presumido que o L4 (histórico de chat) é o principal consumidor de tokens, mas investigações mostram que ele é relativamente bem controlado:

- **Mensagens do usuário no L4** = texto puro do L5 apenas (sem contexto XML). `BaseChainRunner.handleResponse()` extrai `l5Text` do envelope e salva apenas isso na memória.
- **Respostas do assistente no L4** = compactadas ao salvar por `ChatHistoryCompactor`, o que remove XML de resultados de ferramentas (`localSearch`, `readNote`, `note_context`, etc.).
- **Respostas no modo Agente**: `AutonomousAgentChainRunner` salva apenas `loopResult.finalResponse` (a resposta final), NÃO a cadeia completa de raciocínio/chamadas de ferramentas.

O L4 cresce com o comprimento da conversa, mas não é ilimitado — `BufferWindowMemory` o limita para `k = contextTurns * 2` mensagens (padrão: 30), e ambos os lados, usuário e assistente, são relativamente compactos.

### Os Reais Culpados: L1 e Acúmulo de Camadas Não Verificado

O transbordamento (overflow) acontece porque **múltiplas camadas se acumulam sem nenhum orçamento compartilhado**:

#### L1: O Contexto de Projeto Nunca é Orçado

No modo Projetos, `ChatManager.getSystemPromptForMessage()` concatena todos os arquivos do projeto, conteúdo web e transcrições do YouTube em um bloco `<project_context>` dentro do L1. Isso pode facilmente chegar a **centenas de milhares de tokens** para projetos grandes.

O L1 **nunca é compactado por nenhum sistema** — nenhum compactador sequer o vê.

#### O Limite de Compactação é Cego para o L1

`ContextManager.processMessageContext()` usa um `PROJECT_COMPACT_THRESHOLD = 1,000,000` tokens codificado rigidamente (hardcoded) para a compactação no modo Projetos. Esse limite verifica apenas o tamanho de L2+L3 — é completamente cego ao tamanho do L1 (contexto do projeto). É configurado como se L2+L3 fosse o orçamento _inteiro_, quando na realidade o L1 já pode ter consumido a maior parte da janela de contexto disponível.

Para cadeias (chains) que não são de projetos, `autoCompactThreshold` (padrão de 128k) é usado, mas também verifica apenas L2+L3.

#### L4: Nenhuma Consciência de Orçamento

`loadAndAddChatHistory()` carrega todas as mensagens do histórico sem verificar quanto orçamento de tokens resta após a montagem de L1+L2+L3+L5:

```typescript
export async function loadAndAddChatHistory(
  memory: any,
  messages: Array<{ role: string; content: any }>
): Promise<ProcessedMessage[]> {
  const memoryVariables = await memory.loadMemoryVariables({});
  const rawHistory = memoryVariables.history || [];
  // ... processa e adiciona TODAS as mensagens de histórico SEM verificação de tamanho
}
```

### Como 2.7M de Tokens Acontecem

Em uma conversa no modo Projetos:

```
L1 (sistema + project_context):   ~500k tokens  ← NÃO ORÇADO, nunca compactado
L2 (contexto ant., compactado):    ~20k tokens
L3 (contexto de turno atual):      ~50k tokens
                                   ─────────
  ContextCompactor avalia L2+L3:   70k < 1.000k limite → NÃO engatilha compactação
                                   (o limite é cego para os 500k no L1)

L4 (15 turnos de hist. de chat):  ~200k tokens  ← carregado sem verificação de orçam. restante
L5 (mensagem do usuário):           ~2k tokens
─────────────────────────────────────────────────
TOTAL:                            ~772k tokens  → pode exceder a janela de contexto do modelo
```

Em casos extremos (grandes projetos + longas conversas + anexos de contexto pesados), os totais podem chegar a mais de 2 milhões de tokens.

### Todos os Executores de Cadeia (Chain Runners) São Afetados

Todos os chain runners chamam `loadAndAddChatHistory()` sem qualquer orçamento de tokens:

| Runner                     | Arquivo                                                      | Linha |
| -------------------------- | ------------------------------------------------------------ | ----- |
| LLMChainRunner             | `src/LLMProviders/chainRunner/LLMChainRunner.ts`             | 45    |
| CopilotPlusChainRunner     | `src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts`     | 606   |
| AutonomousAgentChainRunner | `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts` | 597   |
| VaultQAChainRunner         | `src/LLMProviders/chainRunner/VaultQAChainRunner.ts`         | 191   |

### A Configuração `contextTurns` é um Preposto (Proxy) Deficiente

`BufferWindowMemory` é configurado com `k = contextTurns * 2` (padrão: 30 mensagens). Isto é um limite bruto baseado em contagem que:

- Não tem relação com o consumo real de tokens
- Não consegue se adaptar à variedade de tamanhos das mensagens
- Não fornece garantias sobre o tamanho total do payload

Um orçamento baseado em tokens para o L4 faz com que o `contextTurns` se torne redundante.

---

## Plano de Correção

### Princípios Orientadores

1. **Agnóstico ao modelo**: O plugin suporta diversos provedores de LLM. Nenhuma lógica de janela de contexto específica de modelo. Utilize o `autoCompactThreshold` (configurável pelo usuário) como o orçamento único e total.
2. **Ponto único de fiscalização**: O orçamento de tokens deve ser avaliado onde todas as camadas se reúnem, e não espalhado através de compactadores individuais.
3. **Garantia de histórico**: O LLM precisa ser capaz de ver sempre ao menos parte do histórico recente de conversas para continuar com um contexto compreensível, ainda que as camadas L1+L2+L3 consumam grande fatia da cota.
4. **Degradação gradual (graceful)**: Quando sobrecarregado, deixe cair (drop) o conteúdo menos valoroso primeiro (os turnos mais velhos de histórico), e apenas emita as devidas perdas mais profundas de compactação conforme exigido.
5. **Retro-compatibilidade**: Os sistemas de compactação existentes permanecerão; isto adicionará uma rede e segurança a todos.
6. **Sem chamadas a LLM na via rápida (hot path)**: As fiscalizações devem atuar como contagens focadas no consumo de string/caracteres para maior desempenho e agilidade.

### Fase 1: Proteção ao Orçamento de Tokens (Correção Crítica)

**Objetivo**: Evitar permanentemente que payloads sobrecarregados (over-budget) consigam chegar ao LLM.

#### 1.1 Tornar o ContextManager Ciente do L1

No momento o `ContextManager.processMessageContext()` verifica apenas `(L2+L3).length > threshold * 4` quando a marca designada é `autoCompactThreshold` ou `PROJECT_COMPACT_THRESHOLD`. Ambos são indiferentes ao uso de peso presente no L1.

**Correção**: O ponto de entrada a `L2+L3` de compactação tem que prever subtrações em benefício à proteção:

```
effectiveThreshold = autoCompactThreshold - estimateTokens(L1)
```

Isto garante que quando o L1 assumir um grande volume de arquivo (em projetos com muitos blocos/contextos), as atuações contra L2+L3 surtirão seus efeitos para viabilizar e sobrar margens no preenchimento necessário de histórico no contexto final (`L4 e L5`).

**Mate a variável `PROJECT_COMPACT_THRESHOLD`** — ele possui o número predefinido e limitador à constante ignorante. Retorne e troque pela fórmula global de cálculo em benefício global de verificação `autoCompactThreshold - L1`.

**Arquivo**: `src/core/ContextManager.ts`

#### 1.2 Incluir a Validação em `loadAndAddChatHistory()`

Submeter ao repasse orçamental (tokenBudget) em validações do tipo via parâmetro. Sempre ativando por chamadas quando demandadas por:

1. Carregar todos históricos através de chamadas vindas de `BufferWindowMemory`
2. Presumir/Acumular custos via `(chars / 4)`
3. Aplicar remoções (Drop) à ordens passadas contendo todo um pacote (par entre `user+assistant`)
4. Assegurar as últimas ações (garantir turno recente) permanentemente (Histórico base).
5. Produzir registro de "Alerta/Warning" reportando o encerramento dos cortes ocorridos.

```
Alocação no Orçamento de Tokens:
  autoCompactThreshold (ex: 128,000 tokens)
  - estimateTokens(L1)   system prompt + project context
  - estimateTokens(L2)   previous context library
  - estimateTokens(L3)   current turn context
  - estimateTokens(L5)   user message
  - reservedForOutput    (~4,096 para geração de resposta)
  = orçamento restante para L4 histórico do chat
```

**Arquivo**: `src/LLMProviders/chainRunner/utils/chatHistoryUtils.ts`

#### 1.3 Atualizar Todos Executores (Chain Runners)

Os blocos executores precisam ter uma re-avaliação conjunta e atualização antes de serem aplicados nas chamadas e instâncias por `loadAndAddChatHistory()`:

1. Calcular os totais a consumir das instâncias de chamadas de mensagens passadas pelo `(L1+L2+L3+L5)`.
2. Armazenar a contabilização via lógica orçamental no `historyBudget`.
3. Informar nas diretrizes de entrada à função `loadAndAddChatHistory()`.

**Arquivos**:

- `src/LLMProviders/chainRunner/LLMChainRunner.ts`
- `src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts`
- `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts`
- `src/LLMProviders/chainRunner/VaultQAChainRunner.ts`

#### 1.4 Depreciar Opção de `contextTurns`

Considerações aos fluxos e métodos restritivos baseados unicamente sobre variáveis baseadas em tokens tornarão a aplicação por contagens obsoletas a longo prazo.

- Reduzir limitação nativa trocando à variável que cede `(BufferWindowMemory.k = contextTurns * 2)` pela imposição maior de teto `(k = 100)`
- A restrição orçamental e seu trabalho no passo "1.2" irá cuidar na prática desta limitação
- Desvincule a representação gráfica à tela de configurações a nível de usuário ("Conversation turns in context") em `ModelSettings.tsx`

**Arquivos**:

- `src/LLMProviders/memoryManager.ts`
- `src/settings/v2/components/ModelSettings.tsx`

### Fase 2: Recorte Inteligente de Histórico (Melhoria)

**Objetivo**: Quando a margem orçamental for curta (tight), agir proativamente e com inteligência em vez de apenas derrubar ações aleatórias do usuário nos recortes passados.

#### 2.1 Estratégia de recorte baseada em prioridade

Atender em rigor orçamentário à ordem e à instrução a seguir:

1. **Derrubar respostas/turnos antigos e totais completados** (par de solicitações/saídas `user+assistant`)
2. **Aplicar corte sob respostas passadas excedentes de assistente** baseando apenas as retenções sobre os primeiros blocos iniciais para a coleta e absorção dos `chars` de L4
3. E, caso por ironia (o recálculo estourou) sob encerramento das tentativas de cortes e avaliações: **Avisar ao utilizador visualmente**

### Fase 3: Observabilidade (Melhoria)

#### 3.1 Transmitir/Apresentar Consumo Orçamental em Interface

Exibir as respostas visuais de acompanhamento pelo painel ou console:

- Acumular visões orçamentais da distribuição estimadas e totais aos pacotes de `L1, L2, L3, L4, L5`
- Monitorar a relação base a contraposições relativas via `autoCompactThreshold`
- Divulgação transparente das retenções ocorridas ou cortes processados.

Esta abordagem fará os dados apresentados possuírem total aderência do entendimento e leitura do fluxo visual por intermédio das próprias intenções do indivíduo (usuário).

### Ordem de Implementação

| Passo | Descrição                                 | Arquivos Modificados              | Risco  |
| ----- | ----------------------------------------- | --------------------------------- | ------ |
| 1.1   | Limite de compactação consciente de L1    | ContextManager.ts                 | Médio  |
| 1.2   | Orçamento de tokens no `loadAndAddChat...`| chatHistoryUtils.ts               | Médio  |
| 1.3   | Atualizar pontos dos executores (chains)  | 4 arquivos chain runners          | Médio  |
| 1.4   | Depreciar `contextTurns`                  | memoryManager.ts, ModelSettings   | Baixo  |
| 2.1   | Recorte e controle priorizado             | chatHistoryUtils.ts               | Baixo  |
| 3.1   | Exposição no Debug Dashboard do token uso | Componentes da Interface UI       | Baixo  |

A Fase 1 (passos 1.1-1.4) é a **correção crítica** que evita o transbordamento. Fases 2 e 3 constituem aprimoramentos.

---

## Referências

### Arquivos Fontes

| Arquivo                                                      | Função                                           |
| ------------------------------------------------------------ | ------------------------------------------------ |
| `src/core/ContextManager.ts`                                 | Gatilho de compactação no turno (L2+L3)          |
| `src/core/ContextCompactor.ts`                               | Sumarização de LLM map-reduce                    |
| `src/context/L2ContextCompactor.ts`                          | Compactação determinística de segmento L2        |
| `src/context/ChatHistoryCompactor.ts`                        | Compactação no salvamento de resultados (ferram.)|
| `src/LLMProviders/memoryManager.ts`                          | Salvar estado da memória por compactação         |
| `src/LLMProviders/chainRunner/utils/chatHistoryUtils.ts`     | Histórico sem carga (c/ ausência orçamental)     |
| `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts` | Montagem e coordenação do envio a Agent mode     |
| `src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts`     | Mensagens alinhadas/passadas ao Copilot Plus     |
| `src/LLMProviders/chainRunner/LLMChainRunner.ts`             | Mensagem LLM Simples a ser processada            |
| `src/LLMProviders/chainRunner/VaultQAChainRunner.ts`         | Resolução para modelo QA do Vault                |
| `src/LLMProviders/chatModelManager.ts`                       | Gestão integral de modelos (Chat Models)         |
| `src/constants.ts`                                           | Configuração padrão (autoCompactThreshold: 128k) |

### Documentos Relacionados

- [CONTEXT_ENGINEERING.md](./CONTEXT_ENGINEERING.md) — Arquitetura de camadas L1-L5
- [MESSAGE_ARCHITECTURE.md](./MESSAGE_ARCHITECTURE.md) — Fluxo e armazenamento de mensagens
- [TECHDEBT.md](./TECHDEBT.md) — Débitos técnicos identificados
