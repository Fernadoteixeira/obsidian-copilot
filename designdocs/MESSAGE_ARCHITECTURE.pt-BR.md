# Arquitetura de Mensagens & Design de Contexto

Este documento descreve a nova arquitetura de processamento de contexto e gerenciamento de mensagens que substituiu o sistema legado SharedState. O novo design segue princípios de arquitetura limpa (clean architecture) com uma única fonte de verdade (single source of truth), visões computadas (computed views) e isolamento completo de projeto.

**Nota**: Para informações detalhadas sobre o sistema de contexto em camadas (camadas L1-L5, auto-promoção L2, otimização de cache), consulte [CONTEXT_ENGINEERING.md](./CONTEXT_ENGINEERING.md).

## Princípios de Arquitetura

### Única Fonte de Verdade

- Cada mensagem é armazenada exatamente uma única vez no `MessageRepository`
- Todas as visualizações de interface do usuário (UI) e visões para LLM são computadas a partir deste único armazenamento
- Nenhuma sincronização complexa de array duplo ou correspondência de IDs

### Fluxo de Arquitetura Limpa

```
Entrada do Usuário → ChatUIState → ChatManager → getCurrentMessageRepo() → MessageRepository + ContextManager
                                   ↓                                        ↓
                         ChatPersistenceManager                    Armazenamento específico do projeto
                ↓
Componentes UI ← ChatUIState ← Visões Computadas ← MessageRepository
                ↓
Processamento LLM ← Memória da Cadeia ← getLLMMessages() ← MessageRepository
```

### Contexto Sempre Fresco

- O contexto é reprocessado quando as mensagens são editadas
- Sem problemas de contexto defasado (stale context) provenientes de processamento armazenado em cache
- Garante contexto preciso para as interações com o LLM

### Isolamento de Projeto

- Cada projeto mantém seu próprio histórico isolado de chat
- Detecção e troca automáticas quando o projeto muda
- Nenhuma configuração (zero configuration) requerida - funciona automaticamente
- Chats não vinculados a um projeto usam um repositório padrão (default)

## Componentes Principais

### 1. MessageRepository (`src/core/MessageRepository.ts`)

**Propósito**: Única fonte de verdade para todas as mensagens

**Conceitos-chave**:

- Armazena objetos `StoredMessage` com ambos `displayText` e `processedText`
- `displayText`: O que o usuário digitou ou a IA respondeu (para exibição na interface/UI)
- `processedText`: Para mensagens de usuário, inclui o contexto. Para mensagens de IA, o mesmo que display

**Métodos Centrais**:

```typescript
// Adicionar nova mensagem
addMessage(
  displayText: string,
  processedText: string,
  sender: string,
  context?: MessageContext,
  content?: MessageContent[]
): string

// Obter visões computadas
getDisplayMessages(): ChatMessage[]  // Para renderização de UI
getLLMMessages(): ChatMessage[]      // Para processamento de IA

// Operações de edição
editMessage(id: string, newDisplayText: string): boolean
updateProcessedText(
  id: string,
  processedText: string,
  contextEnvelope?: PromptContextEnvelope
): boolean

// Operações em lote (Bulk)
truncateAfterMessageId(messageId: string): void
loadMessages(messages: ChatMessage[]): void
```

> **Armazenando envelopes**: Quando o `ChatManager` chama `addMessage` com uma `NewChatMessage` completa, ele inclui a propriedade `contextEnvelope` para que o repositório mantenha tanto o antigo `processedText` legado quanto a representação canônica em camadas. A sobrecarga (overload) baseada em strings permanece para utilitários de baixo-nível e fixtures de teste.

### 2. ChatManager (`src/core/ChatManager.ts`)

**Propósito**: Coordenador central da lógica de negócios

**Responsabilidades**:

- Orquestra MessageRepository, ContextManager e as operações de LLM
- Lida com todas as operações CRUD de mensagens com o tratamento adequado de erros
- Sincroniza com a memória da cadeia para o histórico de conversação
- Gerencia o ciclo de vida do processamento de contexto
- **Isolamento de Projeto**: Mantém um MessageRepository separado por projeto
- **Persistência**: Integra-se ao ChatPersistenceManager para salvar/carregar

**Ciclo de vida do Envelope**:

1. O usuário envia uma mensagem → `ContextManager.processMessageContext()` retorna tanto o `processedContent` **quanto** um `PromptContextEnvelope`.
2. O `ChatManager` armazena o envelope com `MessageRepository.updateProcessedText(...)`.
3. Quando qualquer executor de cadeia (chain runner) opera, ele lê o `userMessage.contextEnvelope` e o alimenta para `LayerToMessagesConverter.convert()` para materializar a estrutura L1-L5 do prompt.
4. Regeneração ou edições chamam `reprocessMessageContext`, garantindo que um envelope novo substitua o antigo defasado.

**Operações-Chave**:

```typescript
// Enviar nova mensagem com processamento de contexto
async sendMessage(displayText: string, context: MessageContext, chainType: ChainType, includeActiveNote?: boolean): Promise<string>

// Editar mensagem e reprocessar contexto
async editMessage(messageId: string, newText: string, chainType: ChainType, includeActiveNote?: boolean): Promise<boolean>

// Regenerar resposta de IA
async regenerateMessage(messageId: string, onUpdateMessage: Function, onAddMessage: Function): Promise<boolean>

// Sincronização de memória
private async updateChainMemory(): Promise<void>

// Gerenciamento de projeto
private getCurrentMessageRepo(): MessageRepository  // Auto-detecta projeto atual
async handleProjectSwitch(): Promise<void>          // Força detecção de projeto

// Persistência
async saveChat(modelKey: string): Promise<{ success: boolean; path?: string; error?: string }>
```

**Implementação de Isolamento de Projeto**:

```typescript
// Estrutura interna
private projectMessageRepos: Map<string, MessageRepository>

// Detecção automática de projeto
getCurrentMessageRepo() {
  const currentProjectId = ProjectManager.getCurrentProjectId() || defaultProjectKey;
  if (!this.projectMessageRepos.has(currentProjectId)) {
    // Cria novo repositório para este projeto
    const repo = new MessageRepository();
    this.projectMessageRepos.set(currentProjectId, repo);
  }
  return this.projectMessageRepos.get(currentProjectId)!;
}
```

### 3. ChatUIState (`src/state/ChatUIState.ts`)

**Propósito**: Gerenciador de estado limpo, focado exclusivamente na interface (UI-only)

**Filosofia de Design**:

