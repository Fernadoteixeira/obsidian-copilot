# Design da Integração via Obsidian CLI (MVP)

**Data:** 2026-02-11
**Status:** Rascunho — Experimental, Apenas-Desktop
**Escopo:** Ferramentaria via plugin Copilot (via base no `AutonomousAgent` + via atrelamento `Copilot Plus` atinente caminho acionado por execuções interligadas de ferramentas)

## 1. Declaração do Problema

Obsidian começou prover embarque formatando implementações nativas com uso acionado na sua oficial CLI (com acesso-antecipado/early access). Copilot até onde consta exibe e abriga amparo com maturação madura originária operante via ferramenta acoplada ao ecossistema referenciado pelo sistema (tool system), perante as configurações interligadas ele correntemente operou abarcamentos gerando providências através vias por provimento a duplicidades vinculadas à manipulações na base no (vault) geridas atinentes às atuações por API's relativas acopladas via plugins nas formatações procedentes vinculadas às próprias formatações intrínsecas das ferramentas e implementações ligadas atinentes. Necessitamos criar amarras focadas e vinculativas que garantam tráfegos procedentes e contíguos de (low-risk path) providenciando amarra via adoção no emprego em arranjos oriundos perante as atribuições provindas atinentes perante (CLI capabilities) evitando interações acopladas geradoras referentes à formatações em reescritas ao percurso originário com loop provindo vinculado no referencial base operante submetido nas vias contidas no processo atinente perante agente.

## 2. Metas (Goals)

1. Agregar capacidades oriundas vinculadas com bases na CLI do Obsidian atrelando arranjos sob adequações dotadas de mínima interferência modificativa via bases aplicadas na arquitetura preestabelecida oriunda da versão pré-existente.
2. Reaproveitar componentes existentes contíguos sob amarras aplicadas atinentes à base gerida com via no `ToolRegistry` + engatilhamentos amarrados pautados pelo acionamento nativo das formas estruturadas ao uso orientativo LangChain procedendo amarra atrelada à ferramenta base.
3. Resguardar escopo primário e originário submetido à estreia e lançamento limitando bases em amarra restrita aplicável sob o arranjo focado perante adoção restrita para (desktop-only), resguardando premissa sob foco a base amarrada referida como (safe-by-default), contendo restrição orientada aplicável sob avaliações e visualizações associadas atinentes em formas observáveis.
4. Escalonar amarras orientativas fornecendo aptidões ligadas através via estipuladora submetendo composições restritas focadas em escalões ordenados e divididos com versões operantes atinentes explícitas (`v0` -> `v1` -> `v2`) gerindo roteamentos associados condizentes providos na amarra via (routing and validation) para viabilizar garantias ordenadoras perante controle operante (manageable).

## 3. Não-Metas (MVP)

1. Previsão rejeitada negando a incorporação englobante abarcando referências vinculadas contidas em (one-to-one wrapper) integrativo e gerador referente às ordens via acoplamento em base CLI associativa formativa por viés condizente através usos perante a via acoplada na forma em primeiro formato iterativo (first iteration).
2. Ausência garantidora abdicando base e provimentos vinculados por suporte e submissões operantes em dispositivo-celular/suporte-móvel (`mobile`) a adoções provindas com CLI assumem contornos direcionadores com referencial contido ao ambiente referenciado de foco operante atinente a base submissa focada na área atrelada via (desktop-oriented).
3. Providência proibindo abstenções vinculadas perante amarras contidas e referidas às reformulações ou edições acopladas referenciadoras orientativas em refações/reescrituras de viés de comandos ou sistemas contidos de ordens de chamada (prompt/system-prompt rewrites) para escopos que superem e adentrem âmbitos amarrados perante atribuições operativas na formatação referida atinente de regras, guias nas vias contidas nas características originais por metadados amarrados e ligados referentes a vias associativas orientativas de formatações às informações nativas em metadados de orientação operantes originários vinculados a próprias ferramentas originais normais.
4. Ausência excludente pautada a negativa e desvinculação em necessidades originárias com preenchimento amarrado em interações aplicadas através arranjos nas dependências sob viés de interfaces vinculadas no referencial provido atinente orientador restrito via arranjo em modo terminal do viés textual associativo amarrado atinente em interações acopladas na forma interativa (interactive TUI mode) perante preenchimento e provimentos baseados e aplicáveis ao uso atinente referido a vias vinculadas com bases operativas fluídas baseadas aos fluxos atrelados de referências vinculativas submetidas através agentes (agent flows).

## 3a. Diretriz da Plataforma (Platform Policy)

Essas ferramentas configuram atuações providenciadas **apenas e tão somente ao escopo atrelado perante Desktop** procedendo contornos ligados à essência puramente **experimental**.

- Providenciando bases atinentes em amarras ligadas sob dispositivos associativos em referencial contido pautado por arranjo oriundo via plataformas atuantes com características móveis, utilidades na via provida com amarras em (CLI tools) permanecem contidas com estado **não registradas** amarrando atuações perante o escopo via registro no `ToolRegistry` transparecendo perante adoção atinente amarrada com formato integral amparadas pela formatação orientadora aplicativa perante aspecto totalmente (invisible) atrelado no invisível, invisível atinente com referencial restritivo acoplado em formatações via preenchimento ao submisso foco amarrado à adoção em usos originários perante uso voltado ao (user) usuário — não emergindo formatação via preenchimento aparecendo ou evidenciando presença (appear) na interface em adoção de vias orientadoras submetendo componentes atrelados em formatação na UI operante com usos nas restritas instâncias em configurações, ferramentas procedidas com restrição contínua amarrada através (tool settings, tool lists), vias processuais atreladas via base operante perante referencial acoplado pautado associativamente a engatilhamentos em engenharias originárias formativas de referencial atinente a uso atrelado ao próprio amparo em processos contínuos por amarras associadas a usos referenciadores (agent reasoning), além de instâncias oriundas na via e constituições em interações visuais aplicáveis submetidas a qualquer superfície vinculada com tela ou área aplicativa amarrada na (UI surface).
- Validação atrelada e baseada via condicionante com viés operacional restritivo vinculativo através guarda nas instâncias com (gated by) `Platform.isDesktopApp` atuando perante viés contido na funcionalidade operante `initializeBuiltinTools()`. Proteção condicional na base atrelada ao fluxo originário referenciador operacional provida à restrição contínua garantidora amarrada via runtime no referencial (runtime guard) amarrada operante à chamada na base de atuação contida originada e preenchida à base na `ObsidianCliClient.runObsidianCliCommand()` fornece provisão e blindagem aprimorada com vias orientativas atuando (defense-in-depth), não caracterizando-se nem detendo via preenchimento atribuição configuradora vinculada no mecanismo preenchido nas averiguações ou bloqueios originais no referencial base restritivamente focado atuando perante primário acoplamento atinente ao principal mecanismo operante procedimental referenciado nas amarras geradoras orientadas no mecanismo primordial e prioritário (primary gating mechanism).
- Requisito perante atuação via referencial originado via formatação contida pautada ao arranjo aplicável da CLI no Obsidian perante obrigações atinentes com submissões na forma operante à vinculação e necessidade amarrada sob `child_process.execFile`, condicionante presente na atribuição e utilidade restritiva operante garantidora atuante de vinculação em viés referencial de apelo ao disponibilizar preenchimento operante unicamente originado via ambiente de composição submetido amarrado ao formativo do desktop acoplado a formatação via Electron focado através de adoção de preenchimento (Electron renderer).

## 3b. Fundamento Condizente a Tomadas De Decisões Na Base Estruturada Do Formato do Design — Operações Externas Em Base à CLI Em Oposição Amarrada Ao Uso Interno Direcionador Pautado perante Integrações Nas Submissões Voltadas às Requisições Internas Providas via (Internal API)

Procedimentos associados e bases vinculativas via formatação orientada atrelando a submissões vinculadas na base perante escolhas no formato e acoplamentos voltados a operação associada amarrada de chamadas em modo terminal de amarra via CLI shell-out foram escolhidas por:

1. **Expansividade abrangente garantida isenta das imposições geradas mediante bases atinentes aos preços cobrados em provimentos (Breadth without cost)**: Submissão formadora via CLI garante abarcamento originário em disposições vinculadas na amplitude abrangente garantindo superfícies expansivas no uso atinente às configurações focadas amarrando adoções procedimentais contidas na providência voltada nas chamadas à base (command surface). Replicação e refeitura nos recálculos providenciados com recriações relativas atinentes perante bases com submissão a ordens referenciadas individualizadas (`app.vault`, `app.metadataCache`, etc.) iriam promover e impor amarras associativas ligadas em cobranças com alto custo atrelado mediante interações operativas significativas gerando acoplamentos com exigências procedimentais oriundas nos aportes por desenvolvimento interligados em viés perante amarras contíguas associadas referenciadas na manutenção.
2. **Resguardo progressivo a vias futuras no âmbito das atualizações referenciadas ligadas e baseadas na amarra perante preenchimento focando adoção retro e avançada amparando resguardo pautado a referências através via atrelada a contínua formatação (Forward compatibility)**: Preenchimentos aplicáveis atinentes a disposições com acoplamento a adoções de novas interações procedidas por ferramentas via novos comandos CLI promovem disponibilidade integrada focada nos preenchimentos orientados acopláveis com garantias via sistema perante restrições dispensadoras no resguardo que exclui acoplamentos formadores focados orientados às adoções vinculadas originárias nas vias orientadas no encadeamento em alterações procedidas através das modificações no código da base originária da via aplicativa (code changes) — necessitando apenas base de inclusão com providências vinculativas atualizadoras geridas com usos nas amarras e preenchimento focados na lista (allowlist) retendo amparo atrelado à base aprovada.
3. **Segurança (Safety)**: Aplicação e utilidade no viés focado em adoções amarradas de referências pautadas nas execuções através utilitário vinculativo perante (execFile) e em negativo ao acoplamento associado a terminal aberto focado e atinente ao acionador restrito vinculador referenciado por atuações com (shell) acompanhados com disposições amarradas a provisões rígidas contidas orientadoras no resguardo serializatório originário da via na proteção contra ataques submissos a adoções originárias voltadas às instâncias com bases vinculadas às tentativas focadas amparadas na base do injetor com formato pernicioso orientador do (injection). Listas restritivas garantidoras com formatações permissivas orientando e controlando usos (command allowlist) acopladas na base limitadora das interações pautadas de alterações procedidas de modificações ligadas em atuações e mutações referidas restringem os alcances de danos em apelos contidos (blast radius).
4. **Implementações gradativas com abordagens e passos cautelosos vinculativos nas adoções pautadas nos usos graduais (Incremental adoption)**: O sistema versionado via camadas interligadas em apelos de amarras (`v0` → `v1` → `v2`) concede e providencia implantações graduais pautadas de cautelas via interações gradativas procedendo aberturas gradativas iniciadas na utilidade contida perante amarras originárias submissas focadas à utilidade base operante puramente voltada em ordens originadas apenas à ações formadas na formatação (read-only) com disposições restritivas sem caráter atrelado à submissão perante mutação amarrada ao viés vinculativo ao processo formativo.

Bases pautadas em vias integradoras e internas continuam mantidas nas providências através adoção de amarras contíguas via escolhas corretas mantidas perante atuações procedimentais contidas com engatilhamentos contíguos para adoções referenciadas às necessidades amarradas operativas com foco através integrações de mergulhos profundos (ex. preenchimentos ligados a bases no acoplamento ao manuseio interligado formativo no gerenciamento contido ao processamento na formatação orientada nas vias frontmatter providas via uso originado focado em (`app.fileManager.processFrontMatter()`)). O viés provido focando CLI estabelece arranjos formadores focados a natureza restrita contida pautada referenciando base de composição operante sob (complementary) vias complementares, não formatando restrições associativas atuantes com amarras via reposições amparadas a formatações excludentes pautadas por adoção referenciadora e procedimental na (replacement).

## 4. Adequação da Arquitetura Vigente Atual (Current Architecture Fit)

Amarras pertinentes interligadas em instâncias originárias nas integrações atinentes ligadas aos processos relativos aos pontos focados atrelados vinculados nas disposições da forma atinente do formato:

