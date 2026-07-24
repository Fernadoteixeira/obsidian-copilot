# Modelos e Parâmetros

Este guia explica como gerenciar modelos de chat, modelos de embedding e os parâmetros que controlam como a IA se comporta.

---

## Modelos de Chat

### Modelos Embutidos

O Copilot vem com um conjunto de modelos embutidos em muitos provedores. Alguns estão sempre incluídos (modelos "core"); outros podem ser ativados ou desativados.

| Modelo                        | Provedor     | Capacidades             |
| ----------------------------- | ------------ | ----------------------- |
| copilot-plus-flash            | Copilot Plus | Visão (Exclusivo Plus)  |
| google/gemini-2.5-flash       | OpenRouter   | Visão                   |
| google/gemini-2.5-pro         | OpenRouter   | Visão                   |
| google/gemini-3.5-flash       | OpenRouter   | Visão, Raciocínio       |
| google/gemini-3.1-pro-preview | OpenRouter   | Visão, Raciocínio       |
| openai/gpt-5.4                | OpenRouter   | Visão                   |
| openai/gpt-5-mini             | OpenRouter   | Visão                   |
| gpt-5.4                       | OpenAI       | Visão                   |
| gpt-5-mini                    | OpenAI       | Visão                   |
| gpt-4.1                       | OpenAI       | Visão                   |
| gpt-4.1-mini                  | OpenAI       | Visão                   |
| claude-opus-4-6               | Anthropic    | Visão, Raciocínio       |
| claude-sonnet-4-5-20250929    | Anthropic    | Visão, Raciocínio       |
| gemini-2.5-pro                | Google       | Visão                   |
| gemini-2.5-flash              | Google       | Visão                   |
| gemini-3.5-flash              | Google       | Visão, Raciocínio       |
| grok-4-1-fast                 | XAI          | Visão                   |
| deepseek-chat                 | DeepSeek     | —                       |
| deepseek-reasoner             | DeepSeek     | Raciocínio              |

### Badges de Capacidade do Modelo

Modelos podem exibir badges de capacidade:

- **Raciocínio** — Pensamento interno estendido antes de responder; melhor para tarefas complexas
- **Visão** — Pode processar imagens (ex: capturas de tela, diagramas embutidos em notas)
- **Busca na Web** — Pode acessar a internet diretamente (recurso nativo do modelo)

### Gerenciando Modelos

Vá em **Configurações → Copilot → Model** para ver a lista completa de modelos.

- **Ativar/desativar** — Alterne modelos individuais para controlar o que aparece no seletor de modelos
- **Reordenar** — Arraste modelos para alterar a ordem no menu suspenso
- **Excluir** — Remova modelos personalizados que você adicionou

### Adicionando Modelos Personalizados

Se seu provedor oferece um modelo que não está na lista embutida, você pode adicioná-lo manualmente:

1. Vá em **Configurações → Copilot → Model**
2. Clique em **Add Model**
3. Insira o nome do modelo exatamente como o provedor espera (ex: `gpt-4-turbo-preview`)
4. Selecione o provedor
5. Opcionalmente defina uma URL base personalizada (útil para proxies ou endpoints alternativos)
6. Salve

### Importando Modelos do Provedor

Você pode importar automaticamente a lista completa de modelos disponíveis de um provedor:

1. Vá em **Configurações → Copilot → Model**
2. Encontre o botão **Import models** do seu provedor
3. O Copilot buscará a lista de modelos do provedor e adicionará os novos

---

## Modelos de Embedding

Modelos de embedding convertem texto em vetores numéricos, o que possibilita a busca semântica (baseada em significado) no modo Q&A no Vault e o recurso "Notas Relevantes".

### Modelos de Embedding Embutidos

