# Beluga UI Components and Theming System

## Theming System

Beluga uses a custom theming system built with Tailwind CSS and React Context. The system supports both light and dark modes, with the ability to easily switch between them.

### Theme Provider

The `ThemeProvider` component wraps the entire application and provides the current theme and a function to toggle between light and dark modes.

Usage:
```tsx
import { ThemeProvider } from '@/contexts/ThemeContext'

function App({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
