"use client"

import { useState, useCallback } from "react"
import type { ResearchMode } from "@/types/ResearchMode"
import { researchModeManager } from "@/services/ResearchModeManager"
import DeepResearchEngine from "@/services/DeepResearchEngine"

export const useDeepResearch = () => {
  const [selectedModeId, setSelectedModeId] = useState<string>("default")
  const [researchDepth, setResearchDepth] = useState<number>(3)
  const [isResearching, setIsResearching] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [researchResult, setResearchResult] = useState<string | null>(null)

  const getAvailableModes = useCallback((): ResearchMode[] => {
    return researchModeManager.getModes()
  }, [])

  const setResearchMode = useCallback((modeId: string) => {
    setSelectedModeId(modeId)
  }, [])

  const startResearch = useCallback(
    async (sessionId: string, query: string, depth: number) => {
      setIsResearching(true)
      setProgress(0)
      setResearchResult(null)

      try {
        const mode = researchModeManager.getMode(selectedModeId)
        if (!mode) {
          throw new Error(`Research mode with id ${selectedModeId} not found`)
        }

        const engine = DeepResearchEngine.getInstance()
        const result = await engine.performResearch(query, depth)

        // Simulate progress updates
        for (let i = 0; i <= 100; i += 10) {
          setProgress(i)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        setResearchResult(result)
      } catch (error) {
        console.error("Error during research:", error)
        setResearchResult("An error occurred during research. Please try again.")
      } finally {
        setIsResearching(false)
        setProgress(100)
      }
    },
    [selectedModeId],
  )

  return {
    getAvailableModes,
    selectedModeId,
    setResearchMode,
    researchDepth,
    setResearchDepth,
    startResearch,
    isResearching,
    progress,
    researchResult,
  }
}

