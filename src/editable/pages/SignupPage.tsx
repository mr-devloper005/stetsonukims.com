import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0a0a0a] text-[#f0f0f0]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <div className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8">
            <h1 className="text-2xl font-bold tracking-[-0.03em] text-white">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-5 text-[14px] text-white/50">Already have an account? <Link href="/login" className="font-semibold text-[#6366f1] hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/50">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
