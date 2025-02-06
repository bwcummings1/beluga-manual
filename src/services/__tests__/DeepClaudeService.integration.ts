import { DeepClaudeService } from "../DeepClaudeService"
import nock from "nock"

describe("DeepClaudeService Integration", () => {
  const deepClaudeService = new DeepClaudeService("http://localhost:8080")

  beforeAll(() => {
    nock.disableNetConnect()
  })

  afterAll(() => {
    nock.enableNetConnect()
  })

  it("should process a research query", async () => {
    const mockResponse = {
      result: "Mocked research result",
      confidence: 0.85,
    }

    nock("http://localhost:8080").post("/research").reply(200, mockResponse)

    const result = await deepClaudeService.processQuery("Test query", 3)

    expect(result).toEqual(mockResponse)
  })

  it("should handle errors from the Rust service", async () => {
    nock("http://localhost:8080").post("/research").replyWithError("Service unavailable")

    await expect(deepClaudeService.processQuery("Test query", 3)).rejects.toThrow("Error processing query")
  })
})