- Delega TODAS as lógicas de negócios para o ChatManager
- Fornece integração com React via um mecanismo de assinatura (subscription mechanism)
- Substitui o antigo SharedState legado com uma abordagem focada e mínima

**Integração React**:

```typescript
// Assinar (inscrever-se) a mudanças de estado
subscribe(listener: () => void): () => void

// Delegar operações ao ChatManager
async sendMessage(displayText: string, context: MessageContext, chainType: ChainType, includeActiveNote?: boolean): Promise<string>
getMessages(): ChatMessage[]  // Visão computada para interface UI

// Projeto e operações de persistência
async handleProjectSwitch(): Promise<void>  // Lida com as atualizações da UI para troca de projeto
async saveChat(modelKey: string): Promise<{ success: boolean; path?: string; error?: string }>

// Compatibilidade legada (para retrocompatibilidade)
get chatHistory(): ChatMessage[]
addMessage(message: ChatMessage): void
clearChatHistory(): void

// Notificar componentes React sobre mudanças
private notifyListeners(): void
```

### 4. ContextManager (`src/core/ContextManager.ts`)

**Propósito**: Lida com processamento e reprocessamento de contexto com arquitetura de contexto em camadas

**Principais Recursos**:

- **Sistema de Contexto em Camadas**: Constrói camadas de contexto estruturadas L1-L5 (ver CONTEXT_ENGINEERING.md)
- **Auto-Promoção L2**: Promove automaticamente o contexto do turno anterior ao L2 para garantir a estabilidade do cache
- **Desduplicação**: Assegura que o contexto apareça apenas uma vez (L3 tem prioridade sobre L2)
- **Processamento de Contexto**: Lida com notas, URLs, texto selecionado, tags e pastas
- **Reprocessamento**: Regenera um contexto totalmente atualizado (fresco) quando as mensagens sofrem edição
- **Construção de Envelope**: Cria `PromptContextEnvelope` com camadas e hashes estruturados
- **Processamento Baseado-na-Cadeia (Chain-Aware)**: Aplica regras específicas para cadeias (ex., processamento Copilot Plus URL, tratamento de nota-ativa (active-note) para os modelos focados em visão)

**Métodos Centrais**:

```typescript
// Processa o contexto para nova mensagem (inclui a construção L2 proveniente do histórico)
async processMessageContext(
  message: ChatMessage,
  fileParserManager: FileParserManager,
  vault: Vault,
  chainType: ChainType,
  includeActiveNote: boolean,
  activeNote: TFile | null,
  messageRepo: MessageRepository,
  systemPrompt?: string
): Promise<ContextProcessingResult>

// Reprocessar contexto para mensagem editada
async reprocessMessageContext(messageId: string, ...): Promise<void>
```

### 5. ChatPersistenceManager (`src/core/ChatPersistenceManager.ts`)

**Propósito**: Encarrega-se de salvar e carregar as dependências relacionadas ao histórico do chat para/dos arquivos em formato markdown

**Principais Recursos**:

- Nomenclatura com conscientização por projeto (project-aware) atribuída perante acréscimo prefixativo (prefixa via projeto ID)
- Filtra arquivos do histórico referentes baseados pautados pelo projeto em modo operante atual
- Analisa (parse) e formata a consolidação focada em registros conversacionais referida focada e para armazenamento
- Integrado ao ChatManager garantindo e referenciando perante persistências fluidas e harmônicas

**Métodos Centrais**:

```typescript
// Salvar chat para o formato baseado e armazenado num arquivo em markdown
async saveChat(messages: ChatMessage[], modelKey: string, projectId?: string): Promise<{ success: boolean; path?: string; error?: string }>

// Obter os arquivos atinentes ao histórico disponível
async getChatHistoryFiles(): Promise<TFile[]>

// Convenção formadora base no batismo originário perante nomeação dos arquivos
// Chats de projeto: `[projectId]-[timestamp]-[modelKey]-chat.md`
// Chats não vinculados (sem projeto): `[timestamp]-[modelKey]-chat.md`
```

## Diagramas da Arquitetura

### Arquitetura Completa do Sistema

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   Camada de Interface de Usuário                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────┐                          ┌──────────────────┐                 │
│  │   Chat.tsx      │ ◄────── usa ───────────► │  CopilotView.tsx │                 │
│  │                 │                           │                  │                 │
│  └────────┬────────┘                          └──────────────────┘                 │
│           │                                                                         │
│           │ assina em & chama                                                       │
│           ▼                                                                         │
└───────────┬─────────────────────────────────────────────────────────────────────────┘
            │
┌───────────┴─────────────────────────────────────────────────────────────────────────┐
│                                    Camada de Estado                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│           │                                                                         │
│  ┌────────▼────────┐                                                               │
│  │  ChatUIState    │  - Gerenciamento de estado React                              │
│  │                 │  - Mecanismo de assinatura p/ atualizações da UI               │
│  │                 │  - Delega a lógica comercial interligada ao ChatManager       │
│  └────────┬────────┘                                                               │
│           │                                                                         │
└───────────┴─────────────────────────────────────────────────────────────────────────┘
            │ delega a
┌───────────▼─────────────────────────────────────────────────────────────────────────┐
│                               Camada de Lógica de Negócios                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────┐         orquestra           ┌─────────────────────────────┐   │
│  │   ChatManager   │ ◄──────────────────────────► │  ContextManager (singleton) │   │
│  │                 │                              │                             │   │
│  │ - Mensagens CRUD│                              │ - Proc. msg em contexto     │   │
│  │ - Isolamento    │                              │ - Lida com as adjunções     │   │
│  │   de projeto    │                              │ - Reprocessa nas edições    │   │
│  │ - Sinc. memória │                              └─────────────────────────────┘   │
│  └────────┬────────┘                                                               │
│           │                                                                         │
│           │ gerencia                              ┌─────────────────────────────┐   │
│           │                                       │  ChatPersistenceManager     │   │
│           ├──────────────────────────────────────►│                             │   │
│           │                                       │ - Salvar/carregar chats     │   │
│           │                                       │ - Nomeação perante projetos │   │
│           │                                       └─────────────────────────────┘   │
│           │                                                                         │
│           │ coordena                              ┌─────────────────────────────┐   │
│           ├──────────────────────────────────────►│     ChainManager           │   │
│           │                                       │                             │   │
│           │                                       │ - Gestão em base na memória │   │
│           │                                       │ - Operações cadenciadas LLM │   │
│           │                                       └──────────┬──────────────────┘   │
│           │                                                  │                      │
│           │                                                  ▼                      │
│           │                                       ┌─────────────────────────────┐   │
│           │                                       │    MemoryManager            │   │
│           │                                       │                             │   │
│           │                                       │ - Guarda cadeias na base    │   │
│           │                                       │ - Histórico referencial     │   │
│           │                                       └─────────────────────────────┘   │
└───────────┴─────────────────────────────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────────────────────────────┐
│                                  Camada de Armazenamento de Dados                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                          MessageRepository                                   │   │
│  │                                                                             │   │
│  │  ┌─────────────────┐    Visões Computadas ┌────────────────────────────┐  │   │
│  │  │ StoredMessage[] │ ──────────────────────► │ getDisplayMessages()     │  │   │
│  │  │                 │                       │ (para renderização UI)     │  │   │
│  │  │ - id            │                       └────────────────────────────┘  │   │
│  │  │ - displayText   │                                                        │   │
│  │  │ - processedText │ ──────────────────────► ┌────────────────────────────┐  │   │
│  │  │ - sender        │                       │ getLLMMessages()         │  │   │
│  │  │ - timestamp     │                       │ (para proc. com de IA)     │  │   │
│  │  │ - context       │                       └────────────────────────────┘  │   │
│  │  └─────────────────┘                                                        │   │
│  │                                                                             │   │
│  │  Única fonte de verdade - nada de armazenamento duplo!                      │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Arquitetura do Isolamento de Projetos

