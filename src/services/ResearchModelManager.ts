import type { ResearchMode, ResearchResult, ApiConfig } from "@/types/ResearchMode"
import researchModes from "@/config/researchModes"

export class ResearchModeManager {
  private modes: Map<string, ResearchMode> = new Map()

  constructor() {
    this.loadModes()
  }

  private loadModes() {
    researchModes.forEach((mode) => {
      this.modes.set(mode.id, mode)
    })
  }

  getModes(): ResearchMode[] {
    return Array.from(this.modes.values())
  }

  getMode(id: string): ResearchMode | undefined {
    return this.modes.get(id)
  }

  setModeEnabled(id: string, isEnabled: boolean) {
    const mode = this.modes.get(id)
    if (mode) {
      mode.isEnabled = isEnabled
    }
  }

  setApiEnabled(modeId: string, apiId: string, isEnabled: boolean) {
    const mode = this.modes.get(modeId)
    if (mode) {
      const api = mode.apiConfigs.find((api) => api.id === apiId)
      if (api) {
        api.isEnabled = isEnabled
      }
    }
  }

  setApiKey(modeId: string, apiId: string, apiKey: string) {
    const mode = this.modes.get(modeId)
    if (mode) {
      const api = mode.apiConfigs.find((api) => api.id === apiId)
      if (api) {
        api.apiKey = apiKey
      }
    }
  }

  addCustomApi(modeId: string, apiConfig: ApiConfig) {
    const mode = this.modes.get(modeId)
    if (mode) {
      mode.apiConfigs.push(apiConfig)
    }
  }

  async executeMode(id: string, query: string, depth: number): Promise<ResearchResult> {
    const mode = this.modes.get(id)
    if (!mode) {
      throw new Error(`Research mode with id ${id} not found`)
    }
    if (!mode.isEnabled) {
      throw new Error(`Research mode ${mode.name} is not enabled`)
    }
    return mode.execute(query, depth)
  }

  addMode(mode: ResearchMode) {
    this.modes.set(mode.id, mode)
  }
}

export const researchModeManager = new ResearchModeManager()

