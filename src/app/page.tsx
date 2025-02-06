"use client"

import { useState } from "react"
import { ChatWindow } from "@/app/components/ChatWindow"

export default function Home() {
  const [isResearchModeActive, setIsResearchModeActive] = useState(false)

  const handleResearchToggle = (isActive: boolean) => {
    setIsResearchModeActive(isActive)
    // You can add any additional logic here when the research mode is toggled
    console.log("Research mode toggled:", isActive)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Beluga Chat</h1>
      <ChatWindow onResearchToggle={handleResearchToggle} />
    </main>
  )
}

