'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ResearchModeSelector } from '@/components/ResearchModeSelector'
import { ApiManagement } from '@/components/ApiManagement'
import { ResearchMode } from '@/types/ResearchMode'
import { useDeepResearch } from '@/hooks/useDeepResearch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SlidingActivityPanelProps {
  isOpen: boolean
  onClose: () => void
  activities: any[] // Replace 'any' with a proper type for activities
}

export const SlidingActivityPanel: React.FC<SlidingActivityPanelProps> = ({
  isOpen,
  onClose,
  activities,
}) => {
  const {
    getAvailableModes,
    selectedModeId,
    setResearchMode,
    researchDepth,
    setResearchDepth,
  } = useDeepResearch()

  const availableModes = getAvailableModes()

  return (
    <motion.div
      className="fixed top-0 right-0 w-96 h-full bg-background shadow-lg z-50"
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Research Panel</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)] p-4">
        <Tabs defaultValue="mode">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mode">Research Mode</TabsTrigger>
            <TabsTrigger value="api">API Management</TabsTrigger>
          </TabsList>
          <TabsContent value="mode">
            <ResearchModeSelector
              modes={availableModes}
              selectedModeId={selectedModeId}
              onModeChange={setResearchMode}
              researchDepth={researchDepth}
              onResearchDepthChange={setResearchDepth}
            />
          </TabsContent>
          <TabsContent value="api">
            <ApiManagement />
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Research Activities</h3>
          {activities.map((activity, index) => (
            <div key={index} className="mb-2 p-2 bg-secondary rounded">
              {/* Replace this with actual activity content */}
              Activity {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
