import { DeepClaudeService } from "./DeepClaudeService"

interface SerpResult {
  title: string
  snippet: string
  url: string
}

interface ProcessedResult {
  learnings: string[]
  followUpQueries: string[]
}

export class SerpProcessingService {
  private deepClaudeService: DeepClaudeService

  constructor() {
    this.deepClaudeService = new DeepClaudeService()
  }

  async processResults(query: string, results: SerpResult[]): Promise<ProcessedResult> {
    const prompt = this.createExtractionPrompt(query, results)
    const response = await this.deepClaudeService.generateResponse(prompt)
    return this.parseExtractionResponse(response)
  }

  private createExtractionPrompt(query: string, results: SerpResult[]): string {
    const resultsText = results
      .map((result) => `Title: ${result.title}\nSnippet: ${result.snippet}\nURL: ${result.url}`)
      .join("\n\n")

    return `
      Given the following search query and SERP results, extract key learnings and generate follow-up questions:

      Query: ${query}

      SERP Results:
      ${resultsText}

      Instructions:
      1. Analyze the SERP results and extract 3-5 key learnings relevant to the query.
      2. Generate 2-3 follow-up questions based on the extracted information.
      3. Format your response as follows:

      Learnings:
      - [Learning 1]
      - [Learning 2]
      - [Learning 3]

      Follow-up Questions:
      - [Question 1]
      - [Question 2]
      - [Question 3]

      Ensure that the learnings and questions are concise, relevant, and provide new insights or directions for further research.
    `
  }

  private parseExtractionResponse(response: string): ProcessedResult {
    const learnings: string[] = []
    const followUpQueries: string[] = []
    let currentSection: "learnings" | "questions" | null = null

    for (const line of response.split("\n")) {
      const trimmedLine = line.trim()
      if (trimmedLine === "Learnings:") {
        currentSection = "learnings"
      } else if (trimmedLine === "Follow-up Questions:") {
        currentSection = "questions"
      } else if (trimmedLine.startsWith("- ") && currentSection) {
        const content = trimmedLine.slice(2)
        if (currentSection === "learnings") {
          learnings.push(content)
        } else {
          followUpQueries.push(content)
        }
      }
    }

    return { learnings, followUpQueries }
  }

  // Simulate SERP results for testing purposes
  async simulateSerpResults(query: string): Promise<SerpResult[]> {
    // In a real implementation, this would call an actual search API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

    return [
      {
        title: `${query} - Wikipedia`,
        snippet: `This is a simulated snippet about ${query} from Wikipedia.`,
        url: `https://en.wikipedia.org/wiki/${query.replace(" ", "_")}`,
      },
      {
        title: `Latest News on ${query}`,
        snippet: `Recent developments and news articles related to ${query}.`,
        url: `https://news.example.com/topics/${query.replace(" ", "-")}`,
      },
      {
        title: `${query} Research Papers`,
        snippet: `Academic research and scholarly articles about ${query}.`,
        url: `https://scholar.example.com/search?q=${query.replace(" ", "+")}`,
      },
    ]
  }
}

