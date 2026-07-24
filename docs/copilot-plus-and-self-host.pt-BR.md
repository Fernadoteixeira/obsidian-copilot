# Copilot Plus e Auto-Hospedagem

**Copilot Plus** é um plano premium que desbloqueia recursos avançados além da experiência gratuita baseada em chave de API. **Modo Auto-Hospedado** é uma opção adicional para assinantes Copilot Plus Vitalício/Believer que desejam rodar sua própria infraestrutura.

---

## Copilot Plus

### O que é o Copilot Plus?

Copilot Plus é uma assinatura que habilita:

- **Modo agente autônomo** — IA que raciocina passo a passo e usa ferramentas automaticamente
- **Ferramentas de edição de arquivos** — Escrever em Arquivo e Substituir em Arquivo para edição de notas por IA
- **Busca na web** — Pesquisa na internet a partir do chat
- **Transcrição do YouTube** — Busca transcrições de vídeos e as usa como contexto
- **Sistema de memória** — Memória persistente entre conversas
- **Modelo Copilot Plus Flash** — Um modelo embutido que não requer chave de API separada
- **Processamento de URL** — Busca e resume páginas web como contexto
- **Modelos de embedding Copilot Plus** — Embeddings de alta qualidade para busca semântica

### Configurando o Copilot Plus

1. Obtenha uma chave de licença no seu painel em **https://www.obsidiancopilot.com/en/dashboard**
2. Vá em **Configurações → Copilot → Básico** (ou o banner do Plus nas configurações)
3. Insira sua chave de licença no campo **Copilot Plus License Key**
4. Os recursos são desbloqueados automaticamente

---

## Modelo Copilot Plus Flash

**Copilot Plus Flash** é um modelo de IA embutido incluído na sua assinatura Copilot Plus:

- Nenhuma chave de API separada necessária
- Funciona imediatamente assim que sua chave de licença estiver ativa
- Suporta visão (entradas de imagem)
- Bom para tarefas de propósito geral

Ele aparece como `copilot-plus-flash` no seletor de modelo.

---

## Sistema de Memória

O sistema de memória permite que o Copilot lembre de coisas entre conversas, para que você não precise se repetir.

### Conversas Recentes

O Copilot pode referenciar seu histórico de conversas recentes para fornecer respostas mais contextualmente relevantes. Isso é separado da janela de chat atual — é um resumo do que você tem trabalhado.

- **Ativar**: **Configurações → Copilot → Plus → Reference Recent Conversation** (ativado por padrão)
- **Quantas**: **Configurações → Copilot → Plus → Max Recent Conversations** — padrão 30, faixa 10–50
- Todo o histórico é armazenado localmente no seu vault (nenhum dado sai da sua máquina para este recurso)

### Memórias Salvas

Você pode pedir ao Copilot para lembrar explicitamente fatos específicos sobre você:

```
@memory lembre que eu estou me preparando para o JLPT N3 e prefiro resumos em tópicos
```

O Copilot salva isso em um arquivo de memória no seu vault e o referencia em conversas futuras.

- **Ativar**: **Configurações → Copilot → Plus → Reference Saved Memories** (ativado por padrão)
- **Pasta de memória**: **Configurações → Copilot → Plus → Memory Folder Name** — padrão: `copilot/memory`
- **Ferramenta de atualizar memória**: A IA pode adicionar, atualizar ou remover memórias quando você pedir

---

## Processador de Documentos

Quando o Copilot processa PDFs e outros arquivos não-markdown (no modo Plus), ele os converte para markdown para a IA ler.

Você pode opcionalmente salvar o markdown convertido em uma pasta no seu vault:

- **Configuração**: **Configurações → Copilot → Plus → Store converted markdown at**
- Deixe vazio para pular o salvamento (a conversão ainda acontece, apenas não é persistida)

---

## Modo Auto-Hospedado

### O que é o Modo Auto-Hospedado?

O Modo Auto-Hospedado permite substituir os serviços em nuvem do Copilot pela sua própria infraestrutura. Em vez de depender do backend Plus do Copilot, você roda tudo localmente ou no seu próprio servidor.

**Requer**: Uma licença Copilot Plus Vitalícia ou Believer (não disponível em assinaturas mensais).

### O que o Modo Auto-Hospedado Habilita

- Usar servidores LLM locais ou personalizados
- Busca web personalizada via Firecrawl ou Perplexity Sonar
- Extração local de transcrições do YouTube via Supadata
- Aplicativo desktop Miyo para parsing local de PDF, busca semântica e mais

### Ativando o Modo Auto-Hospedado

1. Vá em **Configurações → Copilot → Plus**
2. Em **Self-Host Mode**, ative **Enable Self-Host Mode**
3. O Copilot valida sua licença. Se válida, o toggle é ativado.
4. Ative **Enable Miyo** para usar o aplicativo desktop Miyo para busca local, parsing de PDF e contexto.
5. *(Opcional)* Defina **Custom Miyo Server URL** apenas se o Miyo estiver rodando em uma máquina remota. Deixe em branco para usar a descoberta automática de serviço local.

### Busca na Web no Modo Auto-Hospedado

Escolha seu provedor de busca web:

- **Firecrawl** — Uma API de crawling e scraping web. Obtenha uma chave em firecrawl.dev. Insira em **Configurações → Copilot → Plus → Firecrawl API Key**.
- **Perplexity Sonar** — Uma API de busca alimentada por IA. Obtenha uma chave em perplexity.ai. Insira em **Configurações → Copilot → Plus → Perplexity API Key**.

### Transcrição do YouTube no Modo Auto-Hospedado

Use sua própria chave de API Supadata para extração de transcrições do YouTube:

- Obtenha uma chave em supadata.ai
- Insira em **Configurações → Copilot → Plus → Supadata API Key**

---

## Aplicativo Desktop Miyo

O Miyo é um aplicativo desktop complementar do mesmo desenvolvedor que aprimora o Copilot com capacidades locais e offline:

### O que o Miyo Oferece

- **Busca semântica local** — Busca vetorial rápida sem chamadas de API de embedding
- **Parsing de PDF** — Converte PDFs para markdown localmente (sem OCR em nuvem)
- **Hub de contexto** — Gerencia seus documentos indexados localmente
- **URL de servidor personalizado** — Execute o Miyo em qualquer máquina (local ou servidor)

### Configurando o Miyo

1. Baixe e instale o aplicativo desktop Miyo
2. Inicie o servidor Miyo
3. No Copilot, vá em **Configurações → Copilot → Plus → Enable Miyo Search**
4. O Miyo conecta automaticamente ao servidor local (ou use uma URL personalizada em **Miyo Server URL**)
5. Indexe seu vault — o Copilot usará o Miyo para gerar e armazenar embeddings localmente

### URL Personalizada do Servidor Miyo

Se o Miyo estiver rodando em uma máquina diferente (ex: um servidor doméstico), insira seu endereço:

```
http://192.168.1.10:8742
```

Deixe vazio para usar a descoberta automática local.

---

## Relacionado

- [Modo Agente e Ferramentas](agent-mode-and-tools.pt-BR.md) — Usando o agente autônomo
- [Busca no Vault e Indexação](vault-search-and-indexing.pt-BR.md) — Como o Miyo aprimora a busca semântica
- [Primeiros Passos](getting-started.pt-BR.md) — Configuração inicial
