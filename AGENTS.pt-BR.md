# AGENTS.md — Diretrizes para Agentes de Código

Este arquivo fornece orientação para qualquer agente de código que trabalhe com a base de código do Copilot para Obsidian.

---

## Visão Geral do Arquitetura

1. **LLM Provider System** (`src/LLMProviders/`) — Gerencia provedores de modelos e chaveamento.
2. **Chain Factory Pattern** (`src/chainFactory.ts`) — Fábrica de correntes para chat e operações de IA.
3. **Vector Store & Search** (`src/search/`) — Busca semântica e embeddings do vault.
4. **Message Management Architecture** (`src/core/`, `src/state/`) — Gerenciamento unificado via `MessageRepository` e `ChatManager`.

---

## Regras de Desenvolvimento

- **NUNCA EXECUTE `npm run dev`** — O usuário gerencia os builds manualmente.
- Execute `npm run build` para compilar o código antes de testar.
- Execute `npm run lint` e `npm run format` antes de abrir Pull Requests.
