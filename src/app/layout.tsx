import cn from '@/util/classnames'
import { font } from '@/util/constants'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import type { Metadata } from 'next'
import MixPanel from './_MixPanel'
import './globals.css'

export const metadata: Metadata = {
  title: 'BetterBloke',
  description: 'A better way to browse LLM models quantized by TheBloke',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn('bg-slate-800 text-slate-200', font.className)}>
        <MantineProvider defaultColorScheme="dark">
          <ModalsProvider>
            {children}
            <Notifications />
          </ModalsProvider>
        </MantineProvider>
        <MixPanel />
      </body>
    </html>
  )
}
