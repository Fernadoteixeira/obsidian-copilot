# Modo Agente e Ferramentas

O Copilot Plus inclui um **agente autônomo** que pode raciocinar passo a passo e decidir quais ferramentas usar para responder à sua pergunta. Em vez de você especificar cada etapa, o agente descobre sozinho o que fazer.

Este recurso requer uma licença do [Copilot Plus](copilot-plus-and-self-host.pt-BR.md).

---

## Visão Geral

Quando o agente autônomo está ativado, o Copilot pode:

1. Dividir sua solicitação em subtarefas
2. Usar ferramentas para coletar informações (pesquisar seu vault, pesquisar na web, ler uma nota)
3. Criar ou editar notas
4. Combinar resultados e dar uma resposta abrangente

**Exemplo**: Pergunte "No que eu trabalhei na semana passada?" e o agente automaticamente pesquisará seu vault por notas datadas dos últimos 7 dias, lerá as relevantes e resumirá sua semana.

---

## Ativando o Modo Agente

1. Vá em **Configurações → Copilot → Plus**
2. Ative **Enable Autonomous Agent**

O agente é ativado automaticamente quando você está no modo **Copilot Plus**. Não é preciso fazer nada especial — apenas faça sua pergunta.

### Máximo de Iterações

O agente trabalha em ciclos de iteração (pensar → usar uma ferramenta → pensar → usar uma ferramenta → responder). Você pode controlar o número máximo de iterações antes de o agente parar:

- **Padrão**: 4 iterações
- **Máximo**: 16 iterações
- **Configuração**: **Configurações → Copilot → Plus → Autonomous Agent Max Iterations**

O agente também tem um tempo máximo de execução de 5 minutos por resposta, independentemente da contagem de iterações.

---

## Ferramentas Disponíveis

O Copilot Plus possui 13 ferramentas embutidas. Algumas estão sempre ativas; outras podem ser ativadas ou desativadas.

### Ferramentas Sempre Ativas

Estas ferramentas estão sempre disponíveis e não podem ser desativadas:

#### Obter Hora Atual

Obtém a hora atual em qualquer fuso horário. Útil para consultas sensíveis ao tempo como "o que devo fazer hoje?"

#### Obter Intervalo de Tempo

Converte expressões de tempo em linguagem natural (como "semana passada" ou "ontem") em intervalos de datas exatos. Geralmente chamada automaticamente antes de uma busca no vault baseada em tempo.

#### Obter Informação de Tempo

Converte um timestamp epoch para uma data e hora legível.

#### Converter Fusos Horários

Converte um horário de um fuso horário para outro. Pergunte: "Que horas são 15h EST em Tóquio?"

#### Ler Nota

Lê o conteúdo de uma nota específica. O agente usa isso para inspecionar uma nota que encontrou via busca, ou que você mencionou explicitamente. Funciona com notas grandes lendo-as em blocos.

#### Árvore de Arquivos

Navega pela estrutura de arquivos do seu vault. O agente usa isso para encontrar caminhos de pastas antes de criar novas notas ou para contar arquivos em uma pasta.

#### Lista de Tags

Lista todas as tags no seu vault com estatísticas de uso. Útil para reorganização de tags ou para encontrar notas por padrões de tags.

#### Atualizar Memória

