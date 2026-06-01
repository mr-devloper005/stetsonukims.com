import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f3f1e8] text-[#1d1d1b]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[30px] border border-black/10 bg-white p-7 shadow-sm sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9AB17A]">{pagesContent.about.badge}</p>
              <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-[-0.06em] sm:text-6xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-black/70">{pagesContent.about.description}</p>

              <div className="mt-8 grid gap-4">
                {pagesContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="rounded-2xl border border-black/10 bg-[#f6f4eb] p-5 text-sm leading-8 text-black/75">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <aside className="space-y-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[24px] border border-black/10 p-6 ${index === 0 ? 'bg-[#20241d] text-white' : 'bg-white'}`}>
                  <h2 className={`text-2xl font-black tracking-[-0.03em] ${index === 0 ? 'text-white' : 'text-[#1d1d1b]'}`}>{value.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 0 ? 'text-white/80' : 'text-black/65'}`}>{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

