import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: 'Sign in to continue your creative workflow.' })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f3f1e8] text-[#1d1d1b]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <article className="rounded-[30px] border border-black/10 bg-white p-7 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9AB17A]">Member login</p>
            <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">Welcome back</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-black/70">Sign in to continue browsing premium image collections, profile pages, and curated resources.</p>
            <div className="mt-8 rounded-2xl border border-black/10 bg-[#f6f4eb] p-5 text-sm leading-7 text-black/70">
              Your submitted login details are stored in browser local storage for this demo flow.
            </div>
          </article>
          <aside className="rounded-[30px] border border-black/10 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-3xl font-black tracking-[-0.04em]">Login</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm text-black/70">Need an account? <Link href="/signup" className="font-black underline">Register here</Link></p>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}

