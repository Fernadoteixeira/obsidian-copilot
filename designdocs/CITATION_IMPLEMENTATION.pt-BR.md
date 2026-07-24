# Sistema de Citações Inline

Este guia explica como as citações inline são produzidas no Copilot Plus, Q&A no Vault e busca na web, e como o recurso é testado por testes automatizados.

## Alternador de Recurso & Área de Superfície

- `enableInlineCitations` (padrão `true`) fica em `src/settings/model.ts` e é exposto na UI de configurações de QA (`src/settings/v2/components/QASettings.tsx`).
- O alternador controla as instruções de prompt, pós-processamento de fallback e renderização de chat. Quando desativado, o sistema volta para uma lista de fontes recolhível sem marcadores inline.

## Visão Geral do Pipeline

1. **Condicionamento de Recuperação**
   - Tanto `CopilotPlusChainRunner.prepareLocalSearchResult` quanto `VaultQAChainRunner` limpam o conteúdo da nota com `sanitizeContentForCitations` para remover marcadores `[^n]`/`[n]` soltos antes do prompt.
   - Notas recuperadas recebem valores estáveis em `__sourceId` e são serializadas com `formatSearchResultsForLLM`; `deduplicateSources` mantém a entrada com maior pontuação por caminho/título.
   - Um catálogo compacto de fontes é construído via `formatSourceCatalog`, e o Copilot Plus armazena em cache as primeiras 20 entradas em `lastCitationSources` para notas de rodapé de fallback.
2. **Montagem de Prompt**
   - `CITATION_RULES` e `WEB_CITATION_RULES` ficam em `src/LLMProviders/chainRunner/utils/citationUtils.ts`.
   - `getCitationInstructions` (Copilot Plus) e `getQACitationInstructionsConditional` (Q&A no Vault) anexam orientação e um catálogo de fontes apenas quando as citações inline estão ativadas.
   - A busca na web chama `getWebSearchCitationInstructions` de forma que fontes externas emitem definições `[título](url)` enquanto as respostas do vault permanecem em links `[[Nota]]`.
3. **Salvaguardas de Resposta**
   - `addFallbackSources` anexa um bloco `#### Sources` quando o modelo produz marcadores inline mas nenhuma definição. A detecção baseia-se em `hasExistingCitations`, que agora aceita cabeçalhos alternativos (ex: `## Sources`, `Sources -`) e blocos `<summary>Sources</summary>`.
   - O Copilot Plus passa os dados estruturados de `lastCitationSources` para o auxiliar de fallback; O Q&A no Vault deriva títulos da saída do recuperador.
4. **Renderização de Chat**
   - `src/components/chat-components/ChatSingleMessage.tsx` sempre passa as mensagens do assistente por `processInlineCitations`.
   - O auxiliar extrai a seção de fontes no final, constrói um mapa de primeira menção com `buildCitationMap`, normaliza as referências (`normalizeCitations`) para que construções como `[^7][^8]` se tornem `[1][2]`, e converte definições (`convertFootnoteDefinitions`) em links wiki clicáveis ou âncoras Markdown.
   - Definições duplicadas são agrupadas via `consolidateDuplicateSources` + `updateCitationsForConsolidation`, mantendo a numeração estável. Quando o bloco de fontes não está formatado como nota de rodapé ou as citações estão desativadas, o renderizador volta para uma lista simples `<details>`.

## Testes

- `src/LLMProviders/chainRunner/utils/citationUtils.test.ts`
  - Limpeza, formatação de catálogo e inserção de fallback.
  - Cobertura de `hasExistingCitations` para cabeçalhos markdown, rótulos simples `Sources` e wrappers `<summary>`.
  - Suítes de regressão para citações não-sequenciais, consolidação de fonte duplicada e marcadores consecutivos (`[^7][^8]`).
- `src/LLMProviders/chainRunner/utils/searchResultUtils.test.ts`
  - Garante que documentos recuperados sejam serializados com IDs estáveis e filtrados para `includeInContext` antes do prompt.
- `src/tools/ToolResultFormatter.test.ts`
  - Verifica se a ferramenta de busca local emite JSON com a estrutura `{ type: "local_search", documents: [...] }` esperada pelos executores de chain (chain runners).

## Checklist de QA Manual

- Turno do Q&A no Vault usando apenas busca local: confirmar se os marcadores `[1]` inline e as fontes numeradas renderizam sem duplicação.
- Turno misto do Copilot Plus (busca local + outra ferramenta): garantir que o fallback ainda funciona se o modelo omitir o bloco de fontes.
- Resposta da busca na web: verificar se as definições de nota de rodapé renderizam como links `[título](url)` quando as citações estão ativadas.

## Lista de Observação (Watchlist)

- `sanitizeContentForCitations` intencionalmente remove números entre colchetes; fique de olho em domínios (matemática, direito) onde valores literais `[1990]` possam ser desejáveis.
- As citações inline permanecem dependentes do modelo. `addFallbackSources` garante uma lista de fontes, mas a UI ainda reflete quaisquer marcadores inline que o provedor retornar.
