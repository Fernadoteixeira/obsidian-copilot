# Interface de Chat

O painel de chat do Copilot é a principal maneira de interagir com a IA no Obsidian. Este guia cobre tudo sobre a UI de chat: modos, controles de mensagem, histórico, configurações e recursos avançados como a compactação automática.

---

## Modos de Chat

O Copilot oferece quatro modos. Você pode alternar entre eles usando o seletor de modo na parte superior do painel de chat.

### Chat

Conversa de propósito geral. Bom para escrita, brainstorming, resumos ou qualquer tarefa em que você queira conversar com uma IA. Sua nota aberta e o texto selecionado são incluídos automaticamente como contexto.

### Q&A no Vault (Básico)

Faça perguntas sobre o conteúdo do seu vault. O Copilot usa busca lexical (correspondência de palavras-chave) para encontrar notas relevantes e as passa como contexto para a IA. Não requer indexação. Bom para perguntas rápidas sobre suas notas.

### Copilot Plus

O modo mais poderoso. Requer uma licença do [Copilot Plus](copilot-plus-and-self-host.pt-BR.md). Combina Chat e Q&A no Vault com um agente autônomo que pode:

- Pesquisar seu vault e a web
- Ler e editar notas
- Lembrar de coisas entre conversas
- Usar um conjunto crescente de ferramentas automaticamente

### Projetos (alpha)

Espaços de trabalho focados com seu próprio contexto, modelo, prompt de sistema e histórico de chat isolado. Útil para manter conversas de IA separadas por projeto. Veja [Projetos](projects.pt-BR.md) para detalhes.

---

## Enviando Mensagens

Digite sua mensagem na caixa de entrada na parte inferior do painel de chat e pressione **Enter** para enviar (ou **Shift+Enter** para adicionar uma nova linha). Você pode alterar a tecla de envio em Configurações → Básico → **Default Send Shortcut**.

Enquanto a IA está gerando uma resposta, um botão **Parar** aparece. Clique nele para interromper o streaming a qualquer momento.

### Referenciando Notas no Texto

Você pode mencionar notas específicas diretamente na sua mensagem usando a sintaxe de colchetes duplos:

```
[[Título da Nota]]
```

O Copilot adiciona o conteúdo da nota à sua mensagem como contexto em segundo plano. Isso é diferente das @-menções — é digitado diretamente no texto da sua mensagem.

### Botões de Mensagem do Usuário

Cada mensagem que você envia tem botões de ação que aparecem ao passar o mouse:

- **Editar** — Modifique seu prompt. Pressione Enter para reenviar a mensagem editada para a IA.
- **Copiar** — Copie o texto da mensagem para a área de transferência
- **Excluir** — Remova esta mensagem da conversa

### Botões de Mensagem da IA

Cada resposta da IA possui botões de ação:

- **Inserir no cursor** — Insere a resposta da IA na posição do cursor na nota ativa
- **Substituir no cursor** — Substitui o texto selecionado na sua nota pela resposta da IA
- **Copiar** — Copia a resposta para a área de transferência
- **Regenerar** — Pede à IA para gerar uma nova resposta para a mesma mensagem
- **Excluir** — Remove esta resposta da conversa

---

## Histórico de Chat

### Salvamento Automático

Por padrão, o Copilot salva automaticamente suas conversas como arquivos markdown no seu vault. Cada chat salvo aparece na pasta `copilot/copilot-conversations/`.

Você pode desativar o salvamento automático em Configurações → Básico. Quando você inicia um novo chat, qualquer conversa não salva é salva automaticamente.

### Formato do Nome do Arquivo de Chat

O modelo de nome de arquivo controla como os chats salvos são nomeados. O padrão é:

```
{$topic}@{$date}_{$time}
```

Onde:

- `{$topic}` — Um título gerado por IA (ou as primeiras palavras da sua primeira mensagem se os títulos por IA estiverem desativados)
- `{$date}` — Data no formato AAAA-MM-DD
- `{$time}` — Hora no formato HH-MM-SS

