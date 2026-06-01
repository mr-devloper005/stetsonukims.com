import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'

export function EditableFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-black/10 bg-[#f6f4eb]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-10 w-auto object-contain" />
          <p className="mt-3 text-2xl font-black tracking-tight">{SITE_CONFIG.name}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-black/65">{SITE_CONFIG.description}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/45">Company</p>
          <div className="mt-4 grid gap-2 text-sm font-medium">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/search">Search</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 py-5 text-center text-xs font-medium text-black/60">© {year} {SITE_CONFIG.name}. All rights reserved.</div>
    </footer>
  )
}
