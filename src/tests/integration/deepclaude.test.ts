import { DeepClaudeService, type InferenceRequest } from "../../services/DeepClaudeService"

describe("DeepClaude Integration Tests", () => {
  const deepClaudeService = DeepClaudeService.getInstance()

  it("should successfully call the inference endpoint", async () => {
    const request: InferenceRequest = {
      messages: [{ role: "user", content: "Test message" }],
      verbose: true,
    }

    const response = await deepClaudeService.inference(request)
    expect(response).toBeDefined()
    expect(response.content).toBeDefined()
    expect(typeof response.content).toBe("string")
  })

  it("should handle errors gracefully", async () => {
    const invalidRequest: InferenceRequest = {
      messages: [], // Invalid: empty messages array
      verbose: true,
    }

    await expect(deepClaudeService.inference(invalidRequest)).rejects.toThrow()
  })
})

