# Adding New Research Modes to Beluga

This document outlines the process of adding new research modes to the Beluga application.

## 1. Create a new Research Mode

To create a new research mode, you need to implement the `ResearchMode` interface. Here's an example:

```typescript
import { ResearchMode, ResearchResult } from "@/types/ResearchMode";

const myNewResearchMode: ResearchMode = {
  id: "my-new-mode",
  name: "My New Research Mode",
  description: "Description of what this mode does",
  isEnabled: true,
  execute: async (query: string, depth: number): Promise<ResearchResult> => {
    // Implement your research logic here
    // This is where you would integrate with external APIs, process data, etc.
    
    // Return a ResearchResult object
    return {
      summary: `Research summary for query: ${query}`,
      sources: ["https://example.com/source1", "https://example.com/source2"],
    };
  },
};
