'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { ApiAdapter } from '@/services/api-adapters/ApiAdapter'
import { ApiAdapterFactory } from '@/services/api-adapters/ApiAdapterFactory'
import DeepResearchEngine from '@/services/DeepResearchEngine'

interface ApiConfig {
  type: string
  apiKey: string
  isEnabled: boolean
}

export function ApiManagement() {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([])
  const [newApiType, setNewApiType] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load existing API configurations
    const storedConfigs = localStorage.getItem('apiConfigs')
    if (storedConfigs) {
      setApiConfigs(JSON.parse(storedConfigs))
    }
  }, [])

  useEffect(() => {
    // Save API configurations whenever they change
    localStorage.setItem('apiConfigs', JSON.stringify(apiConfigs))

    // Update DeepResearchEngine with current configurations
    const engine = DeepResearchEngine.getInstance()
    apiConfigs.forEach(config => {
      if (config.isEnabled) {
        engine.addApiAdapter(config.type, config.apiKey)
      } else {
        engine.removeApiAdapter(config.type)
      }
    })
  }, [apiConfigs])

  const handleAddApi = () => {
    if (newApiType && newApiKey) {
      try {
        // Attempt to create an adapter to validate the API type
        ApiAdapterFactory.createAdapter(newApiType, newApiKey)

        setApiConfigs([...apiConfigs, { type: newApiType, apiKey: newApiKey, isEnabled: true }])
        setNewApiType('')
        setNewApiKey('')
        setError(null)
      } catch (err) {
        setError(`Invalid API type: ${newApiType}`)
      }
    } else {
      setError('Please provide both API type and key')
    }
  }

  const handleToggleApi = (index: number) => {
    const newConfigs = [...apiConfigs]
    newConfigs[index].isEnabled = !newConfigs[index].isEnabled
    setApiConfigs(newConfigs)
  }

  const handleRemoveApi = (index: number) => {
    const newConfigs = apiConfigs.filter((_, i) => i !== index)
    setApiConfigs(newConfigs)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Management</CardTitle>
        <CardDescription>Manage your external API sources</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {apiConfigs.map((config, index) => (
            <div key={index} className="flex items-center justify-between space-x-2">
              <div className="flex-grow">
                <Label htmlFor={`api-${index}`}>{config.type}</Label>
                <Input
                  id={`api-${index}`}
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => {
                    const newConfigs = [...apiConfigs]
                    newConfigs[index].apiKey = e.target.value
                    setApiConfigs(newConfigs)
                  }}
                  className="mt-1"
                />
              </div>
              <Switch
                checked={config.isEnabled}
                onCheckedChange={() => handleToggleApi(index)}
              />
              <Button variant="destructive" onClick={() => handleRemoveApi(index)}>Remove</Button>
            </div>
          ))}
          <div className="space-y-2">
            <Input
              placeholder="API Type (e.g., ResearchHub)"
              value={newApiType}
              onChange={(e) => setNewApiType(e.target.value)}
            />
            <Input
              type="password"
              placeholder="API Key"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
            />
            <Button onClick={handleAddApi}>Add API</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
