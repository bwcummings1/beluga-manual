import { render, screen, fireEvent } from "@testing-library/react"
import { ChatWindow } from "../ChatWindow"

// Mock the useDeepResearch hook
jest.mock("@/hooks/useDeepResearch", () => ({
  useDeepResearch: () => ({
    startResearch: jest.fn(),
    isResearching: false,
    progress: 0,
    researchDepth: 3,
    setResearchDepth: jest.fn(),
    researchResult: null,
    getAvailableModes: () => [],
    selectedModeId: "",
    setResearchMode: jest.fn(),
  }),
}))

// Mock the SessionManagementService
jest.mock("@/services/SessionManagementService", () => ({
  SessionManagementService: jest.fn().mockImplementation(() => ({
    createSession: () => "mock-session-id",
    addMessage: jest.fn(),
    getContext: jest.fn(),
    resetSession: jest.fn(),
  })),
}))

// Mock the WebSocketService
jest.mock("@/services/WebSocketService", () => ({
  webSocketService: {
    ensureConnection: jest.fn(),
    isConnected: () => true,
  },
}))

describe("ChatWindow", () => {
  const mockOnResearchToggle = jest.fn()

  beforeEach(() => {
    render(<ChatWindow onResearchToggle={mockOnResearchToggle} />)
  })

  test("renders chat input and send button", () => {
    expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument()
  })

  test("allows user to type and send a message", () => {
    const input = screen.getByPlaceholderText("Type your message...")
    const sendButton = screen.getByRole("button", { name: /send/i })

    fireEvent.change(input, { target: { value: "Hello, Beluga!" } })
    expect(input).toHaveValue("Hello, Beluga!")

    fireEvent.click(sendButton)
    expect(input).toHaveValue("")
    expect(screen.getByText("Hello, Beluga!")).toBeInTheDocument()
  })

  test("toggles research mode", () => {
    const researchToggle = screen.getByRole("switch", { name: /deep research/i })

    fireEvent.click(researchToggle)
    expect(mockOnResearchToggle).toHaveBeenCalledWith(true)

    fireEvent.click(researchToggle)
    expect(mockOnResearchToggle).toHaveBeenCalledWith(false)
  })

  test("opens help modal", () => {
    const helpButton = screen.getByRole("button", { name: /help/i })

    fireEvent.click(helpButton)
    expect(screen.getByText("Beluga Help")).toBeInTheDocument()
    expect(screen.getByText("How to use the Beluga AI research assistant")).toBeInTheDocument()
  })
})