- `src/tools/ToolRegistry.ts` perante acoplamentos atrelados vinculativos no registro das instâncias na ferramenta geradora associada aos formatos e atribuições via (metadata).
- `src/tools/builtinTools.ts` perante disposições pautadas sob amarra associativa amarradas de via na estipulação orientadora via configurações intrínsecas acopladas (built-in tool definitions) juntamente ao disparo oriundo e vinculado através via inicialização formativa de base de adequação (initialization).
- `src/LLMProviders/chainRunner/utils/toolExecution.ts` para execuções associativas no engatilhamento, formatações geradoras condizentes sob via amarradora operante ligada por instâncias de bases em referências de estados atrelados na visão focada em amarras pautadas nas provisões (user-facing tool status behavior).
- `src/settings/model.ts` e `src/constants.ts` associados com predefinições nas amarras via (defaults) referenciadas operantes de via retentora amparadas a base salva operante com estado amarrado retido atinente ao formato submisso retendo formatação associada na base das provisões das (persisted settings).
- `src/settings/v2/components/ToolSettingsSection.tsx` para usos no viés procedimental aplicável a adoção referida amarrada às vias submetidas em alavancas de configurações orientativas pautadas na base aplicável às disposições via (user tool toggles).

Isso atesta e providencia comprovações certificadoras demonstrando entregas integrativas com vias de acoplamento perante amarras contidas à adoções submetidas através suporte ao uso pautado focado e atinente referenciador operante perante a CLI integrando base de ferramenta acoplada ao sistema em viés contido associativamente na (built-in tool) nativa ou pequena amarra com agrupamento restrito de instâncias referenciadas focadas por ferramentas sem amarrar exigências atinentes com formatações e base vinculada por mudanças de preenchimentos operantes focados nas reconstruções providas por arquitetura submetida e amarrada nas disposições focadas à mensagem e configurações operantes no viés atinente referenciador no chat de base em (chat/message architecture).

## 5. Organização de Ferramentas: Agrupamentos e Disposições Por Viés Formativo Atinente e Vinculativo Baseado via (Category-Based Grouping) Em Categorias Estruturadas

Ao invés nas tratativas relacionadas à ferramentas singulares operando individualizações com comando próprio e amarrado focado via apelo submisso focado via CLI (~100 submissões operativas orientadas ligadas com chamadas procedimentais = número vultuoso excedendo a razoabilidade atrelada em adoção pautada com excesso amarrado formador a via `too many tools`) ou provimento englobante procedido via arranjos submissos com base generalizada e via atinente amarradora abarcante englobante operando (umbrella tool) de escopo formatado contendo apelo generalizado atinente no preenchimento de adoções operantes demasiadamente fluidas perante submissões de orientações de base com formato atrelado com vagueza demasiada (`too vague`) perante direcionamento focado ao LLM referenciado em (`LLM routing`), instâncias baseadas perante chamadas são amparadas operando junções em formatações contidas referenciando ferramentas atinentes em categorizações amarradas com bases aplicativas agrupadas procedidas focadas a referências amarradas por escopos e categorias atreladas às vias (category-based tools). Cada provedor em formatação à adoções atinentes sob as ferramentas assume receptividade referida, aceitando submissões orientadas perante parâmetros atinentes ligados na (command parameter) com delineamento amarrado no raio de abrangência (scoped) atinente associativo perante sua categoria procedimental respectiva e vinculada associativamente de origem (category).

### Justificativas Embasadoras Ligadas Ao Formato (Design Rationale)

- **Instâncias evidentes perante sinais limpos em base na orientação ligada a adoção de apelo focada no referencial atinente de semântica vinculada no engatilhamento pautado à adequação do (LLM)**: O provedor humano originário solicita averiguações referentes pautadas com notas formativas provindas diárias (daily notes) → utilidade e instâncias atinentes a uso base operante referindo no uso formatado a via `obsidianDailyNote`. Ausência e isenção amarrada provinda com descarte perante amarra de referencial contido de dubiedade vinculada a via pautada originária da formatação atinente na amarra via apelo (ambiguity) em base a submissões vinculativas referenciando na seleções das bases das adoções de instâncias voltadas procedimentais amarradas às utilidades amarradas com foco a (tool selection).
- **Providencia formatações amarradas e estipuladas com escalas que se adequam fluídas perante disposições providas em vias associadas focando no crescimento amarrado através do bem operado e contido no formato (Scales well)**: Integrações formativas de adoção a inserção originárias por ordens procedidas baseadas operantes na via referenciada atinente com submissões em ordens no amparo ao acoplamento a nova (CLI commands) engatilham acoplamentos com encaixe perfeito em disposições pautadas via ferramentas pré-estabelecidas baseadas originárias atinentes nas categorias sem agregamentos providenciando amarra perante instâncias a engatilhamentos amarrando inserções voltadas em adoção a novos originários registros acoplados e atrelados por bases novas formadas na criação via adoção de bases contidas associativas perante os (tool registrations) que necessitariam nova providência associada à forma em base contígua pautada a formatações em engatilhamentos criativos para adoções na base nova formadora.
- **Gestão contida providenciando viés e base controlável e atrelada de instâncias nas referências associativas amarradas contidas perante as quantias e totais contidos na quantificação orientativa amarrada referenciando o manuseável e adequado (Manageable tool count)**: O cômputo fechando em base próxima aos ~10 formatadores (tools) em vias contraposições atreladas e amarradas orientadas a base comparativa operante através uso pautado com mais de 25 instâncias geridas e fragmentadas operantes amarradas de via a formato procedendo base e adoções aplicáveis com amarras individualizadas (individual tools) ou provedor integrado submisso com bases de formatação englobada vinculada com restrições cegas operando com base associativa geradora e amarrada a passarela oculta e sombreada formadora perante formato de acesso gerador sem transparências através do arranjo vinculador pautado por bases sem limpas adequações originando instâncias na base pautada com uso por via opaca em (opaque gateway).
- **Direcionamento pautado perante permissões ordenadoras atreladas amarradas baseadas na forma orientativa associativa e separativa via categorias e restrições por submissão pautadas na base (Per-category allowlists)**: Totalidade associada originada atrelada e baseada formativa de forma orientativa individual das bases com uso em ferramenta consolida e providencia ratificações comprobatórias pautadas pela via (validates) do atributo submetido a formato focado com parâmetro atrelado perante a requisição via `command` baseada focada na limitação originária e restritiva operante nas restrições da permissão englobada perante o escopo via (scoped allowlist), contendo o raio abrangente com raio referencial limitativo contendo estilhaços afeitos às disposições com contornos de contenções a impactos perante contenções atinentes com restrição limitadora oriunda vinculativa contida nas formatações operantes das bases (blast radius).

### v0 (Status em Vigor — 2 instâncias procedimentais via comandos, 2 bases aplicáveis em ferramentas)

| Ferramenta (Tool)    | Ordens Acopladas (Commands) | Detalhamentos Anotados (Notes)                                                                                                              |
| -------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `obsidianDailyRead`  | `daily:read`                | Base de execução formatada e purificada fidedignamente vinculada a restritiva via apenas (Read-only). Uso isolado focado no v0 base simples |
| `obsidianRandomRead` | `random:read`               | Exclusivamente submissão restritiva a ordens em (Read-only). Atuação focada em base simplificada pautada no formato atinente referente a v0 |

### v1 (Status Atualizado — 13 chamadas de comandos procedimentais distribuídas pelas bases atreladas vinculadas a 7 formatadores via ferramentas)

Todo e qualificados agrupadores contidos na base do arcabouço referencial do acoplado e interligado conjunto das instâncias referenciadas de v1 obedecem ordens atinentes com vínculos estritos operantes e restritos e operados por atuações puramente focadas **sem edição e pautadas exclusivamente em base no read-only ou atuantes via base pautada com execuções amarradas de referências submissas diretamente via execução estritamente procedida a formato aplicável (direct-execution)** (sem exigências originárias contidas atinentes perante bases de submissão vinculadas orientativas à confirmação provida em interação contida em restrições visuais atreladas oriundas à base aplicativa UI referida).

| Ferramenta (Tool)      | Comandos Acoplados (Commands)                               | Observações Focadas Referidas às Bases Atreladas (Notes)                                                                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **obsidianDailyNote**  | `daily:read`, `daily:append`, `daily:prepend`, `daily:path` | Procedimentos originários atuantes perante base em referências amarradas nas adoções (Append/prepend) operam sob base submetida ao viés amarrado perante execução fluida estrita e direcionada. Suplanta a submissão via v0 e sua raiz `obsidianDailyRead` |
| **obsidianProperties** | `properties`, `property:read`                               | Provimentos purificados, isentos pautados e estritos baseados na adoção em via originada puramente sem ação geradora mutável operante via apenas formato de via referida base em (Read-only). Ordens relativas (write commands) com bases diferidas à v2   |
| **obsidianTasks**      | `tasks`                                                     | Uso restrito pautado operante vinculativamente atrelado com base referida perante uso atinente à instâncias amarradas de via orientada em exibições de registros referidos às ordens listadas de ações amparadas com submissões proteladas a base v2       |
| **obsidianRandomRead** | `random:read`                                               | Atuação engessada amarrada referenciando base de exclusividade e ordem atinente focada na operação ligada via submissão atrelada a ordem formativa gerada apenas em (Read-only). Continua com base originada amarrada a disposições referidas desde a v0   |
| **obsidianLinks**      | `backlinks`, `links`, `orphans`, `unresolved`               | Plena totalidade restritiva amarrada operante de viés pautado e atrelado perante provimentos focados sob uso via adoção estritamente originária vinculativa formativa (read-only)                                                                          |
| **obsidianTemplates**  | `templates`, `template:read`                                | Formatação de uso amarrado e focado base em engessamentos restritivos via uso procedimental amarrado à premissas e submissão amparando ordenamentos operantes via bases no viés em (`template:insert` deferred) protelações originadas relativas à raiz v2 |
| **obsidianBases**      | `bases`, `base:views`, `base:query`, `base:create`          | Tratativas interligadas geridas e formadas via amarras em instâncias voltadas em (`base:create`) procedem bases referidas em submissão operada diretamente atreladas com execuções originárias fluídas submetidas contíguas com o formato condizente pleno |

### v2 (Viés Focado em Atribuições Procedimentais Futuras — ~9 engatilhamentos contidos via comandos atrelados referidos a 3 amarras em intervenções por base voltada via adoção em referencial mutacional contido com a base perante instâncias pré-formadas atuantes integradoras amarradas oriundas atreladas ao v1 e + 2 instâncias ligadas ferramentas inéditas e vinculativas procedimentais)

A base v2 introduz disposições formativas referenciadoras associativas pautadas perante engatilhamentos operantes amarrados em submissões perante confirmações obrigatórias operativas em mutações (**confirmation-required mutations**) nas instâncias amarradas originárias base perante prévias e contidas utilidades baseadas oriundas de ferramentas da camada atinente à raiz atrelada ao v1 baseada gerando e adicionando instâncias em base aplicativas novas formativas via matriz (new tool categories).

| Instância Orientada Atrelada Com Função (Tool)          | Parâmetros (Commands)             | Ponderações Relativas E Submissas Referentes Notas (Notes)                                                                                                                  |
| ------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **obsidianProperties** _(Acoplamentos estendendo a v1)_ | `property:set`, `property:remove` | Amarra atrelada à validação de uso originada via interações oriundas à confirmações (Light confirmation) geradas na área de chat em submissão orientativa anterior          |
| **obsidianTasks** _(Formato engatilhando extensão v1)_  | `task` (toggle/done/todo/status)  | Exigências contidas amarradas com uso de via operante condicionando adoção referenciadora e amarra atinente originária ligada em validações leves em instâncias (chat) base |
| **obsidianBookmarks**                                   | `bookmarks`, `bookmark`           | `bookmark` (adicionando amarra perante validação restritiva limitadora provida originada operada através e em viés referido a amarra submetida base no mutation setting)    |

### Excluídos Perante A Base Originária do Sistema Focado Amparando As Diretrizes de Formato no Âmbito Orientado Aplicativo Nas Ferramentas Atuantes Vinculativas (Excluded from Tool System)

Os seguintes acoplamentos operantes vinculados procedimentais providos com formatos em comandos vinculados através CLI encontram-se barrados gerando amarras focadas atreladas perante exclusão estrita negando abarcamento vinculativo perante disposições submissas com exibições negadas não providas referenciando instâncias e usos formatados gerados originários em formato invisível, sendo não expostos (**not exposed**) ao provimento focado base de base autônoma com uso pautado da (AI agent):

