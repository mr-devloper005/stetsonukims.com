import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0a0a0a] text-[#f0f0f0]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/50">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-white">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-[14px] text-white/50">New here? <Link href="/signup" className="font-semibold text-[#6366f1] hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
