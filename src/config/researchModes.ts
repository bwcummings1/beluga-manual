import type { ResearchMode } from "@/types/ResearchMode"

const researchModes: ResearchMode[] = [
  {
    id: "default",
    name: "Default Research",
    description: "General-purpose research mode",
    isEnabled: true,
    apiConfigs: [
      {
        id: "google",
        name: "Google Search",
        isEnabled: true,
        apiKey: "",
      },
      {
        id: "wikipedia",
        name: "Wikipedia",
        isEnabled: true,
        apiKey: "",
      },
    ],
    execute: async (query: string, depth: number) => {
      // Implementation of the default research mode
      console.log(`Executing default research mode with query: ${query} and depth: ${depth}`)
      return {
        summary: `Default research summary for query: ${query}`,
        sources: ["https://example.com/source1", "https://example.com/source2"],
      }
    },
  },
  {
    id: "academic",
    name: "Academic Research",
    description: "Research mode focused on academic sources",
    isEnabled: true,
    apiConfigs: [
      {
        id: "googleScholar",
        name: "Google Scholar",
        isEnabled: true,
        apiKey: "",
      },
      {
        id: "pubMed",
        name: "PubMed",
        isEnabled: true,
        apiKey: "",
      },
    ],
    execute: async (query: string, depth: number) => {
      console.log(`Executing academic research mode with query: ${query} and depth: ${depth}`)
      return {
        summary: `Academic research summary for query: ${query}`,
        sources: ["https://scholar.google.com", "https://pubmed.ncbi.nlm.nih.gov"],
      }
    },
  },
]

export default researchModes

