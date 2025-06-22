import type { Viewport } from 'next'

// This defines the viewport metadata for the entire application
// This fixes the "Unsupported metadata viewport is configured in metadata export" warning
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  viewportFit: 'cover',
}

export default viewport 