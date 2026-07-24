# Prompts do Sistema

Um prompt de sistema é um conjunto de instruções que você dá à IA que molda como ela se comporta em todas as conversas. Pense nisso como um briefing persistente: "Você é um assistente que me ajuda com redação acadêmica. Sempre cite fontes. Responda em inglês formal."

---

## Visão Geral

O Copilot tem duas camadas de prompts de sistema:

1. **Prompt de sistema embutido** — Sempre ativo. Define comportamentos principais específicos do Obsidian (como formatar links do Obsidian, como lidar com referências de notas, etc.)
2. **Prompt de sistema personalizado** — Opcional. Você pode escrever suas próprias instruções que são anexadas ao prompt embutido.

---

## Prompt de Sistema Embutido

O prompt embutido está sempre ativo e não pode ser editado. Ele diz à IA:

- Que ela é o "Obsidian Copilot" — uma IA integrada ao Obsidian
- Como formatar links internos do Obsidian: `[[Título da Nota]]`
- Como formatar links de imagens do Obsidian: `![[imagem.png]]`
- Como formatar matemática em LaTeX: use `$...$` e não `\[...\]`
- Como lidar com menções @vault e @tool
- Para usar `-` para tópicos (não `*`)
- Para responder no idioma da consulta do usuário
- Para tratar "nota" como referência a uma nota do Obsidian

Este prompt garante que a saída do Copilot seja formatada corretamente para o Obsidian e tenha consciência do seu contexto.

> **Aviso**: Desativar o prompt embutido pode quebrar recursos como Q&A no Vault, memória e ferramentas do agente. Evite desativá-lo, a menos que tenha um motivo específico.

---

## Prompts de Sistema Personalizados

Prompts de sistema personalizados permitem adicionar suas próprias instruções sobre o prompt embutido.

### Onde Eles São Armazenados

Prompts de sistema personalizados são armazenados como arquivos markdown no seu vault, na pasta:
```
copilot/system-prompts/
```

Você pode alterar esta pasta em **Configurações → Copilot → Avançado → System Prompts Folder Name**.

### Criando um Prompt de Sistema

#### Pelas Configurações

1. Vá em **Configurações → Copilot → Avançado**
2. Em **User System Prompt**, clique no botão `+`
3. Insira um título para o prompt (ex: "Redação Acadêmica")
4. Um novo arquivo markdown é criado na sua pasta de prompts de sistema
5. Abra o arquivo e escreva suas instruções

#### Pela Pasta de Prompts de Sistema

Crie qualquer arquivo `.md` na pasta `copilot/system-prompts/`. O nome do arquivo (sem `.md`) torna-se o título do prompt.

### Escrevendo Bons Prompts de Sistema

Dicas para prompts de sistema eficazes:

- **Seja específico**: "Sempre responda em tópicos com não mais de 5 itens" é melhor do que "seja conciso"
- **Defina uma persona**: "Você é um especialista em ciência cognitiva me ajudando a construir um Zettelkasten"
- **Defina o formato de saída**: Especifique se você quer cabeçalhos, listas, prosa ou blocos de código
- **Defina o idioma**: "Sempre responda em francês" se você quiser saída não em inglês
- **Limite o escopo**: "Apenas responda perguntas relacionadas às minhas notas de pesquisa sobre ciência climática"

**Exemplo de prompt de sistema:**
```markdown
Você é um assistente de Zettelkasten me ajudando a construir uma base de conhecimento.
- Sempre conecte novas ideias a notas existentes quando possível
- Sugira até 3 conceitos relacionados por resposta
- Formate todas as sugestões de notas como [[Título da Nota]]
- Mantenha respostas concisas — menos de 200 palavras
```

---

## Definindo um Padrão Global

Você pode definir um dos seus prompts personalizados como o padrão global — ele será usado para todas as novas sessões de chat:

1. Vá em **Configurações → Copilot → Avançado**
2. Em **Default System Prompt**, selecione seu prompt na lista suspensa
3. Qualquer nova conversa começará com este prompt ativo

Para parar de usar um padrão personalizado, selecione **None (use built-in prompt)** na lista suspensa.

---

## Substituição por Sessão (Ícone de Engrenagem)

Você pode substituir o prompt do sistema apenas para a conversa atual:

1. Clique no **ícone de engrenagem** na barra de ferramentas do painel de chat
2. Selecione um prompt de sistema diferente (ou digite um prompt rápido diretamente)
3. Isso se aplica apenas à sessão atual e é redefinido quando você inicia um novo chat

---

## Como os Prompts se Combinam

Quando você tem um prompt personalizado ativo:

1. O prompt embutido do Copilot é executado primeiro
2. Seu prompt personalizado é anexado depois dele

Ambos os conjuntos de instruções ficam ativos simultaneamente. Suas instruções personalizadas podem refinar, restringir ou estender o comportamento padrão, mas não o substituem.

---

## Prompts de Sistema por Projeto

Cada [Projeto](projects.pt-BR.md) pode ter seu próprio prompt de sistema, independente do padrão global. Configure isso nas configurações do projeto em **System Prompt**.

---

## Relacionado

- [Interface de Chat](chat-interface.pt-BR.md) — Configurações da engrenagem por sessão
- [Projetos](projects.pt-BR.md) — Prompts de sistema por projeto
- [Primeiros Passos](getting-started.pt-BR.md) — Configuração inicial