### Design de Múltiplos Repositórios

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              ChatManager                                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  projectMessageRepos: Map<string, MessageRepository>                                │
│                                                                                      │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐          │
│  │ "defaultProject" │     │   "project-1"    │     │   "project-2"    │          │
│  │                  │     │                  │     │                  │          │
│  │ MessageRepo      │     │ MessageRepo      │     │ MessageRepo      │          │
│  │ - Mensagens s/   │     │ - Mensagens só   │     │ - Mensagens só   │          │
│  │   vínculos/pad.  │     │   do Projeto 1   │     │   do Projeto 2   │          │
│  └──────────────────┘     └──────────────────┘     └──────────────────┘          │
│           ▲                         ▲                         ▲                     │
│           │                         │                         │                     │
│           └─────────────────────────┴─────────────────────────┘                     │
│                                     │                                               │
│                        getCurrentMessageRepo()                                      │
│                        (auto-detecta ativação perante projeto)                      │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Fluxo na Mudança/Troca de Projeto

```
Troca de Projeto Detectada (via área de trabalho / workspace Obsidian)
    ↓
ProjectManager.getCurrentProjectId() reporta devolução num formato e identificação no preenchimento de novo ID
    ↓
ChatManager.getCurrentMessageRepo()
    ↓
Checa verificando se há existência de um respectivo repositório perante o projeto
    ↓ (se não possuir)
Cria um novo MessageRepository correspondente
    ↓
Aloca com amarramento via Map atrelado referencialmente pelo nome projectMessageRepos
    ↓
Retorna a base depositária restrita atinente a referência do repositório específico focado perante a ordem no próprio projeto
```

## Ciclo de Vida da Mensagem

### Exemplo: Mensagem de Usuário com Nota de Contexto

Quando um usuário digita "Resuma esta nota" e anexa "meeting-notes.md":

1. **Entrada**: Texto do Usuário + arquivo em anexo → Componente do Chat
2. **Armazenamento**: MessageRepository guarda o displayText (texto puro): "Resuma esta nota"
3. **Processamento**: ContextManager lê e colhe dados submetendo o material via nota originária procedendo em gerar texto (processedText) estruturado corretamente focado em conformidade às tags no viés e estrutura atinente vinculada através e focada na base XML
4. **Sincronização na Memória**: A memória da cadeia absorve a base provida perante as submissões geradas e moldadas associadas atinentes ao componente no LLM (processada versão)
5. **Atualização Visual/UI Update**: Reporta no chat e envia com visual em formato de emblema/insígnia de identificação (context badge), mostra isolado unicamente com base purificada no seu texto apenas: "Resuma esta nota"
6. **Processamento LLM**: Inteligência via base focada ao componente de modelo na (IA) atesta recebimento via remessa contemplando e unificando carga em lote completo integrativo referenciado à consolidação total do contexto originário processando devoluções em formato originário a resguardar a própria resposta gerada com integridade

### Formato XML do Contexto

Todo contexto fica envelopado atrelando formatações padronizadas associativas frente etiquetas (semantic XML tags) semânticas operantes na formatação para que a ordem gere clara determinação estrutural:

> Processo de Prompt em Camadas: O formato bruto das informações referenciadas operativas procedidas e alocadas cruas provenientes da origem pautada pelo XML é no transcurso procedimental contido referente ao período atinente a base provinda pela Fase 3 mantido sob captações retidas estritas restritas com o uso atinente referenciado pela compatibilidade pautada nas formatações operativas garantidas via `processedText` provendo a amarra pautada perante as amarras retrógradas sob viés mantido resguardado à via (backward compatibility), não obstante a essência base formatada canônica enviada para processamento aos domínios interativos vinculados perante processamentos contidos à figura focada com uso ao LLM passa incondicional e exclusivamente focada proveniente estrita por vias das subdivisões focadas associadas no (envelope layers):
>
> - **L1_SYSTEM / L2_PREVIOUS**: Prefixos estáveis gerados por contextos acumulativos oriundos em junções
> - **L3_TURN**: Referências pontuais oriundas na via e transcurso do próprio turno (smart references) que em vias conectivas atrelam de forma unificada acoplada de retornos ao base de hospedamento focado com uso de (L2) e se desdobram provendo ancoragens de conteúdos associados no encadeamento acionável em inclusão (embed full content) integral
> - **L4_STRIP**: O histórico interativo no processamento mantido, depositado gerido com memória nas interações de vias formativas nas trocas de informações e comunicações
> - **L5_USER**: A mensagem base operante contida originada sem purificação atinente (raw message) do usuário (adicionada com as instruções composicionais da base formatada com as ordens ligadas às vias operacionais oriundas a provimentos em compositores nas eventuais (composer directives) estipulações preestabelecidas)

#### Contexto de Nota

```xml
<note_context>
<title>meeting-notes</title>
<path>docs/meeting-notes.md</path>
<ctime>2024-01-15T10:00:00.000Z</ctime>
<mtime>2024-01-15T14:30:00.000Z</mtime>
<content>
[o conteúdo atual e presente atinente material orgânico exato em referência à nota propriamente deve constar e abrigar este preenchimento]
</content>
</note_context>
```

#### Contexto de URL

```xml
<url_content>
<url>https://example.com/article</url>
<content>
[todo resgate coligado às colheitas de dados puxados contidos restritos oriundos associativos via resgate advindos e processados do provimento pelo apelo à url no URL]
</content>
</url_content>
```

