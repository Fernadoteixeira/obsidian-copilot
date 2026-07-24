# Implementação de Chamada de Ferramentas (Tool Calling) no BedrockChatModel

## Status: ✅ IMPLEMENTADO

Suporte nativo para chamada de ferramentas/funções foi adicionado à classe personalizada `BedrockChatModel` para o modo Agente.

---

## Resumo

O `BedrockChatModel` agora suporta chamadas de ferramentas nativas do LangChain via `model.bindTools(tools)`, permitindo que funcione com o modo Agente assim como `ChatOpenAI`, `ChatAnthropic` e `ChatGoogleGenerativeAI`.

---

## Detalhes da Implementação

### 1. Método `bindTools()`

```typescript
bindTools(tools: StructuredToolInterface[]): BedrockChatModel {
  const bound = Object.create(this) as BedrockChatModel;
  bound.boundTools = tools;
  return bound;
}
```

Cria uma nova instância com ferramentas vinculadas, seguindo o padrão do LangChain.

### 2. Conversão de Formato de Ferramenta

```typescript
private convertToolsToClaude(tools: StructuredToolInterface[]): any[] {
  return tools.map((tool) => {
    let inputSchema: any = { type: "object", properties: {} };
    if (tool.schema) {
      inputSchema = isInteropZodSchema(tool.schema)
        ? toJsonSchema(tool.schema)
        : tool.schema;
    }
    return {
      name: tool.name,
      description: tool.description || "",
      input_schema: inputSchema,
    };
  });
}
```

Usa `isInteropZodSchema` e `toJsonSchema` do LangChain para a conversão adequada do esquema.

### 3. Corpo da Requisição com Ferramentas

Ferramentas são incluídas no payload da requisição quando vinculadas:

```typescript
if (this.boundTools && this.boundTools.length > 0) {
  payload.tools = this.convertToolsToClaude(this.boundTools);
}
```

### 4. Tratamento de ToolMessage

`buildRequestBody` lida com `ToolMessage` (resultados de ferramentas) como blocos de conteúdo `tool_result`:

```typescript
if (messageType === "tool") {
  const toolMessage = message as ToolMessage;
  conversation.push({
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: toolMessage.tool_call_id,
        content: toolResultContent,
      },
    ],
  });
}
```

### 5. AIMessage com Chamadas de Ferramentas

`buildRequestBody` lida com `AIMessage` contendo `tool_calls` como blocos de conteúdo `tool_use`:

```typescript
if (toolCalls && toolCalls.length > 0) {
  const contentBlocks: ContentBlock[] = [];
  // Adiciona texto se presente
  // Adiciona blocos tool_use para cada chamada de ferramenta
  for (const tc of toolCalls) {
    contentBlocks.push({
      type: "tool_use",
      id: tc.id || `tool_${Date.now()}`,
      name: tc.name,
      input: tc.args as Record<string, unknown>,
    });
  }
}
```

### 6. Extração de Chamada de Ferramenta Não-Streaming

`_generate` extrai as chamadas de ferramentas da resposta do Claude:

```typescript
private extractToolCalls(data: any): any[] | undefined {
  if (!Array.isArray(data?.content)) return undefined;
  const toolUseBlocks = data.content.filter(
    (block: any) => block.type === "tool_use"
  );
  if (toolUseBlocks.length === 0) return undefined;
  return toolUseBlocks.map((block: any) => ({
    id: block.id,
    name: block.name,
    args: block.input || {},
    type: "tool_call" as const,
  }));
}
```

### 7. Pedaços (Chunks) de Chamada de Ferramenta em Streaming

`processStreamEvent` emite `tool_call_chunks` para o mecanismo de concatenação do LangChain:

```typescript
private extractToolCallChunk(event: any): { id?: string; index: number; name?: string; args?: string } | null {
  // content_block_start com tool_use - info inicial da chamada da ferramenta
  if (event.type === "content_block_start" && event.content_block?.type === "tool_use") {
    return {
      id: event.content_block.id,
      index: event.index ?? 0,
      name: event.content_block.name,
      args: "",
    };
  }
  // content_block_delta com input_json_delta - argumentos parciais da ferramenta
  if (event.type === "content_block_delta" && event.delta?.type === "input_json_delta") {
    return {
      index: event.index ?? 0,
      args: event.delta.partial_json || "",
    };
  }
  return null;
}
```

Pedaços de chamadas de ferramenta são emitidos como `AIMessageChunk` com `tool_call_chunks`:

```typescript
const toolCallChunk = this.extractToolCallChunk(innerEvent);
if (toolCallChunk) {
  const messageChunk = new AIMessageChunk({
    content: "",
    response_metadata: chunkMetadata,
    tool_call_chunks: [toolCallChunk],
  });
  deltaChunks.push(new ChatGenerationChunk({ message: messageChunk, text: "" }));
}
```

---

## Testes

```typescript
const model = new BedrockChatModel({
  modelId: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  apiKey: "...",
  endpoint: "...",
  streamEndpoint: "...",
});

const tools = [
  {
    name: "get_weather",
    description: "Get weather for a location",
    schema: z.object({ location: z.string() }),
  },
];

const boundModel = model.bindTools(tools);
const response = await boundModel.invoke([new HumanMessage("What's the weather in Tokyo?")]);

console.log(response.tool_calls); // Deve conter chamada de ferramenta
```

---

## Referência

- [Uso de Ferramentas do Claude no Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html)
- [Guia de Uso de Ferramentas da Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [ChatAnthropic do LangChain](https://github.com/langchain-ai/langchainjs/tree/main/libs/langchain-anthropic)
