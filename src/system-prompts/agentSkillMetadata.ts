/**
 * Safe CSS color validation pattern (names, hex, rgb/rgba, hsl/hsla)
 */
const SAFE_COLOR_PATTERN =
  /^(?:[a-zA-Z]{1,32}|#[0-9a-fA-F]{3,8}|(?:rgb|hsl)a?\(\s*[\d.%+\-,\s]+\))$/;

/**
 * Validate and sanitize an agent color value
 */
export function sanitizeAgentColor(color: unknown): string | undefined {
  if (typeof color !== "string") return undefined;
  const trimmed = color.trim();
  if (!trimmed) return undefined;
  if (SAFE_COLOR_PATTERN.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

/**
 * Validate and sanitize an agent description string
 */
export function sanitizeAgentDescription(description: unknown): string | undefined {
  if (typeof description !== "string") return undefined;
  // eslint-disable-next-line no-control-regex
  const cleaned = description.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "").trim();
  if (!cleaned) return undefined;
  return cleaned.slice(0, 500);
}

/**
 * Validate and sanitize an agent model override string
 */
export function sanitizeAgentModel(model: unknown): string | undefined {
  if (typeof model !== "string") return undefined;
  const trimmed = model.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, 150);
}

export interface ModelCandidate {
  name: string;
  provider: string;
  enabled?: boolean;
}

/**
 * Resolve an agent skill model override against a list of active models
 * Resolution priority:
 * 1. Exact key match ("modelName|provider")
 * 2. Exact model name or display name match
 * 3. Unique case-insensitive substring/alias match (e.g. "sonnet")
 */
export function resolveAgentSkillModel<T extends ModelCandidate>(
  requested: string,
  models: T[]
): T | undefined {
  const enabledModels = models.filter((m) => m.enabled !== false);
  if (enabledModels.length === 0) return undefined;

  const target = requested.trim().toLowerCase();
  if (!target) return undefined;

  // 1. Exact modelKey match ("name|provider")
  const exactKeyMatch = enabledModels.find(
    (m) => `${m.name}|${m.provider}`.toLowerCase() === target
  );
  if (exactKeyMatch) return exactKeyMatch;

  // 2. Exact name match
  const exactNameMatch = enabledModels.find((m) => m.name.toLowerCase() === target);
  if (exactNameMatch) return exactNameMatch;

  // 3. Substring/alias match
  const aliasMatches = enabledModels.filter(
    (m) => m.name.toLowerCase().includes(target) || target.includes(m.name.toLowerCase())
  );
  if (aliasMatches.length === 1) {
    return aliasMatches[0];
  }

  return undefined;
}
