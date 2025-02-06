import { createServer } from "http"
import { apiResolver } from "next/dist/server/api-utils/node"
import request from "supertest"
import chatHandler from "../chat"

describe("Chat API Integration", () => {
  const handler = (req, res) => {
    return apiResolver(req, res, undefined, chatHandler, {}, undefined)
  }

  const server = createServer(handler)

  it("should return 405 for non-POST requests", async () => {
    const response = await request(server).get("/api/chat")
    expect(response.status).toBe(405)
    expect(response.body).toEqual({ error: "Method Not Allowed" })
  })

  it("should return 400 for missing message", async () => {
    const response = await request(server).post("/api/chat").send({})
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: "Message is required" })
  })

  it("should return a response for valid input", async () => {
    const response = await request(server).post("/api/chat").send({
      message: "Hello, Beluga!",
      context: [],
      sessionId: "test-session",
    })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("response")
  })
})

