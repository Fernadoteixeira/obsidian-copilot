# Chamada de Ferramentas via AWS Bedrock (Bedrock Tool Calling)

Este documento especifica o design técnico para suporte a chamadas de função/ferramentas via AWS Bedrock no Copilot para Obsidian.

---

## Perfis de Inferência Cross-Region

Para garantir maior disponibilidade e resiliência, todas as solicitações ao AWS Bedrock devem utilizar IDs de perfil de inferência cross-region (ex: `global.anthropic.claude-sonnet-4-5-20250929-v1:0` ou `us.anthropic.claude-sonnet-4-5-20250929-v1:0`).
