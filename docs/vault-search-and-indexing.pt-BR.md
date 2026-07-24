# Busca no Vault e Indexação

O Copilot pode pesquisar no seu vault para encontrar notas relevantes e responder a perguntas baseadas no seu próprio conteúdo. Este guia explica os dois tipos de busca, como gerenciar o índice e como configurar o que é indexado.

---

## Dois Tipos de Busca

### Busca Lexical (Baseada em Palavras-chave)

A busca lexical encontra notas que contêm as palavras exatas que você usou. É rápida, não requer configuração e funciona imediatamente.

- **Usado em**: Modo Q&A no Vault (Básico)
- **Como funciona**: Procura por suas palavras-chave exatas nos títulos e conteúdos das notas
- **Pontos fortes**: Rápida, precisa, não requer chamadas à API de embedding
- **Limitações**: Não encontrará notas que usam palavras diferentes para expressar a mesma ideia

**Limite de RAM**: O índice de busca lexical é mantido em memória. Você pode configurar o limite de memória em **Configurações → Copilot → QA → Lexical Search RAM Limit** (padrão: 100 MB, faixa: 20–1.000 MB).

**Boosts Lexicais**: O Copilot pode dar um impulso aos resultados de busca de notas na mesma pasta que a nota atual, ou de notas que linkam umas às outras. Ative em **Configurações → Copilot → QA → Enable Lexical Boosts** (ativado por padrão).

### Busca Semântica (Baseada em Significado)

A busca semântica encontra notas que são conceitualmente relacionadas, mesmo que não compartilhem palavras exatas.

- **Usado em**: Modos Q&A no Vault e Copilot Plus — mas **desativada por padrão**. Você deve ativá-la explicitamente.
- **Como funciona**: Converte suas notas em vetores numéricos (usando um modelo de embedding), depois encontra as notas cujos vetores estão mais próximos da sua consulta
- **Pontos fortes**: Encontra notas por conceito e significado, excelente para lembrança "difusa" (fuzzy)
- **Custo**: Requer chamadas à API de embedding (custa dinheiro para modelos de embedding pagos)
- **Ativar**: **Configurações → Copilot → QA → Enable Semantic Search** — ligue isso para ativar a busca semântica

---

## Gerenciamento do Índice

O índice de busca semântica armazena os embeddings vetoriais das suas notas. Gerencie-o em **Configurações → Copilot → QA**.

### Estratégia de Indexação Automática

Controla quando o Copilot atualiza automaticamente o índice:

| Estratégia | Quando o índice atualiza |
|---|---|
| **NEVER** | Apenas manual — você deve iniciar a indexação por conta própria |
| **ON STARTUP** | Atualiza quando o Obsidian inicia ou o plugin é recarregado |
| **ON MODE SWITCH** | Atualiza quando você muda para o modo Q&A no Vault ou Copilot Plus (Recomendado) |

O padrão é **ON MODE SWITCH**.

> **Aviso**: Para vaults grandes usando modelos de embedding pagos, indexações frequentes podem incorrer em custos significativos. Considere usar NEVER e indexar manualmente se o custo for uma preocupação.

### Atualizar Índice (Incremental)

**Paleta de comandos → Index (refresh) vault**

Atualiza apenas notas que foram adicionadas, modificadas ou excluídas desde a última indexação. Mais rápido e barato que uma reindexação completa.

### Forçar Reindexação

**Paleta de comandos → Force reindex vault**

Reconstrói o índice inteiro do zero. Use isso se:
- Você alterou seu modelo de embedding
- O índice parece corrompido ou faltando resultados
- Você fez muitas alterações e quer um estado limpo

### Coleta de Lixo (Garbage Collection)

**Paleta de comandos → Garbage collect Copilot index (remove files that no longer exist in vault)**

Remove entradas do índice de notas que foram deletadas do seu vault. Mantém o índice limpo sem uma reindexação completa.

### Limpar Índice

**Paleta de comandos → Clear local Copilot index**

Exclui todo o índice. Você precisará reindexar antes que a busca semântica funcione novamente.

### Comandos de Depuração

Para solução de problemas:

- **List indexed files** — Mostra todas as notas atualmente no índice
- **Inspect index by note paths** — Verifica quais blocos de notas específicas estão indexados
- **Count total vault tokens** — Estima o total de tokens em todo o seu vault
- **Search semantic index** — Executa uma consulta de busca direta contra o índice

