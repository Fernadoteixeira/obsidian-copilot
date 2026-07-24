# Contexto e Menções

O Copilot usa **contexto** para fornecer à IA informações sobre suas notas, texto selecionado, conteúdo da web e mais. Você pode controlar exatamente qual contexto a IA vê usando contexto automático, @-menções e comandos manuais.

---

## Contexto Automático

### Nota Ativa

Por padrão, o conteúdo da sua nota atualmente aberta é incluído automaticamente em cada mensagem que você envia. Isso significa que você pode perguntar coisas como:

- "Resuma esta nota"
- "Quais são os itens de ação aqui?"
- "Adicione uma seção de conclusão"

Para desativar o contexto automático de nota: **Configurações → Copilot → Básico → Auto-add active note to context** (desative).

### Aba Web Ativa (Apenas Desktop)

Se você tiver o Visualizador Web do Copilot aberto ao lado de suas notas, o conteúdo da aba web ativa no momento é incluído automaticamente como contexto (rotulado `{activeWebTab}`). Isso permite que você peça à IA para ajudá-lo a trabalhar com conteúdo web.

### Texto Selecionado

Se você destacar um texto em uma nota e então digitar no chat, o texto selecionado é incluído automaticamente como contexto. Isso é útil para perguntar sobre ou transformar uma parte específica de uma nota.

Você pode ativar/desativar a adição automática de seleção em **Configurações → Copilot → Básico → Auto-add selection to context**.

### Imagens em Markdown

Se sua nota contém imagens (ex: `![[screenshot.png]]`), e você estiver usando um modelo com capacidade de **Visão**, essas imagens são automaticamente incluídas no contexto. O Copilot enviará os dados da imagem para a IA para que ela possa ver e descrever a imagem.

Para controlar esse comportamento: **Configurações → Copilot → Básico → Pass markdown images to AI**.

---

## @-Menções

Digite `@` na entrada do chat para mencionar e incluir itens específicos como contexto.

### @note — Incluir uma Nota Específica

Digite `@` seguido do título da nota para adicionar uma nota ao contexto:

```
@Minhas Notas de Reunião me diga o que foi decidido nesta reunião
```

O conteúdo completo da nota é incluído na solicitação.

### @folder — Incluir uma Pasta de Notas

Digite `@` seguido do nome de uma pasta para incluir todas as notas daquela pasta:

```
@Projetos/ quais tarefas ainda estão pendentes?
```

### @tags — Incluir Notas por Tag

Use `#` após `@` para incluir todas as notas com uma tag específica:

```
@#trabalho/projeto resuma o status do projeto de trabalho
```

### @URL — Incluir uma Página Web

Cole uma URL ou digite `@https://...` para buscar e incluir o conteúdo de uma página web:

```
@https://example.com/artigo resuma este artigo
```

O processamento de URL requer Copilot Plus. URLs do YouTube são tratadas de forma especial — o Copilot buscará a transcrição do vídeo automaticamente.

### Menções de Ferramentas

Estas @-menções especiais acionam explicitamente ferramentas no modo Copilot Plus:

| Menção | O que ela faz |
|---|---|
| `@vault` | Pesquisa suas notas do vault por informações relevantes |
| `@websearch` ou `@web` | Pesquisa na internet |
| `@composer` | Cria ou edita uma nota |
| `@memory` | Acessa ou atualiza sua memória |

Exemplo:

```
@vault o que eu escrevi sobre aprendizado de máquina no mês passado?
@websearch quais são as últimas mudanças no ecossistema de empacotamento do Python?
```

---

## Adicionando Contexto Manualmente

### Adicionar Seleção ao Contexto do Chat

Use a paleta de comandos: **Add selection to chat context**

Destaca o texto selecionado e o adiciona ao chat como contexto sem enviar uma mensagem. Útil quando você quer acumular contexto antes de enviar.

### Adicionar Seleção Web ao Contexto do Chat

Use a paleta de comandos: **Add web selection to chat context**

Funciona de forma semelhante, mas captura texto selecionado do Visualizador Web. Disponível apenas no desktop.

### Adicionando um PDF como Contexto (Copilot Plus)

Clique no botão **+ Adicionar contexto** acima da entrada do chat para anexar um arquivo PDF. O PDF é convertido em texto e incluído como contexto para sua mensagem.

### Adicionando uma Imagem como Contexto

Arraste uma imagem diretamente para a caixa de entrada do chat, ou clique no **botão de imagem** no canto inferior direito da entrada do chat. A imagem é enviada para a IA se o modelo selecionado suportar a capacidade de **Visão**.

---

## Indicadores de Contexto

Quando itens de contexto são adicionados à sua mensagem, o Copilot mostra pequenas pílulas ou badges na área de entrada do chat mostrando o que está incluído (ex: o nome da nota, uma URL, uma tag). Isso ajuda a confirmar exatamente o que a IA verá.

---

## Comportamento de Contexto por Modo

| Tipo de Contexto | Chat | Q&A no Vault | Copilot Plus |
|---|---|---|---|
| Nota ativa | Sim (auto) | Sim (auto) | Sim (auto) |
| Texto selecionado | Sim (auto) | Sim (auto) | Sim (auto) |
| @note / @folder | Sim | Sim | Sim |
| Processamento de @URL | Apenas Copilot Plus | Apenas Copilot Plus | Sim |
| Busca @vault | Sim (explícito) | Auto | Auto |
| @websearch | Não | Não | Sim |
| Imagens (visão) | Sim | Sim | Sim |
| Aba web ativa | Apenas desktop | Apenas desktop | Apenas desktop |

---

## Relacionado

- [Interface de Chat](chat-interface.pt-BR.md) — Como o painel de chat funciona
- [Modo Agente e Ferramentas](agent-mode-and-tools.pt-BR.md) — Mais sobre @vault e @websearch
- [Busca no Vault e Indexação](vault-search-and-indexing.pt-BR.md) — Como a busca no vault funciona