| Categoria Aplicável Atinente            | Ordens de Engatilhamentos Referidos (Commands)                  | Premissas Base Embasadoras da Submissão (Rationale)                                                                                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ações Destrutivas perante arquivo       | `delete`, `move`, `rename`, `create --overwrite`                | Adoção pautada demasiadamente providenciando amarra com contornos originados por perigo oriundo submisso operante referenciado na atuação da utilidade atinente focada baseada amarrada de referências autônoma no uso |
| Gestão Atinente De Temas / Plugins      | `plugin:*`, `theme:*`, `snippet:*`                              | Desvinculada orientada perante arranjo contido da base associativa formativa de IA (Not an AI task) oriunda perigosa amarrada em insegurança atinente (security risk) originada                                        |
| História / Sincronizações               | `sync:*`, `history:restore`, `diff`                             | Interações providenciando engatilhamentos amarrados a referências sob viés gerenciado focado amarrado de operações pelo administrador da plataforma gerando risco a perdas procedimentais                              |
| Controle Contido Em UI/workspace        | `tabs`, `tab:open`, `workspace`, `open`, `daily` (open variant) | Limite originário vinculativo focado e submetido às bases visuais e pautadas orientadoras restritas UI-only, contendo negações referidas com carência e isenções atinentes oriundas a base ausente (no data value)     |
| Submissões via Comandos atrelados via SO| `reload`, `restart`, `version`, `vault`, `vaults`               | Uso estrito carente amarrado negando serventia com finalidades orientadas ao viés das bases atinentes de fluxos originários procedimentais orientadores de bases aplicáveis via agentes de trabalho                    |
| Ferramentaria Atinente Focada Atuante   | `eval`, `dev:*`, `devtools`                                     | Execuções referenciadoras de bases providas focando a perigo e riscos atinentes oriundos nas submissões geradas e providas em arbitrária aplicação vinculativa focada nas bases formativas submetidas orientadoras     |
| Informações em base ao Nicho referidas  | `aliases`, `wordcount`, `recents`, `hotkeys`, `commands`        | Baixa base em sinergias vinculativas com uso (Low AI synergy)                                                                                                                                                          |
| Base focado com pesquisas (Search)      | `search`, `search:context`, `search:open`                       | Redundância atinente focando disposições providas operantes referenciadas pautadas a amarras através da palavra-chave acoplada contígua operante ao sistema provido base via arranjo atinente (`localSearch`)          |
| Leitura oriunda na via por base         | `read`                                                          | Preenchimento operante com viés através da superposição (Redundant) atinente focando arranjo via utilidade (readNote) formatada (ver Tool Disambiguation)                                                              |
| Base de apontamento focada por Etiquetas| `tags`                                                          | Redundâncias pautadas nas aplicações providas e referenciadas em amarra operante à utilidade interna (`getTagList`) (ver Tool Disambiguation atinente referida submissão amparada procedimental na forma aplicada)     |
| Escritas aleatórias oriundas a comandos | `append`, `prepend`, `create`                                   | Modificações geradas com usos associativos procedimentais desdobrados superando escopos formativos pautados através instâncias ligadas via composer (Composer tool `writeToFile`/`replaceInFile`)                      |

### Política e Normatizações Atinentes às Obrigações de Escrita e Operação Atrelada com Instâncias De Mutação (Write Operations Policy)

| Ação Referenciada (Operation)                                                | Modo Atinente de Atuação Associado Via Formato Baseado (Execution model)                   | Versão / Escalão (Tier) | Princípio Orientativo Operante Submisso Pautado Perante a Justificativa Original Orientadora da Execução Base (Rationale)                                                    |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Anotações formativas aplicáveis a ordens diárias via (append/prepend)**    | Engatilhamento direto submisso originado provendo mostras visuais da ação base do chat     | v1                      | Pedido claro atinente com orientações baseadas fidedignas (User explicitly asked) relativas amarradas em base a risco contido mínimo (low-risk) referenciador                |
| **Criações referenciadas providas via arranjo base atuante (Base create)**   | Submissões orientativas diretas amarradas operantes atestando bases devolvidas (chat)      | v1                      | Acionamento atinente através da inserção originária providenciando amarra via aditivos em referências perante usos contidos com limitações (filters, additive and low-risk)  |
| **Alterações vinculativas arbitrárias via base procedimental formatada**     | Ausência contida atestada via exclusão oriunda — orientando amarra focando ao (Composer)   | —                       | Modificações procedimentais além das utilidades vinculadas aos registros base (daily notes) cobram adoção atrelada com usos focados à visualizações previas para resguardos  |
| **Preenchimentos nas referências procedimentais na propriedade (set/remove)**| Previsões gerando base em atestações por conferências leves operantes em tela de (chat)    | v2                      | Trocas contidas no âmago vinculativo perante a via dos (Metadata changes) assumem contornos regressivos mas atestam submissões orientadoras pautadas nas via intenção        |
| **Registros atinentes atrelados a tarefas amparados com usos (toggle/status)**| Submissão atestando interações prévias formatadas em tela operante com viés no (chat)      | v2                      | Ações gerando reveses em configurações (Status changes) contam amparadas na base revertíveis devendo submissões atreladas via confirmação atestada via uso do intento pautado|

### Desambiguação de Ferramentas

Os utilitários e usos com formatações de ferramentas na base CLI amparam com premissas em composições e contornos puramente voltados e atrelados como contornos amparando de via complementar (**complementary**) perante usos em instâncias originárias já em bases pré-estabelecidas baseadas originariamente na amarra via bases operativas na ferramenta, jamais atuando ou sobrepondo atuações vinculadas providenciando com substituições nas amarras. Numerosas avaliações geradoras baseadas em providências formadoras de avaliações em instâncias através da CLI atestaram recusas propositais via rejeições intencionais contidas por formatações superiores originais referenciadas pelas execuções do (Copilot) originando base interna das instâncias:

| Engatilhamento formativo via Base referenciada ao comando operante (CLI Command) | Viés Originário Interno Amarrado Em Operação Com Pré-Existência Submissa Em Base (Existing Internal Tool) | Disposições Motivadoras Apontadas Consolidando Referencial Favorável Perante a Adoção Do Utilitário De Base Interna Formatada (Why Internal Wins)                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `read`                                                                           | `readNote`                                                                                                | Instâncias amarradas em preenchimentos (In-process (`app.vault.cachedRead`)), separações operativas providas com amarras de cortes estruturais pautados limitadores em adoções através `200-line chunking`, caminhos formativos associativos contíguos oriundos (multi-strategy path resolution). Utilitário da CLI `read` procede chamadas a atuações em processos avulsos.                              |
| `tags`                                                                           | `getTagList`                                                                                              | Adoção operante atrelada em via processual contígua através instâncias vinculadas (`app.metadataCache`), arranjos em formatações estruturadas via json vinculativos atinentes com totais limitadores de (occurrence counts), limitadores baseados no peso das adoções (`500KB cap`). A utilidade vinculativa base na CLI `tags` restringe via provimento referenciando textos destituídos da purificação. |
| `search`, `search:context`                                                       | `localSearch`                                                                                             | Composições adotadas via apelo em formatações híbridas atreladas e providas mesclando usos operantes e submissos amarrados da palavra-chave com viés atrelado em formatação atinente base (BM25, query expansion), expansões restritas aplicativas e atinentes ligadas aos filtros de tag (tag-aware retrieval). O arranjo na amarra associativa oriunda do CLI é precário e carente de precisão plena. |
| `append`, `prepend`, `create`                                                    | `writeToFile` / `replaceInFile`                                                                           | Visualizações prévias garantidas resguardando amarras de conformidades originadas vinculadas e operantes provendo (Composer diff/preview UX for safety), adequação e formatações nas padronizações procedimentais associadas a normatização via fins de (line-ending normalization), blocos nas pesquisas vinculativas nas reposições focadas (`SEARCH/REPLACE blocks`), arranjo para via (`auto-accept`) |

**Orientação na Base das Instruções Condicionantes Vinculadas aos Acionamentos via (prompt) atinentes Submetidos Em Utilidades Atreladas na CLI:**

- Totalidade das instâncias procedimentais baseadas no apelo a instrucional e vinculativa restrição submissa associada com ordens focadas por (`customPromptInstructions`) vinculadas às ferramentas da CLI devem atestar contornos precisos contendo instâncias referenciadas com viés focado em adoções orientadas perante desambiguação direcionada na amarra provinda com o (`LLM`) para o exato provimento na escolha atinente operante no foco (correct tool).
- Amostra via Exemplo: "Implemente uso amarrado e atinente operante no arranjo `readNote` provendo escopo na leitura referenciada focada e pontual a notas através usos com amarra restrita focando por (path). Condicione a adoção aplicável atinente orientadora via `obsidianDailyNote` procedendo tratativas relativas ao cotidiano contido amarrado nas bases de nota de (diários) vinculativas. Adote restrições orientadoras pelo apelo submisso focado via ferramenta referida perante arranjo associativo formativo amparando a instância vinculativa orientada a (random note)."
- Na eventualidade das amarras originárias promoverem superposição através preenchimento operante com as vias originárias providenciando usos aplicáveis contidos em base de formato com (internal tool) emparelhada e amparada vinculada pela base aplicável perante a requisição procedimental originária da instância amarrada ao viés na via com (CLI tool), o utilitário pautado interno consolida formatação prevalecendo em (preferred) perante exclusões referenciadas vinculadas através das disposições base originais no formato providenciando base isolada e excludente exclusiva (unique capability).

## 6. O Desenho Relativo Amarrado Ao Viés Na Base Do Projeto Em Implementação Formativo (Implementation Design)

### 6.1 Acoplamento Formatado no Viés Estrutural Das Instâncias Referidas Ao Serviço Em (Service Layer): `ObsidianCliClient`

Posicionamento do arquivo referenciado perante base associada com origem contígua atrelada (`src/services/obsidianCli/ObsidianCliClient.ts`). Incumbência operante base originária responsável amarrada:

1. Constatações operantes originárias na varredura associativa focada na disponibilidade em amarra via apelo com verificação restritiva e contígua por disposições na CLI (CLI availability/version checks).
2. Viabilidade operante atrelada em adoções providas atinentes procedimentais aplicáveis com base de submissão referenciada através instâncias ligadas nas execuções procedimentais contidas na utilidade de execuções perante ordens submetidas por arranjo formador operante em viés resguardado via (safe command execution) amparadas em apelo via `execFile` (negando interações associadas com restrição provida ao shell).
3. Processamento atinente oriundo amarrado na transformação restrita operante do apelo a adequação referida na parametrização amarrada com a utilidade e aplicação ao foco na (`parameter=value`) pautada e submetida pela instância e apelo na utilidade via interações lógicas originadas e formatadas amarradas com arranjo (boolean flags).
4. Delimitações amarradas de referências submissas pautadas em amparo através dos parâmetros amarrados orientativos restritivos das margens de atuações (Timeout + output-size limits).
5. Interligação formativa pautada e condicionada na amarra referenciada por estrutura vinculada em base atrelada ao mapeamento focado no apontador procedimental restritivo oriundo de falhas base na via associativa nas amarras nas (Structured error mapping for tool responses).
6. Solucionador pautado através provisões de apelo focado à formatação baseada e amarrada a restrição associada a recuperações base originárias amparando resoluções (Fallback binary resolution) nas instâncias associativas providenciando (obsidian → known macOS app paths).

Limitadores e chaves atreladas em viés amarrador (Key guardrails):

- Isenção contida amarrada negando interpolações originárias a usos voltados em restrições com a base ligada e associada com `shell interpolation`.
- Disposições atreladas limitando bases focadas a submissão via (Per-tool command allowlist).
- Proteções e travas focadas providenciando arranjo vinculador pautado com (Desktop-only runtime guard).

### 6.2 Composição Contida Atrelada Atinente Da Disposição Estruturada Vinculativa Da Base Formadora Referenciada Ligada (Tool Layer)

A totalidade procedimental originária via amarra em bases contíguas nas categorias formadoras em ferramenta reflete submissões atreladas ao formato (StructuredTool) oriundo do escopo procedimental originário via bases orientativas focadas ao `LangChain` gerando bases com o auxílio referenciado no modelo (zod schema). Configurações em registros amarrados são efetuadas baseadas perante formatações contidas referenciando instâncias (`src/tools/builtinTools.ts`) submetidas pela diretriz pautada em (`registerCliTools()`), com travas associativas focadas e orientadas amarradas mediante a validação submissa a premissa de bloqueios oriundos e associados perante acoplamentos via viés focado em `Platform.isDesktopApp`.

### 6.3 Configurações Submetidas Em Arranjos Estruturados E Interativos Com Operações Referenciadas Base Na Forma (Settings)

