# Interface de Chat

 A interface de chat do Copilot é seu principal ponto de interação com a IA no Obsidian. Ela opera como um painel lateral ou aba do editor e oferece múltiplos modos, gerenciamento de histórico de conversas e configurações por conversa.

---

## Modos de Chat

 O Copilot suporta 4 modos principais de chat, selecionáveis na parte superior do painel de chat:

| Modo | Descrição | Casos de Uso |
|---|---|---|
| **Chat** | Conversa geral com IA sem busca de notas | Perguntas gerais, rascunhos, tarefas de escrita, código |
| **Vault QA** | Respostas fundamentadas nas suas notas usando busca semântica (RAG) | Fazer perguntas sobre seu conhecimento, resumir notas de tópicos |
| **Copilot Plus** | Modo avançado com agente autônomo e execução de ferramentas | Automação complexa, edição de notas, busca na web, fluxos de trabalho |
| **Projects** | Espaços de trabalho isolados com contexto e histórico próprios | Projetos dedicados, pesquisas separadas, fluxos de trabalho específicos |

---

## Enviando Mensagens

- Digite na caixa de texto na parte inferior da janela de chat.
- Pressione **Enter** (padrão) para enviar a mensagem.
- Pressione **Shift+Enter** para adicionar uma nova linha.
- Você pode inverter esse comportamento em Configurações → Copilot → Básico → **Default Send Shortcut**.

---

## Histórico de Chat

- **Novas Conversas**: Clique no botão **+ (Novo Chat)** no cabeçalho do chat para iniciar uma nova sessão limpa.
- **Alternar Histórico**: Clique no ícone de **Histórico** no cabeçalho do chat para visualizar e reabrir conversas anteriores.
- **Excluir Histórico**: Conversas antigas podem ser excluídas individualmente da lista de histórico.

---

## Recursos de Mensagem

- **Copiar**: Copie a resposta da IA para a área de transferência.
- **Inserir na Nota**: Insira a resposta diretamente no documento ativo na posição do cursor.
- **Regenerar**: Peça à IA para tentar responder novamente a última mensagem.
- **Editar Mensagem**: Edite sua mensagem anterior para ajustar a pergunta.

---

## Compactação Automática (Auto-Compact)

Quando as conversas se tornam muito longas e se aproximam do limite da janela de contexto do modelo, o Copilot pode compactar automaticamente o histórico anterior em um resumo concentrado para economizar tokens sem perder o contexto da conversa.
