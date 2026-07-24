# Solução de Problemas e FAQ

Este guia aborda erros comuns, problemas específicos de provedores, problemas de desempenho e perguntas frequentes.

---

## Primeiros Passos para Qualquer Problema

Antes de mergulhar em correções específicas, tente estas etapas primeiro:

1. **Verifique se você está na versão mais recente** do Copilot nos Plugins Comunitários
2. **Desative outros plugins** temporariamente para descartar conflitos
3. **Ative o Modo de Depuração (Debug Mode)** em Configurações → Copilot → Avançado → Debug Mode
4. **Abra o console do desenvolvedor**: `Cmd+Option+I` no Mac, `Ctrl+Shift+I` no Windows

---

## Erros Comuns

### "API key not set" ou "No API key configured"

**Causa**: O modelo que você selecionou não tem uma chave de API válida para seu provedor.

**Solução**:
1. Vá em **Configurações → Copilot → Basic → Set Keys**
2. Insira a chave de API para o provedor que seu modelo usa
3. Se você não tiver certeza de qual provedor um modelo usa, verifique **Configurações → Copilot → Model** — cada modelo mostra seu provedor

### Erros de Limite de Taxa (Rate Limit)

**Causa**: Você enviou muitas solicitações para a API em um curto período.

**Solução**:
- Aguarde um minuto e tente novamente
- Se isso acontecer frequentemente durante a indexação, reduza **Embedding Requests per Minute** nas configurações de QA (tente 10–20)
- Considere fazer upgrade do seu plano de API com o provedor

### Erros de Conexão / Tempo Limite (Timeout)

**Causa**: Problema de rede, interrupção do provedor, ou a solicitação demorou muito.

**Solução**:
- Verifique sua conexão com a internet
- Tente novamente após alguns segundos
- Verifique a página de status do provedor para interrupções
- Se usar um modelo local (Ollama/LM Studio), certifique-se de que o servidor local está rodando

### "Copilot index does not exist"

**Causa**: Você está tentando usar o Q&A no Vault ou a busca semântica, mas o vault ainda não foi indexado.

**Solução**:
1. Certifique-se de ter um modelo de embedding configurado com uma chave de API válida (**Configurações → Copilot → QA → Embedding Model**)
2. Execute **Paleta de comandos → Index (refresh) vault**
3. Aguarde a conclusão da indexação

### "RangeError: invalid string length"

**Causa**: Seu vault é grande demais para uma única partição de índice.

**Solução**: Aumente o número de partições em **Configurações → Copilot → QA → Partitions**. Uma boa meta é manter o primeiro arquivo de índice com menos de ~400 MB (verifique a pasta `.obsidian/` para os arquivos `copilot-index` e seus tamanhos).

### Resposta Fica Cortada

**Causa**: A resposta da IA atingiu o limite de Máximo de Tokens (Max Tokens).

**Solução**: Aumente **Max Tokens** em Configurações → Copilot → Model (ou no ícone de engrenagem da sessão). O padrão é 6.000 tokens.

### Notas Não Encontradas na Busca

Mesmo após a indexação, as notas relevantes não estão sendo retornadas? Tente:
1. Mude para o modo **Copilot Plus** e use `@vault` para uma busca mais poderosa
2. Tente o **modelo de embedding multilíngue** para notas que não estão em inglês
3. Revise suas inclusões/exclusões de QA para confirmar se as notas não estão filtradas
4. Execute **List all indexed files** (comando de depuração) para verificar se as notas estão indexadas
5. Execute **Force reindex vault** para uma reconstrução limpa

### "Non-markdown files are only available in Copilot Plus"

**Causa**: Você tentou usar um PDF, imagem ou outro arquivo que não seja markdown como contexto em um modo gratuito.

**Solução**: Mude para o modo Copilot Plus, ou converta o arquivo para markdown manualmente.

---

## Problemas Específicos do Provedor

### Ollama

**Problema**: "Connection refused" ou modelo não respondendo

**Solução**:
- Certifique-se de que o Ollama está rodando: abra um terminal e execute `ollama serve`
- Verifique se o modelo está baixado: `ollama list`
- Verifique se a porta nas configurações do Copilot corresponde (padrão: 11434)
- Em alguns sistemas, o Ollama usa `http://127.0.0.1:11434` em vez de `http://localhost:11434` — tente ambos

### Azure OpenAI

**Problema**: Erros de autenticação ou modelo não encontrado

**Solução**:
O Azure OpenAI requer que todos os quatro campos sejam preenchidos corretamente:
1. API Key
2. Instance Name (nome do seu recurso Azure, ex: `my-azure-openai`)
3. Deployment Name (o nome que você deu à implantação do seu modelo)
4. API Version (ex: `2024-02-01`)

Qualquer campo ausente ou incorreto causará erros.

### Amazon Bedrock

**Problema**: "Model not found" ou acesso negado