Delimitações esquematizadas atreladas em preenchimentos (Planned settings fields):

1. `obsidianCliAllowMutations: boolean` (pré-definido atinente com formato base `false`) — amarra de trancas originárias submetidas no preenchimento orientador amparado (gates write commands).
2. `obsidianCliTimeoutMs: number` (predefinição associada padrão `15000`) — preenchimento operante vinculado atrelando base na limitação amarrada de via formadora com a submissão no compasso temporal limitante nas vias com (per-command timeout).
3. `obsidianCliPath: string` (definição originária operante contida no arranjo `"obsidian"`) — base aplicativa providenciando formatações no arranjo a disposições de restrições vinculadas a personalizações e formatações associativas a atuações em usos base formativa atinente a referências orientadas no (`custom binary path override`).

## 7. Premissas Normativas Acopladas A Base Executiva De Provimento Focado E Atinente Em Instrucional Base Associativa Com Adoção Referenciadora Aos Contornos Vinculativos Da Origem Nas Diretrizes Referidas Nas Amarras Submetidas Amparando Na Forma E (Execution + UX Rules)

1. Negando-se amarras providas originárias atreladas à ausência focada de utilidades e instâncias formatadas procedendo com limitações atreladas à falta contida e amarrada na presença referida da `CLI`, retorne indicativo acionável de desfalque na premissa com formatação originária na base e erro base explícito (`actionable tool error`).
2. Comprovando atuações vinculativas amarradas ao acoplamento associativo originário perante providência através adoções em viés de instâncias amparando referências com uso através arranjo na premissa referida submissa voltada no acoplamento ao celular (`mobile`), promova a entrega do código vinculativo associado e focado por desfalque de plataforma atinente à restrição ligada em (`unsupported-platform error`).
3. Dê publicidade, visibilidade amarrada nas interações, disposições relativas e acopladas perante exibições orientadas ao sumário originário vinculativo associado procedendo e amarrando atuações perante o referencial contíguo com preenchimento amparando fluxos e as insígnias prévias formatadas de ferramentas através o uso referenciado em (`tool banners/reasoning stream`).
4. Reprima base associativa garantindo providências com atitudes gerando preenchimento atrelado com atuações procedimentais contidas na amarra baseada a modificações atinentes focadas referenciando aos arranjos em (`file-modifying behavior`) atrelados com premissas baseadas perante a extrema precaução e conservadorismo atrelado à base (`conservative`) esperando bases vinculadas a orientações com disposições de inserção e implementações focadas referindo amarras nas vias explícitas e atinentes ao referencial acionado referenciando a (explicit mutation rollout).

## 8. Cronograma Orientador Condizente Com A Avaliação Estrutural e As Atestações Contíguas Da Provisão Vinculativa À Garantia Formativa Perante Provisões Em Modos Atestatórios Formativos (Testing Plan)

Testagens unitárias focadas à base submissa em partes singulares (Unit tests):

1. Procedimentos e utilidades amarrados na transformações ligadas atinentes em serialização associadas com argumento (`parameter=value`, usos através apelo com amarra nas formulações perante o (booleans), preenchimentos originários procedimentais contidos orientativos a adequações via escape em linhas plurais/multiline (multiline escaping handling)).
2. Implementações garantidoras amarradas com uso de provimento orientativo com as interações base pautadas em vias permitidas oriundas na estipulação pautada à lista com permissão (`Allowlist enforcement`) amarrada com atuações providenciando amarra às barreiras e restrições focadas referindo contenção ligada a instâncias amarradas em mutações relativas a (mutation gating).
3. Atuações procedimentais focadas perante arranjos contíguos de disposições relativas pautadas na formatação ligada em via submissa à amarra associada e orientada no comportamento limitador referindo base ligada nas vias temporais por (Timeout) e na adoção submissa pautada atinente à (error mapping behavior).
4. Limitadores orientativos operantes atrelados no uso através viés procedimental pautando barreiras no arranjo atinente ao acoplamento a usos formativos referidos amparando (`Desktop/mobile guards`).

Avaliações e atestações contíguas em ensaios nas integrações procedimentais base aplicáveis e providenciadas referenciando o escopo ao teste integrado na base simulada formativa por acoplamento via apelo na restrição com (mocked process):

1. Conclusão da base aplicativa referida na execução com utilidades provindas atinentes perante o êxito no formato associativo ao engatilhamento originário via a utilidade referenciada formatada à amarra orientativa (Successful command execution output).
2. Aspectos relacionados a finalizações procedimentais associativas atinentes perante usos via apelos à formatação amarrada em (Non-zero exit behavior).
3. Comportamentos interativos com referências atinentes a tratativas com volumes robustos amarrados no tamanho com vias orientativas e restritivas focando à mutilações (truncation) contínuas associadas amparando a grandes proporções na (Large output truncation/handling).

Conferências base originadas através amarras procedimentais em apuração de validação com utilidade atinente ao emprego manual submisso orientativo a referências (Manual validation):

1. Iniciar submissão com bases provindas amarradas à utilização amparando ordens acopladas a base restrita por adoção via (`read-only commands`) procedendo com atuações engatilhadas de formato vinculado à base na interação atinente focada com amarra oriunda do modo de agente providenciando validações referenciadoras de adequações na qualidade com vias amarradas no preenchimento e devolutivas a qualidades via usos oriundos aos contornos (response quality).
2. Corroborar pautando bases submissas de alavancas amarradas perante configurações operantes influenciando a via associativa interligando-se à forma orientada pela disponibilidade na submissão de provimento base originário com via submetida referenciada a ferramenta (`tool availability correctly`).

## 9. Plano e Escalonamento Base Focado À Liberação Associativa E Engatilhamento Vinculativo Baseado A Instalação Procedimental Contígua Atinente (Rollout Plan)

### Fase 0: Estruturação Inicial Integrativa Com Acoplamentos Pertencentes E Fundamentados Oriundos Em Esboço e Design (done)

- Relatório com fundamentação atrelada em usos (Design doc), provedor procedimental com (`ObsidianCliClient`), providências com instâncias ligadas e aplicáveis perante ferramentas via (`obsidianDailyRead`/`obsidianRandomRead`).
- Contenções protetoras aplicadas restritas com a via de submissões amarradas através Desktop-apenas por intermédio das adequações de vias providas via `Platform.isDesktopApp` localizadas atinentes com amarras ligadas via a função (`registerCliTools()`).
- Ensaios garantidores voltados com bases perante os ajustes em (arg serialization), tratativas associativas pautadas na base aplicativa submissa em resoluções com recuperação binária através (fallback binary resolution), base provida com vias de amarras através envolventes formativos contínuos e atrelados por base a (tool wrappers).

### Fase 1: Divulgação Originária Perante Status Atual Lançado Do Referencial v0 (current)

- Estabelecer remessas associativas vinculadas perante a formatação à adoção e o engatilhamento oriundo a referências amarradas nas formas de (`daily:read` and `random:read`) assumindo o porte providenciador de provimento isolado amarrando atuações perante base de usos contidos puramente com restrição orientativa referenciando a atuação limitadora com a base (read-only tools).
- Consolidar confiança, garantia ligada amarrada de bases focadas à confiabilidade associada e experiência relativa e originária associada à usabilidade em viés aplicável à base com (CLI reliability and UX) estendida com formatações e base orientativa a interligar todas vias de desktop referenciadas através bases na plataforma.

### Fase 2: Escalonamento Formativo Originário E Operante À Vias Vinculativas Perante Adotamento No Preenchimento Englobante Em Relativa Submissão a Expansão Base Na Instância Atrelada v1 (v1 expansion)

- Reconstruir arranjo preexistente baseado referenciando instâncias nas ferramentas provindas oriundas perante bases de v0 `obsidianDailyRead` voltada amarrada com a utilidade e adequação formativa de categorizações relativas à raiz orientada referida e amparando base do formato com uso amarrado atinente em base `obsidianDailyNote` (read, append, prepend, path).
- Resguardar com foco de integridade e retenção perante `obsidianRandomRead` mantendo bases submissas de referencial pautado associando engatilhamento e amparo com base originária referenciadora via utilidades com acoplamentos (standalone tool (single command)).
- Agregar ferramentas com apelo e viés pautado amparando instâncias vinculadas referidas e operantes via `obsidianProperties` (read-only), `obsidianTasks` (read-only), `obsidianLinks`.
- Todo conjunto procedimental originário via bases amarradas nas ferramentas no formato pertencente na instancia referenciadora de v1 abarca bases aplicáveis ligadas restritamente amarradas no uso contido de restrição a formatação (`read-only`) ou através usos engatilhados executivos originários nas premissas ligadas a (direct-execution) — dispensando confirmações oriundas com provimentos visuais amarrados à amarra na interface UI de apelo (confirmation UX needed).
- Inserir limitações procedimentais contíguas providenciando amarra em restrições pautadas pela categoria da instância através do emprego associado e amarrado aos usos originados pautados pelo referencial a permissividade contida na `allowlists` operando bases e diretivas com viés a resoluções na base da amarra focada e submetida pela desambiguação atinente provida via apelo focado.

### Fase 3: Escalonamento Formativo Originário E Operante À Vias Vinculativas Perante Adotamento No Preenchimento Englobante Em Relativa Submissão a Expansão Base Na Instância Atrelada v2 (v2 expansion)

- Incorporar obrigações contidas na exigência perante o acoplamento pautando arranjos atrelados de referências relativas à validações aplicadas através viés de confirmações referenciadoras de instâncias mutacionais amarradas oriundas atreladas a bases preexistentes em via pertencentes amarradas contíguas à v1 via formatação e providência formativa acoplada e orientada por: `property:set`, `property:remove`, `task` toggle/status.
- Operar a efetivação originária na base e emprego atinente com a constituição aplicável pautando adoções baseadas nas limitações restritivas submetidas à mutações em base através engatilhamento na utilidade com amarra em restrição operada no uso pautado e focado por trancas em via de (`mutation gating`) oriunda pela formatação baseada e amarrada na adequação perante configuração base focada via `obsidianCliAllowMutations` englobada contígua nas validações via base aplicativa amarrada referenciando tela orientativa a leves constatações originadas providenciando (light confirmation UX).
- Adicionar bases vinculativas originando categorias amarradas de referências submissas formativas pautadas perante acoplamento voltado em novas categorizações atreladas de bases (new tool categories): `obsidianTemplates`, `obsidianBases`, `obsidianBookmarks`.

## 10. Perigos Suscetíveis De Intervenções Perante Amparo Preventivo Procedimental Pautado Via Contenções Amarradas Orientativas Na Gestão Interativa Das Resoluções Corretivas Formadoras (Risks and Mitigations)

1. Discrepância na base procedimental do viés das operações com a base atinente orientativa aos engatilhamentos contidos nas transições de versões procedidas em viés focado em bases associativas a derivas operantes com amarra (CLI behavior/version drift).
   Apaziguamento e solução (Mitigation): constatações com usos de versões + bases submissas operantes originárias com formatação ligada em via da submissão aplicável com a base amarrada referenciando atuações de instâncias por base da amarra de recuperação aplicativa focando em saídas elegantes referenciando em amarras com usos por bases atreladas perante formatações de saídas alternativas graciosas com base em amarra referenciada por uso via formato contido em escapes procedimentais associados com via (graceful fallback).
2. Brechas gerando instabilidades contidas e operantes procedidas e associadas à exposições operadas por bases atinentes em amarras via apelos na injeção vinculada atrelada de referências pautadas na formatação ligada referenciando comandos em (command injection).
   Apaziguamento e solução (Mitigation): restrição no viés de execuções com a formatação por amarra amparando referências pautadas `execFile`, submissão focada e condicionada no enquadramento operado amarrado à adoção em usos através listas providenciando aprovação operante e referenciada `allowlist`, adequação restritiva com amarra no arranjo em limitadores operantes pautados à submissão oriunda via instâncias limitadoras submetidas via componentes de serialização rígida.
3. Desorientações com bases originárias atinentes a perigos vinculativos contidos de confusão operante com formatações atreladas às percepções visuais amarradas em interações pelo referencial com instâncias atinentes com base via interface contida em arranjos (UX confusion) oriunda nos preenchimentos entre a base de usos oriundos baseados no arranjo preexistente operante via as ferramentas em amarras das aplicações operando bases referidas atreladas e suportadas com a utilidade na base atinente pela via amarrada a CLI na submissão de ações e utilidades interativas oriundas no acoplamento às atuações formatadas.
   Apaziguamento e solução (Mitigation): denominação apurada e esclarecedora atrelada em via com base de preenchimentos nominais procedimentais pautados na transparência orientativa atinente a ferramentas vinculando a adoções procedimentais contidas com engatilhamentos contíguos de aumento gradual aplicável ao escopo de atribuições providas em formatação originária na amarra do viés incremental oriunda com o base no raio referencial contido de comandos em (incremental command scope).

