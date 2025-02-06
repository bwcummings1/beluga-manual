import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
}

interface Session {
  id: string
  messages: Message[]
  context: string
}

export class SessionManagementService {
  private sessions: Map<string, Session> = new Map()

  createSession(): string {
    const sessionId = uuidv4()
    this.sessions.set(sessionId, { id: sessionId, messages: [], context: "" })
    return sessionId
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId)
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.messages.push(message)
      this.updateContext(sessionId)
    }
  }

  private updateContext(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.context = session.messages.map((msg) => `${msg.sender}: ${msg.content}`).join("\n")
    }
  }

  getContext(sessionId: string): string {
    return this.sessions.get(sessionId)?.context || ""
  }

  exportSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId)
  }

  resetSession(sessionId: string): void {
    this.sessions.set(sessionId, { id: sessionId, messages: [], context: "" })
  }

  addResearchSummary(sessionId: string, summary: string): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      const researchMessage: Message = {
        id: uuidv4(),
        content: summary,
        sender: "ai",
      }
      this.addMessage(sessionId, researchMessage)
    }
  }
}

