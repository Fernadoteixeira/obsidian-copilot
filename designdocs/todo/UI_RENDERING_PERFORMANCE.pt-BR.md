# TODO - Problemas de Desempenho de Renderização de UI

Este documento rastreia problemas de desempenho de renderização da UI identificados através de uma auditoria abrangente na árvore de componentes React, gerenciamento de estado e caminhos de streaming. As descobertas são classificadas por gravidade e organizadas por prioridade recomendada de correção.

## Legenda de Gravidade

- **CRÍTICO** - Causa jank/travamentos visíveis durante o uso normal; afeta todos os usuários
- **ALTO** - Causa travamentos perceptíveis em cenários específicos ou degrada em escala
- **MÉDIO** - Contribui para degradação cumulativa de desempenho
- **BAIXO** - Ineficiência menor; corrija de forma oportunista

---

## 1. [TODO] ChatSingleMessage Não Memoizado — Streaming Re-renderiza Todas as Mensagens Históricas (CRÍTICO)

### Descrição do Problema

`ChatSingleMessage` é o componente mais caro do aplicativo, mas não está envolvido em `React.memo`. Toda atualização de token em streaming faz com que TODAS as mensagens históricas sejam re-renderizadas com passagens completas de MarkdownRenderer e manipulação do DOM.

### Detalhes Técnicos

- **Arquivos**: `src/components/chat-components/ChatSingleMessage.tsx`, `src/components/chat-components/ChatMessages.tsx:88-115`
- **Causa Raiz**: Quando `ChatMessages` (que ESTÁ memoizado) é re-renderizado devido a mudanças em `currentAiMessage` durante o streaming, o `.map()` na linha 88 cria novos elementos React para TODAS as mensagens históricas. Cada um recebe novas props de closure inline:
  - `() => onRegenerate(index)` (linha 108)
  - `(newMessage) => onEdit(index, newMessage)` (linha 109)
  - `() => onDelete(index)` (linha 110)
- Esses closures inline criam novas referências de funções a cada renderização, o que anularia o `React.memo` mesmo se fosse adicionado sem também estabilizar as callbacks.
- `ChatSingleMessage` contém: `MarkdownRenderer.renderMarkdown()`, manipulação do DOM (`querySelectorAll`, `createElement`, `insertBefore`), `parseToolCallMarkers()`, múltiplas passagens de regex e múltiplos hooks `useEffect`.

### Solução Recomendada

