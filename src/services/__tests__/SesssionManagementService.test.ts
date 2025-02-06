import { SessionManagementService } from "../SessionManagementService"

describe("SessionManagementService", () => {
  let sessionService: SessionManagementService

  beforeEach(() => {
    sessionService = new SessionManagementService()
  })

  test("creates a new session", () => {
    const sessionId = sessionService.createSession()
    expect(sessionId).toBeTruthy()
  })

  test("adds a message to a session", () => {
    const sessionId = sessionService.createSession()
    const message = { id: "1", content: "Test message", sender: "user" as const }

    sessionService.addMessage(sessionId, message)
    const context = sessionService.getContext(sessionId)

    expect(context).toContain(message)
  })

  test("resets a session", () => {
    const sessionId = sessionService.createSession()
    const message = { id: "1", content: "Test message", sender: "user" as const }

    sessionService.addMessage(sessionId, message)
    sessionService.resetSession(sessionId)

    const context = sessionService.getContext(sessionId)
    expect(context).toHaveLength(0)
  })

  test("throws error for non-existent session", () => {
    expect(() => sessionService.getContext("non-existent")).toThrow("Session not found")
  })
})

