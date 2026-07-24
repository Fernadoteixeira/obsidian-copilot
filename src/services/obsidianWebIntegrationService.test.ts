import { ObsidianWebIntegrationService } from "@/services/obsidianWebIntegrationService";
import type CopilotPlugin from "@/main";
import type { App } from "obsidian";
import { getSelectedTextContexts, setSelectedTextContexts } from "@/aiParams";

jest.mock("obsidian", () => ({
  Notice: jest.fn(),
  Platform: { isDesktopApp: true },
}));

jest.mock("@/services/webViewerService/webViewerServiceSingleton", () => ({
  getWebViewerService: jest.fn(() => ({
    isSupportedPlatform: () => true,
    getActiveLeaf: () => ({
      view: {
        url: "https://example.com/test",
        title: "Test Page",
        faviconUrl: "https://example.com/favicon.ico",
      },
    }),
    getPageInfo: () => ({
      url: "https://example.com/test",
      title: "Test Page",
      faviconUrl: "https://example.com/favicon.ico",
      mode: "reader",
    }),
    getReaderModeMarkdown: jest.fn().mockResolvedValue("# Test Content\nThis is a test."),
  })),
}));

describe("ObsidianWebIntegrationService", () => {
  let mockApp: App;
  let mockPlugin: CopilotPlugin;
  let service: ObsidianWebIntegrationService;

  beforeEach(() => {
    jest.clearAllMocks();
    setSelectedTextContexts([]);
    mockApp = {} as App;
    mockPlugin = {
      activateView: jest.fn().mockResolvedValue(undefined),
    } as unknown as CopilotPlugin;
    service = new ObsidianWebIntegrationService(mockApp, mockPlugin);
  });

  it("should ignore web clips with missing or empty URL", async () => {
    await service.handleWebClipParams({});
    expect(mockPlugin.activateView).not.toHaveBeenCalled();
    expect(getSelectedTextContexts()).toHaveLength(0);
  });

  it("should attach a valid web clip with selection content", async () => {
    await service.handleWebClipParams({
      url: "https://obsidian.md/plugins",
      title: "Obsidian Plugins",
      content: "Awesome plugins list",
    });

    expect(mockPlugin.activateView).toHaveBeenCalledTimes(1);
    const contexts = getSelectedTextContexts();
    expect(contexts).toHaveLength(1);
    expect(contexts[0].sourceType).toBe("web");
    expect(contexts[0].content).toBe("Awesome plugins list");
    if (contexts[0].sourceType === "web") {
      expect(contexts[0].url).toBe("https://obsidian.md/plugins");
      expect(contexts[0].title).toBe("Obsidian Plugins");
    }
  });

  it("should clip active WebViewer page when available", async () => {
    await service.clipActiveWebViewerPage();
    expect(mockPlugin.activateView).toHaveBeenCalledTimes(1);
    const contexts = getSelectedTextContexts();
    expect(contexts).toHaveLength(1);
    expect(contexts[0].content).toContain("This is a test.");
  });
});
