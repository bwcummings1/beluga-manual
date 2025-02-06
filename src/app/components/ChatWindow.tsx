'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Smile, RotateCcw, PanelRightOpen, HelpCircle } from 'lucide-react'
import { SessionManagementService } from '@/services/SessionManagementService'
import { useDeepResearch } from '@/hooks/useDeepResearch'
import { Progress } from '@/components/ui/progress'
import { DeepResearchToggle } from '@/components/DeepResearchToggle'
import { SlidingActivityPanel } from '@/components/SlidingActivityPanel'
import { webSocketService } from '@/services/WebSocketService'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { Modal } from '@/components/ui/Modal'
import { Loader } from '@/components/ui/Loader'
import { TextWave } from '@/components/ui/TextWave'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ModeSelector } from '@/components/ModeSelector'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
}

interface ChatWindowProps {
  onResearchToggle: (isActive: boolean) => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onResearchToggle }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [isResearchMode, setIsResearchMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const sessionService = useRef(new SessionManagementService())

  const { startResearch, isResearching, progress, researchDepth, setResearchDepth, researchResult, getAvailableModes, selectedModeId, setResearchMode } = useDeepResearch()
  const { theme } = useTheme()

  useEffect(() => {
    const newSessionId = sessionService.current.createSession()
    setSessionId(newSessionId)

    webSocketService.ensureConnection()
    if (!webSocketService.isConnected()) {
      setError('WebSocket connection is not available. Some features may be limited.')
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [])

  useEffect(() => {
    if (researchResult) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: researchResult,
        sender: 'ai',
      }
      setMessages((prev) => [...prev, aiMessage])
      sessionService.current.addMessage(sessionId, aiMessage)
    }
  }, [researchResult, sessionId])

  const handleSendMessage = async () => {
    if (input.trim()) {
      setError(null)
      const newMessage: Message = {
        id: Date.now().toString(),
        content: input.trim(),
        sender: 'user',
      }
      setMessages((prev) => [...prev, newMessage])
      sessionService.current.addMessage(sessionId, newMessage)
      setInput('')
      setIsThinking(true)

      if (isResearchMode) {
        try {
          await startResearch(sessionId, input.trim(), researchDepth)
        } catch (error) {
          console.error('Error in research process:', error)
          setError('An error occurred during the research process. Please try again.')
        } finally {
          setIsThinking(false)
        }
      } else {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: input.trim(),
              context: sessionService.current.getContext(sessionId),
              sessionId: sessionId,
            }),
          })

          if (response.ok) {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: '',
              sender: 'ai',
            }
            setMessages((prev) => [...prev, aiMessage])

            eventSourceRef.current = new EventSource(
              `/api/chat?message=${encodeURIComponent(input.trim())}&sessionId=${sessionId}`
            )

            eventSourceRef.current.onmessage = (event) => {
              const chunk = JSON.parse(event.data)
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1]
                if (lastMessage.sender === 'ai') {
                  const updatedMessage = { ...lastMessage, content: lastMessage.content + chunk.content }
                  sessionService.current.addMessage(sessionId, updatedMessage)
                  return [...prev.slice(0, -1), updatedMessage]
                }
                return prev
              })
            }

            eventSourceRef.current.addEventListener('done', () => {
              setIsThinking(false)
              eventSourceRef.current?.close()
            })

            eventSourceRef.current.onerror = () => {
              setIsThinking(false)
              eventSourceRef.current?.close()
              setError('An error occurred while processing your request. Please try again.')
            }
          } else {
            console.error('Failed to send message')
            setError('Failed to send message. Please try again.')
            setIsThinking(false)
          }
        } catch (error) {
          console.error('Error:', error)
          setError('An unexpected error occurred. Please try again.')
          setIsThinking(false)
        }
      }
    }
  }

  const handleResearchToggle = (isActive: boolean) => {
    setIsResearchMode(isActive)
    onResearchToggle(isActive)
    if (isActive) {
      setIsActivityPanelOpen(true)
    } else {
      setIsActivityPanelOpen(false)
    }
  }

  const handleResetSession = () => {
    sessionService.current.resetSession(sessionId)
    setMessages([])
    setError(null)
  }

  const handleActivityPanelToggle = () => {
    setIsActivityPanelOpen(!isActivityPanelOpen)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex-grow flex flex-col p-4">
        <motion.div
          className="flex justify-between items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <DeepResearchToggle isActive={isResearchMode} onToggle={handleResearchToggle} />
            {isResearchMode && (
              <ModeSelector
                modes={getAvailableModes()}
                selectedModeId={selectedModeId}
                onModeSelect={setResearchMode}
              />
            )}
          </div>
          <div className="flex space-x-2">
            <ThemeToggle />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleActivityPanelToggle} disabled={!isResearchMode}>
                    <PanelRightOpen className="h-4 w-4 mr-2" />
                    Activity Panel
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Activity Panel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleResetSession}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Session
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset current session</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => setIsHelpModalOpen(true)}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open help guide</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
        <ScrollArea className="flex-grow pr-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                    <AvatarImage src={message.sender === 'user' ? '/user-avatar.png' : '/ai-avatar.png'} />
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {(isThinking || isResearching) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-center bg-secondary text-secondary-foreground p-3 rounded-lg">
                <Loader size={16} className="mr-2" />
                <TextWave text={isResearching ? 'Researching...' : 'Thinking...'} />
              </div>
            </motion.div>
          )}
          {isResearching && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Progress value={progress} className="w-full" />
              <p className="text-center mt-2">{progress}% Complete</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-red-500 mt-4 text-center"
            >
              {error}
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <motion.div
          className="flex items-center mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => {
                    /* Implement emoji picker */
                  }}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open emoji picker</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isResearchMode ? 'Enter your research query...' : 'Type your message...'}
            className="flex-grow"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSendMessage} className="ml-2" disabled={!input.trim() || isThinking || isResearching}>
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </CardContent>
      <SlidingActivityPanel
        isOpen={isActivityPanelOpen}
        onClose={() => setIsActivityPanelOpen(false)}
        activities={[]} // You need to implement this part to show research activities
      />
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="Beluga Help"
        description="How to use the Beluga AI research assistant"
      >
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Quick Start Guide</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Type your question or research topic in the input field and press Enter or click the Send button.</li>
            <li>Toggle Deep Research mode for more comprehensive results on complex topics.</li>
            <li>Use the Activity Panel to track progress during Deep Research mode.</li>
            <li>Click the Theme Toggle to switch between light and dark modes.</li>
            <li>Reset the session to start a new conversation.</li>
          </ul>
        </div>
      </Modal>
    </Card>
  )
}

