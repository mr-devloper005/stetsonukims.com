'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { session, logout } = useEditableLocalAuthSession()
  const tasks = SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'image' && item.key !== 'profile').slice(0, 4)

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const onSignOut = () => {
    logout()
    setOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-[82px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          <span className="text-4 font-black tracking-tight">{SITE_CONFIG.name}</span>
        </Link>
        <div className="ml-6 hidden items-center gap-6 lg:flex">
          {tasks.map((item) => (
            <Link key={item.key} href={item.route} className={`text-[19px] font-medium ${isActive(item.route) ? 'text-black' : 'text-black/80 hover:text-black'}`}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-7 md:flex">
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-black/85 hover:text-black"><Globe className="h-4 w-4" /> Contact</Link>
          {session ? (
            <button type="button" onClick={onSignOut} className="rounded-xl border border-black/15 px-4 py-2 text-sm font-bold">Sign out</button>
          ) : (
            <>
              <Link href="/signup" className="text-sm font-medium">Sign up</Link>
              <Link href="/login" className="text-sm font-medium">Log in</Link>
            </>
          )}
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="ml-auto rounded-xl border border-black/10 p-2 md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div className="border-t border-black/10 bg-white p-4 md:hidden">
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...tasks.map((t) => ({ label: t.label, href: t.route })), { label: 'Contact', href: '/contact' }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl border border-black/10 px-4 py-3 text-sm font-medium">
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={onSignOut} className="rounded-xl border border-black/15 px-4 py-3 text-sm font-bold text-left">
                Sign out
              </button>
            ) : (
              <>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-xl border border-black/10 px-4 py-3 text-sm font-medium">
                  Sign up
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl border border-black/10 px-4 py-3 text-sm font-medium">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
