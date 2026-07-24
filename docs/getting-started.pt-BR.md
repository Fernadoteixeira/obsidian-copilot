# Primeiros Passos com o Copilot para Obsidian

O Copilot para Obsidian é um plugin alimentado por IA que traz grandes modelos de linguagem (LLMs) diretamente para o seu fluxo de trabalho de anotações. Você pode conversar com a IA, fazer perguntas sobre o seu vault, executar comandos personalizados, pesquisar na web e até mesmo fazer a IA editar suas notas — tudo sem sair do Obsidian.

## O que o Copilot pode fazer?

- **Chat**: Converse com um assistente de IA
- **Q&A no Vault**: Faça perguntas e obtenha respostas fundamentadas em suas próprias notas
- **Edição de notas**: Peça para a IA escrever ou atualizar suas notas para você
- **Busca semântica**: Encontre notas pelo significado, não apenas por palavras-chave
- **Comandos personalizados**: Execute prompts com IA no texto selecionado
- **Busca na web**: Busque e resuma informações da internet
- **Memória**: Faça a IA lembrar de fatos sobre você ao longo das conversas

O Copilot suporta 16+ provedores de IA, incluindo OpenAI, Anthropic, Google Gemini, Ollama (local) e muito mais.

---

## Instalação

1. Abra **Configurações do Obsidian** → **Plugins da comunidade**
2. Desative o **Modo restrito** se solicitado
3. Clique em **Procurar** e pesquise por **Copilot**
4. Clique em **Instalar** e depois em **Ativar**

O Copilot agora está instalado. Um ícone de robô aparecerá na barra lateral esquerda (ribbon).

---

## Configuração Inicial

### Passo 1: Abrir as Configurações do Plugin

Vá em **Configurações** → **Copilot** (role para baixo até a seção de Plugins da Comunidade).

### Passo 2: Adicionar uma Chave de API

Na aba **Básico**, clique em **Definir Chaves** para abrir a caixa de diálogo de chaves de API. Insira a chave para o provedor escolhido:

| Provedor | Onde obter a chave |
|---|---|
| OpenRouter (padrão) | https://openrouter.ai/keys |
| OpenAI | https://platform.openai.com/api-keys |
| Anthropic | https://console.anthropic.com/settings/keys |
| Google Gemini | https://makersuite.google.com/app/apikey |

O modelo padrão é o **OpenRouter Gemini 2.5 Flash**, que requer uma chave de API do OpenRouter. Se preferir um provedor diferente, configure essa chave primeiro e depois altere o modelo padrão.

### Passo 3: Escolher um Modelo Padrão

Ainda na aba **Básico**, use o menu suspenso **Modelo de Chat Padrão** para selecionar o modelo que deseja usar. Qualquer modelo cujo provedor tenha uma chave de API configurada estará disponível.

### Passo 4: Escolher um Modo de Chat

Use o menu suspenso **Modo Padrão** para definir qual modo abre por padrão:

- **Chat** — Conversa geral, bom para a maioria das tarefas
- **Vault QA** — Faça perguntas respondidas a partir das suas notas
- **Copilot Plus** — Modo avançado com agente autônomo e ferramentas (requer licença Copilot Plus)
- **Projects** — Espaços de trabalho focados (recurso alpha)

A maioria dos usuários deve começar com o modo **Chat**.

---

## Abrindo o Painel de Chat

Você pode abrir o Copilot de várias maneiras:

- Clique no **ícone de robô** na barra lateral esquerda (ribbon)
- Use a paleta de comandos: `Ctrl/Cmd+P` → **Open Copilot Chat Window**
- Use o atalho `Ctrl/Cmd+P` → **Toggle Copilot Chat Window** para mostrar/ocultar

### Barra Lateral vs. Aba do Editor

Por padrão, o Copilot abre como uma **visualização** (painel da barra lateral). Você pode alterar isso em Configurações → Copilot → Básico → **Open chat in**:
- **View** — Abre na barra lateral, permanece visível enquanto você trabalha
- **Editor** — Abre como uma aba do editor, dando mais espaço na tela