| Modelo                        | Provedor                          |
| ----------------------------- | --------------------------------- |
| copilot-plus-small            | Copilot Plus (Exclusivo Plus)     |
| copilot-plus-large            | Copilot Plus (Exclusivo Believer) |
| copilot-plus-multilingual     | Copilot Plus (Exclusivo Plus)     |
| openai/text-embedding-3-small | OpenRouter                        |
| text-embedding-3-small        | OpenAI                            |
| text-embedding-3-large        | OpenAI                            |
| embed-multilingual-light-v3.0 | Cohere                            |
| text-embedding-004            | Google                            |
| gemini-embedding-001          | Google                            |
| Qwen3-Embedding-0.6B          | SiliconFlow                       |

### Selecionando um Modelo de Embedding

Vá em **Configurações → Copilot → QA** → **Embedding Model**.

Se você trocar os modelos de embedding, precisará reconstruir o índice do vault, porque os vetores antigos são incompatíveis com o novo modelo. O Copilot pedirá confirmação antes de reconstruir.

### O que Embeddings Afetam

- **Modo Q&A no Vault** — Usa embeddings para encontrar notas relevantes pelo significado
- **Busca Semântica** — O botão "Enable Semantic Search" nas configurações de QA
- **Notas Relevantes** — Mostra notas semanticamente similares na barra lateral

---

## Parâmetros do Modelo

Estas configurações controlam como a IA responde. Os padrões globais ficam em Configurações → Copilot → Model. Você pode sobrescrevê-los por sessão usando o ícone de engrenagem no painel de chat.

### Temperatura

Controla quão aleatórias ou criativas as respostas são.

- **Faixa**: 0.0–1.0
- **Padrão**: 0.1
- **Baixa (0.0–0.2)**: Precisa, factual, determinística
- **Média (0.4–0.6)**: Equilibrada
- **Alta (0.8–1.0)**: Criativa, variada, menos previsível

### Tokens Máximos

Número máximo de tokens na resposta da IA. Um **token** é cerca de ¾ de uma palavra (então 1.000 tokens ≈ 750 palavras).

- **Padrão**: 6.000
- Valores maiores permitem respostas mais longas, mas custam mais

### Turnos de Conversa no Contexto

Quantos turnos de conversa anteriores incluir em cada solicitação. Mais turnos = mais contexto, mas solicitações maiores.

- **Padrão**: 15 turnos
- Reduza isso se você atingir limites de contexto ou quiser diminuir custos

### Limite de Compactação Automática

Quando a conversa atinge essa quantidade de tokens, as mensagens mais antigas são resumidas automaticamente.

- **Padrão**: 128.000 tokens
- **Faixa**: 64.000–1.000.000 tokens
- Veja [Interface de Chat](chat-interface.pt-BR.md#auto-compact) para detalhes

### Esforço de Raciocínio

Para modelos com capacidade de raciocínio (como deepseek-reasoner, claude-opus-4-6), controla quanto raciocínio interno o modelo faz antes de responder.

- **Opções**: minimal, low, medium, high, xhigh
- **Padrão**: low
- Maior esforço = melhores resultados em tarefas complexas, respostas mais lentas

### Verbosidade

Para modelos que suportam isso, controla o comprimento e detalhamento da resposta.

- **Opções**: low, medium, high
- **Padrão**: medium

### Top P

Uma alternativa à temperatura para controlar a aleatoriedade. Deixe no padrão, a menos que você tenha um motivo específico para alterá-lo.

### Penalidade de Frequência

Reduz a probabilidade de o modelo se repetir.

---

## Seleção de Modelo Padrão

O seu **modelo padrão** é aquele que o Copilot usa quando você abre um novo chat. Defina-o em:
**Configurações → Copilot → Básico → Default Chat Model**

O padrão é **OpenRouter Gemini 2.5 Flash** (requer chave de API OpenRouter).

---

## Relacionado

- [Provedores de LLM](llm-providers.pt-BR.md) — Configure chaves de API para seu provedor
- [Busca no Vault e Indexação](vault-search-and-indexing.pt-BR.md) — Como modelos de embedding são usados
