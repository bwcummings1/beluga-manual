import { render, screen, fireEvent } from "@testing-library/react"
import { DeepResearchToggle } from "../DeepResearchToggle"

describe("DeepResearchToggle", () => {
  const mockOnToggle = jest.fn()

  test("renders correctly when inactive", () => {
    render(<DeepResearchToggle isActive={false} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch", { name: /deep research/i })
    expect(toggle).toBeInTheDocument()
    expect(toggle).not.toBeChecked()
  })

  test("renders correctly when active", () => {
    render(<DeepResearchToggle isActive={true} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch", { name: /deep research/i })
    expect(toggle).toBeInTheDocument()
    expect(toggle).toBeChecked()
  })

  test("calls onToggle when clicked", () => {
    render(<DeepResearchToggle isActive={false} onToggle={mockOnToggle} />)

    const toggle = screen.getByRole("switch", { name: /deep research/i })
    fireEvent.click(toggle)

    expect(mockOnToggle).toHaveBeenCalledWith(true)
  })
})

