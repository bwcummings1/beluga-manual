"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { ResearchMode } from "@/types/ResearchMode"
import { Info } from "lucide-react"

interface ResearchModeSelectorProps {
  modes: ResearchMode[]
  selectedModeId: string
  onModeChange: (modeId: string) => void
  researchDepth: number
  onResearchDepthChange: (depth: number) => void
}

export const ResearchModeSelector: React.FC<ResearchModeSelectorProps> = ({
  modes,
  selectedModeId,
  onModeChange,
  researchDepth,
  onResearchDepthChange,
}) => {
  const selectedMode = modes.find((mode) => mode.id === selectedModeId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Mode Configuration</CardTitle>
        <CardDescription>Select and configure your research mode</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mode-select">Research Mode</Label>
          <Select value={selectedModeId} onValueChange={onModeChange}>
            <SelectTrigger id="mode-select">
              <SelectValue placeholder="Select a research mode" />
            </SelectTrigger>
            <SelectContent>
              {modes.map((mode) => (
                <SelectItem key={mode.id} value={mode.id}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center">
                          {mode.name}
                          <Info className="ml-2 h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{mode.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="research-depth">Research Depth: {researchDepth}</Label>
          <Slider
            id="research-depth"
            min={1}
            max={5}
            step={1}
            value={[researchDepth]}
            onValueChange={(value) => onResearchDepthChange(value[0])}
          />
        </div>

        {selectedMode && selectedMode.apiConfigs && (
          <div className="space-y-2">
            <Label>API Configurations</Label>
            {selectedMode.apiConfigs.map((api) => (
              <div key={api.id} className="flex items-center justify-between">
                <span>{api.name}</span>
                <Switch
                  checked={api.isEnabled}
                  onCheckedChange={(checked) => {
                    // Update API enabled state
                    // This should be implemented in the parent component
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

