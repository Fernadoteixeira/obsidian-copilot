import type { App } from "obsidian";
import { Notice } from "obsidian";
import { v4 as uuidv4 } from "uuid";
import type CopilotPlugin from "@/main";
import { logError, logInfo } from "@/logger";
import { getWebViewerService } from "@/services/webViewerService/webViewerServiceSingleton";
import type { WebSelectedTextContext, WebTabContext } from "@/types/message";
import { normalizeWebTabContext } from "@/utils/urlNormalization";
import { getSelectedTextContexts, setSelectedTextContexts } from "@/aiParams";

/**
 * Service to handle obsidian-web extension clips and internal WebViewer page clipping into Obsidian Copilot context.
 */
export class ObsidianWebIntegrationService {
  private readonly app: App;
  private readonly plugin: CopilotPlugin;

  constructor(app: App, plugin: CopilotPlugin) {
    this.app = app;
    this.plugin = plugin;
  }

  /**
   * Handle incoming obsidian://copilot-web-clip parameters from external browser extensions (e.g. obsidian-web).
   * Accepted parameters:
   * - url: The URL of the web page (required)
   * - title: Page title (optional)
   * - content / selection: Clipped selection or body markdown (optional)
   * - favicon: Favicon URL (optional)
   *
   * @param params - Query parameters passed via obsidian:// protocol
   */
  async handleWebClipParams(params: Record<string, string>): Promise<void> {
    try {
      const rawUrl = params.url || params.link;
      if (!rawUrl || !rawUrl.trim()) {
        new Notice("[Copilot] Web clip ignored: Missing URL parameter.");
        return;
      }

      const title = params.title?.trim() || rawUrl;
      const content = params.content?.trim() || params.selection?.trim() || "";
      const faviconUrl = params.favicon?.trim() || params.faviconUrl?.trim();

      const webTab: WebTabContext = {
        url: rawUrl.trim(),
        title,
        faviconUrl: faviconUrl || undefined,
        isLoaded: true,
        isActive: true,
      };

      const normalized = normalizeWebTabContext(webTab);
      if (!normalized) {
        new Notice("[Copilot] Web clip ignored: Invalid URL format.");
        return;
      }

      // Activate Copilot View
      await this.plugin.activateView();

      // If clip content/selection exists, create a WebSelectedTextContext
      if (content) {
        const webSelectedCtx: WebSelectedTextContext = {
          id: uuidv4(),
          content,
          sourceType: "web",
          title: normalized.title || normalized.url,
          url: normalized.url,
          faviconUrl: normalized.faviconUrl,
        };

        const currentContexts = getSelectedTextContexts();
        // Append or replace web selected contexts
        const updated = [
          ...currentContexts.filter(
            (ctx) => ctx.sourceType !== "web" || ctx.url !== normalized.url
          ),
          webSelectedCtx,
        ];
        setSelectedTextContexts(updated);
      }

      new Notice(`[Copilot] Web clip attached: "${normalized.title || normalized.url}"`);
      logInfo("[ObsidianWebIntegration] Successfully attached web clip:", normalized.url);
    } catch (error) {
      logError("[ObsidianWebIntegration] Failed to handle web clip params:", error);
      new Notice("[Copilot] Error attaching web clip. Check console logs.");
    }
  }

  /**
   * Clip the active Obsidian WebViewer page into Copilot Chat context (Desktop).
   */
  async clipActiveWebViewerPage(): Promise<void> {
    try {
      const webViewer = getWebViewerService(this.app);
      if (!webViewer.isSupportedPlatform()) {
        new Notice("[Copilot] WebViewer clipping is only supported on Desktop.");
        return;
      }

      const activeLeaf = webViewer.getActiveLeaf();
      if (!activeLeaf) {
        new Notice("[Copilot] No active WebViewer tab found.");
        return;
      }

      const pageInfo = webViewer.getPageInfo(activeLeaf);
      if (!pageInfo.url) {
        new Notice("[Copilot] Active WebViewer tab has no valid URL.");
        return;
      }

      let markdownContent = "";
      try {
        markdownContent = await webViewer.getReaderModeMarkdown(activeLeaf);
      } catch (err) {
        logError("[ObsidianWebIntegration] Could not extract reader mode markdown:", err);
      }

      await this.handleWebClipParams({
        url: pageInfo.url,
        title: pageInfo.title || pageInfo.url,
        content: markdownContent,
        favicon: pageInfo.faviconUrl || "",
      });
    } catch (error) {
      logError("[ObsidianWebIntegration] Failed to clip active WebViewer page:", error);
      new Notice("[Copilot] Failed to clip WebViewer page. Check logs.");
    }
  }
}
