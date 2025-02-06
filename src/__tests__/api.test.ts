import request from "supertest"
import { app, redisClient, pool } from "../server"
import { askDeepClaude } from "../deepclaude"
import { jest } from "@jest/globals" // Added import for jest

jest.mock("../deepclaude")

beforeAll(async () => {
  await redisClient.connect()
})

afterAll(async () => {
  await redisClient.quit()
  await pool.end()
})

describe("API Endpoints", () => {
  it("should return a 200 status code for the root endpoint", async () => {
    const response = await request(app).get("/api")
    expect(response.status).toBe(200)
    expect(response.text).toBe("API is working!")
  })

  it("should return a cached response for repeated questions", async () => {
    const mockAskDeepClaude = askDeepClaude as jest.MockedFunction<typeof askDeepClaude>
    mockAskDeepClaude.mockResolvedValueOnce("This is a test answer.")

    const question = "What is the capital of France?"

    // First request
    const response1 = await request(app).post("/api/ask").send({ question })
    expect(response1.status).toBe(200)
    expect(response1.body.answer).toBe("This is a test answer.")

    // Second request (should be cached)
    const response2 = await request(app).post("/api/ask").send({ question })
    expect(response2.status).toBe(200)
    expect(response2.body.answer).toBe("This is a test answer.")

    expect(mockAskDeepClaude).toHaveBeenCalledTimes(1)
  })

  it("should perform a search query", async () => {
    // Mock the pool.query method
    jest.spyOn(pool, "query").mockResolvedValueOnce({
      rows: [{ id: 1, content: "Test document" }],
    } as any)

    const response = await request(app).get("/api/search").query({ query: "test" })

    expect(response.status).toBe(200)
    expect(response.body).toEqual([{ id: 1, content: "Test document" }])
  })
})