#### Contexto de Texto Selecionado

```xml
<selected_text>
<title>Título da Nota de Origem</title>
<path>caminho/para/origem.md</path>
<start_line>45</start_line>
<end_line>52</end_line>
<content>
[escopo associado focado e referenciado unicamente atinente base submissa vinculada aos extraimentos sob restrição ligada ao próprio conteúdo atrelado referente texto assinalado na base do selecionado]
</content>
</selected_text>
```

#### Casos de Erro

```xml
<note_context_error>
<title>nome_do_arquivo</title>
<path>caminho/para/arquivo.ext</path>
<error>[Erro: Não foi possível processar o arquivo]</error>
</note_context_error>
```

Essa separação garante:

- UI limpa (mostra o que o usuário digitou)
- Contexto rico e denso voltado à atuação orientada associada com foco processado a formatações na manipulações vinculadas e destinadas na base operacional provida por instâncias na IA (inclui conteúdo originário ao interior na ordem presente contida internamente a nota atinente do arquivo)
- Contexto reprocesável operante em eventuais ou ocasionais interações provocando base gerada associada em referências atreladas com (message edits) de edições ligadas

Para exemplos detalhados, confira os repositórios atinentes e referenciados:

- `src/core/MessageLifecycle.test.ts` - Demonstração focada na constituição integral orientada pelo ciclo base perante preenchimento focando atrelado provido na via perante nota ao foco e conteúdo atinente no contexto
- `src/core/MessageLifecycle.xmltags.test.ts` - Testes e exemplos orientados a verificações pautadas focadas na via aplicada sob formatações nas etiquetas presentes aplicadas e operadas com tags XML

### 1. Enviando uma Nova Mensagem

```
Entrada do Usuário
    ↓ (via componente do Chat)
ChatUIState.sendMessage()
    ↓
ChatManager.sendMessage()
    ↓
MessageRepository.addMessage() // Armazena com o conteúdo básico
    ↓
ContextManager.processMessageContext() // Adiciona o contexto
    ↓
MessageRepository.updateProcessedText() // Atualiza com o texto processado + envelope de contexto
    ↓
ChatManager.updateChainMemory() // Sincroniza ao LLM
    ↓
ChatUIState.notifyListeners() // Atualiza UI
```

### 2. Editando uma Mensagem

```
Edição do Usuário
    ↓
ChatUIState.editMessage()
    ↓
ChatManager.editMessage()
    ↓
MessageRepository.editMessage() // Atualiza texto de exibição
    ↓
ContextManager.reprocessMessageContext() // Contexto Fresco/Atualizado
    ↓
ChatManager.updateChainMemory() // Sincroniza ao LLM
    ↓
ChatUIState.notifyListeners() // Atualiza UI
```

### 3. Exibição de Mensagens

```
Renderização do Componente React
    ↓
ChatUIState.getMessages()
    ↓
ChatManager.getDisplayMessages()
    ↓
ChatManager.getCurrentMessageRepo() // Ciente-do-Projeto
    ↓
MessageRepository.getDisplayMessages() // Visão Computada
    ↓
Filtra mensagens visíveis → Mapeia ao formato ChatMessage
```

### 4. Salvando o Histórico de Chat

```
Ação de Salvamento Pelo Usuário
    ↓
Chat.tsx → ChatUIState.saveChat(modelKey)
    ↓
ChatManager.saveChat(modelKey)
    ↓
Busca ID e mensagens relativas em base perante projeto operado amarrado em atuação no fluxo com estado provido operante a via condizente ao atual
    ↓
ChatPersistenceManager.saveChat(messages, modelKey, projectId)
    ↓
Cria um documento focada operante no viés de formato atinente submetido na via associativa contida na base do markdown e referenciado à junção associativa no preenchimento de indicativo base sob determinação através da constituição referenciadora à indicativo vinculativo através (project prefix)
    ↓
Expele com retorno o sucesso perante repasses referenciadores aos locais exatos via o caminho/trajetória de origem contida do documento consolidado depositário da formatação (file path)
```

### 5. Mudança de Projeto

```
Alteração de Projeto na área de trabalho (Obsidian)
    ↓
ChatUIState.handleProjectSwitch()
    ↓
ChatManager.handleProjectSwitch()
    ↓
Forçar getCurrentMessageRepo() para base operacional com providência fidedigna acionadora perante readequações originárias frente recálculos no preenchimento em atestação na base (re-detect) do atual e respectivo amarrado restritivamente com viés em operação na via do projeto
    ↓
Transferir foco processado e orientativo base perante a transição operacional (Switch) e adoção atinente ligada em referenciamentos com as características próprias presentes com formato vinculado via um repositório modificado com formatação alteradora operante de adoção em base a novo e referenciado depositário (MessageRepository)
    ↓
Ajustar acoplamentos ligados sob referenciamentos contínuos mantenedores vinculados em memória do executor e rede em conformidade alinhada e base na conformidade originada nas restritas delimitações perante o recém acoplamento formatado por (new project's messages)
    ↓
Avisar receptores, instâncias ligadas conectadas no repasse, ouvintes vinculados às interações e mudanças (listeners) presentes com instâncias sob atuação pautada à UI visando recálculo formativo atinente para que promovam execuções perante renovação providenciando engatilhamentos contínuos de atualizações visuais frente tela via (refresh)
```

## Estruturas de Dados

### StoredMessage (Uso Interno)

```typescript
interface StoredMessage {
  id: string;
  displayText: string; // O que o usuário digitou/A IA respondeu
  processedText: string; // Com o contexto atrelado ao usuário, o mesmo exibido em referência contida à IA
  sender: string;
  timestamp: FormattedDateTime;
  context?: MessageContext;
  isVisible: boolean;
  isErrorMessage?: boolean;
  sources?: { title: string; score: number }[];
  content?: any[];
}
```

### ChatMessage (Interface de Acesso Externo)

```typescript
interface ChatMessage {
  id?: string;
  message: string; // Texto de Exibição
  originalMessage?: string; // Texto processado
  sender: string;
  timestamp: FormattedDateTime | null;
  isVisible: boolean;
  context?: MessageContext;
  isErrorMessage?: boolean;
  sources?: { title: string; score: number }[];
  content?: any[];
}
```

### MessageContext

```typescript
interface MessageContext {
  notes: TFile[];
  urls: string[];
  selectedTextContexts: SelectedTextContext[];
}
```

## Carregamento do Histórico de Chat

### Mecanismo de Mensagens Pendentes

