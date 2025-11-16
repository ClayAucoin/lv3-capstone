// setupTests.js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Adds jest-dom matchers like toBeInTheDocument, toHaveTextContent, etc.
import '@testing-library/jest-dom/vitest'

// Automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup()
})
