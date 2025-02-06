"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { ResearchMode, ApiConfig } from "@/types/ResearchMode"
import { researchModeManager } from "@/services/ResearchModeManager"

interface ApiSourceManagerProps {
  mode: ResearchMode
}

export const ApiSourceManager: React.FC<ApiSourceManagerProps> = ({ mode }) => {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>(mode.apiConfigs)
  const [newApiName, setNewApiName] = useState("")
  const [newApiKey, setNewApiKey] = useState("")

  const handleApiToggle = (apiId: string, isEnabled: boolean) => {
    researchModeManager.setApiEnabled(mode.id, apiId, isEnabled)
    setApiConfigs(apiConfigs.map((api) => (api.id === apiId ? { ...api, isEnabled } : api)))
  }

  const handleApiKeyChange = (apiId: string, apiKey: string) => {
    researchModeManager.setApiKey(mode.id, apiId, apiKey)
    setApiConfigs(apiConfigs.map((api) => (api.id === apiId ? { ...api, apiKey } : api)))
  }

  const handleAddCustomApi = () => {
    if (newApiName && newApiKey) {
      const newApi: ApiConfig = {
        id: newApiName.toLowerCase().replace(/\s+/g, "-"),
        name: newApiName,
        isEnabled: true,
        apiKey: newApiKey,
      }
      researchModeManager.addCustomApi(mode.id, newApi)
      setApiConfigs([...apiConfigs, newApi])
      setNewApiName("")
      setNewApiKey("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Sources for {mode.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {apiConfigs.map((api) => (
          <div key={api.id} className="mb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor={`api-${api.id}`}>{api.name}</Label>
              <Switch
                id={`api-${api.id}`}
                checked={api.isEnabled}
                onCheckedChange={(checked) => handleApiToggle(api.id, checked)}
              />
            </div>
            <Input
              type="password"
              placeholder="API Key"
              value={api.apiKey}
              onChange={(e) => handleApiKeyChange(api.id, e.target.value)}
              className="mt-2"
            />
          </div>
        ))}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Add Custom API</h4>
          <Input
            placeholder="API Name"
            value={newApiName}
            onChange={(e) => setNewApiName(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="API Key"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleAddCustomApi}>Add API</Button>
        </div>
      </CardContent>
    </Card>
  )
}

