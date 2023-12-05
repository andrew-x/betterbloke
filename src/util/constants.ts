import { VT323 } from 'next/font/google'

export const font = VT323({ subsets: ['latin'], weight: ['400'] })

export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || ''
export const IS_DEV = process.env.NODE_ENV === 'development'