## 11. Demandas Atinentes Amarradas Sob Interrogatórios Compendentes Providenciando Base E Vias Aplicativas Dependentes Baseadas A Preenchimentos Carentes Focando Em Questionamentos Ainda Sem Vias Completas Originárias (Open Questions)

### Sanados e Apaziguados Com Conformidade (Resolved)

1. ~~Deverá e poderá submeter base em interligação com a premissa `obsidianCli` englobada e incorporada contida vinculativa nas pré-configurações atinentes com amarras normais vinculadas atreladas perante formatos e instâncias com padrões originais procedimentais orientados de ferramentas atinentes em amarra aos usuários globais, ou a formatação atuará suprimida com viés de esconderijo referenciado por adoção operante condicionando acoplamentos amarrados pautados pelo escudo em amarra com submissão a instâncias de engatilhamentos focados amarrados e submetidos em instâncias sob viés ocultador referenciado originário ao recurso em restrição contida amarrada a feature flag prioritariamente atestando usos originários no formato vinculativo e anterior?~~
   **Solucionado (Resolved)**: Utilitários amarrados em formato da CLI assumem a formatação e premissa via registro operante de referencial no arranjo contido da raiz `ToolRegistry` operando interações iguais às outras premissas aplicáveis atinentes nas ferramentas vinculadas do arranjo gerador referenciador originário associativo, contendo amarras e bloqueios com viés focado pautado perante adoção atrelada na amarra ligada à utilidade via `Platform.isDesktopApp`. Eximidos referencial contido pautando em restrições separadoras atinentes relativas em amarras providenciando usos de engatilhamentos isolados formativos procedimentais associados com vias operadas (No separate feature flag) — interagem provendo visibilidades oriundas atinentes a bases vinculativas aplicadas na seção amarrada por preenchimento formativo de configurações atinentes perante instâncias a ferramentas procedimentais no núcleo amarrado a versão no desktop, preservando via de ocultação operada a invisibilidade amarrada nas interações sob a versão atinente com a base provinda com usos perante o modelo para base focado em formato atrelado e vinculado via submissão pelo celular (invisible on mobile).

2. ~~Omitiremos engatilhamentos associados procedendo ou atestaremos formatações procedimentais amarradas através categorizações amparadas por adoção contígua dedicada perante o escopo via usos em instâncias de provimentos amparadas operando através da utilidade focada e submetida pela via amarrada à utilidade via base na CLI?~~
   **Solucionado (Resolved)**: Previsão descartando base vinculada providenciando isolamento na formatação orientada atrelada à submissão perante instâncias com formatação em categorização dedicada (No dedicated category). Utilitários operantes perante bases associativas com CLI promovem amarras e usos engatilhados assumindo arranjo vinculador formativo atinente via viés da categoria `"file"` coabitando contornos e bases com utilidades formativas pré-existentes perante os arranjos contíguos de ferramentas já alocadas na providência voltada por escopo aplicável amarrada no arquivo originário. A diferenciação entre ambas garante formatações operativas por acoplamentos vinculados com premissas em identificativos operantes amarrados no engatilhamento pautado via seu prefixo `id` originário operante (`obsidian*`) conjuntamente amarrada em preenchimentos operantes amparados referenciadores aos complementos nominais em submissão orientativa da via atrelada nas terminações formadoras na via do escopo através disposições no atributo atrelado via `displayName` e o formato no uso atrelado atinente `(CLI)`.

3. ~~Pautaremos orientações providenciando bases atinentes em apelos submetendo preferência aplicativa contínua via ferramentas atinentes em base ao escopo interno originário em sobreposições restritivas frente às atuações e instâncias submissas operantes na formatação da CLI focado às submissões voltadas perante instâncias específicas atreladas de operações procedimentais amarradas na consistência vinculada provinda em base à performance e usabilidade originada no formato interligado amarrado em provisões com viés de estabilizações e referências oriundas perante uso amarrado atinente?~~
   **Solucionado (Resolved)**: Com certeza. Utilitários amarrados em formatação procedimental contígua associada via premissa com origem na instância ligada a amarra interna detém viés focado em prevalência originária preferida vinculativa contígua (preferred) se a existência amarrada de formato originário amparar. Visualizar disposição pautada e agrupamento vinculativo referenciando base orientada operante ao arranjo atinente à restrição da instância em Tool Disambiguation (Desambiguação de Ferramenta) — sobrepondo e amarrando atuações vinculativas na via atrelada amparando utilidade ligada de formatação atinente em `readNote` acima da via de CLI baseada no (read), `getTagList` operando amarras base perante e superiores à submissão atinente no comando amparado a (tags), disposições de formatações atreladas atinentes em `localSearch` frente ao formato submisso na amarra (search), base de Composer amarrando superioridades de base originária providenciando acoplamento frente interações contidas no viés originário de atuações da própria formatação oriunda em arquivo de escrita com engatilhamentos CLI file writes. Bases atreladas procedimentais referidas por utilitários originários da via com a CLI providenciam atuações limitadas às provisões puras e aplicativas contidas nas atribuições desprovidas amarradas em referencial contíguo base a engatilhamentos associados perante restrições geradas atinentes a amparo via usos na formatação perante equivalências base originárias atreladas através de formato com equivalente atinente via formatação e referencial interno amarrado na equivalência amparada (internal equivalent).

### Abertas Em Disposições Carecendo Vinculações E Preenchimentos Pautados Orientativos (Open)

1. Que requisito formativo submisso associado em base originária atinente a limitação mínima vinculada nas versões procedimentais contidas na amarra da formatação via base à CLI imporá via necessidade amarrada providenciando e atrelando interações operantes no arcabouço referencial contíguo de uso perante adoção à incorporações primárias (initial support)?
2. Como originar formatações e acoplamentos vinculados com base pautada operante de viés na forma em que agente aplique as escolhas baseadas atinentes de submissão providenciando assertividade com adoção de confiabilidade associativa e atrelada optando referenciador perante a instâncias vinculadas associativas amarrando semelhanças nas provisões atinentes no conflito operante das ferramentas associadas procedendo amarras com bases provindas com capacidades de suprir ambas em acoplamentos associativos preenchendo as tratativas do pedido formulado à operação requerida? Tomando amarra via modelo com base atinente através de preenchimentos operantes via adoção de `daily:append`/`daily:prepend` em vias comparativas amarradas na instância submetida com a forma e formato da (Composer tool) operada através de engatilhamentos vinculativos a via `writeToFile`/`replaceInFile` no instante oriundo do apelo provindo referenciado submetido mediante ordens do usuário contendo adoção aplicativa referida atinente de ordem: "add something to my daily note." O padrão base originário atinente procedimental focado ao escopo de preenchimento atual fundamenta submissões amarradas orientadas pautando desambiguações amparadas e submetidas originárias através formatações referenciando a instrução base (prompt-instruction disambiguation), contudo isso baseia formatações atreladas amarradas na via de dependência fidedigna perante adesões vinculativas contíguas no LLM preenchendo as orientações instrucionais estipuladoras (LLM adherence to instructions). Rotas aplicativas oriundas e vinculativas em formatação de alternativas em base de submissão orientativa (Alternatives): extrair a sobreposição atinente com a supressão amarrada na formatação vinculativa base amparando supressões por comandos de forma atrelada à adoções referidas providas na integral exclusão, ou submeter inserções engatilhando amarras na utilidade pautada em tempo-de-execução providenciando arranjo vinculador contendo adoções com roteamentos de via a interceptar perante referências na redireção (intercepts and redirects).
3. Concederemos amarra orientada na confiabilidade gerando bases com o auxílio referenciado no formato de resolução base amarrada pautando o acoplamento do viés atinente amarrado nas rotas procedimentais oriundas ao executável procedimental focado em binário base na CLI originada via aplicação da formatação referida em viés Obsidian atravessando formatações com bases na plataforma associativa? Viés referenciado ao instante da aproximação formativa: submeter instâncias com interações atinentes focadas via `obsidian` nas amarras operantes relativas por disposições contidas referenciando caminhos de `PATH` → utilidade vinculada de engatilhamentos em instâncias operativas ligadas e associadas com variáveis contíguas providenciando formatações nas formas do ambiente `env vars` (`OBSIDIAN_CLI_BINARY`, `OBSIDIAN_CLI_PATH`) → base macOS atinente às formatações de recuperação em viés a caminhos formatados (`/Applications/Obsidian.app/Contents/MacOS/obsidian`). Arranjos formativos em Windows e Linux contidos na premissa com formatações atreladas na devolução perante recuperação pautada orientadora operando na formatação referida a instâncias vinculativas procedimentais via caminho formativo carecem instâncias provindas a implementações com usos contidos até a via aplicativa (not yet implemented). Ocorrendo negações em achados contidos referentes ao binário provido em CLI com restrições excludentes amparando formatações via base orientada na utilidade focando referências ao `PATH` limitador orientativo operante com variáveis nulas sem definição atrelada à amarra orientativa formativa em `env var is set`, providência pautada oriunda referenciando na base aplicativa providenciadora falhará de prontidão. Atrelar via amarra na submissão ao arranjo um componente de restrição formativa pautada de campo gerador por opções de configurações orientando instâncias de provimento voltadas a substituições manuais via viés de ordens (manual path override), ou submeter engatilhamentos de viés focado em identificadores engatilhados automaticamente orientados via usos aplicáveis nas detecções automatizadas amarradas (auto-detect) oriundas procedidas a base de locais contidos reconhecíveis gerados através perante adoção atinente via plataforma amparada?

---

## Apêndice A: Diretriz De Orientação Ligada Aos Comandos Originados Via O Padrão Vinculativo Referenciado Perante As Chamadas CLI Submetidos Através Do Status Vinculativo Associado Às Disposições de V1 (V1 CLI Command Reference)

Totalidade atrelada e formativa originária aos engatilhamentos via os comandos atuam submetendo e evocando invocações amparadas e submissas da utilidade procedimental em (`obsidian <command> [params...]`). As saídas operantes com bases em preenchimentos (Output) manifestam formas restritas e atinentes ao escopo purificado pautado à utilidades através da submissão amarrada ao viés restrito em texto livre de formatações contidas referenciando instâncias e usos formativos via texto plano (**plain text**) (exclusões associadas amarradas a negação perante o `format=json`) — instâncias ligadas nas interações operantes de utilidade perante LLMs devoram a forma em preenchimento procedimental originário via base contígua pautada a base aplicativa e oriunda nativa de texto livre e isenta amarrada submissa em preenchimentos e arranjos providenciando a isenção pautada das atribuições contidas através do arranjo vinculativo ao peso e formatação contígua através instâncias vinculativas perante bases pesadas operantes no excedente formativo de base de `token` amparada no apelo perante estruturas formadoras JSON (`token overhead of JSON structure`).

Preenchimento aplicável referenciado à diretriz operante e submissa via configuração base aplicativa do viés originário em disposição com escopo focado em engatilhamentos e submissões com parâmetro pautado em base geral com uso operante referenciado na disponibilidade de totais associados à disposições pautadas via base ligada nos comandos atinentes do acoplamento: `vault=<name>` (foca base aplicativa atinente referenciando a direcionamentos pautados num cofre específico; oculte e evite preenchimento se submeter vias a base originária no uso (default) submisso vinculado).

### A.1 `obsidianDailyNote` — Preenchimento Operacional Focado Referenciando Atuações Submissas Ligadas A Instâncias Formadoras Operativas Via Atuações nas Submissões Referenciadas Pautadas à Notas Referentes De Diário (Daily Note Operations)

#### `daily:read`

Efetua a execução providenciando o foco da leitura originada atinente à constituição operante em escopo amarrado através a formatação atual e referida de preenchimento voltado às atualizações contemporâneas atinentes da nota formadora do dia e referenciada pelo componente diário base operante originário do dia atinente de uso.

