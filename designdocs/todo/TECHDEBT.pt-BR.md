# TODO - Débito Técnico e Melhorias Futuras

Este documento rastreia itens de débito técnico e melhorias que precisam ser abordados no futuro.

## 1. Erro SSL no Docs4LLM no Modo Projetos

### Descrição do Problema

A análise de documentos para o modo de projetos está falhando com um erro SSL (`net::ERR_SSL_BAD_RECORD_MAC_ALERT`) ao tentar fazer upload de arquivos para o endpoint da API docs4llm.

### Detalhes Técnicos

- **Local do Erro**: `src/LLMProviders/brevilabsClient.ts:185` no método `makeFormDataRequest`
- **Causa Raiz**: O método usa a API nativa `fetch` em vez da API `requestUrl` do Obsidian
- **Contexto**: Enquanto requisições JSON regulares foram migradas para usar `safeFetch` (que usa `requestUrl`) no commit e49aafa para corrigir problemas de CORS, o método `makeFormDataRequest` não foi atualizado

### Por Que Abordagens Atuais Não Funcionarão

1. **Restrição do Backend**: O endpoint `/docs4llm` aceita apenas formato multipart/form-data com `files: List[UploadFile]`
2. **Limitação do Obsidian**: A função `safeFetch` existente é fixada (hardcoded) para content type `application/json`
3. **Sem Alternativa JSON**: Ao contrário de `pdf4llm` que aceita JSON base64, não há endpoint JSON para `docs4llm`

### Solução Recomendada

Criar uma nova função `safeFetchFormData` que:

1. Usa a API `requestUrl` do Obsidian com configuração correta de multipart/form-data
2. Lida corretamente com objetos FormData
3. Contorna restrições de CORS e SSL como `safeFetch` faz para JSON

### Soluções Alternativas

1. **Modificação do Backend**: Adicionar um novo endpoint `/docs4llm-base64` que aceite cargas JSON codificadas em base64
2. **Pesquisar API do Obsidian**: Investigar se versões mais novas do `requestUrl` do Obsidian suportam multipart/form-data
3. **Correção do Certificado SSL**: Abordar o problema subjacente do certificado SSL (solução alternativa temporária)

### Impacto

- Usuários não conseguem analisar arquivos que não sejam markdown (PDFs, Word docs, etc.) no modo de projetos
- Isso afeta a funcionalidade principal de carregamento de contexto do projeto
- Solução de contorno: Usuários devem garantir que seus projetos contenham apenas arquivos markdown

### Referências

- Commit relacionado: e49aafa (Problema de CORS da Brevilabs #918)
- Discussão no Fórum: https://forum.obsidian.md/t/holo-how-to-add-a-png-image-or-file-to-formdata-in-obsidian-like-below-this-help/73420
- Implementação no backend: `/Users/chaoyang/webapps/brevilabs-api/app/main.py:1039`

---

_Última atualização: 2025-07-18_
