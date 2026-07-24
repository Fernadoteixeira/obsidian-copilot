# Provedores de LLM

O Copilot inclui 16 provedores de IA embutidos, e você pode adicionar um número ilimitado de modelos adicionais desde que sejam compatíveis com o formato OpenAI. Você pode usar serviços em nuvem que requerem chaves de API, ou rodar modelos localmente na sua própria máquina. Este guia explica como configurar cada provedor.

---

## Como Definir Chaves de API

1. Vá em **Configurações → Copilot → Básico**
2. Clique em **Set Keys** para abrir a caixa de diálogo de chaves de API
3. Insira sua chave para o provedor que deseja usar
4. Clique em Salvar

Você pode configurar múltiplos provedores simultaneamente e alternar entre eles mudando o modelo padrão.

---

## Provedores em Nuvem

### OpenRouter (Padrão)

OpenRouter é um gateway que fornece acesso a centenas de modelos de muitos provedores através de uma única chave de API.

- **Obtenha uma chave**: https://openrouter.ai/keys
- **Modelo padrão**: OpenRouter Gemini 2.5 Flash
- **Por que usar**: Uma chave, muitos modelos. Bom ponto de partida.
- **Chave da configuração**: `openRouterAiApiKey`

### OpenAI

Acesso direto ao GPT-4.1, GPT-5 e outros modelos da OpenAI.

- **Obtenha uma chave**: https://platform.openai.com/api-keys
- **Modelos incluem**: GPT-5.4, GPT-5 mini, GPT-5 nano, GPT-4.1, GPT-4.1 mini, GPT-4.1 nano, o4-mini (raciocínio)
- **Chave da configuração**: `openAIApiKey`

### Anthropic

Acesso aos modelos Claude (Opus, Sonnet, etc.).

- **Obtenha uma chave**: https://console.anthropic.com/settings/keys
- **Modelos incluem**: claude-opus-4-6, claude-sonnet-4-5
- **Chave da configuração**: `anthropicApiKey`

### Google Gemini

Acesso à família de modelos Gemini do Google.

- **Obtenha uma chave**: https://makersuite.google.com/app/apikey
- **Modelos incluem**: gemini-2.5-pro, gemini-2.5-flash, gemini-3.5-flash, gemini-3.1-pro-preview
- **Chave da configuração**: `googleApiKey`

### XAI / Grok

Acesso aos modelos Grok da xAI.

- **Obtenha uma chave**: https://console.x.ai
- **Modelos incluem**: grok-4-1-fast
- **Chave da configuração**: `xaiApiKey`

### Groq

Groq fornece inferência muito rápida para modelos de código aberto.

- **Obtenha uma chave**: https://console.groq.com/keys
- **Modelos incluem**: llama3-8b-8192 (e outros)
- **Chave da configuração**: `groqApiKey`

### Mistral

Acesso aos modelos da Mistral AI.

- **Obtenha uma chave**: https://console.mistral.ai/api-keys
- **Modelos incluem**: mistral-tiny-latest (e outros)
- **Chave da configuração**: `mistralApiKey`

### DeepSeek

Acesso aos modelos de chat e raciocínio da DeepSeek.

- **Obtenha uma chave**: https://platform.deepseek.com/api-keys
- **Modelos incluem**: deepseek-chat, deepseek-reasoner
- **Chave da configuração**: `deepseekApiKey`

### Cohere

Acesso aos modelos Command da Cohere.

- **Obtenha uma chave**: https://dashboard.cohere.ai/api-keys
- **Modelos incluem**: command-r
- **Chave da configuração**: `cohereApiKey`

### SiliconFlow

Uma plataforma de IA chinesa em nuvem com acesso aos modelos DeepSeek e Qwen.

- **Obtenha uma chave**: https://cloud.siliconflow.com/me/account/ak
- **Modelos incluem**: DeepSeek-V3, DeepSeek-R1 (via SiliconFlow)
- **Chave da configuração**: `siliconflowApiKey`

### Azure OpenAI

Acesso a modelos da OpenAI implantados no Microsoft Azure. Requer quatro campos configurados:

