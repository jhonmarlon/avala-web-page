import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { scrollToTop } from '@/lib/smooth-scroll'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTop()
  }, [pathname])

  return null
}
