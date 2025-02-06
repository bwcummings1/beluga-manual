import { createMocks } from "node-mocks-http"
import chatHandler from "../chat"

describe("/api/chat", () => {
  test("returns 405 for non-POST requests", async () => {
    const { req, res } = createMocks({
      method: "GET",
    })

    await chatHandler(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(JSON.parse(res._getData())).toEqual({ error: "Method Not Allowed" })
  })

  test("returns 400 for missing message", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {},
    })

    await chatHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toEqual({ error: "Message is required" })
  })

  test("returns a response for valid input", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        message: "Hello, Beluga!",
        context: [],
        sessionId: "test-session",
      },
    })

    await chatHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toHaveProperty("response")
  })
})

