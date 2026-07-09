'use client'

import { useEffect } from 'react'

/**
 * Minimal replacement for the one bit of GoDaddy builder runtime we rely on:
 * toggling the mobile navigation drawer. The cloned markup ships a hamburger
 * (data-aid="HAMBURGER_MENU_LINK") and a full-screen NavigationDrawer that the
 * removed runtime slid in/out. This opens/closes it — no trackers, no external
 * dependencies.
 *
 * The closed drawer is translated off-screen by a scoped class rule, so we set
 * the container's display/transform/visibility inline with `!important` (which
 * beats the stylesheet); descendant visibility is handled by the
 * body[data-nav-open] rules in globals.css.
 */
export default function NavToggle() {
  useEffect(() => {
    const drawer = document.querySelector<HTMLElement>('.x [data-ux="NavigationDrawer"]')

    const setOpen = (open: boolean) => {
      document.body.dataset.navOpen = open ? 'true' : 'false'
      if (!drawer) return
      if (open) {
        drawer.style.setProperty('display', 'flex', 'important')
        drawer.style.setProperty('transform', 'none', 'important')
        drawer.style.setProperty('visibility', 'visible', 'important')
      } else {
        drawer.style.removeProperty('display')
        drawer.style.removeProperty('transform')
        drawer.style.removeProperty('visibility')
      }
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      if (target.closest('[data-aid="HAMBURGER_MENU_LINK"]')) {
        e.preventDefault()
        setOpen(document.body.dataset.navOpen !== 'true')
        return
      }

      // Inside the open drawer: close on a nav link or the exit/close control.
      if (
        target.closest('[data-ux="NavigationDrawer"]') &&
        target.closest('a, button, [data-ux="IconExit"], [data-ux="IconClose"]')
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