A nova arquitetura usa um padrão de "mensagens pendentes" para carregar o histórico:

```
main.ts.loadChatHistory()
    ↓
Decodifica o processamento (Parse) procedendo a decodificação da composição perante interações das comunicações atreladas oriundas à providência contida formatada baseada perante as composições arquivadas contidas a depósitos vinculados oriundos a instâncias associativas providas nos (file)
    ↓
CopilotView.setPendingMessages()
    ↓
Componente referenciado atinente à UI focado e atrelado do Chat aceita admissibilidade operante recebendo sob interações formativas recebendo carga de referencial em vinculações providas através de adendos contidos nas submissões orientativas por características e vinculações de parâmetros operantes formativos (`prop`) orientados providos por (pendingMessages)
    ↓
A execução procedimental com engatilhamentos amarrados a retornos executáveis condicionais em instâncias presentes sob o uso de (useEffect) monitora, descobre e constata sob amarra e formatação aplicável pela vigência focada nos preenchimentos oriundos com provisão vinculada atinente à verificação amarrada nas detecções efetuadas de acoplamentos presentes referidos nos identificativos associados frente presença aos fluxos atrelados sob amarra contida oriunda em (pendingMessages)
    ↓
ChatUIState.loadMessages()
    ↓
Sinalizações oriundas e amarradas por resposta sob execuções providenciadas por instâncias ligadas de engatilhamentos acionados perante funções em devoluções formadas com retornos retroativos base orientados atrelados perante o viés (`callback`) contidos no escopo e ação executiva por base atuante em (`onPendingMessagesProcessed()`) extingue na origem de forma efetiva os acoplamentos presentes removendo formatação ligada pendências retidas limpando e liberando os espaços residuais remanescentes operantes em formato (clears pending)
```

### Carregamento Ciente do Projeto (Project-Aware)

Quando for carregar o histórico de conversações:

1. ChatPersistenceManager providencia engatilhamento efetuando varreduras acopladas à adoções que purificam submetendo ao agrupamento contido nas amarras relativas atinentes às avaliações procedentes via arquivos filtrantes (filters files) ancorados com fundamentação nas atribuições atinentes estritamente orientadas no (current project) ativo momento.
2. Apenas e tão somente admite exibições ligadas e restritamente aplicáveis amarradas ao arcabouço referencial contido de composições estipuladas originárias na composição e base da nomenclatura aplicativa atrelada aos documentos operantes focados nas identificações textuais restritas aplicativas nos históricos de interações procedidas por prefixação restrita estritamente atinentes com submissão orientada via providência amarrada através da utilidade referenciadora no uso originado com apelos amarrados referidos sob o ID vigente condicionado à aplicação submissa no (`current project ID`) ativo no projeto.
3. Tratativas ligadas por submissões em trocas nas bases relacionadas com arquivos amarrados a descolamentos nas naturezas atinentes e não vinculativas por bases atreladas a restrição de formatos referidos pela premissa com ausência ligada ao âmbito no núcleo formatado aos projetos (`Non-project chats`) ganham instâncias procedimentais visíveis perante instantes restritos atrelados nas ocasiões precisas perante ausências atinentes atreladas em restrições desvinculativas sem estipulações em vigência ativa.

## Estratégia de Testes

### Testes de Unidade (Unit Tests)

- **MessageRepository**: 23 extensos ensaios de testagem providos englobando abrangência total inclusive a instâncias e providências contra prevenção pautada a falhas e erros estruturais do tipo (bug).
- **ChatManager**: Mais de 25 provimentos atuantes com escopos direcionados abrangentes e focados perante os contornos funcionais restritos operantes na funcionalidade crítica da aplicação.
- **Testes de Componente**: Prevenções englobando ocorrências base originárias atinentes a amarras nas interações duplas de identidades nas repetições com falhas originárias por uso de via formativa (duplicate key) dentro e inerente as bases operantes em (MessageContext).

### Testes de Prevenção a Inconsistências (Bug)

1. **Defeito no Emblema/Insígnia (Badge) Vinculada Ao Componente do Contexto**: Garante as devidas constatações associativas de formatações exibindo de modo contido o processamento providenciador de contexto operante em formato alinhado no processamento com as submissões corretas
2. **Sincronização de Memória**: Aborta na forma bruta perante os incidentes base atinentes amarrados no desencontro (mismatches) das contagens associadas com as estruturas formatadas perante memória de chat (chat memory count)
3. **Falhas atinentes via Edição Submetida nas Mensagens**: Confere exatidões condizentes frente a submissões das dinâmicas atinentes associativas com as readequações orgânicas nas reconstruções provindas com formatações atreladas (proper context reprocessing) ao uso próprio perante os recálculos contínuos em processos referidos
4. **Acoplamentos Originários em Submissões a Notas Operantes Repetidas e Referenciadas via Base Duplicada**: Tolhe interferências na origem das submissões, e evita conflitos focados com chaves no intermédio das tratativas (React key) oriundas durante renderizações expostas do contexto visualizado (context display)

## Migração partindo do SharedState

### Antes (Legado)

```typescript
// Múltiplas fontes de verdade
const sharedState = {
  currentChatMessages: ChatMessage[],
  chatHistory: ChatMessage[],
  // Lógica de sincronização complexa entre as matrizes em ambos os arranjos numéricos (arrays)
}
```

### Depois (Arquitetura Limpa)

```typescript
// Única fonte de verdade
const messageRepository = new MessageRepository();
const chatManager = new ChatManager(messageRepository, ...);
const chatUIState = new ChatUIState(chatManager);

// Visões computadas
const displayMessages = chatUIState.getMessages(); // Para a interface (UI)
const llmMessages = chatManager.getLLMMessages();   // Para o processamento em (IA)
```

## Considerações de Desempenho

### Eficiência de Memória

- Armazenamento singular suprime redundância obliterando duplicidades ligadas por objetos na via formativa à (message)
- Tratativas vinculadas a visões geradas nas computações da forma originária são procedidas (on-demand) perante as demandas em instâncias sob uso providenciado originado em vias pautadas na formatação (generated) sob demandas estritas a vias provindas por referenciamento do sistema sob solicitação referida em solicitações expressas acopladas (on-demand)
- Tratativas aplicáveis em processamentos amarrados a instâncias atinentes no escopo atrelado à ocorrência ligada com context operam baseadas unicamente em formatações submissas a restrição orientativa operada a instâncias em necessidades associadas com uso de provimento restritivamente e focadamente exclusivo operado de via no qual haja o requisito fundamental e expressamente submetido nas provisões da demanda e acionamento estipulado imperioso com via essencial (only when needed)