---

## Sua Primeira Conversa

1. Abra o painel de chat
2. Digite sua mensagem na caixa de entrada na parte inferior
3. Pressione **Enter** (ou **Shift+Enter** se alterou o atalho de envio) para enviar
4. Observe a resposta da IA sendo transmitida em tempo real
5. Continue a conversa naturalmente

A IA incluirá automaticamente sua nota aberta como contexto, para que você possa dizer coisas como "resuma esta nota" ou "quais são os itens de ação nesta nota?".

---

## Atalhos de Teclado

Estes são os atalhos padrão. Você pode personalizá-los em **Configurações do Obsidian** → **Atalhos de teclado** → pesquise por "Copilot".

| Ação | Atalho Padrão |
|---|---|
| Open Copilot Chat Window | *(não atribuído — atribua em Atalhos)* |
| Toggle Copilot Chat Window | *(não atribuído — atribua em Atalhos)* |
| New Copilot Chat | *(não atribuído — atribua em Atalhos)* |
| Quick Ask (entrada flutuante) | *(não atribuído — atribua em Atalhos)* |
| Trigger Quick Command | *(não atribuído — atribua em Atalhos)* |
| Add selection to chat context | *(não atribuído — atribua em Atalhos)* |

### Atalho de Envio

Por padrão, **Enter** envia uma mensagem e **Shift+Enter** adiciona uma nova linha. Você pode alternar isso em Configurações → Copilot → Básico → **Default Send Shortcut**.

---

---

## Glossário

**LLM (Large Language Model / Grande Modelo de Linguagem)**
O "cérebro" de IA por trás do Copilot — um modelo treinado em grandes volumes de texto para entender e gerar linguagem humana, alimentando chat, resumos e assistência de escrita.

**API (Application Programming Interface / Interface de Programação de Aplicações)**
Uma maneira de o Copilot se comunicar com serviços externos de IA. Você fornece uma chave de API, que é como uma senha que permite ao Copilot usar modelos de IA de um provedor em seu nome. Nota: uma chave de API da OpenAI é *diferente* de uma assinatura do ChatGPT Plus — você não precisa do ChatGPT Plus para usar o Copilot.

**API Key (Chave de API)**
Um token secreto de um provedor de IA que autoriza o Copilot a fazer solicitações. A maioria dos provedores exige que você tenha uma conta de faturamento com saldo positivo.

**Token**
Uma pequena unidade de texto (aproximadamente ¾ de uma palavra) que os modelos de IA processam. Os tokens medem quanto texto a IA pode manipular de uma só vez e estão relacionados aos custos de uso.

**Context Window (Janela de Contexto)**
A quantidade de texto que a IA pode considerar por vez ao gerar uma resposta. Uma janela de contexto maior significa que a IA pode usar mais das suas notas ou do histórico da conversa.

**Embeddings**
Um método de converter texto em números que capturam o significado. Os embeddings permitem que a IA encontre notas conceitualmente relacionadas, mesmo que não compartilhem palavras exatas.

**RAG (Retrieval-Augmented Generation / Geração Aumentada por Recuperação)**
Uma técnica que aprimora as respostas da IA buscando primeiro notas relevantes e, em seguida, gerando uma resposta com base na sua consulta e no conteúdo recuperado. É assim que o Vault QA funciona.

**Vector Store / Index (Armazenamento de Vetores / Índice)**
Um banco de dados que armazena suas notas como vetores matemáticos (embeddings) para que possam ser buscadas pelo significado. Pense nisso como um índice inteligente que entende o contexto das suas notas, não apenas as palavras-chave.

---

## Próximos Passos

- [Interface de Chat](chat-interface.pt-BR.md) — Saiba mais sobre modos, histórico e configurações
- [Provedores de LLM](llm-providers.pt-BR.md) — Configure seu provedor de IA preferido
- [Contexto e Menções](context-and-mentions.pt-BR.md) — Controle qual contexto a IA visualiza
- [Busca no Vault e Indexação](vault-search-and-indexing.pt-BR.md) — Configure a busca semântica em suas notas