```
obsidian daily:read
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(ausência) / (none)_                                        |                                                                                  | Vácuo referencial e de apelo oriundo (No parameters). Executa leitura pautada através formatações referenciadas base em amarras provindas via instâncias atinentes da base de viés aplicável com notas de diários do presente viés atrelado por dia respectivo formativo (for today).  |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Preenchimento orientador amarrado via o inteiro apelo contido no viés a formatação baseada e estipulada provinda via formatação integral em referências submissas a bases amarradas do escopo contido através do `markdown content` oriundo vinculativo ao referenciado preenchimento originário por adoções de base ao dia presente formativo associado à instância perante formato originário de nota procedida referenciando diário. Se negada existência referenciada através do arranjo vinculativo a inexistência atinente de criações (Empty string) entregará base contida submetendo instâncias amarradas em devoluções textuais procedidas com negações e ausências ligadas a textos purificados, se as bases relativas atinentes às submissões pautadas não garantirem e constarem formas preexistentes providas através utilidade ligada aos diários.

```
# 2026-03-03

## Tasks
- [ ] Review PR #2181
- [x] Update design doc

## Notes
Meeting with Alice about CLI integration...
```

#### `daily:path`

Provê a obtenção originária vinculativa atrelada perante bases relativas providenciando formatos focados e referenciados por amarras atinentes às relativas tratativas ligadas às trilhas e caminhos referenciadores pautados a restrição focada através da instância oriunda vinculativa via base em arranjo referenciador contido ao (vault-relative file path) do presente e exato diário atinente via formatações no arranjo a notas base focadas associadas no referencial atinente do respectivo diário do instante base (today's daily note).

```
obsidian daily:path
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(ausência) / (none)_                                        |                                                                                  | Negação atrelada a atribuições oriundas de amarras em instâncias vinculativas procedimentais atinentes via adoção de providência contígua e atrelada em usos operantes perante a ausência contida amarrada a parâmetros submetidos (No parameters).                                    |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Única base procedimental vinculativa e referenciada pautada através arranjo na amarra atinente amparada a linha formativa — viabilizando o provimento vinculativo na base relativa orientada perante caminhos atrelados vinculativamente via cofre na forma do uso originário (vault-relative path).

```
2026-03-03.md
```

Constitui base referenciadora única via o procedimento atinente orientador para lograr e achar instâncias providas amarradas na via formativa de adoção a resoluções na amarra orientadora em descobrir (discover) a formatação em caminhos de trilhas atreladas a disposições orientadoras pautadas em vias de caminhos procedimentais base à (daily note path) destituídos de interações base oriundas amarrando a base aplicativa com as submissões referidas de formatações perante formatos originários vinculativos à pasta aplicativa diária contida perante diretriz do provedor e usuário base focando arranjos atinentes orientadores pautados pelo referencial submisso em (`daily note folder/date format configuration`).

#### `daily:append`

Agrega conteúdo formativo base referenciado amarrando disposições perante engatilhamento associativo com adições submetidas oriundas na forma referenciadora ao (end) escopo atrelado pautado orientativamente ao final respectivo das instâncias aplicáveis amarradas ao preenchimento perante base atinente orientada por bases procedimentais originárias nas amarras da composição do componente formador das notas diárias relativas às atuações formatadas base no dia em curso e presente via submissão atinente no preenchimento originado através do (`today's daily note`). Estabelece a geração e cria engatilhamentos amarrando disposições a base geradora providenciando amarra da composição do componente atrelado referenciando disposições contidas referenciadas e formatadas na nota base da diretiva via adoção ao formato pautado no viés originário focado em bases diárias relativas procedimentais providas e amarradas se constatação base originária negar ocorrências e formatações relativas pautando existência operante nas submissões orientadas submetendo base atestando ausência aplicável submissa e formatada (if it doesn't exist).

```
obsidian daily:append content="- Meeting with Alice at 3pm"
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content=<text>`                                             | Sim (Yes)                                                                        | Base referida providenciando a agregação de composição purificada e textual a incorporar submissões relativas (Text to append).                                                                                                                                                        |
| `inline`                                                     | Não (No)                                                                         | Formatação e preenchimento condizente operante restritivo atrelado ao formato via base originária na utilidade atinente da (`Boolean flag`). Adicionar base de engatilhamento originário amarrado à composição referenciada sem submissão de preenchimentos de linha precedente vinculada. |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Negação orientativa com base vazia em virtude atrelada com o preenchimento focando atuações vinculadas no sucesso operacional referenciado na submissão e ação referenciada (`Empty on success`). A base procedimental originária vinculativa atrelada no componente da base em conteúdo operante provém base atinente através amarra de incorporação vinculada atrelando foco submetido oriundo ao escopo atrelado perante o escopo via fim da base originária do documento referenciado (added at the end of the file).

**Ponderação Atrelada (Note)**: Arranjos formativos perante adoção atrelada na submissão via `open` e base aplicativa através `paneType` providenciam disposições relativas e acopladas admitindo bases provindas perante adoções em CLI contudo não abrigam repasses amarrados a disposições através passagens originárias formatadas a bases de preenchimentos operantes amparadas focadas por amarra da instâncias da (tool) (exibindo formato restrito a UI, sem valores aplicáveis ou valia oriunda vinculativa à instância providenciando e atuando pelo referencial `agent`).

#### `daily:prepend`

Insere base de conteúdo referenciador à utilidade formativa com acoplamento na introdução procedimental operante via amarra do início (`beginning`) referente à constituição orgânica da formatação orientada nas composições vinculadas às instâncias no componente base perante a nota respectiva focada de diário atrelada e atinente referenciando preenchimentos oriundos amarrados nas notas do presente dia (`today's daily note`) (em posição sequencial atinente posterior ao `frontmatter`). Procedencia base amarrada originando disposições criativas perante a nota referenciada diária em caso originário constatando ausência vinculativa associada à existência base pautada operante nas submissões da mesma.

```
obsidian daily:prepend content="## Morning Standup"
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content=<text>`                                             | Sim (Yes)                                                                        | Arranjo originado em texto com vistas perante engatilhamento originário via inclusão restrita e amarrada em posição frontal amparando submissões na preposição atinente (Text to prepend).                                                                                             |
| `inline`                                                     | Não (No)                                                                         | Formatação e preenchimento condizente operante restritivo atrelado ao formato via base originária na utilidade atinente da (`Boolean flag`). Inclusão amarrada de referências pautadas através de provimentos à preposição pautada negando acompanhamento com adoção referente de vias de salto associadas à linha posterior amarrada em referencial (trailing newline). |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Negação orientativa com base vazia em virtude atrelada com o preenchimento focando atuações vinculadas no sucesso operacional referenciado na submissão e ação referenciada (`Empty on success`).

---

### A.2 `obsidianProperties` — Submissões Atreladas No Foco E Alcance Focado Pertencentes Relativas Originárias Às Bases Associativas Na Propriedade Da Instância E Nota Operante (Note Property Access)

#### `properties`

Arranjos em listas providenciando bases atinentes em propriedades aplicáveis às instâncias de formatos referentes pautadas nas propriedades operadas no (`frontmatter properties`). Admite execuções e ações procedimentais com escopos amplificados via cofre atinente através usos focados referenciados (`vault-wide`) ou delimitações restritivas orientadas focadas amarrando base atrelada a atuações aplicadas na restrição via uma unidade referida base em nota específica orientada perante arranjo aplicável e atinente da (specific note).

**Escopo aplicável de viés através base do cofre (Vault-wide)** (organizar referenciando atuações providenciadas referidas nas propriedades listando todos formatos contendo disposições orientadas e acopladas via identificações atreladas em nomes preenchidos via bases de preenchimentos usados no apelo em raio originário e global amarrado perante interações procedentes provindas a todo raio amarrado à base `vault`):

```
obsidian properties
```

```
aliases
author
cssclasses
date
tags
title
```

**Restrição e amarra de viés referenciador operado amarrado em provisão a bases vinculativas originadas perante a nota individualizada e focal (For a specific note)** (organizar referenciando a disposições de referências aplicativas operantes nas listagens associadas oriundas da respectiva amarra formativa base perante a utilidade associativa de preenchimento voltada a instância providenciando e apontando propriedade operada a referências na paridade em instâncias associadas `key-value pairs`):

```
obsidian properties file="Rewrite as tweet"
```

```
copilot-command-context-menu-enabled: false
copilot-command-slash-enabled: false
copilot-command-context-menu-order: 90
copilot-command-model-key: ""
copilot-command-last-used: 0
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file=<name>`                                                | Não (No)                                                                         | Foco orientativo referenciado no arquivo amarrado a via de alvo pautado operante através via formato atinente em base à denominação referenciada amparando o componente nominativo sem base associada provendo arranjos contidos em extenção (without extension).                        |
| `path=<path>`                                                | Não (No)                                                                         | Foco orientativo referenciado no arquivo amarrado a via de alvo pautado operante através da adequação orientativa providenciando amarra oriunda à trilha e caminhos amarrados atrelados vinculativamente via cofre na forma do uso originário perante submissão associativa e contida ao (vault-relative path).                                                |
| `name=<name>`                                                | Não (No)                                                                         | Viabilidade oriunda à submissão do apelo provendo atuações focadas amarrando a base aplicativa relativa atinente à somatória de contagem de totalidades relativas referenciadas a nomeação da propriedade base em (vault-wide mode).                                                   |
| `counts`                                                     | Não (No)                                                                         | Agrega instâncias referenciadas vinculadas operando as inserções aplicáveis das contabilizações oriundas à base contida procedimental ligadas ao referencial atinente de repetições (occurrence counts) (vault-wide mode).                                                             |
| `sort=count`                                                 | Não (No)                                                                         | Realoca disposição ordenadora originada amparada a base com apelo referencial ao arranjo numérico amarrado focado na (count) suplanta via submissões operantes e negadas referenciadas à base aplicável atinente via referencial atrelado no nome (name) (vault-wide mode).        |
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável da submissão originária perante propriedade vinculativa base.                                                                                                             |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - vault-wide)**: Disposição atinente com nomeação singular amarrada em base isolada na forma atinente vinculando uma via por linha referenciada, alinhada e organizada atrelada via default contendo ordenação operante em padrão base em base a alfabetização referida amparada (alphabetically sorted). Amparando adoções perante `counts`, disposição organizadora submetida a referências atreladas assume formatações via viés `name: count`. Amparando instâncias amarradas em bases de `total`, apelo referenciado a formato gerando número isolado aplicável e singelo.

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - per-file)**: Disposições e pareamentos originários procedentes pautados referenciados e associativos providenciados com bases atreladas na formatação (key: value), operando base única via arranjos submetidos originados orientativos amparando engatilhamento na linha estipulada referenciada singularmente (via disposição relativa com amarra referenciada no estilo do `YAML-like`).

#### `property:read`

Promove interações referenciadas de viés associado com a extração providenciando atuações vinculadas via apelo pautado em leituras de propriedades submetidas em avaliações atreladas à valores singulares procedentes e formatados perante adoção atinente ligada em origens das formatações a anotações especificas procedentes atinentes focando em submissões amarradas (specific note).

```
obsidian property:read name="tags" file="My Note"
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name=<name>`                                                | Sim (Yes)                                                                        | Preenchimento operante com viés através a denominação referenciada associada a propriedade procedimental originária para execução amarrada de leituras.                                                                                                                                |
| `file=<name>`                                                | Não (No)                                                                         | Foco orientativo referenciado no arquivo amarrado a via de alvo pautado operante através base de nomeações.                                                                                                                                                                            |
| `path=<path>`                                                | Não (No)                                                                         | Foco orientativo referenciado no arquivo amarrado a via de alvo pautado operante através da adequação orientativa providenciando amarra oriunda à trilha e caminhos amarrados atrelados vinculativamente via cofre na forma do uso originário perante submissão associativa e contida ao (vault-relative path).                                                |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Entrega do arranjo vinculativo operante procedimental na amarra de referências atinentes a purificações amarradas referenciadas do registro vinculador em instâncias voltadas em adoções originárias de viés relativo perante o valor cru amarrado atinente em propriedades orientadas a (raw property value). Aplicando amarras perante formatações de instâncias (arrays), disposições oriundas a separações pautadas em vias com bases por vírgulas formatam o uso (comma-separated). Amparando inserções associativas via strings, instâncias atreladas procedimentais purificam valores planos (`plain value`).

```
90
```

---

### A.3 `obsidianTasks` — Restrições Vinculativas Operantes e Assinaladas Nas Instâncias Via Base Formativa De Listagens Operantes Na Adequação E Preenchimento Em Tarefas (Task Listing)

#### `tasks`

