# Primeiros Passos com o Copilot para Obsidian

O Copilot para Obsidian é um plugin alimentado por IA que traz grandes modelos de linguagem (LLMs) diretamente para o seu fluxo de trabalho de anotações. Você pode conversar com a IA, fazer perguntas sobre o seu vault, executar comandos personalizados, pesquisar na web e até mesmo fazer a IA editar suas notas — tudo sem sair do Obsidian.

## O que o Copilot pode fazer?

- **Chat**: Tenha uma conversa com um assistente de IA
- **Q&A no Vault**: Faça perguntas e obtenha respostas baseadas nas suas próprias notas
- **Edição de notas**: Peça à IA para escrever ou atualizar suas notas para você
- **Busca semântica**: Encontre notas pelo significado, não apenas por palavras-chave
- **Comandos personalizados**: Execute prompts de IA no texto selecionado
- **Busca na web**: Busque e resuma informações da internet
- **Memória**: Faça a IA lembrar de fatos sobre você entre conversas

O Copilot suporta 16+ provedores de IA, incluindo OpenAI, Anthropic, Google Gemini, Ollama (local) e mais.

---

## Instalação

1. Abra **Configurações do Obsidian** → **Plugins Comunitários**
2. Desative o **Modo Seguro** se solicitado
3. Clique em **Procurar** e pesquise por **Copilot**
4. Clique em **Instalar**, depois em **Ativar**

O Copilot agora está instalado. Um ícone de robô aparecerá na barra lateral esquerda.

---

## Configuração Inicial

### Passo 1: Abrir as Configurações do Plugin

Vá em **Configurações** → **Copilot** (role para baixo até a seção de Plugins Comunitários).

### Passo 2: Adicionar uma Chave de API

Na aba **Basic**, clique em **Set Keys** para abrir a caixa de diálogo de chaves de API. Insira a chave para o seu provedor escolhido:

| Provedor | Onde obter uma chave |
|---|---|
| OpenRouter (padrão) | https://openrouter.ai/keys |
| OpenAI | https://platform.openai.com/api-keys |
| Anthropic | https://console.anthropic.com/settings/keys |
| Google Gemini | https://makersuite.google.com/app/apikey |

O modelo padrão é o **OpenRouter Gemini 2.5 Flash**, que requer uma chave de API do OpenRouter. Se preferir um provedor diferente, configure essa chave primeiro e depois altere o modelo padrão.

### Passo 3: Escolher um Modelo Padrão

Ainda na aba **Basic**, use o menu suspenso **Default Chat Model** para selecionar o modelo que você deseja usar. Qualquer modelo cujo provedor tenha uma chave de API configurada estará disponível.

### Passo 4: Escolher um Modo de Chat

Use o menu suspenso **Default Mode** para definir qual modo abre por padrão:

- **Chat** — Conversa de propósito geral, bom para a maioria das tarefas
- **Vault QA** — Faça perguntas respondidas a partir das suas notas
- **Copilot Plus** — Modo avançado com agente autônomo e ferramentas (requer licença Copilot Plus)
- **Projetos** — Espaços de trabalho focados (recurso alpha)

A maioria dos usuários deve começar com o modo **Chat**.

---

## Abrindo o Painel de Chat

Você pode abrir o Copilot de várias maneiras:

- Clique no **ícone de robô** na faixa à esquerda (barra lateral)
- Use a paleta de comandos: `Ctrl/Cmd+P` → **Open Copilot Chat Window**
- Use o atalho `Ctrl/Cmd+P` → **Toggle Copilot Chat Window** para mostrar/ocultar

### Barra Lateral vs. Aba do Editor

Por padrão, o Copilot abre como uma **view** (painel na barra lateral). Você pode alterar isso em Configurações → Copilot → Basic → **Open chat in**:
- **View** — Abre na barra lateral, permanece visível enquanto você trabalha
- **Editor** — Abre como uma aba do editor, dando-lhe mais espaço na tela