Todas as três variáveis são obrigatórias. Você pode personalizar o formato em Configurações → Básico → **Conversation note name**.

### Títulos Gerados por IA

Quando **Generate AI chat title on save** está ativado (padrão), o Copilot pede à IA para gerar um título curto e descritivo para a conversa ao salvar. Quando desativado, as primeiras 10 palavras da sua primeira mensagem são usadas em vez disso.

### Carregando Chats Anteriores

Clique no **ícone de relógio/histórico** na barra de ferramentas do painel de chat para abrir a lista de Histórico de Chat. Você pode:

- Navegar por conversas anteriores
- Clicar em uma conversa para carregá-la e continuar de onde parou
- Excluir conversas que você não precisa mais

A lista de histórico pode ser ordenada por mais recente ou alfabeticamente.

---

## Configurações por Sessão (Ícone de Engrenagem)

Clique no **ícone de engrenagem** dentro do painel de chat para abrir as configurações por sessão. Estas se aplicam apenas à conversa atual e são redefinidas quando você inicia um novo chat:

- **Prompt do sistema** — Sobrescreve o prompt de sistema padrão para esta sessão
- **Temperatura** — Controla a aleatoriedade (0 = determinístico, 1 = criativo)
- **Max tokens** — Comprimento máximo da resposta da IA

---

## Contador de Tokens

O Copilot mostra um indicador de contagem de tokens na parte inferior do chat. Isso estima quantos tokens estão sendo usados pelo seu contexto atual. Útil para saber quando você está se aproximando dos limites de contexto.

---

## Compactação Automática

Quando uma conversa fica muito longa, ela pode exceder a janela de contexto do modelo. A compactação automática resume automaticamente a parte mais antiga da conversa e a substitui por um resumo comprimido, permitindo que você continue conversando sem perder o fio do que foi discutido.

O limite é configurado em Configurações → Básico → **Auto-compact threshold**, cujo padrão é 128.000 tokens. Faixa válida: 64.000–1.000.000 tokens.

Quando a compactação automática é acionada, você verá um indicador "Compactando" no chat. A conversa continua normalmente — as mensagens mais antigas são substituídas por um resumo, então a IA ainda entende o histórico mesmo que você não possa mais rolar para ver as mensagens originais.

---

## Prompts Sugeridos

Ao iniciar um novo chat, o Copilot pode mostrar prompts sugeridos com base na sua nota ativa ou conversas anteriores. Você pode ativar ou desativar isso em Configurações → Básico → **Show suggested prompts**.

## Notas Relevantes

O Copilot pode exibir uma lista de notas relacionadas à sua nota ativa atual no painel de chat. Isso ajuda a encontrar notas que você pode querer referenciar sem precisar buscá-las manualmente.

Ative em **Configurações → Copilot → Básico → Relevant Notes** (ativado por padrão).

## Salvando um Chat Manualmente

Se o salvamento automático estiver desativado, ou se você quiser salvar durante a conversa, clique no botão **Save Chat as Note** acima da caixa de entrada do chat. Isso salva a conversa atual na sua pasta de salvamento configurada.

---

## Comportamento de Novo Chat

Clique no **ícone de lápis/novo chat** para iniciar uma conversa nova. Isso:

1. Salva a conversa atual (se o salvamento automático estiver ativado)
2. Limpa a janela de chat
3. Redefine o contexto para sua nota ativa atual

Você também pode usar a paleta de comandos: **New Copilot Chat**.

---

## Relacionado

- [Contexto e Menções](context-and-mentions.pt-BR.md) — Controle qual contexto a IA vê
- [Prompts do Sistema](system-prompts.pt-BR.md) — Personalize o comportamento da IA com prompts de sistema
- [Modo Agente e Ferramentas](agent-mode-and-tools.pt-BR.md) — O que o modo Plus pode fazer
- [Projetos](projects.pt-BR.md) — Espaços de trabalho isolados com históricos separados
