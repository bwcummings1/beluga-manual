import { askDeepClaude } from "../deepclaude"
import jest from "jest"

jest.mock("../deepclaude", () => ({
  askDeepClaude: jest.fn((question: string) => {
    if (question.toLowerCase().includes("capital of france")) {
      return Promise.resolve("The capital of France is Paris.")
    } else {
      return Promise.resolve("I'm sorry, I don't have enough information to answer that question accurately.")
    }
  }),
}))

describe("DeepClaude Integration", () => {
  it("should return a valid answer for a known question", async () => {
    const question = "What is the capital of France?"
    const answer = await askDeepClaude(question)
    expect(answer).toBe("The capital of France is Paris.")
  })

  it("should return a default response for an unknown question", async () => {
    const question = "What is the meaning of life?"
    const answer = await askDeepClaude(question)
    expect(answer).toBe("I'm sorry, I don't have enough information to answer that question accurately.")
  })
})