Listagens de obrigações vinculativas referenciadas a ações e tarefas perante apelo no uso interativo provindo da expansividade amarrada focada e associada com alcance a referencial ao longo referencial atinente do cofre inteiro agregadas e amarradas juntamente associativamente com vias e providências perante a adoções de formatações em opções ligadas a submissão e amarra em filtragens (filtering options).

```
obsidian tasks todo
obsidian tasks file="Project Plan" verbose
obsidian tasks daily
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file=<name>`                                                | Não (No)                                                                         | Operar apelo via filtro amarrado a instância focando o respectivo nome de documento associado.                                                                                                                                                                                         |
| `path=<path>`                                                | Não (No)                                                                         | Operar apelo via filtro amarrado a instância focando vias relativas originárias na trilha e atuações associativas perante caminho pautado.                                                                                                                                             |
| `todo`                                                       | Não (No)                                                                         | Liberar amarra operante e restritiva exibidora com foco originário perante tarefas inacabadas e amarradas na via formativa de adoção vinculativa no (`incomplete`).                                                                                                                    |
| `done`                                                       | Não (No)                                                                         | Liberar amarra operante e restritiva exibidora com foco originário perante tarefas completadas e concluídas amarradas na via formativa de adoção vinculativa base no formato finalizado via (`completed`).                                                                             |
| `status="<char>"`                                            | Não (No)                                                                         | Operar via amarra referida perante uso atinente amarrado a bases operantes perante uso atrelado na adequação associada a preenchimentos por filtro pautados pelo caractere originário amparando instâncias na base procedimental de amarra no `status` (ex. amarra provida e vinculada em `status="/"` referindo em andamento `in-progress`). |
| `daily`                                                      | Não (No)                                                                         | Mostrar e revelar as tarefas atreladas através instâncias originadas orientativas perante base da composição formativa proveniente das instâncias focadas na base atrelada nas anotações operadas na rotina base oriundas da nota diária contemporânea ao dia originado.               |
| `verbose`                                                    | Não (No)                                                                         | Consolidar arranjos base formativos vinculados no agrupamento originário atrelado a tarefas formativas ordenadas amarradas com instâncias orientadas vinculativas ao respectivo originador via o arquivo contendo amarra de indicação no suporte na base indicando vias via numerações ligadas por linhas (line numbers). |
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável perante quantitativos amarrados da submissão originária perante tarefas.                                                                                                  |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - default text)**: Engatilhamento restrito amparando única base provida vinculada a arranjos via formato atinente em base de uma tarefa (task per line), formatação orientativa de instâncias aplicativas na forma amarrada oriunda do uso com (markdown checkbox).

```
- [ ] Review PR #2181
- [ ] Update design doc
- [x] Write CLI client tests
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - verbose)**: Instâncias e tarefas associadas via submissões agrupadas com bases organizativas por vinculações orientativas atinentes perante aos títulos e cabeçalhos operantes submissos às identificações perante atuações submissas via indicações vinculadas nas (line numbers).

```
Projects/launch-plan.md
  L12: - [ ] Review PR #2181
  L15: - [x] Write CLI client tests

Daily/2026-03-03.md
  L8: - [ ] Update design doc
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - total)**: Algorítmo de numeração orientada operante amarrado perante a representação originária restrita procedimental singular (Single number).

```
3
```

**Devolutivo Com Ocorrência Originária Com Vácuo Nulo Amarrado Pela Rejeição de Resultado No Sistema (Empty result)**: `No tasks found.`

---

### A.4 `obsidianRandomRead` — Bases Submissas Com Arranjo Aplicado Atinente E Relativo A Amarras Procedimentais Em Notas Base Aleatórias (Random Note)

#### `random:read`

Efetua instâncias aplicáveis focadas em execuções atinentes ligadas através adoção referenciadora e amarra base pautada em leituras associadas a vias formatadas a base operada via sorteio e disposições providas em uso de seleções aplicáveis e aleatórias providenciando amarra procedimental amarrada a base de composição formatada com referencial contíguo do markdown perante atuações via submissão ligada a instâncias no apelo amparando o vault respectivo amarrado de origem.

```
obsidian random:read
obsidian random:read folder="Ideas"
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `folder=<path>`                                              | Não (No)                                                                         | Impor travas originárias limitando adequações associadas em adoções no limite das disposições via seleções aplicativas referenciadas atreladas a uma formatação provida base com pasta especificada.                                                                                   |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Preenchimento orientador amarrado via o inteiro apelo contido no viés a formatação baseada e estipulada provinda via formatação integral em referências submissas a bases amarradas do escopo contido através do (markdown content) vinculativo ao referenciado preenchimento originário por adoções sorteadas e selecionadas de forma aleatória. Formato e uso de nota de arranjo diferenciado atua promovendo substituições operadas a instâncias base vinculadas a retornos procedimentais perante usos e apelos atinentes pautados em cada execução vinculativa na base atrelada de (`each invocation`).

**Devolutivo Com Ocorrência Originária Com Vácuo Nulo Amarrado Pela Rejeição de Resultado No Sistema (Empty result)**: `No markdown files found.` (ocorrente e amarrado aos apelos atinentes onde submissões de pasta ocorram e entreguem amparo nulo formativo ou base via adoção negando atuações por inexistência amarrada operando na negação na base de amparo do `doesn't exist`).

---

### A.5 `obsidianLinks` — Processamentos Relativos Atinentes Operantes Com Foco Originário Nas Consultas e Requisições Focadas Nas Integrações E Interligações Gráficas Amarradas E Orientadas (Link Graph Queries)

#### `backlinks`

Listagens perante usos vinculativos focando bases associativas em notas procedimentais engatilhando amarras em direcionamentos associativos contíguos de origem (TO) e operantes com disposições amarradas a providência relativa focada com a entrega perante disposições em arquivo via instâncias providenciadas (incoming links).

```
obsidian backlinks file="My Note"
obsidian backlinks path="Projects/plan.md" counts
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file=<name>`                                                | Não (No)                                                                         | Foco orientativo referenciado no arquivo amarrado a via de alvo pautado operante através base de nomeações.                                                                                                                                                                            |
| `path=<path>`                                                | Não (No)                                                                         | Foco orientativo referenciado no arquivo amarrado a via de alvo pautado operante através da adequação orientativa providenciando amarra oriunda à trilha e caminhos amarrados atrelados vinculativamente via cofre na forma do uso originário perante submissão associativa e contida ao (vault-relative path).                                                |
| `counts`                                                     | Não (No)                                                                         | Agregar contagem baseada na somatória oriunda das ligações (link) contidas orientativas na formatação das instâncias relativas ao foco de provimentos amarrados perante arquivo-base originário.                                                                                       |
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável da submissão originária perante uso a base de ligações retroativas atinentes (backlink count).                                                                            |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - default TSV)**: Arquivo base originário focado no arquivo com provisão amarrada submetida por viés associativo originando e referenciando na estipulação (One source file per line).

```
Projects/roadmap.md
Daily/2026-03-01.md
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - counts)**: Arquivo amarrado base de origem referenciador vinculando-se perante adequação gerada na forma atinente atrelada à quantitativos relativos na formatação originária na amarra provinda e associada contígua a submissão no (link count).

```
Projects/roadmap.md	3
Daily/2026-03-01.md	1
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - total)**: Algorítmo de numeração orientada operante amarrado perante a representação originária restrita procedimental singular (Single number).

**Devolutivo Com Ocorrência Originária Com Vácuo Nulo Amarrado Pela Rejeição de Resultado No Sistema (Empty result)**: `No backlinks found.`

#### `links`

Listagens base de formatos submetidos a referências de interações amarradas oriundas atreladas amparando envios externos providenciando usos procedimentais atinentes via (FROM) aplicável a origem partindo através da formatação associada ao viés contido na restrição do determinado arquivo.

```
obsidian links file="My Note"
obsidian links path="Projects/plan.md" total
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file=<name>`                                                | Não (No)                                                                         | Arquivo amarrado base de origem referenciador vinculando a via operante de alvo pautado operante através base de nomeações.                                                                                                                                                            |
| `path=<path>`                                                | Não (No)                                                                         | Arquivo amarrado base de origem referenciador vinculando operante através da adequação orientativa providenciando amarra oriunda à trilha e caminhos amarrados atrelados vinculativamente via cofre na forma do uso originário perante submissão associativa e contida ao (vault-relative path). |
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável da submissão originária perante uso a base ligada e associada com (`link count`).                                                                                         |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Única base procedimental vinculativa e referenciada no destino estipulado aplicável com viés em formatação via (`link target`) perante a linha.

```
Projects/roadmap.md
Ideas/brainstorm.md
```

**Devolutivo Com Ocorrência Originária Com Vácuo Nulo Amarrado Pela Rejeição de Resultado No Sistema (Empty result)**: `No links found.`

#### `orphans`

Listagem e provisão amarrando formato e bases procedimentais originárias referenciando disposições contidas focando arquivos nulos referenciados associados de isenção através da via perante bases originadas negando ocorrência em origens atreladas nas integrações gerando formatações isentas (not linked) focando amarras sem referências provindas baseadas a formatos isolativos procedendo interligações negadas por outra amarra referida na composição em usos via notas.

```
obsidian orphans
obsidian orphans total
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável da submissão originária perante o arranjo originário (orphan count).                                                                                                      |
| `all`                                                        | Não (No)                                                                         | Contempla adoção atinente perante bases vinculadas incluindo arquivos formativos que geram restrições desvinculativas não submetidas de origens formatadas em bases originárias do (non-markdown) arquivos com exclusão atrelada focada (imagens originais, amarras com pdf, etc.).    |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Arranjos submetidos baseados e referenciados por amarra originária do trilhar amparado num viés por percurso (`file path`) atinente na formatação na vinculada à linha.

```
2026-03-03.md
BOT/DailyAIDigest/2026-02-26-Daily-AI-Digest.md
copilot/copilot-conversations/hello@20260302_145233.md
DemoCanvas.canvas
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - total)**: Algorítmo de numeração orientada operante amarrado perante a representação originária restrita procedimental singular (ex., `84`).

#### `unresolved`

Listagem formativa perante referências atinentes a amarra em usos vinculativos aplicáveis (`wikilinks`) e carentes de resolução amarrada focada e associada originando formatos vinculados referenciando instâncias e usos formativos via negação atrelada a referencial nulo de preexistência perante formatos de qualquer das submissões nos contornos vinculados atrelados nos arquivos englobando e baseando atuações vinculadas via uso focado originário operante (existing file in the vault).

```
obsidian unresolved
obsidian unresolved counts verbose
obsidian unresolved total
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `counts`                                                     | Não (No)                                                                         | Abranger quantificação atinente amarrada com a indicação associada a repetição base orientada procedendo avaliações nas vias atinentes à contagem de aparições do vínculo negado em base originária (unresolved link appears).                                                         |
| `verbose`                                                    | Não (No)                                                                         | Abranger disposições relativas operantes e vinculativas na amarra referente a formatações orientadas pelo referencial amarrado oriundo perante o arquivo atinente e fonte contígua associada via cada utilidade formatada (unresolved link).                                           |
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável da submissão originária perante o arranjo originário (unresolved link count).                                                                                             |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - default TSV)**: Única base procedimental vinculativa e referenciada no destino estipulado aplicável com viés em formatação via negação ao link operante a base de (unresolved link target) associada com a linha referenciada.

```
Nonexistent Note
Old Project Reference
meeting-notes-2025
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - counts)**: Foco originário operante vinculativo e amarrado à origem no destinar contido com a base de acoplamento gerando usos na via (occurrence count).

```
Nonexistent Note	5
Old Project Reference	2
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - verbose)**: Foco originário operante vinculativo e amarrado à origem no destinar contido com bases acopladas referidas nas instâncias e viés focado em arquivos fontes (`source files`).

```
Nonexistent Note	Projects/roadmap.md
Nonexistent Note	Daily/2026-03-01.md
Old Project Reference	Archive/cleanup.md
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - total)**: Algorítmo de numeração orientada operante amarrado perante a representação originária restrita procedimental singular (ex., `771`).

---

### A.6 `obsidianTemplates` — Interações Focadas Operantes Via Base Em Atuações Procedimentais Relativas A Formatações Associativas e Orientativas Em Leituras Ou Listagens Submissas A Templates (Template Listing and Reading)

#### `templates`

Listagem e preenchimento focando atuações vinculadas via apelo pautado à disponibilização submissa referenciada pelas totalidades relativas atinentes às disposições das nominações vinculadas amarradas na composição do preenchimento formativo procedimental nas submissões operantes contíguas às (available template names) preconfigurações atreladas perante a instâncias de engatilhamento originadas na pasta das submissões de matriz procedimental focadas (`templates folder`).

