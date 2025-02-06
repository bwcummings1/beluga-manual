export interface ApiConfig {
    id: string
    name: string
    isEnabled: boolean
    apiKey: string
    baseUrl?: string
  }
  
  export interface ResearchMode {
    id: string
    name: string
    description: string
    isEnabled: boolean
    apiConfigs: ApiConfig[]
    execute: (query: string, depth: number) => Promise<ResearchResult>
  }
  
  export interface ResearchResult {
    summary: string
    sources: string[]
  }
  
  