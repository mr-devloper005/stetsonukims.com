import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0a0a0a] text-[#f0f0f0]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-2xl border border-white/8 bg-[#161616] p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{pagesContent.about.badge}</p>
              <h1 className="mt-4 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/50">{pagesContent.about.description}</p>

              <div className="mt-8 grid gap-4">
                {pagesContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="rounded-xl border border-white/6 bg-[#0f0f0f] p-5 text-[14px] leading-7 text-white/60">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <aside className="space-y-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-2xl border p-6 ${index === 0 ? 'border-[#6366f1]/30 bg-[#6366f1]/10' : 'border-white/8 bg-[#161616]'}`}>
                  <h2 className="text-xl font-bold tracking-[-0.02em] text-white">{value.title}</h2>
                  <p className="mt-3 text-[14px] leading-7 text-white/50">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