---

## Sua Primeira Conversa

1. Abra o painel de chat
2. Digite sua mensagem na caixa de entrada na parte inferior
3. Pressione **Enter** (ou **Shift+Enter** se você alterou o atalho de envio) para enviar
4. Assista a resposta da IA fluindo em tempo real
5. Continue a conversa naturalmente

A IA incluirá automaticamente sua nota aberta no momento como contexto, então você pode dizer coisas como "resuma esta nota" ou "quais são os itens de ação nesta nota?"

---

## Atalhos de Teclado

Estes são os atalhos padrão. Você pode personalizá-los em **Configurações do Obsidian** → **Atalhos de teclado** → procure por "Copilot".

| Ação | Atalho Padrão |
|---|---|
| Open Copilot Chat Window | *(não definido — atribua em Atalhos de teclado)* |
| Toggle Copilot Chat Window | *(não definido — atribua em Atalhos de teclado)* |
| New Copilot Chat | *(não definido — atribua em Atalhos de teclado)* |
| Quick Ask (entrada flutuante) | *(não definido — atribua em Atalhos de teclado)* |
| Trigger Quick Command | *(não definido — atribua em Atalhos de teclado)* |
| Add selection to chat context | *(não definido — atribua em Atalhos de teclado)* |

### Atalho de Envio

Por padrão, **Enter** envia uma mensagem e **Shift+Enter** adiciona uma nova linha. Você pode trocar isso em Configurações → Copilot → Basic → **Default Send Shortcut**.

---

---

## Glossário

**LLM (Grande Modelo de Linguagem)**
O "cérebro" de IA por trás do Copilot — um modelo treinado em vastos textos para entender e gerar linguagem humana, potencializando chat, resumo e assistência de escrita.

**API (Interface de Programação de Aplicação)**
Uma maneira do Copilot se comunicar com serviços de IA externos. Você fornece uma chave de API, que é como uma senha que permite ao Copilot usar modelos de IA de um provedor em seu nome. Nota: uma chave de API da OpenAI é *diferente* de uma assinatura do ChatGPT Plus — você não precisa do ChatGPT Plus para usar o Copilot.

**Chave de API**
Um token secreto de um provedor de IA que autoriza o Copilot a fazer solicitações. A maioria dos provedores exige que você tenha uma conta de faturamento com saldo positivo.

**Token**
Uma pequena unidade de texto (cerca de ¾ de uma palavra) que os modelos de IA processam. Tokens medem quanto texto a IA pode manipular de uma só vez e estão relacionados aos custos de uso.

**Janela de Contexto**
A quantidade de texto que a IA pode considerar ao mesmo tempo ao gerar uma resposta. Uma janela de contexto maior significa que a IA pode usar mais das suas notas ou histórico de conversa.

**Embeddings**
Um método de converter texto em números que capturam o significado. Embeddings permitem que a IA encontre notas conceitualmente relacionadas, mesmo que não compartilhem palavras exatas.

**RAG (Geração Aumentada por Recuperação)**
Uma técnica que aprimora as respostas da IA buscando primeiro por notas relevantes, depois gerando uma resposta baseada tanto na sua consulta quanto no conteúdo recuperado. É assim que o Q&A no Vault funciona.

**Vector Store / Índice**
Um banco de dados que armazena suas notas como vetores matemáticos (embeddings) para que possam ser pesquisadas pelo significado. Pense nisso como um índice inteligente que entende o contexto das suas notas, não apenas suas palavras-chave.

---

## Próximos Passos

- [Interface de Chat](chat-interface.pt-BR.md) — Aprenda sobre modos, histórico e configurações
- [Provedores de LLM](llm-providers.pt-BR.md) — Configure seu provedor de IA preferido
- [Contexto e Menções](context-and-mentions.pt-BR.md) — Controle qual contexto a IA vê
- [Busca no Vault e Indexação](vault-search-and-indexing.pt-BR.md) — Configure a busca semântica em suas notas
