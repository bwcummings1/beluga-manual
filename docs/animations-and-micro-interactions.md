# Beluga Animations and Micro-Interactions

This document outlines the animations and micro-interactions implemented in the Beluga UI to enhance user experience and provide visual feedback.

## Framer Motion

We use Framer Motion, a popular animation library for React, to create smooth and engaging animations throughout the application.

## Components with Animations

### DeepResearchToggle

The DeepResearchToggle component features a glowing effect when activated:

- A small green dot appears next to the toggle
- The dot scales up and becomes more opaque when the toggle is active
- The animation is smooth and subtle, providing clear visual feedback without being distracting

### Loader

The Loader component uses a spinning animation to indicate loading states:

- A circular border rotates continuously
- The animation runs indefinitely until the loading state is complete
- The size of the loader can be customized

### TextWave

The TextWave component creates a wave-like animation for text:

- Each letter of the text moves up and down in a wave pattern
- The animation is staggered, creating a flowing effect
- This component is used for dynamic text like "Thinking..." or "Researching..."

### ChatWindow

The ChatWindow component incorporates several animations for a more engaging user experience:

1. Header Animation:
   - The header (containing the DeepResearchToggle and control buttons) fades in and slides down when the component mounts

2. Message Animation:
   - New messages fade in and slide up when they appear
   - Messages fade out and slide up when removed (e.g., when resetting the session)

3. Thinking/Researching Indicator:
   - The indicator fades in and slides up when active
   - It combines the Loader and TextWave components for a dynamic effect

4. Research Progress Bar:
   - The progress bar and percentage text fade in and scale up when research mode is active
   - They fade out and scale down when research is complete or mode is deactivated

5. Error Messages:
   - Error messages fade in and slide up when they appear
   - They fade out and slide up when cleared

6. Input Area:
   - The input area and send button fade in and slide up when the component mounts

## Accessibility Considerations

- All animations are designed to be subtle and not overly distracting
- Animations do not interfere with the readability of text or usability of interactive elements
- The animations respect the user's preference for reduced motion (implementation pending)

## Performance

- Animations are optimized to run smoothly on various devices
- Heavy animations are avoided to ensure good performance on lower-end devices

## Future Improvements

- Implement preference check for reduced motion
- Add more micro-interactions for button hovers and clicks
- Explore advanced animation techniques for transitions between different app states

## Usage

To use these animations in other components:

1. Import the necessary components (Loader, TextWave) or use Framer Motion directly
2. Wrap elements with Framer Motion components like `<motion.div>`
3. Use the `initial`, `animate`, and `transition` props to define the animation behavior

Example:

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Your content here
</motion.div>
