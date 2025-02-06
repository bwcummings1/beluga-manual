'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface DeepResearchToggleProps {
  isActive: boolean
  onToggle: (isActive: boolean) => void
}

export const DeepResearchToggle: React.FC<DeepResearchToggleProps> = ({ isActive, onToggle }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch
              id="deep-research-mode"
              checked={isActive}
              onCheckedChange={onToggle}
            />
            <Label htmlFor="deep-research-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Deep Research Mode
            </Label>
            <motion.div
              initial={false}
              animate={isActive ? { scale: 1.2, opacity: 1 } : { scale: 1, opacity: 0.5 }}
              transition={{ duration: 0.3 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Deep Research mode for more comprehensive results</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
