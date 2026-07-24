# Documentação do Sistema de Ferramentas

## Visão Geral

O sistema de ferramentas do Copilot utiliza um padrão de registro centralizado que facilita a adição de novas ferramentas, incluindo futuras ferramentas MCP (Model Context Protocol). Todas as ferramentas são gerenciadas através de um singleton `ToolRegistry` que fornece uma interface unificada para descoberta, configuração e execução de ferramentas.

## Arquitetura de Prompts de Ferramentas

### Como as Instruções de Ferramentas Fluem para o LLM

O sistema utiliza **chamada nativa de ferramentas** via `bindTools()` do LangChain para invocação de ferramentas. Os resultados das ferramentas são formatados como contexto em uma abordagem em camadas:

1. **Descrições de Schema das Ferramentas** (schemas Zod nas implementações das ferramentas)

   - Define formatos de parâmetros, regras e validação
   - Fornecidos ao LLM via `bindTools()` para chamada nativa de ferramentas

2. **Instruções Personalizadas de Prompt** (em `builtinTools.ts`)

   - Orientação comportamental sobre quando e como usar ferramentas
   - Requisitos especiais (ex: "sempre forneça salientTerms")

3. **Adaptações Específicas por Modelo** (em `modelAdapter.ts`)
   - Último recurso para peculiaridades específicas de cada modelo

### Integração de Prompts em Camadas

- O `ContextManager` promove artefatos anexados pelo usuário de turnos anteriores para o **L2 (Biblioteca de Contexto)**, de modo que cada executor de cadeia (chain runner) comece com o mesmo prefixo de sistema cacheável.
- Quando uma ferramenta é executada durante o turno atual, sua carga de resultado é preposta à **mensagem do usuário** (L3 + L5) usando `renderCiCMessage(...)`. Nada é injetado na mensagem do sistema, mantendo L1/L2 estáveis.
- `LayerToMessagesConverter.convert(envelope, { includeSystemMessage: true, mergeUserContent: true })` materializa as mensagens base; os executores então anexam resultados de ferramentas antes de enviar ao modelo.
- O `promptPayloadRecorder` inspeciona a carga final e destaca os blocos de ferramentas em sua visualização em camadas, facilitando a depuração da estrutura L1-L5.

### Por Que Duas Camadas: Schema vs Instruções Personalizadas

**Diferença Chave**: Descrições de schema documentam parâmetros via Zod, enquanto instruções personalizadas fornecem orientação comportamental.

1. **Separação Clara**

   - **Schema**: Documentação de parâmetros (tipos, formatos, regras) via Zod - usado pelo `bindTools()`
   - **Instruções Personalizadas**: Orientação comportamental sobre quando e como usar a ferramenta

2. **Compatibilidade com MCP**

   - Ferramentas externas fornecem schemas imutáveis
   - Adicionamos instruções personalizadas sem modificar o código delas

3. **Exemplo**

   ```typescript
   // Schema (fornecido ao LLM via bindTools())
   const searchSchema = z.object({
     query: z.string().min(1).describe("The search query"),
     salientTerms: z.array(z.string()).describe("Keywords to find in notes"),
   });

   // Instruções Personalizadas (orientação comportamental)
   customPromptInstructions: `
   When searching notes:
   - Always provide salientTerms extracted from the user's query
   - Use getTimeRangeMs first for time-based queries
   - Examine relevance scores before using results
   `;
   ```

### Melhores Práticas

1. **Descrições de Schema: Apenas Documentação de Parâmetros**

   - Documente tipos de parâmetros, formatos e regras de validação via Zod
   - Os schemas são fornecidos automaticamente ao LLM via `bindTools()`
   - Foque no contrato de dados

2. **Instruções Personalizadas: Orientação Comportamental**

   - Explique quando usar esta ferramenta vs alternativas
   - Mostre padrões de uso comuns e requisitos
   - Inclua dicas para melhores resultados (ex: "use getTimeRangeMs antes de localSearch")