---

## Filtragem: O Que É Indexado

Controle quais notas são incluídas na busca semântica.

### Estimativa de Custo Antes de Indexar

Antes de indexar um vault grande com um modelo de embedding pago, estime o custo primeiro:

**Paleta de comandos → Count total tokens in your vault**

Isso mostra a contagem total de tokens em seu vault, que você pode usar para estimar os custos da API de embedding. Custos de embedding geralmente são baixos, mas vale a pena conferir para vaults muito grandes.

### Exclusões

**Configurações → Copilot → QA → Exclusions**

Lista separada por vírgulas de padrões. Notas que correspondem a estes padrões são excluídas. Suporta:
- Nomes de pasta: `privado` — exclui a pasta chamada "privado"
- Caminhos de pasta: `Trabalho/Confidencial` — exclui essa subpasta específica
- Extensões de arquivo: `.pdf` — exclui todos os arquivos PDF
- Tags: `#privado` — exclui todas as notas marcadas com `#privado`
- Títulos de notas: `Minha Nota Secreta` — exclui essa nota específica

Exemplo: `privado, Trabalho/Confidencial, #privado` exclui a pasta privada, uma pasta de trabalho específica, e todas as notas com a tag #privado.

> **Nota**: A correspondência de tags funciona com tags nas **propriedades (frontmatter)** da nota, não com tags inline dentro do corpo da nota.

A pasta `copilot` é sempre excluída automaticamente (ela contém os próprios arquivos do plugin).

### Inclusões

**Configurações → Copilot → QA → Inclusions**

Lista separada por vírgulas. Se configurado, **apenas** notas correspondentes a estes padrões são indexadas. Útil para indexar uma área específica do seu vault.

Deixe vazio para incluir tudo (exceto exclusões).

---

## Configurações de Embedding

Estas configurações aparecem em **Configurações → Copilot → QA** quando a Busca Semântica está ativada.

### Requisições por Minuto

Quantas requisições de API de embedding enviar por minuto. O padrão é 60. Diminua isso se você atingir erros de limite de taxa (rate limit) do seu provedor de embedding.

Faixa: 10–60

### Tamanho do Lote (Batch Size) de Embedding

Quantos blocos de texto enviar por requisição de API. O padrão é 16. Lotes maiores são mais rápidos, mas podem causar problemas com alguns provedores.

### Partições

O índice é dividido em partições para lidar com vaults grandes. Você pode controlar o número de partições em **Configurações → Copilot → QA → Number of Partitions**. Se você tiver um vault grande, aumente este valor para evitar erros de índice.

> **Se você receber um erro "RangeError: invalid string length"**: Isso significa que seu vault é muito grande para uma única partição. Aumente o número de partições nas configurações de QA. Uma boa regra geral é que o primeiro arquivo de partição (encontrado em `.obsidian/`) deve ter menos de ~400 MB.

---

## Citações Inline (Experimental)

Quando ativado, as respostas da IA no Q&A no Vault incluem citações em estilo de nota de rodapé apontando para as notas fonte usadas na resposta.

**Ativar**: **Configurações → Copilot → QA → Enable Inline Citations**

Este é um recurso experimental. Nem todos os modelos lidam bem com ele.

---

## Obsidian Sync

Se você usar o Obsidian Sync, o índice de vetores pode ser sincronizado entre dispositivos. Ative **Configurações → Copilot → QA → Enable Index Sync**.

> **Nota**: O índice pode ser grande (centenas de MB para vaults grandes). Tenha isso em mente para limites de sincronização e uso de dados móveis.

---

## Considerações sobre Dispositivos Móveis

Por padrão, o Copilot **desativa a indexação no celular** para economizar bateria e dados. A configuração está em **Configurações → Copilot → QA → Disable index on mobile** (ativado por padrão).

No celular, você ainda pode usar o Q&A no Vault com busca lexical, mas a busca semântica não será atualizada automaticamente.

---

## Relacionado

- [Modo Agente e Ferramentas](agent-mode-and-tools.pt-BR.md) — Como o @vault usa o índice no modo Plus
- [Modelos e Parâmetros](models-and-parameters.pt-BR.md) — Escolhendo um modelo de embedding
- [Copilot Plus e Auto-Hospedagem](copilot-plus-and-self-host.pt-BR.md) — Busca semântica local baseada no Miyo
