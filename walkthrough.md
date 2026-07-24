# Walkthrough - Custom Agents & Agent Skills Integration

## Accomplished Changes

### 1. Core Data Models & Frontmatter Parser

- **[UserSystemPrompt](file:///c:/Users/fjuni/OneDrive/Documentos/GitHub/obsidian-copilot/src/system-prompts/type.ts):** Updated the `UserSystemPrompt` interface to support optional Agent Skill metadata fields: `description?: string`, `model?: string`, and `color?: string`.
- **[agentSkillMetadata.ts](file:///c:/Users/fjuni/OneDrive/Documentos/GitHub/obsidian-copilot/src/system-prompts/agentSkillMetadata.ts):** Created a dedicated helper module with sanitization functions (`sanitizeAgentColor`, `sanitizeAgentDescription`, `sanitizeAgentModel`) and model override resolution logic (`resolveAgentSkillModel`).
- **[systemPromptUtils.ts](file:///c:/Users/fjuni/OneDrive/Documentos/GitHub/obsidian-copilot/src/system-prompts/systemPromptUtils.ts):** Modified `parseSystemPromptFile` to extract `description`, `model`, and `color` from file frontmatter (e.g. `.claude/agents/*.md`), and updated `ensurePromptFrontmatter` to preserve metadata on save.

### 2. Application State & Model Override Sync

- **[state.ts](file:///c:/Users/fjuni/OneDrive/Documentos/GitHub/obsidian-copilot/src/system-prompts/state.ts):** Integrated model override switching into `setSelectedPromptTitle`. When selecting a prompt with a `model` property, the active chat model automatically switches to the matching active model. Unselecting or starting a new chat (`resetSessionSystemPromptSettings`) restores the user's previous model key.

### 3. UI Component Updates

- **[SystemPromptAddModal.tsx](file:///c:/Users/fjuni/OneDrive/Documentos/GitHub/obsidian-copilot/src/system-prompts/SystemPromptAddModal.tsx):** Added form input fields for `description`, `model`, and `color` tag.
- **[ChatSettingsPopover.tsx](file:///c:/Users/fjuni/OneDrive/Documentos/GitHub/obsidian-copilot/src/components/chat-components/ChatSettingsPopover.tsx):** Rendered an Agent Skill metadata badge (showing skill description, color indicator dot, and requested model tag) below the system prompt selector.

---

## Verification Results

### Automated Quality Gates

1. **ESLint Linter (`npm run lint`):** **PASSED** (0 errors, 0 warnings).
2. **Unit Test Suite (`npm test`):**
   - **`agentSkillMetadata.test.ts`**: PASSED (100% coverage on sanitization and model resolution).
   - **`state.test.ts`**: PASSED.
   - **`systemPromptUtils.test.ts` & `systemPromptRegister.test.ts`**: PASSED.
3. **Production Build (`npm run build`):** **PASSED** (Compiled `main.js`, `manifest.json`, `styles.css`).

### Example Agent Skill Frontmatter Supported

```yaml
---
name: pr-pricing
description: Analisa escopo, risco, tamanho e precificação de pull requests.
model: claude-sonnet-4-6|anthropic
color: "#22c55e"
---
```