3. **Adaptadores de Modelo: Correções Específicas por Modelo**
   - Apenas para falhas persistentes específicas de cada modelo
   - Mantenha mínimo e direcionado

### Fluxo de Prompting CiC do localSearch

- CiC: Corpus in Context https://arxiv.org/pdf/2406.13121
- **Instrução Primeiro**: O `CopilotPlusChainRunner` agora monta a carga do localSearch via `buildLocalSearchInnerContent`, garantindo que a orientação de citação (ex: regras `<guidance>`) encabece o bloco XML antes de quaisquer documentos.
- **Documentos em Seguida**: Os resultados de busca são serializados uma vez através de `formatSearchResultsForLLM`; o auxiliar simplesmente os anexa após a orientação, mantendo a seção de documentos intocada mas claramente separada.
- **Pergunta por Último**: O `renderCiCMessage` formata o prompt final de modo que qualquer contexto preceda a consulta original do usuário; isso segue a recomendação CiC para ordenação instrução → contexto → consulta.
  - **CopilotPlus**: Usa `LayerToMessagesConverter` que adiciona o rótulo `[User query]:` ao mesclar conteúdo L3+L5 do envelope
  - **AutonomousAgent**: Usa `ensureCiCOrderingWithQuestion` que adiciona o rótulo `[User query]:` para separar claramente resultados de ferramentas da consulta original no loop iterativo
  - **Consistência**: Ambas as cadeias usam o mesmo formato de rótulo `[User query]:` para prompting uniforme em toda a base de código
- **Encapsulamento Reutilizável**: O `wrapLocalSearchPayload` centraliza a criação da tag `<localSearch>` (incluindo `timeRange` opcional), tornando o layout reutilizável para futuras cadeias sem copiar concatenação de strings.

## Implementação Atual

### Arquivos Principais

- `src/tools/ToolRegistry.ts` - Registro central para todas as ferramentas
- `src/tools/builtinTools.ts` - Definições e inicialização de ferramentas embutidas
- `src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts` - Execução de ferramentas no agente
- `src/settings/v2/components/ToolSettingsSection.tsx` - UI de configurações para ferramentas

### Padrão do Registro de Ferramentas

O `ToolRegistry` é um singleton que gerencia todas as ferramentas:

```typescript
class ToolRegistry {
  static getInstance(): ToolRegistry;
  register(definition: ToolDefinition): void;
  registerAll(definitions: ToolDefinition[]): void;
  getAllTools(): ToolDefinition[];
  getEnabledTools(enabledToolIds: Set<string>, vaultAvailable: boolean): SimpleTool<any, any>[];
  getToolsByCategory(): Map<string, ToolDefinition[]>;
  getConfigurableTools(): ToolDefinition[];
  getToolMetadata(id: string): ToolMetadata | undefined;
  clear(): void;
}
```

### Estrutura de Definição de Ferramentas

```typescript
interface ToolDefinition {
  tool: SimpleTool<any, any>; // A implementação real da ferramenta
  metadata: ToolMetadata; // Metadados de UI e configuração
}

interface ToolMetadata {
  id: string; // Identificador único
  displayName: string; // Exibido na UI
  description: string; // Texto de ajuda
  category: "search" | "time" | "file" | "media" | "mcp" | "custom";
  isAlwaysEnabled?: boolean; // Se verdadeiro, não é configurável (ex: ferramentas de tempo)
  requiresVault?: boolean; // Necessita acesso ao vault
  customPromptInstructions?: string; // Prompts específicos da ferramenta
}
```

## Adicionando uma Nova Ferramenta Embutida

### 1. Implemente a Ferramenta

Crie sua ferramenta seguindo a interface `SimpleTool`:

```typescript
// Exemplo: Nova ferramenta embutida
import { z } from "zod";
import { SimpleTool } from "./SimpleTool";

export const myNewTool: SimpleTool<{ input: string }, { result: string }> = {
  name: "myNewTool",
  description: "Description for the LLM to understand when to use this tool",
  schema: z.object({
    input: z.string().describe("The input parameter description"),
  }),
  func: async (params) => {
    // Implementação da ferramenta
    const result = await performOperation(params.input);
    return { result };
  },
};
```

### 2. Adicione às Ferramentas Embutidas

Atualize `src/tools/builtinTools.ts`:

```typescript
export const BUILTIN_TOOLS: ToolDefinition[] = [
  // ... ferramentas existentes ...
  {
    tool: myNewTool,
    metadata: {
      id: "myNewTool",
      displayName: "My New Tool",
      description: "User-friendly description for settings UI",
      category: "custom", // Escolha a categoria apropriada
      // Flags opcionais:
      isAlwaysEnabled: false, // Defina como true se a ferramenta deve estar sempre disponível
      requiresVault: true, // Defina como true se a ferramenta precisa de acesso ao vault
      customPromptInstructions: "Special instructions for the AI when using this tool",
    },
  },
];
```

### 3. Atualize as Configurações Padrão (se configurável)

Se a ferramenta for configurável (não sempre ativada), adicione seu ID às ferramentas ativadas por padrão em `src/constants.ts`:

```typescript
autonomousAgentEnabledToolIds: [
  "localSearch",
  "webSearch",
  "pomodoro",
  "youtubeTranscription",
  "writeToFile",
  "myNewTool"  // Adicione o ID da sua ferramenta aqui
],
```

## Adicionando Ferramentas MCP (Implementação Futura)

### 1. Wrapper de Ferramenta MCP

Crie um wrapper para converter ferramentas MCP para a interface SimpleTool:

```typescript
function createMcpToolWrapper(serverName: string, mcpTool: McpTool): SimpleTool<any, any> {
  return {
    name: `${serverName}_${mcpTool.name}`,
    description: mcpTool.description || `MCP tool from ${serverName}`,
    schema: convertMcpSchemaToZod(mcpTool.inputSchema),
    func: async (params) => {
      // Chamar o servidor MCP
      const result = await mcpHub.callTool(serverName, mcpTool.name, params);

      // Converter resposta MCP para o formato esperado
      return {
        result: formatMcpResponse(result),
      };
    },
  };
}
```

### 2. Registro Dinâmico de Ferramentas MCP

Registre ferramentas MCP quando os servidores se conectarem:

```typescript
// No seu código de inicialização MCP
export async function registerMcpServerTools(serverName: string, mcpTools: McpTool[]) {
  const registry = ToolRegistry.getInstance();

  for (const mcpTool of mcpTools) {
    registry.register({
      tool: createMcpToolWrapper(serverName, mcpTool),
      metadata: {
        id: `mcp_${serverName}_${mcpTool.name}`,
        displayName: mcpTool.displayName || mcpTool.name,
        description: mcpTool.description || `MCP tool from ${serverName}`,
        category: "mcp",
        // Ferramentas MCP são configuráveis pelo usuário por padrão
        isAlwaysEnabled: false,
        // Adicione quaisquer instruções de prompt específicas para MCP
        customPromptInstructions: mcpTool.systemPrompt,
      },
    });
  }
}

// Quando o servidor MCP desconectar
export function unregisterMcpServerTools(serverName: string) {
  const registry = ToolRegistry.getInstance();
  const allTools = registry.getAllTools();

  // Remover ferramentas deste servidor
  const toolsToKeep = allTools.filter((t) => !t.metadata.id.startsWith(`mcp_${serverName}_`));

  registry.clear();
  registry.registerAll(toolsToKeep);

  // Reinicializar ferramentas embutidas
  initializeBuiltinTools(app.vault);
}
```

### 3. Auxiliar de Conversão de Schema

Converta JSON Schema do MCP para schema Zod:

```typescript
function convertMcpSchemaToZod(jsonSchema: any): z.ZodSchema {
  // Implementação básica - estenda conforme necessário
  if (jsonSchema.type === "object") {
    const shape: any = {};

    for (const [key, prop] of Object.entries(jsonSchema.properties || {})) {
      const propSchema = prop as any;

      if (propSchema.type === "string") {
        shape[key] = z.string();
        if (propSchema.description) {
          shape[key] = shape[key].describe(propSchema.description);
        }
      } else if (propSchema.type === "number") {
        shape[key] = z.number();
      } else if (propSchema.type === "boolean") {
        shape[key] = z.boolean();
      } else if (propSchema.type === "array") {
        shape[key] = z.array(z.any()); // Simplificação
      } else if (propSchema.type === "object") {
        shape[key] = z.object({});
      }

      // Tratar propriedades opcionais
      if (!jsonSchema.required?.includes(key)) {
        shape[key] = shape[key].optional();
      }
    }

    return z.object(shape);
  }

  // Fallback para outros tipos
  return z.any();
}
```

### 4. Armazenamento de Configurações para Ferramentas MCP

As preferências de ferramentas MCP são armazenadas no mesmo array que as ferramentas embutidas:

```typescript
// Ao ativar/desativar ferramentas MCP:
function updateMcpToolSetting(toolId: string, enabled: boolean) {
  const settings = getSettings();
  const enabledIds = new Set(settings.autonomousAgentEnabledToolIds || []);

  if (enabled) {
    enabledIds.add(toolId);
  } else {
    enabledIds.delete(toolId);
  }

  updateSetting("autonomousAgentEnabledToolIds", Array.from(enabledIds));
}
```

## Como o Sistema Funciona

### Fluxo de Descoberta de Ferramentas

1. **Inicialização**: `initializeBuiltinTools()` registra todas as ferramentas embutidas
2. **Conexão MCP**: Quando servidores MCP se conectam, suas ferramentas são registradas dinamicamente
3. **UI de Configurações**: O componente `ToolSettingsSection` lê do registro para gerar a UI
4. **Execução de Ferramentas**: `AutonomousAgentChainRunner.getAvailableTools()` filtra ferramentas com base nas configurações

## Raízes de Renderização de Chamadas de Ferramentas

O invariant #409 do React surgiu quando banners de chamadas de ferramentas tentavam renderizar em raízes React que já haviam sido desmontadas. Para prevenir essa regressão, o plugin roteia toda renderização de banners através do gerenciador compartilhado em `src/components/chat-components/toolCallRootManager.tsx`.

### Responsabilidades do Gerenciador

- Rastreia `{ root, isUnmounting }` por mensagem/chamada de ferramenta via `window.__copilotToolCallRoots`.
- `ensureToolCallRoot` finaliza descartes pendentes e cria um novo `createRoot` quando necessário.
- `renderToolCallBanner` renderiza `<ToolCallBanner />` na raiz gerenciada; componentes nunca chamam `root.render` diretamente.
- `removeToolCallRoot` e `cleanupMessageToolCallRoots` agendam desmontagens no próximo tick e removem entradas somente após o descarte ser concluído.
- `cleanupStaleToolCallRoots` purga IDs de mensagens com mais de uma hora para evitar vazamento de raízes históricas.

### Notas de Integração

O `ChatSingleMessage` mantém `const rootsRef = useRef(getMessageToolCallRoots(messageId))`, que fornece um registro estável para cada mensagem. O componente delega todas as chamadas de ciclo de vida ao gerenciador e captura `rootsRef.current` dentro da limpeza de efeitos para satisfazer `react-hooks/exhaustive-deps`.

### Verificação

Execute o teste focado para cobrir o comportamento de streaming e integração de chamadas de ferramentas:

```
npm test -- src/components/chat-components/ChatSingleMessage.test.tsx
```
