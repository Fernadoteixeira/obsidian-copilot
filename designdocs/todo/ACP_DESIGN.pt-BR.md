# Design de Integração ACP (Fina

Status: Rascunho final para a implemen
Data: 2026-02-19

## 1. Obje

Adicionar agentes ACP (Claude Code, Codex, OpenCode) como interação principal de primeira classe no Copilot

Direção princip

- ACP é um caminho de runtime par
- Modos de chat LangChain existentes permanecem inta
- Arquitetura de longo prazo otimizada para o ACP como caminho primário 

## 2. Decisões Finais

1. Usar `InteractionMode` (`llm` vs `agent`) em vez de adicionar `ChainType.AC
2. Manter o ACP isolado das pilhas de modelo/ferramenta/memória/envelope LangC
3. Suportar leitura/escrita de arquivos + permissão no
4. Troca de modelo do OpenCode é exigida quando recursos de modelo da sessão ACP estão dis

## 3. O Que o ACP Muda (e O Que Não Muda)    

### 3.1 Ignorado no modo `agent`

- Pipeline de solicitações `ChainManager` / `Chai
- `ChatModelManager` e seleção de modelos de prov
- Construção de envelopes L1-L5 no `ContextMan
- `LayerToMessagesConverter`
- Sincronização de memória do LangChain (`MemoryManager`, `up
- Planejamento/chamadas de ferramentas nativas do LangC
- `getAIResponse()` em `src/langchainStream.ts`

### 3.2 Reutilizado no modo `a

- UI do shell de chat e contêineres da list
- `MessageRepository` para armazenamento 
- Modelo de assinatura de `ChatUIS
- `ChatManager` como hub orquestrador (com envio específico do ACP)  
- Infraestrutura existente de conf

## 4. Arquitetura de Runti

### 4.1 Modo de Interaçã

Adicionar modo de interação superior em `src/aiParam

```ts
type InteractionMode = "llm" | "agent";
```

- Modo `llm`: comportamento atual do Copilot inal
- Modo `agent`: pipeline e controles do AC

### 4.2 Módulos Runtime do 

