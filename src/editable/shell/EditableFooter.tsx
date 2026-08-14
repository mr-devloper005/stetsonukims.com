'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = { '--editable-footer-bg': '#0a0a0a', '--editable-footer-text': '#f0f0f0' } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="border-t border-white/8 bg-[#0a0a0a] text-[#f0f0f0]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="text-[15px] font-bold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-[14px] leading-7 text-white/50">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Discover</h3>
          <div className="mt-5 grid gap-2.5">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/60 transition hover:text-white">
                {task.label} <ArrowUpRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Site</h3>
          <div className="mt-5 grid gap-2.5">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-[14px] font-medium text-white/60 transition hover:text-white">{label}</Link>
            ))}
            {session ? <button type="button" onClick={logout} className="text-left text-[14px] font-medium text-white/60 transition hover:text-white">Logout</button> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/6 px-4 py-5 text-center text-[12px] font-medium text-white/30">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
