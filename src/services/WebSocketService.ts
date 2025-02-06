import { io, type Socket } from "socket.io-client"

export class WebSocketService {
  private socket: Socket | null = null
  private websocketUrl: string

  constructor() {
    this.websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000"
    // Don't connect automatically, we'll do it when needed
  }

  public connect() {
    if (!this.socket) {
      this.socket = io(this.websocketUrl)
      console.log(`Connected to WebSocket at ${this.websocketUrl}`)
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  public subscribeToResearchUpdates(sessionId: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(`researchUpdate:${sessionId}`, callback)
    }
  }

  public unsubscribeFromResearchUpdates(sessionId: string) {
    if (this.socket) {
      this.socket.off(`researchUpdate:${sessionId}`)
    }
  }

  public isConnected(): boolean {
    return this.socket !== null && this.socket.connected
  }

  public ensureConnection() {
    if (!this.isConnected()) {
      this.connect()
    }
  }
}

export const webSocketService = new WebSocketService()