| Configuração    | Descrição                               |
| --------------- | --------------------------------------- |
| API Key         | Sua chave do Azure OpenAI               |
| Instance Name   | O nome do seu recurso Azure             |
| Deployment Name | O nome da implantação do seu modelo     |
| API Version     | ex: `2024-02-01`                        |

- **Nota**: Diferente dos outros provedores, o Azure OpenAI usa sua própria implantação no Azure
- **Embedding**: Também pode usar o Azure para embeddings (nome de implantação separado necessário)

### Amazon Bedrock

Acesso a modelos hospedados no AWS Bedrock.

- **Obtenha credenciais**: https://console.aws.amazon.com/iam/home#/security_credentials
- **Campos obrigatórios**: Access Key ID (chave de API), Região
- **Chave da configuração**: `amazonBedrockApiKey`

**Importante**: Sempre use IDs de perfil de inferência cross-region, não IDs de modelo simples. Por exemplo:

- Use: `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
- Não use: `anthropic.claude-sonnet-4-5-20250929-v1:0`

Perfis cross-region (com o prefixo `us.`, `eu.`, `apac.` ou `global.`) são mais confiáveis e disponíveis entre regiões.

### GitHub Copilot

Use sua assinatura existente do GitHub Copilot para acessar modelos de IA.

- **Fluxo OAuth**: Clique em **Connect GitHub Copilot** na caixa de diálogo de chaves de API
- **Nenhuma chave de API separada necessária** — autentica via GitHub OAuth
- **Requer**: Assinatura ativa do GitHub Copilot

---

## Provedores de Modelos Locais

Provedores locais rodam modelos no seu próprio computador. Nenhuma chave de API ou conexão com a internet necessária após a configuração.

### Ollama

Roda modelos de código aberto localmente na sua máquina.

- **Porta padrão**: 11434
- **URL**: `http://localhost:11434/v1/`
- **Configuração**: Instale o Ollama (ollama.ai), baixe um modelo, então adicione-o nas configurações de Modelo do Copilot
- **Nenhuma chave de API necessária**

### LM Studio

Um aplicativo desktop para rodar modelos locais com interface gráfica.

- **Porta padrão**: 1234
- **URL**: `http://localhost:1234/v1`
- **Configuração**: Instale o LM Studio, carregue um modelo, vá à aba Developer, **ative o CORS** (obrigatório), clique em "Start Server", então adicione o modelo no Copilot
- **Nenhuma chave de API necessária**

### 3rd Party (Formato OpenAI)

Para qualquer API que siga o formato da API OpenAI. Útil para implantações personalizadas, proxies ou outros servidores de inferência local (vLLM, LiteLLM, etc.).

- **Requer**: URL base e opcionalmente uma chave de API
- **Use quando**: Seu provedor não está na lista mas fala o formato OpenAI

> **Aviso de CORS**: Alguns provedores de terceiros (ex: Perplexity) não suportam CORS, o que faz o Copilot falhar com um erro de CORS. Ao adicionar um modelo personalizado para tal provedor, ative o toggle **CORS** no formulário de modelo personalizado. Nota: streaming não está disponível no modo CORS.

---

## Problemas Comuns por Provedor

| Provedor       | Problema Comum                                | Solução                                                                                        |
| -------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Azure OpenAI   | Falta um dos quatro campos obrigatórios       | Verifique todas as quatro configurações: chave, nome da instância, nome da implantação, versão da API |
| Amazon Bedrock | Limite de taxa ou modelo não encontrado        | Use IDs de perfil de inferência cross-region com prefixo `us.`, `eu.`, `apac.` ou `global.`    |
| GitHub Copilot | Token expirado                                 | Reautentique via o botão OAuth na caixa de diálogo de chaves de API                            |
| Ollama         | Conexão recusada                               | Certifique-se de que o Ollama está rodando (`ollama serve`) e a porta está correta              |
| Google Gemini  | Cota excedida                                  | Use um modelo diferente ou verifique sua cota em console.cloud.google.com                       |
| DeepSeek       | Erros de streaming                             | Tente desativar o streaming nas configurações por sessão se encontrar problemas                 |

---

## Relacionado

- [Modelos e Parâmetros](models-and-parameters.pt-BR.md) — Ativar, desativar e configurar modelos
- [Primeiros Passos](getting-started.pt-BR.md) — Configuração inicial
