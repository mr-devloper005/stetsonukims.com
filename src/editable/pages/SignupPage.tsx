import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Register', description: 'Create your local account and start exploring.' })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#20241d] text-white">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:px-8">
          <aside className="rounded-[30px] border border-white/15 bg-white/10 p-7 backdrop-blur sm:p-9">
            <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">Create your account</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/80">Register to save your local session and continue with personalized access to curated visual content.</p>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-7 text-white/80">
              Submitted registration details are stored in local storage for this demo experience.
            </div>
          </aside>
          <article className="rounded-[30px] border border-white/15 bg-white p-7 text-[#1d1d1b] shadow-sm sm:p-9">
            <h2 className="text-3xl font-black tracking-[-0.04em]">Register</h2>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm text-black/70">Already have an account? <Link href="/login" className="font-black underline">Login here</Link></p>
          </article>
        </section>
      </main>
    </EditableSiteShell>
  )
}

