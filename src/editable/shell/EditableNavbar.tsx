'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = { '--editable-nav-bg': '#0a0a0a', '--editable-nav-text': '#f0f0f0', '--editable-nav-active': '#f0f0f0', '--editable-nav-active-text': '#0a0a0a', '--editable-cta-bg': '#6366f1', '--editable-cta-text': '#ffffff', '--editable-search-bg': '#161616', '--editable-border': 'rgba(255,255,255,0.08)', '--editable-container': '1320px' } as CSSProperties
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[#0a0a0a]/95 text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 w-full max-w-[var(--editable-container)] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="text-[15px] font-bold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <span className="mx-3 h-5 w-px bg-white/10" />
          {navItems.slice(0, 4).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`px-3.5 py-1.5 text-[14px] font-medium transition ${active ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                {item.label}
              </Link>
            )
          })}
          <Link href="/about" className={`px-3.5 py-1.5 text-[14px] font-medium transition ${pathname === '/about' ? 'text-white' : 'text-white/60 hover:text-white'}`}>About</Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[#6366f1] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#5558e6] sm:inline-flex"><PlusCircle className="h-3.5 w-3.5" /> Create</Link>
              <button type="button" onClick={logout} className="hidden items-center gap-2 px-3 py-2 text-[13px] font-medium text-white/60 hover:text-white sm:inline-flex">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 px-3 py-2 text-[13px] font-medium text-white/60 hover:text-white sm:inline-flex"><LogIn className="h-3.5 w-3.5" /> Login</Link>
              <Link href="/signup" className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/10 sm:inline-flex"><UserPlus className="h-3.5 w-3.5" /> Sign up</Link>
            </>
          )}
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-white lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/8 bg-[#0a0a0a] px-4 py-4 lg:hidden">
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-[14px] font-medium text-white/80 transition hover:bg-white/5 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