### Otimizações no Escopo de Utilização e Provimento em Base ao React

- Renovações oriundas nas vias orientadas por adoções e acoplamentos aplicáveis pautadas através restritivamente a interações através usos associados com vias de amarras através (Subscription-based) mitigam formatações atreladas com desequilíbrio e minimizam disparos constantes referentes nas excessivas ocorrências atreladas providas em repinturas e (re-renders) no arcabouço estrutural do quadro formador visual gráfico atuante com os arranjos originados.
- Assinaturas nas chaves geradas em instâncias originais e operantes providenciando amarras de instâncias amarradas em formatações puras na exclusividade orgânica em referenciamentos com restritividade operante a característica (Unique keys) operantes na interdição e contenção submetida perante os atritos e ruídos vinculados aos perigos contidos em (React reconciliation)
- Flutuações, transições e readequações procedentes através (State changes) processam instâncias formatadas amarradas na via orientada através do uso associado na submissão em lotes concentrando os processos contíguos de (batched) executados amarrados e retidos através passagem pela (ChatUIState)

## Recursos Essenciais da Arquitetura

### Benefícios Atrelados na Providência Restritiva Vinculada no Isolamento Oriundo Perante Interações Focadas Referidas Atinentes Pelo Projeto

1. **Completa e Restrita Separação Plena Isolada**: Projetos em uso no individual resguardam providências retendo exclusividades isoladas restritivas amarradas de referências a todo interativo de troca em bases com histórico formatadas isoladamente referenciando o histórico
2. **Gerenciamentos Totalmente Autônomos em Formatações Integradas Automaticamente**: Liberações providas eximem obrigações amarradas a manipulações nas configurações submetidas atinentes às amarras oriundas pelas configurações focadas ao formato e adoção via (user configuration)
3. **Dinâmicas Fluídas Isentas perante Instâncias a Tratativas Restritas Focadas nos Procedimentos Acionados Via Transições Sem Impacto Visual/Funcional Negativo Originário no Engatilhamento por (`Seamless Switching`)**: Ajustes originários no acoplamento ao instantes pontuais e providos em foco nas trocas orgânicas efetuadas na dinâmica orientativa operante e amarrada nas (Instant context switch) relativas à transição condizente atinente ao transitar no manuseio procedimental do acoplamento via projeto
4. **Dinâmica Provida Eficiente em Gerenciamento na Referência Oriunda à Memória Ativa**: Retenção focada amparando formatações no arranjo do sistema estipulado na submissão providenciadora associativa e provida do preenchimento estrito retido referindo (Only active project's) em associação perante submissões no espaço ativo da formatação
5. **Aberturas Restritas Limpas em Providências Sem Sujeiras Vinculadas no Descolamento de Sessões Limpas e Livres em Registros Acoplados por Renovações Focadas à Base do Marco Temporal (`Fresh Start`)**: Toda a abertura submetida perante bases vinculadas no núcleo de origem provinda aos agrupadores oriundos sob a denominação atinente a projeto operam perante fluxos engatilhados providos sob a condição inicial da formatação original preenchendo as tratativas a via e amarra focada e submetida pela instância desprovida com amarras em usos e acoplamentos vinculados à bagagem preexistente oriundas por bases esvaziadas (empty chat history)

### Providências Atreladas em Integrações via Adoção Persistente Perene

1. **Titulação Direcionada Operante Focada através Apelo Inteligente (Project-Aware Naming)**: Fixação estrutural ligada nas denominações associadas no acoplamento retido originário por bases provindas amarradas a apelo prefixativo atinente no escopo focando formatação vinculada através do (`project ID`)
2. **Rolagem Operante Restrita Condizente ao Limite Imposto Orientativo de Acoplamento Referenciador e Focado através de Base em Filtragens Aplicáveis (Filtered File Lists)**: Provimentos engatilhados operando exibições restritivas condicionando bases de exibições amarradas de exclusividade unicamente submetidas via instâncias de amarra condizentes operantes ao relevante atinente material estrito ligado as dependências no chat amarradas em preenchimentos oriundos amarrados nas condições formadas originariamente
3. **Formatação Padronizada Contínua na Manutenção Integrativa Amarrada e Coesa da Integridade Aplicada nas Operações Estruturais Contíguas por Conformidade (Consistent Format)**: Regra restritiva no formato e diretiva vinculada nas regras via uso atinente sob amarra perante arranjos formatados com bases adotadas perante as instâncias no markdown procedimental adotado mantendo e replicando uniformidade inabalável, abrangência irrestrita garantida incondicional e niveladora nas provisões (across all projects)
4. **Regras Aplicáveis Voltadas e Atreladas nas Limitações Relativas e Providas frente Operações Restritas Ligadas às Contenções em Prevenções nos Eventuais Rompimentos Inesperados Relativos por Erros de Falhas Acidentais Formadas Em Amarras Restritivamente Voltadas (Error Handling)**: Engrenagens submissas vinculadas nas atribuições providas nas retrocompatibilidades e recuperações base atreladas operativas pelas bases restritivas em formatos focados a substituições de garantia provindas originadas com provisão através vias acionáveis nas amarras de seguranças protetivas (`Graceful fallbacks`) orientadas em acionamentos providenciando amarras associadas a incidentes ocorridos sob falhas provindas nas atuações aplicadas amarradas amparando nas interações referentes nas instâncias e salva-guardas perante usos contíguos procedentes referidos a interações em salvamento procedido a falhas (save/load failures)

## Detecção na Causalidade Solucionando Resoluções Providas Ligadas aos Infortúnios Vinculados Referentes aos Incidentes Oriundos a Problematizações Submetidas ao Processo na Estrutura Base Formatada na Utilidade Acionável (Troubleshooting)

### Intercorrências Habituais Ocorrentes perante Processos Referidos e Assinalados com Evidências Notadas (Common Issues)

1. **A Base Vinculada Atinente à Composição Originária Retida no Preenchimento da Estruturação e Forma Ligada Atrelada pelo Componente Formado via (Context) Demonstra Engessamento Refratário Negando Incorporação Amarrada Referente ao Recálculo Estipulado Atualizador Inativando Adequações**: Validar e atestar a certificação nas confirmações focadas referidas se (updateChainMemory()) foi acionada devidamente e evocada logo subsequentemente depois atinentes manifestações operantes por via de execuções nas provisões aplicadas e provindas amarradas a processamentos associados via usos de alterações procedidas e formatadas via amarras com provimentos no núcleo das intervenções contidas atreladas em formatos com (edits)
2. **A Área Operante Vinculada Restritiva Aos Contornos Pertencentes Associados perante Configuração do Arranjo Composição na Apresentação Relacionada Ao Composto Operante de Interface Visual Atinente Frente Estruturação Designada Formada e Associada Com Amarra Frontal e Submissa Ligada a Base (UI) Paralisa Estática Referenciada Perante Abstenções Vinculadas Associativamente às Formatações Atreladas a Submissões Ligadas Em Reações Frente Adequações Restritivas e Focadas nas Configurações Adotadas Orientativas Com Premissas Perante Necessidade Relativa a Recálculos Renovatórios de Refrescamentos na Execução Não Respondendo Originário (not refreshing)**: Providenciar testes certificando perante as obrigações e averiguações atestatórias exigindo amarras em garantias atestadoras restritas garantidas onde a ocorrência formadora perante apelo e ordem executiva provinda através da requisição imperativa referida atinente de chamada orientadora operante nas provisões no uso providenciado originário (notifyListeners()) se materializa provinda da obrigação posterior pós modificações ocorridas associadas nas adequações restritivas em preenchimento estrito ligadas em atuações frente as alterações operantes amarradas de arranjos contidos operantes no estado com usos na aplicação (state changes)
3. **Disparidades Condicionantes de Enquadramentos Analíticos Nas Medições Associadas Nas Composições de Totalidades Atreladas Em Quantias Incoerentes Amarradas Restritivamente Por Submissões Pertencentes Referenciadas Originárias Do Acoplamento Nas Vias Aplicativas Em Totalizadores Das Fórmulas Relativas Ao Cômputo Das Fórmulas Presentes Da Instância Vinculada Associativamente Na Base Matriz No Provimento Encarregado Originário Na Manutenção e Estruturação Da Capacitância Analítica Estipulada Perante Os Retentores No Hospedeiro Do Núcleo e Configurações Do Estoque Contido No Ambientes E Composição Atreladas Via A Memória Da Rede Acoplada Operante No Arquivamento (Memory count mismatch)**: Averiguar, testar perante ratificações atestando que os agrupamentos originários no recálculo nas instâncias pertencentes à base formatada associada de amarra vinculada em atuações operantes no preenchimento originário com via restritiva e acionada em interações orientadas por intermédio das disposições ligadas a usos amarrados referidos nas tratativas sob (`truncateAfterMessageId()`) operam promovendo adequações vinculativas com base nas obrigações associativas referenciadas atinentes à atuações operativas nas intervenções contíguas e associativas a amarra nas interações com via base perante os arranjos contidos oriundos na submissão de renovações orientadas ligadas e associadas com bases retidas via memórias aplicáveis através rede executiva operante por engatilhamento de formatações na utilidade (chain memory)
4. **Preenchimentos Originários com Vias Submissas Focadas em Inserções Decorrentes Pautadas através Elementos Exibindo Múltiplas Adjunções Perante Componentes Referidos Nas Insígnias De Composições Restritas e Acoplamentos Duplicados Na Natureza Formatada Formando Retenção Ligada na Via Vinculada aos Arranjos Com Emblemas Decorrentes Oriundos Nas Atribuições Associativas a Base Operante na Camada Aplicável do Apelo (Duplicate context badges)**: Esquadrinhar matriz com averiguações perante atestados no arranjo referenciado por bases vinculadas na operação associada a restrição na forma gerada associativa através das ordenações e chaves formatadas amarradas na natureza associativa por vinculações orientadas na base operante perante a via acoplada via natureza (React keys) no recinto integrador referente ao corpo presente acionado no componente operante na amarra atrelada amparada a composição referente base originária da via atinente (`MessageContext component`)
5. **Apontamentos Desordenados e Contraditórios Em Apelos Relacionados nas Configurações das Constatações com Fugas no Alinhamento do Vínculo Associado Amarrado no Redirecionamento Com Fuga de Submissões Referentes Nas Origens E Enquadramentos Por Desvio Direcional de Atribuição Pautada Nas Bases de Acoplamentos Ao Vinculativo Associado no Arranjo Com A Formatação Do Núcleo Operante Relativo O Modo Referenciado Relacionado com Descolamentos Da Base Referida Pelo Identificador e Configurações Contidas Vinculadas Atinentes a Outros Corpos Inapropriados Acoplados Em Fugas Pelo Alocamento Em Formatos Operantes Perante Enquadramento Condizente Orientado Pela Designação Em Vias Pertencentes Inadequadas De Trocas Involuntárias Entre Elementos Alheios Descolados Pertencentes Ao Próprio Modelo Adotado Desvinculados Amarrados Operantes Relativos Perante As Ocorrências Associativas Das Falas Atinentes Amarradas E Dispostas Perante Redes Vinculadas Com Origens Extintas Ou Referidas Base Do Erro Pautado Referente Ao Outro Apelo Adotado Em Fuga Pela Direcional Das Submissões Orientativas Operadas Nos Próprios Acoplados Referentes Nas Operativas (Wrong project messages)**: Conduzir atestação garantidora checando na via aplicável o processamento e a retribuição do cômputo devolvido no arranjo e referenciamento através da vinculação via processamento sob usos no apelo referente pelo retorno referenciado de submissão do arranjo vinculativo ao escopo atrelado via `getCurrentProjectId()` a devolução em conformidade fidedigna associada perante os cômputos esperados provindos e associativos no retorno referenciado de estrita conformidade às avaliações com (expected value)
6. **Desfalques Perante as Existências Referenciadas e Materializações Pertinentes na Aferição Associada perante Apuros nas Verificações Pautadas nas Ocorrências por Comprovações Materializadas nas Inexistências Focadas aos Sumiços Focados nas Lacunas Providas em Falhas Associativas por Registros Submetidos em Disposições Preenchidas Referidas aos Intermédios Ausentes Pertencentes ao Próprio Registramento Focado e Atinente na Conservação Orientativa das Trocas Orientadas (Missing chat history)**: Exigir ratificação comprobatória garantidora que as formatações prefixadas relativas e incorporadas base associativa de forma condizente com ID perante o próprio corpo de formação originária do projeto amarradas de bases no corpo e identificação amarrada ao nome do componente (filename) refletem equivalência perfeitamente pautada no alinhamento e precisão estrita espelhando alinhadamente o exato referencial provindo perante configuração no status operante perante a correspondência do componente ativo acoplado de uso (current project)

### Métodos Empregados Focados Amarrados Atinentes Aos Usos De Repasses Orientados À Solução Baseada Nas Execuções E Provisões Em Ferramentarias Orientadas Na Prevenção Em Base Nas Avaliações Na Solução Dos Apuros Focados Sob Amarra Nas Intercorrências Visando Resgates Submetidos Purificadores Adotando Contornos Profiláticos Direcionados Puramente Focados na via Amarrada aos Enquadramentos Em Atividades Específicas Direcionadas Através O Recurso (Debug Methods)

```typescript
// Averiguar as integridades referidas ao estado atinente do repositório
messageRepo.getDebugInfo();

// Averiguar arranjos e composições de conformidade ao administrador (estado gerente)
chatManager.getDebugInfo();

// Estabelecer cruzamento e apuração vinculada atestadora no paralelo base LLM vs display (volumetria relativa no mostrador exibível em contagem por totais)
console.log({
  display: chatUIState.getMessages().length,
  llm: chatManager.getLLMMessages().length,
});

// Sondar repositórios presentes em submissões atuais por conformidade orientada aos projetos e repositório
const debugInfo = chatManager.getDebugInfo();
console.log({
  currentProject: debugInfo.currentProjectId,
  totalProjects: debugInfo.projectCount,
  messagesByProject: debugInfo.messageCountByProject,
});
```

## Arquivos Correlacionados e Coligados Integrativos Ao Assunto Atinente (Related Files)

### Instâncias Acopladas Submetidas à Composição Documentativa

- `designdocs/CONTEXT_ENGINEERING.md` - Desenho procedimental esquemático operante referente aos provimentos ligados a forma focada por bases de camada provinda pela formatação estruturada de via orgânica e atuações associativas a L2 ligada e atrelada em autogeração na utilidade por usos orgânicos amarrados com formatações e promoção de detalhamentos referenciados.
- `designdocs/MESSAGE_ARCHITECTURE.md` - Disposição estrutural material referente e associativa da própria arquitetura disposta contida no corpo pertencente a esta tratativa na base atinente a base orientada focada em base gerenciadora operante de via focada (mensagem-gerenciamento de arquitetura).

### Implementação Base Submetida E Condicionada Nas Instâncias Pertinentes No Coração Focado Atinente E Operante (Core Implementation)

- `src/core/MessageRepository.ts` - Instância matriz operadora orientada pautada nos arquivos retentores (Armazenamento associado perante mensagens).
- `src/core/ChatManager.ts` - Processamentos submetidos em conformidades lógicas orientadas (Lógica de negócios e arranjos provindos no formato isolativo focado em formatação de submissões em projeto).
- `src/state/ChatUIState.ts` - Intermediador operacional vinculando ações e interligações gerenciadas via (UI estado e gestão de via e arranjo de base de uso operante).
- `src/core/ContextManager.ts` - Condução focada restritiva associada pelas operações oriundas associativas e focadas perante instâncias na constituição atinente referida a matriz e viés via (Contextual-processamento).
- `src/core/ChatPersistenceManager.ts` - Viabilidade provida por consolidações aplicáveis amarradas ao resguardo fixador mantenedor focado em estabilidade de bases originadas no histórico (Persistência e estabilização originária orientada ao chat-histórico).

### Integração Relativa a Estruturação Amarrada na Amálgama Por Formatações Vinculadas à Base no Arcabouço Procedimental e Formato Provindo no Processo e Acoplamento da Forma Aplicativa Associada via Formação Atinente Pertencente Referente no Próprio Uso Do Reator Componente No (React) Integrador Formativo

- `src/components/Chat.tsx` - Operante originário de base matricial associado com apelos e componentes em instâncias atinentes no viés interligador atrelado através componente matriz (Principal associado em via atrelada base ao formador e construtor focado a via componente no fluxo atinente no referencial amarrado à formatação atrelada via componente referenciador de usos atinentes a amarra originada no base referenciada e aplicada via chat componente).
- `src/hooks/useChatManager.ts` - Adereço originário a vias de utilidades formadoras na base referenciada pautada por adoções contidas no (React hook) procedendo a utilidade referenciada atinente à `ChatUIState` .
- `src/components/chat-components/ChatSingleMessage.tsx` - Referência atrelada operativa perante amarras em amostragens com usos práticos associativos nas vias operantes atinentes com submissões em base à amarra na tela e disposição visual com base aplicativa em instâncias ligadas referidas via mensagem perante usos de forma operante perante a exibição orientada.

### Avaliações Orientadas Em Foco Aos Processos Associativos Amarrados Nas Diretivas Providas Por Operações Acopladas a Checagens Referenciadas (Testing)

- `src/core/MessageRepository.test.ts` - Ensaio orientado a preenchimentos testáveis a nível de repositórios (Repositório de avaliações processuais contidas).
- `src/core/ChatManager.test.ts` - Ensaio atrelado a bases voltadas e amarradas por testagens condizentes provindas através da viabilização por uso amarrado e atrelado com usos gerenciais e atestadores no gerenciador operante através administrador base em gerenciamentos relativos aos arranjos referidos.
- `src/core/MessageLifecycle.test.ts` - Arcabouço base submetido a instâncias pautadas mediante viabilidade ligada por modelagem aplicável a amostragens em exibições de exemplos associativos no todo englobando bases relativas orientadas por notas e interações originárias nos alinhamentos ligados nas instâncias associativas completas englobando amarra procedimental originária nos agrupamentos formatados no histórico em encadeamento provindo através usos via o trajeto associativo com a constituição integral da passagem por todo percurso integral vital atrelado focado restritamente ao longo percurso base referenciado através formato amarrado às transações na (Complete lifecycle exemplos práticos englobando arranjos formativos e anotações base em viés referenciador em notas).
- `src/core/MessageLifecycle.xmltags.test.ts` - Experiências submetidas a ensaios através averiguações relativas em adoções avaliativas com diretrizes pautadas nas orientações formadas nas matrizes focadas operantes através a constatação associativa do formato orientador referente em validações de viabilidade nas etiquetas base atreladas através instâncias originadas nas formatações procedentes vinculadas com as formas procedentes orientadas nas constatações de validações amarradas de preenchimentos pautados pelas designações aplicativas atinentes às formulações via formatações XML.
- `src/components/chat-components/MessageContext.test.tsx` - Modelagens avaliadoras direcionadas e referenciadoras pautadas em garantias efetuadas via averiguações de checagem condizentes associadas com viabilidades base submetidas aos agrupadores restritos referenciados aos contornos nas averiguações submetidas através atuações amarradas às bases operantes perante utilizações amarradas nas formas visuais operativas de arranjos contidos no apelo operante via bases de restrições em atuações oriundas nas providências ligadas via arranjo formativo de tela visual de amostragens amarradas no enquadramento associativo ao context de amarra referenciada em usos na amostra em (Context display tests).
