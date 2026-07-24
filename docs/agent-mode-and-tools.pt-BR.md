# Modo Agente e Ferramentas

O Modo Agente no Copilot permite que a IA tome ações autônomas em seu vault, como ler notas, criar ou editar arquivos, realizar buscas semânticas e pesquisar na web.

---

## O que é o Modo Agente?

No Modo Agente (disponível no modo **Copilot Plus**), a IA não apenas responde com texto, mas executa um loop de pensamento e ação. Ela pode decidir usar uma ou mais ferramentas para responder à sua solicitação com precisão.

---

## Ferramentas Disponíveis (13 Ferramentas)

| Ferramenta | Descrição |
|---|---|
| `view_file` | Lê o conteúdo de uma nota específica |
| `write_file` | Cria uma nova nota ou substitui completamente uma nota existente |
| `edit_file` | Faz edições cirúrgicas em seções específicas de uma nota |
| `append_file` | Adiciona conteúdo ao final de uma nota |
| `list_dir` | Lista arquivos em uma pasta do vault |
| `search_vault` | Realiza busca semântica em todo o vault |
| `search_lexical` | Realiza busca por palavras-chave exatas (FTS) |
| `web_search` | Realiza buscas na web para obter dados atualizados |
| `fetch_url` | Extrai e lê o conteúdo de uma página web |
| `get_current_time` | Obtém a data e hora atual do sistema |
| `run_command` | Executa comandos permitidos do Obsidian |
| `remember` | Salva fatos ou preferências no sistema de memória |
| `recall` | Recupa memórias salvas sobre o usuário |

---

## Permissões e Segurança

- **Aprovações**: Ferramentas que modificam arquivos exigem sua confirmação por padrão, garantindo total controle sobre as alterações no vault.
- **Modo Somente Leitura**: Você pode desativar as ferramentas de escrita nas configurações para permitir apenas consultas e leituras.