**Solução**:
- Sempre use **IDs de perfil de inferência cross-region**, não IDs de modelo simples:
  - ✅ `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
  - ❌ `anthropic.claude-sonnet-4-5-20250929-v1:0`
- Certifique-se de que suas credenciais IAM tenham permissões de acesso ao Bedrock
- Confirme se o modelo está disponível na sua região

### GitHub Copilot

**Problema**: "Token expired" ou falha na autenticação

**Solução**:
- Vá em **Configurações → Copilot → Basic → Set Keys**
- Clique em **Connect GitHub Copilot** para reautenticar via OAuth
- Certifique-se de que sua assinatura do GitHub Copilot esteja ativa

### Google Gemini

**Problema**: "QUOTA_EXCEEDED" ou respostas lentas

**Solução**:
- Verifique sua cota em https://console.cloud.google.com
- Tente mudar para o modelo Flash (mais rápido, cota maior)
- Considere usar o Google via OpenRouter para uma cota unificada

### DeepSeek

**Problema**: A resposta corta ou erros de streaming

**Solução**:
- Modelos de raciocínio da DeepSeek (deepseek-reasoner) podem produzir saídas muito longas; tente aumentar o Max Tokens
- Se você vir erros de streaming, verifique a página de status do DeepSeek
- Tente alternar entre deepseek-chat e deepseek-reasoner

---

## Problemas de Desempenho

### Indexação Lenta

**Causa**: Vault grande com muitas notas, ou configuração de limite de taxa baixa.

**Solução**:
- Verifique **Embedding Requests per Minute** — valores mais altos aceleram a indexação, mas podem causar limites de taxa
- Use exclusões para pular pastas que você não precisa indexar (ex: pastas de arquivo grandes)
- Use o comando incremental **Index (refresh) vault** em vez de Force Reindex quando possível
- Considere o Miyo (auto-hospedado) para indexação local sem limites de taxa de API

### Alto Uso de Memória

**Causa**: Índice de busca lexical grande ou muitos arquivos indexados.

**Solução**:
- Reduza **Lexical Search RAM Limit** em QA (padrão 100 MB, faixa 20–1000 MB)
- Adicione mais pastas às exclusões para reduzir o tamanho do índice
- Em dispositivos móveis, desative completamente a indexação

### Lag na Interface de Usuário

**Causa**: Renderização de muitas mensagens de chat ou uma conversa muito longa.

**Solução**:
- Inicie um novo chat — conversas longas podem tornar a renderização lenta
- O auto-compact irá ser acionado automaticamente em 128.000 tokens para manter conversas gerenciáveis
- Reduza seu limite de auto-compact se estiver enfrentando problemas de desempenho cedo

---

## Problemas de Configuração

### Redefinir Configurações para o Padrão

Se suas configurações ficarem em um estado ruim, você pode redefinir:

1. Vá para **Configurações → Copilot** → encontre a opção de redefinição
2. Ou exclua o arquivo `data.json` da pasta do plugin: `.obsidian/plugins/copilot/data.json`

⚠️ A redefinição limpa todas as suas configurações. As chaves de API mantidas em `data.json` (armazenamento padrão) são removidas, mas as chaves armazenadas no Obsidian Keychain **não** são — para apagá-las, use **Configurações → Copilot → Avançado → API Key Storage → Delete All Keys**. Faça backup de suas chaves primeiro.

### Armazenamento de Chave de API

O Copilot tem duas maneiras de armazenar chaves de API:

- **Armazenamento padrão**: As chaves são salvas em `data.json` em texto simples. Vaults existentes permanecem neste modo até você escolher migrar.
- **Obsidian Keychain**: Novas instalações usam isso por padrão. Você pode mudar um vault existente acessando **Configurações → Copilot → Avançado → API Key Storage** e clicando em **Migrate to Obsidian Keychain**. Após a migração, o `data.json` não contém mais suas chaves.

O Obsidian Keychain é por dispositivo. Se você sincronizar seu vault para outro dispositivo, precisará reinserir as chaves de API lá.

### Modo de Depuração e Logs

Para relatar bugs:

1. **Ative o Debug Mode**: **Configurações → Copilot → Avançado → Debug Mode**
2. **Crie um arquivo de log**: **Configurações → Copilot → Avançado → Create Log File**
3. O arquivo de log abre no seu vault — anexe-o ao seu relatório de bug

---

## Perguntas Frequentes

### Meus dados são privados? O Copilot envia minhas notas para a nuvem?

O Copilot em si não armazena suas notas em nenhum servidor. No entanto, quando você envia uma mensagem, o conteúdo (incluindo qualquer contexto das suas notas) é enviado ao provedor de IA que você configurou (OpenAI, Anthropic, etc.) através da API deles. Cada provedor tem sua própria política de privacidade. Suas notas não são enviadas a lugar nenhum até que você use ativamente o chat.

O sistema de memória armazena dados localmente no seu vault. O histórico de chat é salvo como arquivos markdown no seu vault. Nada é armazenado nos servidores do Copilot, a menos que você use os recursos de nuvem do Copilot Plus.

**Para máxima privacidade**: A API paga do Google Gemini (base do copilot-plus-flash) não usa dados de solicitação da API para treinar seus modelos. Para privacidade local completa, considere usar Ollama ou LM Studio com um modelo local — nada sai da sua máquina. O modo self-host já está disponível para detentores de licenças vitalícias — veja [Copilot Plus e Auto-Hospedagem](copilot-plus-and-self-host.pt-BR.md) para detalhes.

### Posso referenciar uma nota específica no chat?

Sim — use a sintaxe `[[Título da Nota]]` diretamente na sua mensagem. O Copilot adiciona o conteúdo dessa nota como contexto em segundo plano. Você também pode usar menções @. Veja [Contexto e Menções](context-and-mentions.pt-BR.md) para a lista completa de maneiras de adicionar contexto.

### Como faço para o Copilot responder sempre em inglês?

Vá em **Configurações → Copilot → Avançado → Default System Prompt**, crie um prompt personalizado e adicione "Sempre responda em inglês." como instrução. Veja [Prompts do Sistema](system-prompts.pt-BR.md).

### O Copilot consegue entender imagens nas minhas notas?

Sim, mas apenas com modelos que têm capacidade de **Visão** (mostrado por um ícone de visão na lista de modelos). Certifique-se:
1. Você está usando um modelo com capacidade de visão
2. **Configurações → Copilot → Basic → Pass markdown images to AI** está ativado

### Por que o Copilot não consegue ler meu PDF?

- PDFs grandes (mais de 10 MB) devem ser convertidos para markdown primeiro
- No modo Copilot Plus, use **+ Add context** para anexar um PDF — ele será convertido automaticamente
- Para grandes coleções de PDF, o **Modo Projetos** é mais adequado (suporta PDF como contexto nativamente)

### Posso usar o Copilot offline?

Com modelos locais (Ollama ou LM Studio), sim — uma vez que um modelo é baixado, ele roda totalmente offline. Provedores de nuvem (OpenAI, Anthropic, etc.) exigem conexão com a internet.

A busca lexical no vault funciona offline. A busca semântica requer um modelo de embedding, que também pode precisar de conexão com a internet, a menos que você esteja usando um provedor local ou o Miyo.

### Qual a diferença entre modo Chat e modo Q&A no Vault?

- **Chat** — Conversa geral. A IA só tem acesso à sua nota atual e a qualquer coisa que você mencione explicitamente.
- **Q&A no Vault** — Especificamente projetado para fazer perguntas sobre seu vault. O Copilot busca automaticamente nas suas notas por conteúdo relevante e o inclui como contexto.

Para a maioria das tarefas de perguntas e respostas sobre o seu vault, use o modo **Vault QA** ou **Copilot Plus**.

### Posso usar múltiplos provedores ao mesmo tempo?

Sim. Você pode ter chaves de API configuradas para vários provedores simultaneamente e alternar entre modelos de provedores diferentes a qualquer momento. Você pode até definir um modelo diferente para comandos rápidos em vez de chat regular.

### Onde meus chats salvos são armazenados?

As conversas de chat são salvas como arquivos markdown no seu vault, na pasta `copilot/copilot-conversations/` por padrão. Você pode alterar essa pasta em **Configurações → Copilot → Basic → Default save folder**.

### Como eu limpo o cache do Copilot?

Use **Paleta de comandos → Clear Copilot cache**. Isso limpa respostas em cache e arquivos processados. Não afeta seu histórico de chat ou o índice do vault.

### O que é a pasta `copilot/` no meu vault?

A pasta `copilot/` é criada pelo plugin e armazena:
- `copilot-conversations/` — Históricos de chats salvos
- `copilot-custom-prompts/` — Seus comandos personalizados
- `system-prompts/` — Seus prompts de sistema personalizados
- `memory/` — Memórias de IA salvas (se ativadas)

Esta pasta é automaticamente excluída da busca no vault para evitar a poluição de resultados.

### Como faço para trocar de modos?

Clique no seletor de modo no topo do painel de chat. Modos disponíveis:
- Chat
- Vault QA (Basic)
- Copilot Plus (requer licença)
- Projetos (alpha)

### A IA sempre esquece do que conversamos mais cedo

Isso geralmente significa que a conversa ficou longa demais e os turnos mais antigos estão sendo cortados do contexto. Opções:
- Diminua **Conversation Turns in Context** nas configurações do Model
- Deixe o auto-compact cuidar disso (ele resume turnos antigos automaticamente)
- Comece um novo chat e referencie o arquivo do chat anterior

---

## Obtendo Mais Ajuda

- **GitHub Issues**: Relate bugs em https://github.com/logancyang/obsidian-copilot/issues
- **Discord**: Entre na comunidade Copilot no Discord para ajuda de outros usuários
- **Arquivo de Log**: Crie um arquivo de log (**Configurações → Copilot → Avançado → Create Log File**) e inclua-o nos relatórios de bugs

---

## Relacionado

- [Primeiros Passos](getting-started.pt-BR.md) — Configuração inicial
- [Provedores de LLM](llm-providers.pt-BR.md) — Detalhes de configuração específicos do provedor
- [Busca no Vault e Indexação](vault-search-and-indexing.pt-BR.md) — Gerenciamento do índice