1. Envolva `ChatSingleMessage` em `React.memo` com um comparador personalizado que verifica `message.id`, `message.message`, `isStreaming` e a identidade da callback.
2. Substitua callbacks de closure inline no `ChatMessages.map()` por referências estáveis. Opções:
   - Passe `messageIndex` como uma prop e deixe o `ChatSingleMessage` chamar `onRegenerate(messageIndex)` internamente.
   - Use `useCallback` com um padrão baseado em ref para evitar dependência de `chatHistory` (veja Descoberta #9).

### Impacto

- **Afeta**: Todo stream de resposta de LLM para todos os usuários.
- **Gravidade escala com**: Tamanho da conversa. Uma conversa de 20 mensagens significa 20 re-renderizações desnecessárias e caras por quadro de animação durante o streaming.
- **Melhoria esperada**: Eliminar re-renderizações de mensagens históricas durante o streaming seria o maior ganho de desempenho em todo o código (codebase).

---

## 2. [TODO] Filtro O(N^2) Dentro do .map() no ChatMessages (CRÍTICO)

### Descrição do Problema

`chatHistory.filter()` é chamado dentro do callback do `.map()` em cada iteração, criando uma complexidade O(N^2) por renderização.

### Detalhes Técnicos

- **Arquivo**: `src/components/chat-components/ChatMessages.tsx:89`
- **Código**: `const visibleMessages = chatHistory.filter((m) => m.isVisible);` é chamado dentro de `.map()` para computar `isLastMessage`. Para N mensagens, isso executa N operações de filtro de O(N) cada = O(N^2).
- Combinado com a Descoberta #1 (re-renderizações em cada quadro de streaming), isso se agrava terrivelmente.

### Solução Recomendada

Eleve (hoist) o filtro antes do `.map()`:

```tsx
const visibleMessages = useMemo(() => chatHistory.filter((m) => m.isVisible), [chatHistory]);
// Então use visibleMessages.length dentro de .map()
```

### Impacto

- **Afeta**: Cada renderização durante o streaming.
- **Para 100 mensagens**: 10.000 operações de filtro por quadro de renderização.
- **Esforço de correção**: Trivial — elevação de linha única.

---

## 3. [TODO] ChatManager.getCurrentMessageRepo() Cria Novo ChatPersistenceManager em Cada Chamada (ALTO)

### Descrição do Problema

Um novo objeto `ChatPersistenceManager` é alocado em cada chamada a `getCurrentMessageRepo()`, que é invocado por virtualmente toda operação de leitura/escrita.

### Detalhes Técnicos

- **Arquivo**: `src/core/ChatManager.ts:82-87`
- **Código**: `this.persistenceManager = new ChatPersistenceManager(this.plugin.app, currentRepo, this.chainManager)` é executado incondicionalmente dentro de `getCurrentMessageRepo()`.
- Este método é chamado por `getDisplayMessages()`, `getLLMMessages()`, `getMessage()`, `addMessage()`, `deleteMessage()`, etc.
- Via `useChatManager`, `getDisplayMessages()` é chamado em cada notificação de inscrição vinda de `ChatUIState`.

### Solução Recomendada

Faça cache do `ChatPersistenceManager` por chave de projeto. Recrie apenas quando o projeto realmente mudar:

```typescript
if (!this.persistenceManagers.has(projectKey)) {
  this.persistenceManagers.set(projectKey, new ChatPersistenceManager(...));
}
```

### Impacto

- **Afeta**: Cada operação de mensagem (leitura ou escrita).
- **Causa**: Alocação desnecessária de objeto e pressão no GC (Garbage Collector) em cada ciclo de renderização.

---

## 4. [TODO] useChatManager Cria Nova Referência de Array em Cada Notificação de Estado (ALTO)

### Descrição do Problema

O `useChatManager` sempre espalha (spreads) em um novo array, o que significa que o React sempre vê uma nova referência de `messages`, anulando a memoização posterior (downstream).

### Detalhes Técnicos

- **Arquivo**: `src/hooks/useChatManager.ts:21`
- **Código**: `setMessages([...chatUIState.getMessages()])` — o operador de propagação (spread) sempre cria uma nova referência de array independentemente de o conteúdo ter mudado ou não.
- Toda chamada a `notifyListeners()` (de qualquer operação de mensagem) aciona isso, fazendo com que o `ChatMessages` seja re-renderizado mesmo se as mensagens reais não tiverem mudado.

### Solução Recomendada

Use comparação estrutural ou um contador de versão para evitar atualizações desnecessárias de estado:

```typescript
const unsubscribe = chatUIState.subscribe(() => {
  const next = chatUIState.getMessages();
  setMessages((prev) => {
    // Atualiza apenas se as mensagens realmente mudaram
    if (
      prev.length === next.length &&
      prev.every((m, i) => m.id === next[i].id && m.message === next[i].message)
    ) {
      return prev;
    }
    return [...next];
  });
});
```

Como alternativa, adicione um contador de versão/geração em `MessageRepository` e espalhe apenas quando a versão mudar.

### Impacto

- **Afeta**: Toda mudança de estado cascateia em re-renderizações desnecessárias do `ChatMessages`.
- **Se compõe com**: Descoberta #1 (ChatSingleMessage não memoizado) e Descoberta #9 (deps de callback instáveis).

---

## 5. [TODO] useChatScrolling Dispara Consultas DOM Caras em Toda Mudança de chatHistory (ALTO)

### Descrição do Problema

`calculateDynamicMinHeight` realiza consultas DOM (`querySelector`, `getBoundingClientRect`) e é chamado em toda mudança de `chatHistory`, causando sobrecarga de layout (layout thrashing) durante o streaming.

### Detalhes Técnicos

- **Arquivo**: `src/hooks/useChatScrolling.ts:29-66, 109-114`
- `calculateDynamicMinHeight` tem `chatHistory` no seu array de dependências, de modo que altera de identidade em cada atualização de mensagem.
- O `useEffect` na linha 109 o chama a cada mudança de `chatHistory`.
- Ele faz `querySelector` + `getBoundingClientRect`, o que força um recálculo de layout pelo navegador (reflow).
- Como `chatHistory` recebe uma nova referência com frequência (Descoberta #4), isso dispara recálculos de layout caros de forma constante.

### Solução Recomendada

1. Use debounce ou throttle nas chamadas de `calculateDynamicMinHeight` (ex: recalcule apenas em adições de mensagens do usuário, não durante o streaming).
2. Desvincule da identidade do array `chatHistory` — use `chatHistory.length` ou uma contagem de mensagens em vez disso.
3. Considere usar `ResizeObserver` no último elemento de mensagem, em vez de consultar a cada mudança de estado.

### Impacto

- **Afeta**: Toda atualização de mensagem durante o streaming.
- **Causa**: Sobrecarga de layout (reflows forçados) na thread principal (main thread).

---

## 6. [TODO] useAllNotes Ordena Lista de Arquivos Inteira a Cada Mudança no Vault (ALTO)

### Descrição do Problema

O hook `useAllNotes` ordena todos os arquivos do vault pela data de criação dentro de `useMemo`, acionado a cada evento debounced (com debounce) do vault.

### Detalhes Técnicos

- **Arquivo**: `src/components/chat-components/hooks/useAllNotes.ts:36`
- **Código**: `files.sort((a, b) => b.stat.ctime - a.stat.ctime)` roda dentro de `useMemo` com deps `[allNotes, isCopilotPlus]`.
- O átomo `allNotes` recebe uma nova referência de array a cada evento com debounce do vault (`VaultDataManager.refreshNotes` em `vaultDataAtoms.ts:214` sempre define um novo array).
- Para vaults com 5000+ arquivos, isso é O(N log N) a cada criação/exclusão/renomeação de arquivo.

### Solução Recomendada

Mova a ordenação para dentro de `VaultDataManager.refreshNotes()` para que ocorra uma vez na fonte, não em cada consumidor. Ou pré-ordene o valor do átomo.

### Impacto

- **Afeta**: Usuários com vaults grandes (5000+ arquivos).
- **Disparos**: A cada criação/exclusão/renomeação de arquivo no vault (debounce de 250ms).

---

## 7. [TODO] Animação de Pontos de Carregamento Dispara Re-render Completo de ChatMessages a Cada 200ms (MÉDIO)

### Descrição do Problema

A animação dos pontos de carregamento (loading dots) usa um estado interno (`setLoadingDots`) que dispara re-renderizações de `ChatMessages` a cada 200ms, o que é repassado em cascata a todos os componentes de mensagens filhos.

### Detalhes Técnicos

- **Arquivo**: `src/components/chat-components/ChatMessages.tsx:49-59`
- Um `setInterval` a 200ms chama `setLoadingDots()`, atualizando o estado interno do `ChatMessages` que é envolvido em `memo`.
- Mudanças de estado interno ignoram `React.memo`, forçando toda a lista de mensagens a re-renderizar.
- Combinado com a Descoberta #1, todos os filhos `ChatSingleMessage` históricos re-renderizam também.

### Solução Recomendada

Extraia os pontos de carregamento em um pequeno componente separado que gerencia seu próprio estado:

```tsx
const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    /* lógica do intervalo */
  }, []);
  return <span>{dots}</span>;
};
```

Isso isola as re-renderizações de 200ms a apenas o indicador de carregamento, não à lista completa de mensagens.

### Impacto

- **Afeta**: Toda fase de carregamento (esperando pela resposta da IA).
- **Causa**: 5 re-renderizações completas de árvore desnecessárias por segundo durante o carregamento.

---

## 8. [TODO] VaultDataManager Tag Refresh Faz Varredura de Todos os Arquivos Markdown (MÉDIO)

### Descrição do Problema

`refreshTagsFrontmatter()` e `refreshTagsAll()` iteram cada um sobre TODOS os arquivos markdown, e ambos são disparados de forma independente em toda alteração de arquivo/alteração de metadados.

### Detalhes Técnicos

- **Arquivo**: `src/state/vaultDataAtoms.ts:234-271`
- Ambos os métodos chamam `app.vault.getMarkdownFiles()` e iteram com `getTagsFromNote()` sobre cada arquivo.
- Ambos são acionados pelos eventos `handleFileModify` e `handleMetadataChange` (debounce de 250ms).
- Para um vault com 5000 arquivos markdown, isso significa duas varreduras completas do vault a cada salvamento de arquivo.

### Solução Recomendada

1. Junte os dois métodos de atualização em uma única passagem que calcule tanto os metadados (frontmatter) quanto todas as tags simultaneamente.
2. Considere atualizações incrementais de tags — recálcule tags apenas para o arquivo que sofreu alteração, não para todo o vault.

### Impacto

- **Afeta**: Usuários com vaults grandes.
- **Disparos**: A cada salvamento de arquivo (após debounce de 250ms).
- **Geralmente mitigado por**: Debounce. Mas para vaults muito grandes, mesmo uma varredura pode levar 50-100ms.

---

## 9. [TODO] Dependências das Callbacks de Chat.tsx Incluem Array chatHistory (MÉDIO)

### Descrição do Problema

`handleRegenerate`, `handleEdit` e `handleDelete` no `Chat.tsx` dependem de `chatHistory` em seus arrays de dependência de `useCallback`, fazendo com que sejam recriadas a cada renderização e anulando o `React.memo` do `ChatMessages`.

### Detalhes Técnicos

- **Arquivo**: `src/components/Chat.tsx:421-472, 474-550, 664-683`
- Essas callbacks acessam `chatHistory[messageIndex]` para obter a mensagem na qual devem operar.
- Como `chatHistory` recebe uma nova referência de array em cada atualização de estado (Descoberta #4), essas callbacks são recriadas a cada renderização.
- Elas são passadas como props para `ChatMessages` (que é memoizado), mas as referências de callback novas forçam a re-renderização mesmo assim.

### Solução Recomendada

Use uma ref para manter o `chatHistory` mais recente e o acesse dentro das callbacks:

```typescript
const chatHistoryRef = useRef(chatHistory);
chatHistoryRef.current = chatHistory;

const handleRegenerate = useCallback(
  (messageIndex: number) => {
    const message = chatHistoryRef.current[messageIndex];
    // ... resto da lógica
  },
  [
    /* apenas dependências estáveis */
  ]
);
```

Isso mantém a identidade da callback estável enquanto permite que você sempre leia os dados mais atuais.

### Impacto

- **Afeta**: Na prática, anula o `React.memo` no `ChatMessages`, compondo a Descoberta #1.

---

## 10. [TODO] Manipulação do DOM de ChatSingleMessage em useEffect Durante o Streaming (MÉDIO)

### Descrição do Problema

O principal `useEffect` de renderização no `ChatSingleMessage` executa extensas operações síncronas do DOM a cada alteração da prop `message`, o que, durante o streaming, acontece a cada tick (RAFs - RequestAnimationFrame).

### Detalhes Técnicos

- **Arquivo**: `src/components/chat-components/ChatSingleMessage.tsx:533-723`
- As operações incluem: `querySelectorAll`, `createElement`, `insertBefore`, `appendChild`, `remove`, `MarkdownRenderer.renderMarkdown()`.
- Durante o streaming, apenas a instância do `ChatSingleMessage` que está streamando realiza este trabalho (mensagens históricas também fariam, conforme a Descoberta #1, mas elas não deveriam estar recebendo novas props).
- O callback `preprocess` (linha 246) executa várias substituições de regex e divisões de string a cada atualização.

### Solução Recomendada

1. Corrija a Descoberta #1 primeiro — isto elimina manipulação DOM para mensagens históricas durante o streaming.
2. Para a mensagem que está no stream, considere usar atualizações diferenciais (apenas re-renderize novo conteúdo anexado desde o último quadro) em vez de reprocessar a mensagem inteira a cada token.

### Impacto

- **Afeta**: Renderização da mensagem em stream (streaming message).
- **Majoritariamente contido**: Depois de corrigir a Descoberta #1, apenas a instância de um componente faz isso por quadro.

---

## 11. [TODO] preprocess em ChatSingleMessage: Quebra (Splitting) Repetida via Regex (MÉDIO)

### Descrição do Problema

O helper `replaceLinks` divide a mensagem em blocos de código usando regex e, em seguida, executa mais substituições regex em cada parte. Isso ocorre duas vezes por renderização (uma para imagens, uma para links).

### Detalhes Técnicos

- **Arquivo**: `src/components/chat-components/ChatSingleMessage.tsx:378-395`
- **Código**: `text.split(/(```[\s\S]*?```|`[^`]\*`)/g)` cria um array de segmentos código/não-código e, em seguida, a substituição regex executa em cada segmento não-código. Chamado duas vezes na pipeline de pré-processamento.
- Para respostas da IA extensas com vários blocos de código, isso é O(partes x tamanho_do_conteúdo) por chamada.

### Solução Recomendada

Divida o conteúdo em segmentos de código/não-código uma vez e aplique todas as transformações aos segmentos não-código em uma única passagem.

### Impacto

- **Afeta**: Respostas longas de IA durante o streaming.
- **A severidade dimensiona com**: Comprimento da mensagem e número de blocos de código.

---

## 12. [TODO] Falta de React.memo em Componentes-Folha Renderizados com Frequência (BAIXO)

### Descrição do Problema

Diversos componentes de nível inferior (folhas) que são re-renderizados frequentemente devido a re-renderizações de pais não estão envolvidos em `React.memo`.

### Detalhes Técnicos

- **ChatButtons** (`src/components/chat-components/ChatButtons.tsx`): Renderiza para todas as mensagens, recebe callbacks que mudam na re-renderização do componente pai.
- **MessageContext** (`src/components/chat-components/ChatSingleMessage.tsx:85`): Renderiza as etiquetas (badges) de contexto de cada mensagem.
- **ChatHistoryItem** (`src/components/chat-components/ChatHistoryPopover.tsx:349`): Recebe `confirmDeleteId` que muda para todos os itens em qualquer confirmação de exclusão.

### Solução Recomendada

Envolva cada um em `React.memo`. Para `ChatHistoryItem`, considere passar apenas um booleano `isConfirmingDelete` em vez do completo `confirmDeleteId` para reduzir as re-renderizações desnecessárias.

### Impacto

- **Individualmente insignificante**, mas se acumula com outras descobertas.

---

## 13. [TODO] useAtMentionSearch Cria Ansiosamente (Eagerly) Elementos React Para Todos os Itens do Vault (BAIXO)

### Descrição do Problema

Os memos `noteItems`, `folderItems` e `webTabItems` criam `React.createElement` para componentes de ícones em cada item, mesmo quando o menu (typeahead) não está aberto.

### Detalhes Técnicos

- **Arquivo**: `src/components/chat-components/hooks/useAtMentionSearch.ts:45-113`
- Para vaults com 5000+ notas, isso cria mais de 5000 elementos React na inicialização (mount).
- As deps do `useMemo` incluem `allNotes` que muda a cada evento do vault.

### Solução Recomendada

Atrase (defer) a criação do elemento do ícone até o momento da renderização (passe o tipo do componente do ícone em vez da instância do elemento), ou apenas compute os itens quando o menu estiver aberto.

### Impacto

- **Afeta**: O tempo de inicialização (mount time) e a memória para vaults de grande escala.
- **Mitigado por**: `useMemo` — apenas recalcula quando as deps mudam.

---

## 14. [TODO] ChatHistoryItem em ChatHistoryPopover Não Está Memoizado (BAIXO)

### Descrição do Problema

`ChatHistoryItem` recebe várias propriedades que mudam por meio de todos os itens quando apenas um único item está sendo excluído ou editado.

### Detalhes Técnicos

- **Arquivo**: `src/components/chat-components/ChatHistoryPopover.tsx:349-486`
- `confirmDeleteId` muda para todos os itens quando alguma exclusão é confirmada.
- `editingTitle` muda a cada pressionamento de tecla durante a edição.
- Todos os itens re-renderizam quando algum destes se altera.

### Solução Recomendada

Envolva `ChatHistoryItem` em `React.memo`. Passe dados booleanos deduzidos (`isConfirmingDelete`, `isEditing`) em vez de identificadores globais.

### Impacto

- **Mitigado por**: Paginação (no máximo 50 itens exibidos por vez).
- **Quase insignificante** com a arquitetura atual.

---

## Bons Padrões Já Em Prática

Estes padrões foram identificados como já bem implementados:

- **Streaming controlado pelo RAF**: O uso de `useRafThrottledCallback` efetua o controle do recebimento constante de dados de texto pelas chamadas às janelas de renderização
- **Memo do ChatMessages**: O componente pai, `ChatMessages` está abrangido no bloco de código com `React.memo` (ainda que anulado no presente caso pelas propriedades instáveis - Veja Descobertas #1, #4, #9)
- **Paginação em ChatHistoryPopover**: Paginação infinita baseada em IntersectionObserver impede a renderização de todo o histórico de vez
- **Uso do Debounce do VaultDataManager**: Intervalo seguro de 250ms contra repetição em eventos de Vault
- **Adoção de useLayoutEffect na paginação**: Ação imediata previne oscilações (frame render spike) aquando a janela reaparece (pop-over abre)
- **Memo do RelevantNotes**: Foi adotado um uso ótimo do bloco para cache a fim de `React.memo`
- **Mensagem de stream sendo mantida em zona de processamento individual**: Para que somente a parte afetada seja alvo da repetição de texto. Exibição e atualização ocorre em um arquivo individual de modo `ChatSingleMessage` para conter alterações excessivas a base global.

---

## Prioridades e Correções Direcionadas a Atuação Estratégica

| Prioridade | Descoberta                                          | Esforço   | Impacto Previsto                                 |
| ---------- | --------------------------------------------------- | --------- | ------------------------------------------------ |
| P0         | #1 Adicionar o bloco ao arquivo ChatSingleMessage   | Médio     | Elimina problema na navegação sob texto interativo (streaming) |
| P0         | #2 Isolar a aplicação das validações (Filtro)       | Trivial   | Redução e otimização para cálculos pontuais      |
| P1         | #9 Atualizar uso das chaves estáticas de chat.tsx   | Pouco     | Repara a quebra ocasionada a estrutura global    |
| P1         | #4 Reparo nos Arrays de Chat History                | Pouco     | Solução do encadeamento desenfreado a chamadas   |
| P1         | #7 Componente visual sob carregamento de chamadas   | Trivial   | Corta cerca de 5 atualizações a cada segundo     |
| P2         | #3 Manter local Cache sobre Persistence Manager     | Trivial   | Protege e diminui uso nos ciclos pelo GC         |
| P2         | #5 Controle da contagem (Chat History) no scroll    | Pouco     | Extermina alterações repentinas durante a navegação|
| P2         | #6 Filtro imediato (Vault Data) na lista de notas   | Trivial   | Reduz processamento sob Vaults Grandes           |
| P3         | #8 Única verificação pontual contra Vault Arrays    | Pouco     | Reduzirá o número total de execuções efetuadas   |
| P3         | #10-14 Todos outros pontos menores e sem agravamento| Baixo/Méd.| Previne possíveis casos (Melhorias Contínuas)    |

---

_Última atualização: 2026-03-03_
