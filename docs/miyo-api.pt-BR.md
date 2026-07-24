# API do Serviço Miyo Node

URL Base: `http://127.0.0.1:8742`

Todos os corpos de requisição e resposta são JSON. Erros sempre retornam `{ "detail": "<mensagem>" }`.

---

## Integridade (Health)

### `GET /v0/health`

Retorna o status do serviço e sidecar.

**Resposta 200**

```json
{
  "status": "ok | degraded",
  "service": "running",
  "qdrant": "connected | ...",
  "llama_server": "running | ...",
  "model_download_progress": 0.75,
  "embedding_model": "nomic-embed-text-v1.5",
  "batch_size_preset": "default",
  "gpu_variant": "metal | null",
  "indexed_files": 1234
}
```

---

## Busca

### `POST /v0/search`

Busca híbrida semântica + palavra-chave (densa + BM25, fundida via RRF).

**Corpo da requisição**

```json
{
  "query": "string (obrigatório)",
  "folder_path": "string | null — restringe a esta pasta",
  "path": "string | null — filtro de substring no caminho do arquivo (case-insensitive)",
  "limit": 10,
  "filters": [
    /* MetadataFilter[], veja abaixo */
  ]
}
```

**Resposta 200**

```json
{
  "results": [
    /* SearchResult[] */
  ],
  "query": "string",
  "count": 5,
  "execution_time_ms": 42.0
}
```

**Erros:** 400 (falta query), 503 (llama-server ou Qdrant indisponíveis)

---

### `POST /v0/search/related`

Encontra arquivos relacionados a um determinado arquivo usando similaridade vetorial.

**Corpo da requisição**

```json
{
  "file_path": "string (obrigatório) — caminho absoluto",
  "folder_path": "string | null",
  "limit": 10,
  "filters": [
    /* MetadataFilter[] */
  ]
}
```

**Resposta 200**

```json
{
  "results": [{ "path": "string", "score": 0.95 }],
  "file_path": "string",
  "count": 5,
  "execution_time_ms": 12.0
}
```

**Erros:** 400, 404 (sem blocos indexados para o arquivo), 503

---

## Pastas

### `GET /v0/folder`

- Com `?path=<caminho_da_pasta>`: retorna uma única `FolderEntry` (404 se não registrada)
- Sem `path`: retorna `{ "folders": [ FolderEntry[] ] }`

---

### `POST /v0/folder`

Registra uma pasta para indexação. Inicia a observação e a varredura imediatamente.

**Corpo da requisição**

```json
{
  "path": "string (obrigatório) — caminho absoluto",
  "include_patterns": ["**/*.md"],
  "exclude_patterns": ["**/node_modules/**"],
  "recursive": true
}
```

**Resposta 201** — `FolderEntry`

**Erros:** 400 (inválido), 409 (já registrada)

---

### `PATCH /v0/folder`

Atualiza a configuração da pasta. Somente os campos fornecidos são alterados.

**Corpo da requisição**

```json
{
  "path": "string (obrigatório)",
  "include_patterns": ["**/*.md"],
  "exclude_patterns": ["**/node_modules/**"],
  "recursive": false
}
```

**Resposta 200** — `FolderEntry` atualizada

**Erros:** 400, 404

---

### `DELETE /v0/folder`

Desregistra uma pasta e remove todos os seus dados indexados.

**Corpo da requisição**

```json
{ "path": "string (obrigatório)" }
```

**Resposta 200** — objeto de resumo da exclusão

**Erros:** 400, 404

---

### `POST /v0/folder/pause`

Interrompe a observação de arquivos de uma pasta sem removê-la.

**Corpo da requisição**

```json
{ "path": "string (obrigatório)" }
```

**Resposta 200**

```json
{ "status": "paused", "path": "string" }
```

**Erros:** 400, 404

---

### `POST /v0/folder/resume`

Retoma a observação de arquivos e aciona uma nova varredura.

**Corpo da requisição**

```json
{ "path": "string (obrigatório)" }
```

**Resposta 202**

```json
{ "status": "scanning", "path": "string" }
```

**Erros:** 400, 404

---

### `POST /v0/scan`

Aciona manualmente a varredura de uma pasta registrada.

**Corpo da requisição**

```json
{
  "path": "string (obrigatório)",
  "force": false
}
```

`force: true` re-indexa todos os arquivos, mesmo se não alterados.

**Resposta 202**

```json
{ "status": "started", "path": "string" }
```

**Erros:** 400, 404

---

## Arquivos & Documentos

### `GET /v0/folder/files`

Lista os arquivos indexados com filtros opcionais e paginação.

**Parâmetros de consulta (Query)**

