# Comandos Personalizados

Comandos personalizados são prompts de IA predefinidos que você define uma vez e reutiliza em qualquer nota ou texto selecionado. Eles são armazenados como arquivos markdown no seu vault e podem ser acionados a partir do menu de contexto (clique direito), da paleta de comandos ou como comandos slash no chat.

---

## Visão Geral

Um comando personalizado é como um modelo de prompt. Você escreve uma instrução (com variáveis opcionais) e a salva. A partir daí, você pode aplicá-la a qualquer nota ou texto selecionado com um único clique.

**Exemplos do que você pode criar:**
- "Resuma esta nota em tópicos"
- "Extraia todos os itens de ação como uma lista de tarefas"
- "Reescreva isso em um tom mais formal"
- "Traduza para espanhol"
- "Crie uma Nota Rápida a partir disso"

---

## Criando um Comando Personalizado

### A partir das Configurações

1. Vá em **Configurações → Copilot → Command**
2. Clique em **Add new command**
3. Preencha os campos:
   - **Nome** — Como o comando é chamado (também se torna seu ID)
   - **Prompt** — A instrução a ser enviada para a IA
   - **Mostrar no menu de contexto** — Se ele aparece ao clicar com o botão direito em texto de uma nota
   - **Modelo** — Opcional: usar um modelo específico para este comando (usa o modelo de chat atual por padrão)
4. Salve

### A partir da Paleta de Comandos

Você também pode criar um comando instantaneamente:

1. Abra a paleta de comandos (`Ctrl/Cmd+P`)
2. Execute **Add new custom command**
3. Um formulário será aberto para preencher os detalhes do comando

---

## Variáveis de Modelo de Prompt

Dentro do seu prompt, você pode usar variáveis que são substituídas por conteúdo real quando o comando é executado:

| Variável | O que ela insere |
|---|---|
| `{}` ou `{selected_text}` | O texto atualmente selecionado no editor |
| `{activeNote}` | O conteúdo completo da nota atualmente ativa |
| `{[[Título da Nota]]}` | O conteúdo de uma nota específica pelo título |
| `{CaminhoDaPasta}` | Todas as notas dentro de uma pasta específica |
| `{#tag1, #tag2}` | Todas as notas com qualquer uma das tags especificadas |

> **Importante**: As tags em `{#tag1, #tag2}` devem estar nas **propriedades (frontmatter)** da nota, não como tags inline no corpo da nota.

**Exemplo — gerador de quiz usando duas variáveis:**
```
Come up with multiple choice questions using {activeNote}, and follow
the format of {[[Quiz Template]]} to start a quiz session.

Ask one question at a time, stop and wait for the user.
After the user answers, provide the correct answer and explanation.
Repeat until the user says STOP.
```

**Exemplo — comparação usando notas específicas:**
```
Compare my notes on {[[Product Roadmap]]} and {[[Competitor Analysis]]} and identify gaps.
```

**Exemplo — atuando no texto selecionado:**
```
Rewrite this in a more formal tone: {selected_text}
```

A substituição de variáveis deve estar ativada em **Configurações → Copilot → Command → Enable custom prompt templating** (ativado por padrão).

---

## Usando Comandos

### A partir do Menu de Contexto (Clique Direito)

Se um comando tem **Show in context menu** ativado:
1. Selecione algum texto em uma nota (opcional)
2. Clique com o botão direito para abrir o menu de contexto
3. Passe o mouse sobre **Copilot** → selecione seu comando
4. A IA processa sua seleção ou nota e mostra o resultado

### A partir da Paleta de Comandos

1. Selecione texto ou abra a nota com a qual deseja trabalhar
2. Abra a paleta de comandos (`Ctrl/Cmd+P`)
3. Execute **Apply custom command**
4. Escolha seu comando da lista

### Como um Comando Slash no Chat

Dentro da entrada do chat, digite `/` seguido do nome do comando para executá-lo:

```
/resumir
```

O comando é executado no contexto da sua sessão de chat atual e nota ativa.

> **Nota**: A menção `@composer` (para edição de notas por IA) requer Copilot Plus. Nos modos gratuitos, `@composer` não estará disponível.

---

## Gerenciando Comandos

Vá em **Configurações → Copilot → Command** para gerenciar todos os seus comandos personalizados:

- **Editar** — Clique no ícone de edição ao lado de qualquer comando
- **Reordenar** — Arraste comandos para alterar sua ordem (afeta o menu de contexto e a lista de comandos)
- **Duplicar** — Copie um comando existente como ponto de partida
- **Excluir** — Remova um comando permanentemente
- **Estratégia de ordenação** — Escolha como os comandos são ordenados: manualmente, por uso recente ou alfabeticamente

### Pasta de Prompts Personalizados

Os comandos são armazenados como arquivos markdown no seu vault. A pasta padrão é `copilot/copilot-custom-prompts/`. Você pode alterar isso em **Configurações → Copilot → Básico → Custom prompts folder**.

---

## Comando Rápido

**Comando Rápido** abre uma janela modal onde você pode executar um prompt de IA avulso no seu texto selecionado sem criar um comando permanente.

- **Acionamento**: Paleta de comandos → **Trigger quick command**
- **Atribuir um atalho**: Configurações → Atalhos de teclado → pesquise "Trigger quick command"
- **Comportamento**: Abre uma entrada de prompt, permite escolher um modelo e se deve incluir o contexto da nota, então executa o prompt na sua seleção

---

## Pergunta Rápida

**Pergunta Rápida** é um painel flutuante inline que aparece na posição do cursor no seu editor. É projetado para consultas rápidas de IA em contexto enquanto você escreve.

- **Acionamento**: Paleta de comandos → **Quick Ask** (ou atribua um atalho, recomendado: `Ctrl/Cmd+K`)
- **Não disponível no Modo Source** — Funciona em Live Preview e modo de Leitura
- **Como funciona**: Uma pequena entrada aparece exatamente onde seu cursor está. Digite sua pergunta, pressione Enter, e a resposta aparece inline.

Pergunta Rápida é ótima para coisas como "reformule esta frase", "o que este termo significa?" ou "sugira três alternativas".

---

## Relacionado

- [Interface de Chat](chat-interface.pt-BR.md) — Usando comandos slash no chat
- [Contexto e Menções](context-and-mentions.pt-BR.md) — Como o contexto é passado para os comandos
- [Modo Agente e Ferramentas](agent-mode-and-tools.pt-BR.md) — Edição de notas mais poderosa com @composer