Salva informações na sua memória quando você pede explicitamente à IA para lembrar de algo. Veja [Copilot Plus e Auto-Hospedagem](copilot-plus-and-self-host.pt-BR.md#memory-system) para detalhes.

> **Requer**: **Configurações → Copilot → Plus → Reference Saved Memories** deve estar ativado. Se esta configuração estiver desativada, a ferramenta não é registrada e comandos de memória não funcionarão.

### Ferramentas Configuráveis

Estas ferramentas podem ser individualmente ativadas ou desativadas em **Configurações → Copilot → Plus → Tool Settings**:

#### Busca no Vault

Pesquisa suas notas do vault por conteúdo. O agente usa isso para encontrar notas relevantes à sua pergunta.

- **Acionamento**: Automaticamente para perguntas relacionadas ao vault, ou explicitamente com `@vault`
- **Usa**: Tanto busca semântica (se ativada) quanto busca lexical

#### Busca na Web

Pesquisa na internet por informações atuais.

- **Acionamento**: Automaticamente quando sua pergunta implica conteúdo web/online, ou explicitamente com `@websearch` ou `@web`
- **Requer**: Um serviço de busca web configurado (Firecrawl ou Perplexity no modo auto-hospedado, ou gerenciado pelo Plus)

#### Escrever em Arquivo

Cria uma nova nota ou sobrescreve uma existente inteiramente.

- **Acionamento**: Automaticamente para solicitações "crie uma nota", ou explicitamente com `@composer` (disponível tanto no modo Copilot Plus quanto no modo Projetos)
- **Comportamento**: Mostra uma prévia do conteúdo antes de escrever. Você pode revisar e aceitar ou rejeitar a alteração.
- **Aceitação automática**: Ative **Configurações → Copilot → Plus → Auto-accept edits** para pular a prévia

#### Substituir em Arquivo

Faz alterações direcionadas em uma nota existente usando blocos de buscar-e-substituir.

- **Caso de uso**: Edições pequenas (adicionar um item, atualizar uma seção) — mais preciso do que reescrever a nota inteira
- **Comportamento**: Mostra uma prévia de diff antes de aplicar a alteração
- **Aceitação automática**: Mesma configuração que Escrever em Arquivo

#### Transcrição do YouTube

Obtém a transcrição de um vídeo do YouTube.

- **Acionamento**: Automaticamente quando você cola uma URL do YouTube na sua mensagem
- **Sem configuração extra necessária**: Apenas inclua a URL na sua mensagem
- **Opção auto-hospedada**: Use sua própria chave de API Supadata para transcrição no modo auto-hospedado

---

## Configurações de Ferramentas

Vá em **Configurações → Copilot → Plus → Tool Settings** para:

- Ver todas as ferramentas disponíveis
- Ativar ou desativar ferramentas configuráveis individualmente
- Visualizar o que cada ferramenta faz

---

## Usando Ferramentas Explicitamente

Enquanto o agente decide automaticamente quando usar ferramentas, você também pode acioná-las explicitamente com @-menções:

```
@vault encontre todas as notas sobre minha lista de leitura
@websearch qual é a última versão do Python?
@composer crie um novo modelo de notas de reunião
@memory lembre que eu prefiro listas com marcadores
```

Veja [Contexto e Menções](context-and-mentions.pt-BR.md) para a referência completa de @-menções.

---

## Indicadores de Chamada de Ferramentas

Enquanto o agente está trabalhando, o chat mostra indicadores de status para cada chamada de ferramenta:

- "Lendo arquivos"
- "Pesquisando na web"
- "Lendo árvore de arquivos"
- "Compactando"

Isso permite que você veja o que o agente está fazendo enquanto trabalha.

---

## Edição de Arquivos: Prévia e Diff

Quando o agente usa **Escrever em Arquivo** ou **Substituir em Arquivo**, ele mostra uma prévia antes de fazer alterações:

- **Visualização dividida**: Antes/depois mostrados lado a lado
- **Visualização lado a lado**: Alterações destacadas inline

Você pode escolher sua visualização de diff preferida em **Configurações → Copilot → Plus → Diff View Mode**.

Revise a mudança proposta e clique:

- **Aceitar** — Aplica a alteração na sua nota
- **Rejeitar** — Descarta sem fazer nenhuma alteração
- **Reverter** — Desfaz uma alteração que já foi aceita

### Aceitação Automática de Edições

Se você confia no agente e não quer revisar cada alteração de arquivo, ative **Auto-accept edits** em **Configurações → Copilot → Plus**. Alterações de arquivo serão aplicadas imediatamente sem uma etapa de confirmação.

---

## Relacionado

- [Copilot Plus e Auto-Hospedagem](copilot-plus-and-self-host.pt-BR.md) — Licenciamento e memória
- [Busca no Vault e Indexação](vault-search-and-indexing.pt-BR.md) — Como a busca no vault funciona
- [Contexto e Menções](context-and-mentions.pt-BR.md) — Acionadores @-menção para ferramentas
