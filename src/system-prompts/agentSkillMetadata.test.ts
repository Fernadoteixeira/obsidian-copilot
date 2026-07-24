import {
  sanitizeAgentColor,
  sanitizeAgentDescription,
  sanitizeAgentModel,
  resolveAgentSkillModel,
  ModelCandidate,
} from "./agentSkillMetadata";

describe("agentSkillMetadata", () => {
  describe("sanitizeAgentColor", () => {
    it("accepts valid hex, rgb, hsl, and CSS color names", () => {
      expect(sanitizeAgentColor("#22c55e")).toBe("#22c55e");
      expect(sanitizeAgentColor("#abc")).toBe("#abc");
      expect(sanitizeAgentColor("rgb(34, 197, 94)")).toBe("rgb(34, 197, 94)");
      expect(sanitizeAgentColor("hsl(142, 71%, 45%)")).toBe("hsl(142, 71%, 45%)");
      expect(sanitizeAgentColor("emerald")).toBe("emerald");
    });

    it("rejects invalid or unsafe color inputs", () => {
      expect(sanitizeAgentColor("expression(alert(1))")).toBeUndefined();
      expect(sanitizeAgentColor("<script>alert(1)</script>")).toBeUndefined();
      expect(sanitizeAgentColor(12345)).toBeUndefined();
      expect(sanitizeAgentColor("")).toBeUndefined();
    });
  });

  describe("sanitizeAgentDescription", () => {
    it("cleans control characters and trims long descriptions", () => {
      expect(sanitizeAgentDescription("  A useful agent skill  ")).toBe("A useful agent skill");
      const longDesc = "a".repeat(600);
      expect(sanitizeAgentDescription(longDesc)?.length).toBe(500);
    });

    it("returns undefined for empty/non-string values", () => {
      expect(sanitizeAgentDescription("   ")).toBeUndefined();
      expect(sanitizeAgentDescription(null)).toBeUndefined();
    });
  });

  describe("sanitizeAgentModel", () => {
    it("sanitizes model requested strings", () => {
      expect(sanitizeAgentModel(" claude-sonnet-4-6|anthropic ")).toBe(
        "claude-sonnet-4-6|anthropic"
      );
      expect(sanitizeAgentModel("   ")).toBeUndefined();
    });
  });

  describe("resolveAgentSkillModel", () => {
    const activeModels: ModelCandidate[] = [
      { name: "gpt-4o", provider: "openai", enabled: true },
      { name: "claude-sonnet-4-6", provider: "anthropic", enabled: true },
      { name: "claude-3-5-haiku", provider: "anthropic", enabled: true },
      { name: "disabled-model", provider: "custom", enabled: false },
    ];

    it("resolves exact modelKey match", () => {
      const match = resolveAgentSkillModel("claude-sonnet-4-6|anthropic", activeModels);
      expect(match?.name).toBe("claude-sonnet-4-6");
    });

    it("resolves exact model name match", () => {
      const match = resolveAgentSkillModel("gpt-4o", activeModels);
      expect(match?.name).toBe("gpt-4o");
    });

    it("resolves unique alias/substring match", () => {
      const match = resolveAgentSkillModel("sonnet", activeModels);
      expect(match?.name).toBe("claude-sonnet-4-6");
    });

    it("ignores disabled models", () => {
      const match = resolveAgentSkillModel("disabled-model", activeModels);
      expect(match).toBeUndefined();
    });
  });
});