| Parâmetro      | Tipo                              | Descrição                       |
| -------------- | --------------------------------- | ------------------------------- |
| `folder_path`  | string                            | Filtrar por pasta               |
| `title`        | string                            | Correspondência por substring   |
| `file_path`    | string                            | Caminho do arquivo exato        |
| `mtime_after`  | number                            | Limite inferior (unix timestamp)|
| `mtime_before` | number                            | Limite superior (unix timestamp)|
| `offset`       | integer (padrão 0)                | Offset de paginação             |
| `limit`        | integer                           | Máximo de resultados (ou omita) |
| `order_by`     | `mtime` \| `updated_at` (padrão)  | Ordem de classificação          |

**Resposta 200**

```json
{
  "files": [
    /* FileEntry[] */
  ],
  "total": 99
}
```

---

### `GET /v0/folder/documents`

Obtém todos os blocos indexados para um arquivo específico, classificados pelo índice do bloco.

**Parâmetros de consulta (Query)**

| Parâmetro     | Obrigatório | Descrição                  |
| ------------- | ----------- | -------------------------- |
| `path`        | sim         | Caminho absoluto do arquivo|
| `folder_path` | não         | Restringe a uma pasta      |

**Resposta 200**

```json
{
  "documents": [
    /* DocumentChunk[] */
  ]
}
```

**Erros:** 400, 503

---

## Utilitários

### `POST /v0/parse-doc`

Analisa um arquivo e retorna o conteúdo de texto extraído.

**Corpo da requisição**

```json
{ "path": "string (obrigatório) — caminho absoluto" }
```

**Resposta 200** — objeto de conteúdo analisado (formato varia de acordo com o arquivo)

**Erros:**

| Código | Significado                      |
| ------ | -------------------------------- |
| 400    | Entrada inválida                 |
| 403    | Arquivo não legível              |
| 404    | Arquivo não encontrado           |
| 415    | Tipo de arquivo não suportado    |
| 422    | Falha na análise (Parse failed)  |
| 500    | Erro interno                     |

---

### `POST /v0/rebuild-metadata`

Reconstrói o manifesto ressincronizando os metadados do Qdrant. Use quando o manifesto estiver dessincronizado.

**Resposta 200** — `{ "elapsed_ms": 123, ...stats }`

**Erros:** 409 (reconstrução em andamento), 503

---

### `POST /v0/llama-server/restart`

Reinicia o sidecar do llama-server, opcionalmente alterando a predefinição do tamanho do lote (batch size preset).

**Corpo da requisição**

```json
{ "batch_size_preset": "default" }
```

**Resposta 200**

```json
{
  "restarted": true,
  "batch_size_preset": "default",
  "status": "running"
}
```

**Erros:** 400

---

### `POST /v1/embeddings`

Gera embeddings. Interface compatível com OpenAI, enviada (proxied) para o llama-server.

**Corpo da requisição**

```json
{
  "model": "nomic-embed-text-v1.5",
  "input": "string or string[]"
}
```

`model` é opcional, mas deve corresponder ao modelo de embedding configurado se fornecido.

**Resposta 200** — resposta padrão de embeddings do OpenAI

**Erros:** 400, 503

---

## Esquemas

### MetadataFilter

Filtro de intervalo (range) em um campo de metadados.

```json
{
  "field": "mtime",
  "gt": 1700000000,
  "gte": 1700000000,
  "lt": 1800000000,
  "lte": 1800000000
}
```

- `field` pode ser `mtime`, `ctime`, ou qualquer chave de metadados
- Nomes de campos puros (não `mtime`/`ctime` e não prefixados com `metadata.`) são automaticamente prefixados com `metadata.`
- Pelo menos um entre `gt`, `gte`, `lt`, `lte` deve estar presente

---

### SearchResult

```json
{
  "path": "string",
  "score": 0.95,
  "title": "string | null",
  "mtime": 1700000000,
  "ctime": 1700000000,
  "file_name": "string | null",
  "chunk_index": 0,
  "total_chunks": 5,
  "chunk_text": "string | null",
  "metadata": {},
  "embedding_model": "string | null",
  "tags": ["string"],
  "extension": ".md",
  "created_at": "string | null",
  "nchars": 1024,
  "folder_path": "string | null"
}
```

---

### FileEntry

```json
{
  "path": "string",
  "title": "string | null",
  "mtime": 1700000000,
  "updated_at": "ISO8601 string",
  "folder_path": "string | null",
  "total_chunks": 5
}
```

---

### DocumentChunk

```json
{
  "id": "string",
  "path": "string | null",
  "title": "string | null",
  "chunk_index": 0,
  "chunk_text": "string | null",
  "metadata": {},
  "embedding_model": "string | null",
  "ctime": 1700000000,
  "mtime": 1700000000,
  "tags": ["string"],
  "extension": ".md",
  "created_at": "ISO8601 string | null",
  "nchars": 1024,
  "folder_path": "string | null"
}
```

---

### FolderEntry

Formato varia — inclui no mínimo:

```json
{
  "path": "string",
  "include_patterns": ["**/*.md"],
  "exclude_patterns": [],
  "recursive": true
}
```

Mais campos de status ao vivo preenchidos pelo gerenciador de pasta.
