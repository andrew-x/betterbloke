'use client'

import { IS_DEV, MIXPANEL_TOKEN } from '@/util/constants'
import mixpanel from 'mixpanel-browser'

mixpanel.init(MIXPANEL_TOKEN, {
  debug: IS_DEV,
  track_pageview: true,
  persistence: 'localStorage',
})

export default function MixPanel() {
  return <></>
}