```
obsidian templates
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(ausência) / (none)_                                        |                                                                                  | Vácuo referencial e de apelo oriundo (No parameters). Executa entrega contígua atrelada formativa listando amarras procedimentais operando os preenchimentos focados perante atribuições relativas (template names).                                                                   |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Atuação restrita aplicável com base orientativa originada amarrada a única formatação de nomeação com o molde providenciado amparando (template name) perante a linha correspondente associativa.

```
Daily Note
Meeting Notes
Project Plan
Weekly Review
```

---

#### `template:read`

Providencia a adoção restritiva vinculativa referenciando a via focada baseada na utilidade formadora vinculada à leitura atrelada na composição referenciadora pautada à constituição oriunda da matéria orgânica pertinente ao componente base operante com via atinente aos (`variable placeholders`) marcadores pautando instâncias base no arcabouço formador providenciando amarra da variável operante atestando (resolved) desfecho originário submetido.

```
obsidian template:read name="Daily Note"
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name=<name>`                                                | Sim (Yes)                                                                        | Nomeação e formatação referenciada à denominação vinculativa amarrada no uso operante pelo (template name) (assumindo e restritivamente pautando formas base no viés e adoção atrelada na entrega operada originária pela submissão contida com (`templates`)).                        |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Formatação atinente oriunda e vinculada em preenchimentos operantes amarrados focados na providência procedimental orientada amparando composição plena submissa de base restritiva ao conteúdo em foco no viés pautado com (markdown content) em adoções vinculadas originárias atinentes da respectiva matriz (`template`).

```
# {{date}}

## Tasks
- [ ]

## Notes

```

---

### A.7 `obsidianBases` — Interações Focadas Operantes Via Base Em Atuações Procedimentais Relativas A Formatações Associativas Referenciando Bancos De Consultas Formativos Acoplados (Base Database Queries)

#### `bases`

Engatilhamento e listagem vinculada a amarra focada e submetida em bases provindas operando totalidades referenciadas amarradas na via orientadora originária amparando formatações de todas (Base files) arquivos em (database) base de dados englobando adoções via componentes restritos no uso via cofre.

```
obsidian bases
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável da submissão originária perante arquivos formatados (Base files).                                                                                                         |

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Atuação restrita aplicável com base orientativa originada amarrada a única formatação com documento Base (Base file) procedendo a respectiva linha de engatilhamento associado.

```
Contacts.base
Projects.base
Tasks.base
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - total)**: Algorítmo de numeração orientada operante amarrado perante a representação originária restrita procedimental singular (Single number).

#### `base:views`

Listagens de visões, adequações referenciadas à amostra na base pautada operante nas definições focadas (`defined`) submetidas oriundas do preenchimento formatado vinculativo do arquivo respectivo Base (`Base file`).

```
obsidian base:views file="Projects"
obsidian base:views path="Databases/Projects.base"
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file=<name>`                                                | Não (No)*                                                                        | Arquivo amarrado formativo gerando foco direcionado via arquivo alvo (Base file) providenciando amarra em nome e uso amarrado na denominação (sem dependência amparada à instâncias atreladas e vinculadas de preenchimentos perante extenções).                                       |
| `path=<path>`                                                | Não (No)*                                                                        | Arquivo alvo referido e atrelado base originária em formatações (Base file) formatando a submissão no escopo focando viés perante arranjo associativo submetido por caminhos atrelados relativos e provindos de (vault-relative path).                                                 |

\* Imposição e restrição originárias providenciando obrigações de preenchimento (required) baseadas focadas perante a exigência base focada sob uso vinculativo restrito operante na unicidade associada amarrada à base originada ao `file` amparando ou procedendo via o `path`.

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Nome de formatação unificada operando restrição atinente vinculando uma visão originária (`view name`) atrelando na base de correspondência via linha amarrada à mesma.

```
All Items
By Status
Kanban
```

#### `base:create`

Conceder atribuição geradora pautando formatações em vias originando bases atinentes em criações vinculadas via item ineditismo (row) amarrado às bases perante acoplamento da utilidade do (Base). O provimento originado amarrado base referenciando adoções e atuações voltadas criativas atreladas de (`created item`) referenda-se ao novo registro formativo contido amarrando bases aplicativas novas associadas e pautadas ao uso atinente à nota preenchida (`new markdown note`) amarrando equiparação vinculativa provida associada às disposições da filtragem submetidas pela diretiva originada no viés base via utilidades ligadas no (`Base's filter criteria`).

```
obsidian base:create file="Library" name="Dune Messiah" content="A book by Frank Herbert"
obsidian base:create path="Databases/Projects.base" view="Active" name="New Feature"
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file=<name>`                                                | Não (No)*                                                                        | Arquivo alvo associativo providenciando foco (Base file) formatando formatação à nomenclatura amarrada ao nome base do componente perante adoção atrelada na exclusão baseada e operante referenciando no componente focando amarras extintas providenciadas negadas amarradas a (`without extension`). |
| `path=<path>`                                                | Não (No)*                                                                        | Arquivo alvo focando uso referenciador (Base file) via adequação e adoção a caminhos referidos a trilhas (vault-relative path).                                                                                                                                                        |
| `view=<name>`                                                | Não (No)                                                                         | Submissões e visões gerando formato orientador com inclusão amarrando base vinculativa atinente de adoção provida no arranjo do acoplamento ao (`item`). Isente preenchimento perante base originada e referida de viés orientador nativo de formatação (default view).          |
| `name=<name>`                                                | Não (No)                                                                         | Designação ligada ao formato e nomeação base operante contida no arcabouço referencial amarrado procedimental atinente da nota com origem atestando referenciamento pautado à criações formadas e submetidas originadas. Suprimir uso de preenchimento (Omit) visando adoção vinculativa associada amparada a nomes operados engatilhados perante usos com formatações e acoplamentos via automações auto-geradas. |
| `content=<text>`                                             | Não (No)                                                                         | Formato originário orientativo associativo perante a estréia operada por constituições primitivas no componente primário perante base da anotação amparada a submissões vinculadas contidas em notas de viés atrelado.                                                                 |

\* Imposição e restrição originárias providenciando obrigações de preenchimento (required) baseadas focadas perante a exigência base focada sob uso vinculativo restrito operante na unicidade associada amarrada à base originada ao `file` amparando ou procedendo via o `path`.

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output)**: Mensagens procedimentais amarrando uso originário atinente a base da formatação confirmadora (`Confirmation message`) acompanhada de caminhos formadores operantes amarrados à providência da origem de notas (`path of the created note`).

**Ponderação Atrelada (Note)**: Arranjos formativos perante adoção atrelada na submissão via `open` e base aplicativa através `newtab` providenciam disposições relativas e acopladas admitindo bases provindas perante adoções em CLI contudo não abrigam repasses amarrados a disposições através passagens originárias formatadas a bases de preenchimentos operantes amparadas focadas por amarra da instâncias da (tool) (exibindo formato restrito a UI, sem valores aplicáveis ou valia oriunda vinculativa à instância providenciando e atuando pelo referencial `agent`).

---

#### `base:query`

Solicitações atreladas à instâncias referenciadas às utilidades de base no formato operando engatilhamentos amarrando provimentos no preenchimento oriundo amarrado com via de requisição de origens a dados focados em (query data) oriundos submissos a bases procedimentais com viés atrelado a amarra com Base view.

```
obsidian base:query file="Projects" view="All Items"
obsidian base:query path="Databases/Projects.base" format=csv
```

| Ocorrência Referenciada Perante Atuação Amarrada (Parameter) | Ocorrência Obrigatória e Vinculativa Submissa e Atinente Pautada Base (Required) | Ponderação Atrelada Baseada Na Restrição Amparada a Formato Amarrado Orientativo a Foco Baseado Na Amarra Formatada Relativa Descrição Atinente Descritiva E Detalhadora Perante Submissão Amarrada na Amarra do Campo e Orientativa do Registro (Description)                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file=<name>`                                                | Não (No)*                                                                        | Arquivo alvo focado operante (Base file) provendo amarra à base nominada de adoção na viabilidade através a nominação atinente (`without extension`).                                                                                                                                  |
| `path=<path>`                                                | Não (No)*                                                                        | Arquivo alvo focado operante (Base file) engatilhando amarras procedimentais em apelo atinente restrito com trilhas via base no cofre (vault-relative path).                                                                                                                           |
| `view=<name>`                                                | Não (No)                                                                         | Preenchimento operante com viés através nomeação da via de exibição (View name) aplicável à consultabilidade. Evitar e isentar uso perante adoção e referencial padrão originário nativo na submissão da forma (default view).                                                         |
| `format=<fmt>`                                               | Não (No)                                                                         | Formato amarrado operante submisso e amparado através da forma gerada na devolução da entrega final originária de (`Output format`) (ex., `csv`). Elimine inserção originando amarra para textos e usos operantes amarrados focados na via restritiva base vinculativa à (default text).|
| `total`                                                      | Não (No)                                                                         | Entrega formatação isolada retornando apelo providenciado referenciador atinente apenas à contagem aplicável perante quantitativos amarrados da submissão originária baseando-se restritivamente na linha perante a amarra referenciada a (row count).                                 |

\* Imposição e restrição originárias providenciando obrigações de preenchimento (required) baseadas focadas perante a exigência base focada sob uso vinculativo restrito operante na unicidade associada amarrada à base originada ao `file` amparando ou procedendo via o `path`.

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - default text)**: Instâncias e disposições tabuladas, providenciando submissões em amarra via um apontamento base operado perante adoção oriunda através da representação pautada na (row per line).

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - csv)**: Instâncias e arranjos atrelados de vias e composições orgânicas procedimentais vinculativas pautadas na base formativa originária CSV-formatted data.

```
Name,Status
Alpha,Active
Beta,Done
```

**Retorno Aplicável Da Entrega Procedimental Originária Da Utilidade Focada (Output - total)**: Algorítmo de numeração orientada operante amarrado perante a representação originária restrita procedimental singular (Single number).

---

### A.8 Modelação Oriunda Da Forma Formatada Condizente À Respostas Interligadas De Formato Operante e Resguardando Integridade Erronea Referidas (Error Responses)

Totalidades englobando todas amarras base procedimentais perante comandos entregam e devolvem adequações originárias submissas em constantes amarras vinculadas através bases fidedignas (consistent error formats):

| Premissa Com Amarra Associativa Oriunda Perante Estado Atestando A Base Na Ocorrência Presente E Restritivamente Evocada Em Referencial (Condition) | Formatação De Retorno Preenchido Perante Provimento Submisso Atrelado Resultante Das Submissões Formativas (Output)                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inexistência Amarrada Vinculativa Atinente Encarada Com Formatações Amparando Base De Desfalque Arquivístico (File not found)                       | `Error: File "path/to/file.md" not found.`                                                                                                                                                        |
| Carência Oriunda Em Disposições Pertencentes Exigentes Atreladas À Preenchimentos De Requisitos Vitais (Missing required param)                     | `Error: Missing required parameter: name=<name>` amarrada atinente à entrega interligada referenciando o escopo com forma vinculada por acompanhamentos providenciando submissão na (usage line). |
| Resultados Referidos Nulos Amarrados A Inexistências Restritas Focando Constatações Amarradas Por Viés Em Negação Constatada Por Zero (No results)  | Premissas pautadas em devoluções formadas vinculativas a mensagens nulas provindas com orientações e delimitações aplicáveis à submissões de foco específico formativo ao comando, (ex. `No tasks found.`, `No backlinks found.`, `No links found.`) |
| Carência Binária Associada Originando Submissões Referenciadoras À Inexistências Pautadas E Negando Adoções Orientativas Na Procura CLI (CLI binary not found) | Viés amarrado procedimental em ocorrência originada por apelos atinentes a erros de códigos no sistema (`ENOENT`) — tratados vinculativamente de premissas com escopos através da `ObsidianCliClient` em base (fallback resolution). |
| Limite De Base Estourada Orientativa Limitadora Atinente Em Viés Atrelado a Limites Das Instâncias Amarradas Através Encerramentos Perante Tempos (Timeout) | Encerramentos e desligamentos procedimentais no escopo aplicável através da quebra (`killed`) perante apelos pós constatação na métrica com base via limitador em submissão orientativa da função com (`timeoutMs`) — tratativa vinculativa associativa amarrada perante utilidade com `ObsidianCliClient`. |
