import type { NextApiRequest, NextApiResponse } from "next"
import { DeepClaudeService } from "@/services/DeepClaudeService"
import { SessionManagementService } from "@/services/SessionManagementService"

const sessionService = new SessionManagementService()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message, sessionId } = req.body

    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required" })
      return
    }

    const context = sessionService.getContext(sessionId)

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    })

    const deepClaude = new DeepClaudeService()

    try {
      const stream = deepClaude.streamResponse(message, context)

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      }

      res.write("event: done\ndata: Stream finished\n\n")
    } catch (error) {
      console.error("Error in chat API:", error)
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: "An error occurred while processing your request" })}\n\n`,
      )
    } finally {
      res.end()
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

