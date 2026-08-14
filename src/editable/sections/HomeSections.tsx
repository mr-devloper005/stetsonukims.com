import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { postHref, getEditablePostImage, getEditableExcerpt, getEditableCategory } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function safePosts(posts: SitePost[]) {
  return posts.filter((p) => p?.slug && p?.title).slice(0, 16)
}

function WaveDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      <svg viewBox="0 0 1440 500" fill="none" className="absolute right-0 top-1/2 h-full w-[70%] -translate-y-1/2" preserveAspectRatio="none">
        <path d="M0 200 C200 150, 400 280, 600 200 S1000 120, 1200 200 S1400 280, 1440 200" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M0 240 C250 190, 450 320, 700 250 S1050 170, 1250 250 S1400 330, 1440 260" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M0 280 C300 230, 500 360, 750 290 S1100 210, 1300 290 S1420 370, 1440 300" stroke="#eab308" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M0 320 C200 370, 500 250, 700 330 S1000 400, 1200 330 S1380 260, 1440 340" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M0 360 C250 310, 450 440, 750 370 S1100 290, 1300 370 S1420 450, 1440 380" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.4" />
      </svg>
    </div>
  )
}

export function EditableHomeHero({ primaryTask: _primaryTask, primaryRoute, posts: _posts }: HomeSectionProps) {
  const siteName = SITE_CONFIG.name
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#0a0a0a]">
      <WaveDecoration />
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[var(--editable-container)] items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="animate-fade-up text-[11px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">Business profiles & visual discovery</p>
          <h1 className="animate-fade-up-delay-1 mt-6 text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
            <span className="text-[#6366f1]">{siteName}</span> connects business owners with the profiles and images that grow their brand online.
          </h1>
          <p className="animate-fade-up-delay-2 mt-6 max-w-lg text-[16px] leading-7 text-white/50">
            Stand out in your industry with a polished, searchable presence. Share profiles, showcase images, and reach the audience that matters most to your business.
          </p>
          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap gap-4">
            <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#5558e6]">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/5">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const items = safePosts(posts)
  if (!items.length) return null

  const featured = items[0]
  const left = items.slice(1, 3)

  return (
    <section className="bg-[#0a0a0a] py-16 lg:py-24">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">{SITE_CONFIG.name} in action</h2>
            <p className="mt-2 text-[15px] text-white/45">Real profiles and stories from the community.</p>
          </div>
          <Link href={primaryRoute} className="hidden items-center gap-1 text-[14px] font-medium text-white/50 transition hover:text-white sm:inline-flex">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.6fr]">
          <div className="grid gap-5">
            {left.map((item) => (
              <Link key={item.id} href={postHref(primaryTask, item, primaryRoute)} className="group overflow-hidden rounded-2xl border border-white/8 bg-[#161616] transition hover:border-white/15">
                <div className="relative">
                  <div className="grid grid-cols-3 gap-px">
                    {(() => {
                      const imgs = Array.isArray(item.media) ? item.media.filter((m: any) => m?.url).slice(0, 3) : []
                      return imgs.length >= 2 ? imgs.slice(0, 3).map((m: any, i: number) => (
                        <img key={i} src={m.url} alt="" className="aspect-square w-full object-cover" />
                      )) : (
                        <img src={getEditablePostImage(item)} alt={item.title} className="col-span-3 aspect-[16/9] w-full object-cover" />
                      )
                    })()}
                  </div>
                  <span className="absolute left-3 top-3 rounded-md bg-[#6366f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">{getEditableCategory(item)}</span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {featured ? (
            <Link href={postHref(primaryTask, featured, primaryRoute)} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#161616]">
              <div className="grid gap-px sm:grid-cols-3">
                {(() => {
                  const imgs = Array.isArray(featured.media) ? featured.media.filter((m: any) => m?.url).slice(0, 3) : []
                  return imgs.length >= 2 ? imgs.slice(0, 3).map((m: any, i: number) => (
                    <img key={i} src={m.url} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                  )) : (
                    <img src={getEditablePostImage(featured)} alt={featured.title} className="col-span-3 aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" />
                  )
                })()}
              </div>
              <span className="absolute left-4 top-4 rounded-md bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">{getEditableCategory(featured)}</span>
              <div className="p-6">
                <h3 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-3xl">{featured.title}</h3>
                <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-white/50">{getEditableExcerpt(featured, 180)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-white/60 transition group-hover:text-[#6366f1]">
                  View story <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const items = safePosts(posts).slice(5, 11)
  if (!items.length) return null
  return (
    <section className="border-t border-white/6 bg-[#0a0a0a] py-16 lg:py-24">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">Gallery &middot; Image</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">Image posts with a gallery-first browsing experience.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-white/45">Image pages should lead with visual impact, stronger cards, and a portfolio-like rhythm.</p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {['Gallery', 'Visual-first', 'Portfolio mood'].map((chip) => (
            <span key={chip} className="rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-medium text-white/50">{chip}</span>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
          {items.map((item, idx) => {
            const isLarge = idx === 0
            return (
              <Link key={item.id} href={postHref(primaryTask, item, primaryRoute)} className="group block break-inside-avoid overflow-hidden rounded-2xl border border-white/8 bg-[#161616] transition hover:border-white/15">
                <div className="relative">
                  <img src={getEditablePostImage(item)} alt={item.title} className={`w-full object-cover transition duration-500 group-hover:scale-105 ${isLarge ? 'aspect-[3/4]' : idx % 3 === 1 ? 'aspect-[4/3]' : 'aspect-square'}`} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-white">{item.title}</h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-white/60">View Image <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const items = safePosts(posts).slice(8, 14)
  if (!items.length) return null
  return (
    <section className="border-t border-white/6 bg-[#0a0a0a] py-16 lg:py-24">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">Discover more stories</h2>
        <p className="mt-2 text-[15px] text-white/45">Explore the latest entries across all categories.</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <Link key={item.id} href={postHref(primaryTask, item, primaryRoute)} className="group grid overflow-hidden rounded-2xl border border-white/8 bg-[#161616] transition hover:border-white/15 sm:grid-cols-[200px_1fr]">
              <img src={getEditablePostImage(item)} alt={item.title} className="h-full w-full object-cover sm:aspect-square" />
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366f1]">{getEditableCategory(item)}</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-tight text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-white/45">{getEditableExcerpt(item, 120)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="border-t border-white/6 bg-[#0a0a0a] py-20 lg:py-28">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">Build your visual presence with confidence</h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-white/45">Access image-first publishing, profile storytelling, and clear discovery paths across every page.</p>
        <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-8 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#5558e6]">
          Create your account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
