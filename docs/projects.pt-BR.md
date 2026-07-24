# Projetos

Projetos são espaços de trabalho focados de IA. Cada projeto tem seu próprio modelo, prompt de sistema, fontes de contexto e histórico de chat completamente isolado. Use projetos para manter conversas de IA separadas por cliente, tópico ou área de trabalho.

Projetos suportam **mais de 50 tipos de arquivos** além do markdown, incluindo PDFs, documentos do Word, PowerPoint, Excel, imagens e muito mais — tornando-os ideais para analisar coleções de documentos grandes ou diversas.

> **Nota**: Projetos é um recurso alpha. Pode ter arestas não aparadas e está sujeito a mudanças.

---

## Visão Geral

No chat normal, todas as conversas compartilham as mesmas configurações e modelo. Projetos permitem que você crie espaços de trabalho dedicados com:

- **Um contexto específico** — Notas, pastas, URLs ou vídeos do YouTube específicos aos quais a IA sempre tem acesso
- **Um modelo dedicado** — Diferentes projetos podem usar modelos de IA diferentes
- **Um prompt de sistema personalizado** — Cada projeto pode ter suas próprias instruções para a IA
- **Histórico de chat isolado** — Conversas em um projeto não se misturam com conversas em outro

**Exemplos de casos de uso:**
- Um projeto de "Pesquisa" que sempre tem suas notas de pesquisa como contexto
- Um projeto "Trabalho para Clientes" com um prompt de sistema específico e acesso a notas relacionadas a clientes
- Um projeto de "Aprendizado" com URLs de vídeos do YouTube para materiais de estudo

---

## Criando um Projeto

1. Abra o painel de chat
2. Clique no seletor de modo na parte superior do chat
3. Selecione **Projetos (alpha)**
4. Clique em **New Project** (ou no botão `+`)
5. Preencha os detalhes do projeto e salve

---

## Configuração do Projeto

Cada projeto possui as seguintes configurações:

### Nome
Um nome curto para o projeto. Aparece na lista de projetos.

### Descrição
Uma descrição opcional sobre o propósito do projeto.

### Modelo
Escolha qual modelo de IA usar para este projeto. As opções disponíveis dependem de quais modelos você ativou.

### Configurações do Modelo
Substitua a temperatura padrão e o máximo de tokens especificamente para este projeto.

### Prompt do Sistema
Defina um prompt de sistema personalizado para este projeto. Ele substitui (ou complementa) o padrão global. Veja [Prompts do Sistema](system-prompts.pt-BR.md) para detalhes.

---

## Fontes de Contexto

Os projetos permitem que você pré-carregue contexto que está sempre disponível no chat do projeto.

### Inclusões e Exclusões de Arquivos

Especifique quais notas ou pastas incluir no contexto deste projeto:

- **Inclusões**: Apenas estas notas/pastas estão disponíveis para busca e contexto
- **Exclusões**: Estas notas/pastas são excluídas do contexto

Isso restringe o conhecimento da IA a apenas as notas relevantes ao seu projeto.

### URLs da Web

Adicione URLs de páginas da web que são buscadas e incluídas como contexto para todas as conversas neste projeto. Útil para documentação, páginas de referência ou recursos web que você consulta frequentemente.

### URLs do YouTube

Adicione URLs de vídeos do YouTube cujas transcrições são carregadas no contexto para todas as conversas.

---

## Trabalhando em um Projeto

### Alternando Projetos

Use o seletor de projetos na parte superior do painel de chat para alternar entre projetos. Ao alternar, o histórico de chat é limpo e o contexto do novo projeto é carregado.

### Histórico de Chat Isolado

Cada projeto mantém seu próprio histórico de chat, completamente separado de outros projetos e do chat regular (não pertencente a um projeto). As conversas não vazam entre projetos.

### Carregamento de Contexto

Quando você abre um projeto, o Copilot carrega o contexto configurado (notas, URLs, etc.) automaticamente. Para projetos grandes com muitas notas, isso pode levar um momento.

---

## Gerenciamento da Lista de Projetos

Vá para o seletor de projetos para gerenciar seus projetos:

- **Ordenar**: Projetos podem ser ordenados pelo uso mais recente ou alfabeticamente
- **Editar**: Clique no ícone de edição para alterar as configurações de um projeto
- **Excluir**: Remova a entrada do projeto da lista (os arquivos de conversa salvos no seu vault não são excluídos)

Estratégia de ordenação: **Configurações → Copilot → Basic → Project list sort strategy**

---

## Limitações

Como um recurso alpha, os projetos possuem algumas limitações conhecidas:

- Fontes de contexto grandes (muitas notas ou arquivos grandes) podem tornar o carregamento de contexto mais lento
- O carregamento de contexto na troca de projeto é síncrono — a IA não fica disponível até que o carregamento seja concluído
- Alguns recursos disponíveis no modo Plus regular podem se comportar de forma diferente em projetos
- O comportamento de compactação automática é o mesmo do chat regular

---

## Relacionado

- [Interface de Chat](chat-interface.pt-BR.md) — Visão geral dos modos de chat, comportamento de novo chat, histórico
- [Prompts do Sistema](system-prompts.pt-BR.md) — Prompts de sistema personalizados para projetos
- [Contexto e Menções](context-and-mentions.pt-BR.md) — Como o contexto funciona
- [Copilot Plus e Auto-Hospedagem](copilot-plus-and-self-host.pt-BR.md) — Recursos do Plus
