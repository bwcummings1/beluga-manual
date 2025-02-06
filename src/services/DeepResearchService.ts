import { DeepClaudeService } from "./DeepClaudeService"
import { SerpProcessingService } from "./SerpProcessingService"
import pLimit from "p-limit"
import type { Server as SocketIOServer } from "socket.io"

interface ResearchResult {
  query: string
  learnings: string[]
  followUpQueries: string[]
}

interface AggregatedResearch {
  learnings: Set<string>
  visitedUrls: Set<string>
}

export class DeepResearchService {
  private deepClaudeService: DeepClaudeService
  private serpProcessingService: SerpProcessingService
  private concurrencyLimit: number
  private io: SocketIOServer

  constructor(concurrencyLimit = 3, io: SocketIOServer) {
    this.deepClaudeService = new DeepClaudeService()
    this.serpProcessingService = new SerpProcessingService()
    this.concurrencyLimit = concurrencyLimit
    this.io = io
  }

  async generateQueries(userQuery: string, previousLearnings: string[]): Promise<string[]> {
    try {
      const prompt = this.createQueryGenerationPrompt(userQuery, previousLearnings)
      const response = await this.deepClaudeService.generateResponse(prompt)
      const queries = this.parseQueriesFromResponse(response)
      return this.limitAndFormatQueries(queries)
    } catch (error) {
      console.error("Error generating queries:", error)
      throw new Error("Failed to generate research queries")
    }
  }

  private createQueryGenerationPrompt(userQuery: string, previousLearnings: string[]): string {
    const learningsContext =
      previousLearnings.length > 0 ? `Based on previous learnings:\n${previousLearnings.join("\n")}\n` : ""

    return `
      ${learningsContext}
      Generate 5 unique search queries to research the following topic:
      "${userQuery}"

      Rules:
      1. Each query should be specific and focused.
      2. Avoid repeating information from previous learnings.
      3. Aim for a diverse set of queries that cover different aspects of the topic.
      4. Format each query on a new line, prefixed with "Query: ".

      Example output:
      Query: What are the main causes of climate change?
      Query: How does deforestation contribute to global warming?
      Query: What are the most effective solutions to reduce carbon emissions?
      Query: How do different countries compare in their efforts to combat climate change?
      Query: What are the economic impacts of implementing green energy solutions?
    `
  }

  private parseQueriesFromResponse(response: string): string[] {
    return response
      .split("\n")
      .filter((line) => line.trim().startsWith("Query:"))
      .map((line) => line.replace("Query:", "").trim())
  }

  private limitAndFormatQueries(queries: string[]): string[] {
    return queries.slice(0, 5).map((query) => {
      // Ensure query is not too long and doesn't end with punctuation
      return query.slice(0, 100).replace(/[.!?]$/, "")
    })
  }

  async processQueries(queries: string[], sessionId: string): Promise<ResearchResult[]> {
    const limit = pLimit(this.concurrencyLimit)
    const processQuery = async (query: string, index: number): Promise<ResearchResult> => {
      try {
        this.emitProgress(sessionId, `Processing query ${index + 1} of ${queries.length}: ${query}`)
        const serpResults = await this.serpProcessingService.simulateSerpResults(query)
        const { learnings, followUpQueries } = await this.serpProcessingService.processResults(query, serpResults)
        this.emitProgress(sessionId, `Completed processing query ${index + 1}`)
        return { query, learnings, followUpQueries }
      } catch (error) {
        console.error(`Error processing query "${query}":`, error)
        this.emitProgress(sessionId, `Error processing query ${index + 1}`)
        return { query, learnings: [], followUpQueries: [] }
      }
    }

    const results = await Promise.all(queries.map((query, index) => limit(() => processQuery(query, index))))

    return results
  }

  async conductRecursiveResearch(
    initialQuery: string,
    maxDepth: number,
    sessionId: string,
  ): Promise<AggregatedResearch> {
    const aggregatedResearch: AggregatedResearch = {
      learnings: new Set<string>(),
      visitedUrls: new Set<string>(),
    }

    const recursiveResearch = async (query: string, depth: number): Promise<void> => {
      if (depth > maxDepth) {
        return
      }

      this.emitProgress(sessionId, `Starting research depth ${depth} of ${maxDepth}`)

      const queries = await this.generateQueries(query, Array.from(aggregatedResearch.learnings))
      const results = await this.processQueries(queries, sessionId)

      results.forEach((result) => {
        result.learnings.forEach((learning) => aggregatedResearch.learnings.add(learning))
        // Assuming SerpProcessingService returns URLs, we would add them here
        // result.urls.forEach(url => aggregatedResearch.visitedUrls.add(url));
      })

      this.emitProgress(sessionId, `Completed research depth ${depth} of ${maxDepth}`)

      // Recursively process follow-up queries
      const followUpQueries = results.flatMap((result) => result.followUpQueries)
      await Promise.all(followUpQueries.map((q) => recursiveResearch(q, depth + 1)))
    }

    await recursiveResearch(initialQuery, 1)
    return aggregatedResearch
  }

  private emitProgress(sessionId: string, message: string) {
    const timestamp = new Date().toISOString()
    this.io.to(sessionId).emit("researchProgress", { timestamp, message })
  }
}