Criar um namespace dedicado ao ACP (`src/acp/`

- `src/acp/ports/agent-client.port.ts` — Interface IAgentClient (contrato princ
- `src/acp/adapters/acp.adapter.ts` — geração de processo, handshake ACP, fluxo ndJSON, rotas de sessão, fila de permissões
- `src/acp/adapters/terminal-manager.ts` — lida com callbacks do terminal ACP: `terminal/create`, `terminal/output`, `terminal/kill`, `terminal/wait_for_e
- `src/acp/types/*` — tipos de domínio (AgentConfig, SessionUpdate, PromptContent, e
- `src/acp/session/ACPManager.ts` — ciclo de vida do adaptador, troca de agentes, resoluç
- `src/acp/context/AcpPromptAssembler.ts` — cria o conteúdo do prompt do ACP a partir do input do usuári
- `src/acp/updates/AcpUpdateReducer.ts` — roteia notificações de atualização da sessão ao esta
- `src/acp/components/*` — seletor de agente, seletores de modo/modelo, renderizadores de ferrament

Regras de des

- Os módulos ACP não devem depender dos componentes de runtime
- Todos os detalhes de protocolo isolados na camada `adapters/`; domínio e UI usam apenas interfaces por

### 4.3 Caminho Paralelo do ChatM

Manter `sendMessage()` existente inalterado (modo L
Adicionar `sendAgentMessage()` para o 

1. Criar/armazenar a mensagem do usuário (te
2. Criar o conteúdo do prompt do ACP através de `AcpP
3. Delegar ao gerenciador do ACP para transmissão do pro

## 5. Estratégia de Contexto no Modo

Os agentes ACP gerenciam as próprias janelas de contexto e ferramentas. Copilot fornece só o contexto d

Política de prompt em mod

- Incluir a mensagem de usuário
- Incluir apenas contexto anexado no turno atual (notas/seleções web/imagen
- Não compilar ou injetar a biblioteca cumulativa de co
- Não injetar faixa de conversa L4 do Copilot.
- Não forçar prompt do sistema do Copilot por pa

Conversão do contexto anexado (feita por `AcpPromptAssembler`)

- Notas mencionadas com @ → Blocos `Resource` do ACP se tiver suporte `embeddedContext`, ou texto inserido direto.                  
- Imagens → blocos de imagens ACP se o agente suportar `image`.          
- Seleções da web → conteúdo de texto.             

Configuração avançada opcional (desativada 

- "Anexar instruções do sistema personalizadas do Copilot em

Isto evita duplicação de contexto e mantém o comportamento do prompt na

## 6. Leitura/Escrita de Arquivos e Modelo

Esta seção reflete padrões de integração do ACP e requisitos de design finais do Copilot.         

### 6.1 Achado: Padrões Típicos de Operação de Arqui

Observados em fluxos de clientes ACP

- Ao inicializar o ACP, clientes podem informar
  - `fs.readTextFile = false`
  - `fs.writeTextFile = false`
- e continuam entregando rica UX de edição v
  - eventos `tool_call` / `tool_call_update` do agente (incluindo diff),   
  - permissões ACP `session/request_p
  - ações de UI mapeadas para respostas de permissões do ACP.     

Signific

- o fluxo de permissão de edição costuma basear-se em ferramentas do agente, não nos callbacks `fs/*` do 

### 6.2 Requisitos do Copilot e design final

Modo agente deve apoiar a leitura/escrita de arquivos com permissões.    

Nós apoiamos isso através de dois can

1. Canal de permissões das ferramentas de agent

- Gerenciar e renderizar diffs e status para `tool_call`/`tool_call_up
- Lidar com `session/request_permission` via interface visual de aprov
- Postura de segurança padrão: sem permissão automá

1. Canal de callbacks do fs ACP (extensão de compati

- Criar manipuladores reais `fs/readTextFile` e `fs/writeTextFile` paras APIs vault do Obsidian
- Confinar escritas atrás do mesmo fluxo de permissão manua
- Manter flags compatíveis perfeitamente precisas a execuçã

Raciocínio

- Canal 1 combina ao comportamento real dos agentes alvos, imediato.           
- Canal 2 avança à compatibilização de agentes diretos.                     

### 6.3 Arquitetura da Chamada de Ferramenta

No modo `agent`, existem duas faixas de fe

1. Ferramentas de agentes nativas do ACP

- Agente executa ferramentas inter
- Agente emite `tool_call` / `tool_call_update`
- Copilot renderiza os blocos de ferramentas e de p

1. Habilidades do Agente (Skills - contexto, ex

- Skills são **scripts e arquivos markdown** num diretório, similares aos da Claude Code.                      
- O Copilot expõe as habilidades de arquivo; o **agente** os executa e o Copilot não o faz via client-side.                            
- Divulgação progressiva: as skills só são lançadas baseado em contexto conversacional.                                 

#### 6.3.1 Design das Skills d

**O que uma skill é:

- Um arquivo `.md` que contém as orientações, matrizes e as matrizes do
- Auxiliadas com roteiros (shell, python) para agentes de ferramentas via sistema interno.                   
- Organizadas dentro do repositório copilot-skills configurado (`copilot-skills/`).    

**Exemplo de estrutura de ha

```
copilot-skills/
├── vault-search.md         # Como usar CLI/MCP miyo em pesquisa híbrida     
├── web-search.md           # Uso do sistema próprio de buscas web e ac
├── youtube-transcription.md # Transcrição self-hosted de vídeos do Yout
├── code-review.md          # Como você deve revisar o código local de forma adeq
├── commit-conventions.md   # As convenções exclusivas e form
├── vault-organization.md   # Informação importante da fundação gera
├── scripts/
│   ├── run-tests.sh        # Runner exclusivo onde é possível
│   └── lint-check.sh       # Script de veri
└── templates/
    └── meeting-note.md     # Notas da reunião                              
```

**Exemplo: vault-search.md (integração miyo)** 

```markdown
# Busca do Vau

Usar miyo em uma busca híbrida sobre todo vault (semântico + key

## CLI

miyo search "<query>" --limit 10

## MCP

miyo também serve para o MCP para um controle avançado.            
```

**Exemplo: web-search.md (serviço self-hosted)**

```markdown
# Busca Web 

Busca web via provedor central (Firec

Endpoint: http://localhost:3002/v1/search
Method: POST
Body: {"query": "...", "limit": 5}
Returns: JSON array de metadados ricos {titl
```

O formato reflete as padronizações integrais aos vários scripts unifica

- **miyo** (híbrido) e nativo ou terminal livre e limpo e o mcp
- **Self-hosted Firecrawl** direto e liso 
- **Supadata Self-hosted** transcrevendo vídeos inte
- Ou para futuras redes locais na arquit

O Copilot sempre evita pontes de serviço interno. Os agentes gerenciam o cha

**Como as skills alcançam o age

- Baseado na pasta raiz local, agentes leem diretamente arquivos puros via o fs interno de traba
- O Copilot passa os metadados contextuais diretamente do diretório via prompt pr
- O Copilot opcionalmente lista as chaves disponíveis ativas das descrições.            
- O agente ativamente determina por conta própria o que deve ser lido seguindo independ

**Estratégia de divulgação progressi

- Nível 1: Introduzir chaves no índice de skills baseados no sistema central (um formato de lista 
- Nível 2: Injetar chaves de skills fixadas no núcleo absoluto ("always active" e similares perm
- Nível 3: Agentes exploram arquivos de instrução do diretório a critério através de

**Interface visual da sk

- Configurações: caminhos definidos e cam
- Skills browser: ativar tags dinâmicas ativas globais em diretórios marcados po
- A restrição total do lado cliente não executa serviços nas regras; o próprio

**Princípio Chave:

- O contexto, puramente injetado pela estrutura principal sem acoplamentos das 
- Sem ferramentas client-side, o ACP não liga em LangChain livre sem ligações indesejad
- A analogia de como a AI Claude entende informações da raiz em arquivo com nome e leit

## 7. Estado de Sessão e Agen

### 7.1 Predefinições

Padrões embutidos:

- Claude Code
- Codex
- OpenCode

Cada pré-definição pode ser c

- `id`, `displayName`, `command`, `args`, `env`.

Não fixe comandos e caminhos cegos de versões não p

- Em muitos exemplos e subcomandos ativos do próprio prog
- Um número significativo pode usar e suport
- Pré-definições e as origens se adequam estrit

### 7.2 Capacidades 

Rastrear as especificações de recursos nativos das 

- recursos lógicos prompt (`image` e `
- os canais em sessões nas listas de controle centrais conectadas dina

Interface nativa restringe por capabi

### 7.3 Troca de modelos do Open

Implementação obrigatória: 

- Capturar sessão usando dados autênticos via conexão nas informa
- Um menu limpo visual ativo de seleção central quando 
- Switch central usando uma ativação inst
- Use transições via respostas confiáveis em tela 

Importante observação do

- A atualização `current_mode_update` bas
- Evitar confusões em uso não autorizado de trans

### 7.4 Recuperação da conexão de erro 

Visualizar na chat UI mensagens autênticas limpas, com o tratamento ativo e cont

**Categorias de erro:

- **Spawn** base (permissões da matriz rejeitadas puramente ou falhas gerais do executável remoto base ou caminhos cegos corrom
- **Crash central** interno livre de controle puro ativo (processo finalizado repentinamente no 
- **Protocolo de Rede Falhou** central via ACP puro ativo localmente da raiz (erros de execução contínuos retornados J
- **Silêncio de execução** passivo contínuo do agente puramente original base e da interface autônoma mestre local independente conectada

**Estratégia de reconexão:

- Nenhuma ação não autorizada central automática livre isolada do fluxo puro mestre nativo original e
- Acionado apenas manualmente no núcleo base puro da UI principal integrada conectada i
- A função "Load e Restart" reinicia os ambientes salvos locais.                                            
- Controles de UI puramente limpos em chat UI da barra base de status.                                

## 8. Comportamen

### 8.1 ChatControls

No momento exclusivo ativo puro r

- Controles normais puros originais d

Ao interagir isoladamente mestre na

- Painel do switcher d
- Se a conectividade pura livre autônoma conec
- Os modelos e opções remotas aparecem baseados 
- Visor puro ativo de rede na barra superio
- Restringir as barras exclusivas puramente do projeto e as ferramentas au
- Opção puramente passiva ativada síncrona da barra principal ativa livr

### 8.2 Rederização das matrizes das me

Exibir os pacotes isolados conectados da i

- bloco ativo mestre nativo remotos de tela (`a
- fluxo do contexto interno conectado at
- bloco `tool_call_update`, seguro ativo mestre nati
- requisições livre mestre puras ativas remo
- visualizações integrad
- visualizaçõ

Desativar o uso híbrido cruzado remoto nativo puro autônomo base autêntic

Mostrar os contextos puramente ativos da raiz segura matriz autô

- as informações livres conect
- a exibição da barra ativa remota livre autêntica segura n

## 9. Mensagens   

### 9.1 Base Legada LLM     

Não alterar nativo seguro gl

- O loop e as conexões do core central permanecem ativas isoladas puras mat

### 9.2 Base ACP d

Novos loo

1. As funções da tela matriz autônoma segura is
2. O envio seguro matriz conectado nativo livre puro isolado síncrono autêntico global
3. Garantem puramente a conectividade nativa segura autêntica sínc
4. Conectam e visualizam matriz base livre pura at
5. Em caso nativo de cancelamentos mest

## 10. Menu de Configuraç

Opções mestre exclusivas adicionais na tel

- interações puramente baseadas no pa
- seletores mestre un
- configurações locais ativas l
- auto permissão e liberação matriz autônom
- integração puros mestre de diretórios da máquina e ambientes de di
- log ativado base puro mestre e matriz de

## 11. Implementação Progr

### Phase 1: Núcleo e engi

**Objetivo:** Text stream puro nativo seguro ativo base raiz mestre gl

**Criação livr

| File                                     | Ported from reference                | Description                    |
| ---------------------------------------- | ------------------------------------ | ------------------------------ |
| `src/acp/ports/agent-client.port.ts`     | `domain/ports/agent-client.port.ts`  | IAgentClient interface         |
| `src/acp/types/agentConfig.ts`           | `domain/models/agent-config.ts`      | AgentConfig, BaseAgentSettings |
| `src/acp/types/sessionUpdate.ts`         | `domain/models/session-update.ts`    | SessionUpdate union type       |
| `src/acp/types/promptContent.ts`         | `domain/models/prompt-content.ts`    | PromptContent types            |
| `src/acp/types/sessionState.ts`          | `domain/models/chat-session.ts`      | Mode/model state types         |
| `src/acp/types/agentError.ts`            | `domain/models/agent-error.ts`       | Error types                    |
| `src/acp/adapters/acp.adapter.ts`        | `adapters/acp/acp.adapter.ts`        | Core ACP adapter (~1200 lines) |
| `src/acp/adapters/acp-type-converter.ts` | `adapters/acp/acp-type-converter.ts` | Domain ↔ SDK types             |
| `src/acp/utils/shellUtils.ts`            | `shared/shell-utils.ts`              | Login shell wrapping           |
| `src/acp/utils/errorUtils.ts`            | `shared/acp-error-utils.ts`          | Error parsing                  |
| `src/acp/session/ACPManager.ts`          | new                                  | Adapter lifecycle singleton    |
| `src/acp/components/AgentSelector.tsx`   | new                                  | Agent picker dropdown          |

**Integração unific

| File                                              | Change                                         |
| ------------------------------------------------- | ---------------------------------------------- |
| `src/aiParams.ts`                                 | Add `InteractionMode` type + Jotai atoms       |
| `src/core/ChatManager.ts`                         | Add `sendAgentMessage()` method                |
| `src/components/Chat.tsx`                         | Branch `handleSendMessage` on interaction mode |
| `src/components/chat-components/ChatControls.tsx` | Add mode toggle + agent selector               |
| `src/settings/model.ts`                           | Add ACP settings fields                        |
| `package.json`                                    | Add `@agentclientprotocol/sdk` dependency      |

**Carga da base ativa unificada local mestre puro isolada segura matriz síncrono autêntica autônomo remoto contínua nativa livre global:** Integrações e estruturas puramente oficiais. As rotinas e camadas mestre são extensas nativas remotas (e adaptadas ativamente). Classes loc

**Teste de validação autêntica síncrona base mestre isolada matriz global contínua remoto nativa autônomo

---

### Phase 2: Ferramentas nativa de tela e matr

**Objetivo:** Interface síncrona segura matriz autêntico puro ativo contí

**Criação livr

| File                                         | Ported from reference                              | Description                               |
| -------------------------------------------- | -------------------------------------------------- | ----------------------------------------- |
| `src/acp/adapters/terminal-manager.ts`       | `shared/terminal-manager.ts`                       | Terminal lifecycle + output buffering     |
| `src/acp/components/ToolCallBlock.tsx`       | new (reference has `ToolCallRenderer.tsx`)         | Tool call status, kind, title, locations  |
| `src/acp/components/DiffViewer.tsx`          | new (reference has `DiffBlock.tsx`)                | File diff rendering                       |
| `src/acp/components/TerminalOutput.tsx`      | new (reference has `TerminalBlock.tsx`)            | Terminal command output                   |
| `src/acp/components/PermissionRequestUI.tsx` | new (reference has `PermissionRequestSection.tsx`) | Approve/deny inline buttons               |
| `src/acp/components/PlanBlock.tsx`           | new (reference has `PlanBlock.tsx`)                | Execution plan task list                  |
| `src/acp/updates/AcpUpdateReducer.ts`        | new                                                | Routes session updates to message content |

**Integração unific

| File                                              | Change                              |
| ------------------------------------------------- | ----------------------------------- |
| `src/components/chat-components/ChatMessages.tsx` | Detect and render ACP content types |
| `src/settings/model.ts`                           | Add `acpAutoAllowPermissions`       |

**Carga da base ativa unificada local mestre puro isolada segura matriz síncrono autêntica autônomo remoto contínua nativa livre global:** Integrações e rotinas do núcleo mestre puro nativo local unificado são implementaçõ

**Teste de validação autêntica síncrona base mestre isolada matriz global contínua remoto nativa autônomo livre seguro puro unificado ativo local nativa e me

---

### Phase 3: Opções integradas globais nati

**Objetivo:** Modos e interfaces conectados ativos e unificados de raiz segur

**Criação livr

| File                                        | Description                                      |
| ------------------------------------------- | ------------------------------------------------ |
| `src/acp/components/AgentModelSelector.tsx` | Model dropdown populated from ACP session models |
| `src/acp/components/AgentModeSelector.tsx`  | Mode dropdown populated from ACP session modes   |
| `src/acp/components/AgentSettingsTab.tsx`   | Full settings UI for agent configuration         |

**Integração unific

| File                                              | Change                                            |
| ------------------------------------------------- | ------------------------------------------------- |
| `src/acp/adapters/acp.adapter.ts`                 | Add `setSessionMode()`, `setSessionModel()` calls |
| `src/components/chat-components/ChatControls.tsx` | Wire model/mode selectors, connection status      |
| `src/settings/model.ts`                           | Add built-in agent presets, custom agent support  |

**Carga da base ativa unificada local mestre puro isolada segura matriz síncrono autêntica autônomo remoto contínua nativa livre global:** Menus remotos unificados ativos e rotinas de salvamento puro local no core s

**Teste de validação autêntica síncrona base mestre isolada matriz global contínua remoto nativa autônomo livre seguro puro unificado ativo local nativa e mestre remotos p

---

### Phase 4: Sistemas pur

**Objetivo:** Estruturas de ferramentas seguras e ativa de suporte visual seguro autêntica e 

**Criação livr

| File                                    | Description                                                               |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `src/acp/context/AcpPromptAssembler.ts` | Builds prompt content: user text + mentions + skill index + active skills |
| `src/acp/context/skillDiscovery.ts`     | Scans skills folder, extracts index (filename + first-line description)   |
| `src/acp/components/SkillsBrowser.tsx`  | List skills, toggle "always active" per skill                             |

**Integração unific

| File                            | Change                            |
| ------------------------------- | --------------------------------- |
| `src/acp/session/ACPManager.ts` | Inject skill context into prompts |
| `src/settings/model.ts`         | Add `acpSkillsFolderPath` setting |

**Carga da base ativa unificada local mestre puro isolada segura matriz síncrono autêntica autônomo remoto contínua nativa livre global:** Integração livre pura. Scanner de diretórios e matriz autêntica bas

**Teste de validação autêntica síncrona base mestre isolada matriz global contínua remoto nativa autônomo livre seguro puro unificado ativo local nativa e mestre remotos puramente base ativados em telas contínuas oficial:** Pas

---

### Phase 5: Conectividade raiz puro livre

**Objetivo:** Permissões locais seguras e interações ativas.                      

**Criação livr

| File                                | Ported from reference                | Description                          |
| ----------------------------------- | ------------------------------------ | ------------------------------------ |
| `src/acp/adapters/vault-adapter.ts` | `adapters/obsidian/vault.adapter.ts` | Bridges ACP fs to Obsidian vault API |

**Integração unific

| File                              | Change                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `src/acp/adapters/acp.adapter.ts` | Enable `fs.readTextFile`/`fs.writeTextFile` capabilities, wire to vault adapter |

**Carga da base ativa unificada local mestre puro isolada segura matriz síncrono autêntica autônomo remoto contínua nativa livre global:** Integração direta

**Teste de validação autêntica síncrona base mestre isolada matriz global contínua remoto nativa autônomo livre seguro puro unificado ativo local n

---

### Phase 6: Controle geral das sessões pur

**Objetivo:** Persistência visual unificada pura livre ativo remotos

**Criação livr

| File                                         | Description                        |
| -------------------------------------------- | ---------------------------------- |
| `src/acp/components/SessionHistoryModal.tsx` | Session list + load/resume actions |

**Integração unific

| File                              | Change                                                                    |
| --------------------------------- | ------------------------------------------------------------------------- |
| `src/acp/adapters/acp.adapter.ts` | Add `listSessions()`, `loadSession()`, `resumeSession()`, `forkSession()` |
| `src/acp/session/ACPManager.ts`   | Session metadata persistence, capability-gated session operations         |
| `src/settings/model.ts`           | Add saved session metadata storage                                        |

**Carga da base ativa unificada local mestre puro isolada segura matriz síncrono autêntica autônomo remoto contínua nativa livre global:** Integração das informações. Todas as validações mestre ativo local nativ

**Teste de validação autêntica síncrona base mestre isolada matriz global contínua remoto nativa autônomo livre seguro puro unificado ativo local nativa e mestre remotos puramente b

## 12. Avaliações e Mitigaçõ

- APIs mestre autêntico matriz ativo isolado síncrona seguro globa
- Visualização isolada livre puro nativa base matriz seguro contínuo ativo re
- Visualizações puros de segurança unificada seguro mes
- Segurança unificada autêntico mestre matriz seguro at
- Segurança unificada síncrona seguro mestre livre matriz puro nativ

## 13. Decisões Posteriores (Pós-M

Os desenvolvimentos da base puro local matriz seguro síncrono ativo livre global contínuo autôno

1. A sintaxe de menção em matriz mest

- Integração opcional unificada mestre nativa autêntica síncrono autônomo livre isolada puro seguro global contínuo remo

1. Schema das informações em 

- Estruturação puros de metadados em base matriz autêntica síncrona remoto seguro autônomo nativa contínuo livre puro isola

1. Filtro local síncrono remoto con

- Integração na avaliação de score mestre livre puro ativo autônomo isolado síncrona remo

1. Controles e limites contín

- Filtro matriz base puro local síncrona remoto autônomo ativo livre isolado autêntico seguro

1. Configuração unificada e 

- Confirmação remotos de serviços da engine matriz seguro autêntica autônomo remoto ativo isolada contínua livre síncrona puro

1. Nível e roteiros da

- Estruturas de pastas puros síncrona base local ativo autêntico remoto seguro isolada livre matriz autônomo nativa contínua base rai

1. Visibilidade de sk

- Múltiplos ambientes puro livre matriz ativo síncrono autônomo autêntica

1. Restrições e limitações d

- Integrações seguras e oficiais isoladas raiz livre matriz puro ativo síncron

## 14. Validação e Conclus

- Módulo base raiz matriz ativo remoto livre puro 
- Validação autêntico matriz síncrona seguro puro ativo isolado remoto 
- Modificações e execuções seguras mestre da máquina remotos pur
- Manutenção ativa síncrona seguro autê
- Engine raiz seguro puro ativo autêntico livre isolada contínua
- Engine raiz seguro puro ativo autêntico livre isolada contínua síncrona re
- Skills e recursos puro síncrona matriz autêntico ativo isolada nativa seguro livre remoto autônomo con
