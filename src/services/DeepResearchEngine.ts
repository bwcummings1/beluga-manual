import { ApiAdapterFactory } from "./api-adapters/ApiAdapterFactory"
import type { ApiAdapter, ApiResponse } from "./api-adapters/ApiAdapter"
import { DeepClaudeService, type InferenceRequest } from "./DeepClaudeService"

class DeepResearchEngine {
  private static instance: DeepResearchEngine
  private apiAdapters: Map<string, ApiAdapter> = new Map()

  private constructor() {
    this.loadApiConfigurations()
  }

  public static getInstance(): DeepResearchEngine {
    if (!DeepResearchEngine.instance) {
      DeepResearchEngine.instance = new DeepResearchEngine()
    }
    return DeepResearchEngine.instance
  }

  private loadApiConfigurations() {
    const storedConfigs = localStorage.getItem("apiConfigs")
    if (storedConfigs) {
      const configs = JSON.parse(storedConfigs)
      configs.forEach((config: { type: string; apiKey: string; isEnabled: boolean }) => {
        if (config.isEnabled) {
          this.addApiAdapter(config.type, config.apiKey)
        }
      })
    }
  }

  public addApiAdapter(type: string, apiKey: string): void {
    const adapter = ApiAdapterFactory.createAdapter(type, apiKey)
    this.apiAdapters.set(type, adapter)
  }

  public removeApiAdapter(type: string): void {
    this.apiAdapters.delete(type)
  }

  private async searchAllApis(query: string): Promise<ApiResponse[]> {
    const searchPromises = Array.from(this.apiAdapters.values()).map((adapter) =>
      adapter.search(query).catch((error) => {
        console.error(`Error searching ${adapter.name}:`, error)
        return null
      }),
    )

    const results = await Promise.all(searchPromises)
    return results.filter((result): result is ApiResponse => result !== null)
  }

  private normalizeAndMergeResults(results: ApiResponse[]): string {
    return results
      .map((result) => {
        return `Source: ${result.source}\n\nTitle: ${result.title}\n\n${result.content}\n\n`
      })
      .join("---\n\n")
  }

  async performResearch(query: string, depth: number): Promise<string> {
    const apiResults = await this.searchAllApis(query)
    const normalizedResults = this.normalizeAndMergeResults(apiResults)

    const deepClaudeService = DeepClaudeService.getInstance()
    const request: InferenceRequest = {
      messages: [
        {
          role: "system",
          content:
            "You are a research assistant. Analyze and summarize the following information from multiple sources.",
        },
        { role: "user", content: `Query: ${query}\n\nResearch data:\n${normalizedResults}` },
      ],
      verbose: true,
    }

    try {
      const response = await deepClaudeService.inference(request)
      return response.content
    } catch (error) {
      console.error("Error performing research:", error)
      throw new Error("Failed to perform research")
    }
  }
}

export default DeepResearchEngine

