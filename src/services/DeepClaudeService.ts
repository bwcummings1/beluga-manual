import axios from "axios"

const DEEPCLAUDE_URL = process.env.DEEPCLAUDE_URL || "https://localhost:3000"

export interface Message {
  role: string
  content: string
}

export interface InferenceRequest {
  messages: Message[]
  stream?: boolean
  verbose?: boolean
}

export interface InferenceResponse {
  content: string
}

export class DeepClaudeService {
  private static instance: DeepClaudeService

  private constructor() {}

  public static getInstance(): DeepClaudeService {
    if (!DeepClaudeService.instance) {
      DeepClaudeService.instance = new DeepClaudeService()
    }
    return DeepClaudeService.instance
  }

  public async inference(request: InferenceRequest): Promise<InferenceResponse> {
    try {
      const response = await axios.post<InferenceResponse>(`${DEEPCLAUDE_URL}/inference`, request, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error calling DeepClaude service:", error)
      throw new Error("Failed to get inference from DeepClaude service")
    }
  }
}

