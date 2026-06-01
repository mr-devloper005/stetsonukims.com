import Link from 'next/link'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { postHref, getEditablePostImage, getEditableExcerpt } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function safePosts(posts: SitePost[]) {
  return posts.filter((p) => p?.slug && p?.title).slice(0, 16)
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const top = safePosts(posts)
  const hero = top[0]
  const side = top.slice(1, 3)
  return (
    <section className="border-b border-black/8 bg-[#f3f1e8]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">Curated visuals and profiles for modern creative work</h1>
          <p className="mt-6 max-w-xl text-xl leading-9 text-black/65">Discover polished image stories, standout profiles, and practical resources in one elegant stream.</p>
          <div className="mt-9 flex gap-4">
            <Link href={primaryRoute} className="rounded-2xl bg-[#0f6fff] px-7 py-4 text-base font-bold text-white">Explore collection</Link>
            {/* <Link href="/contact" className="rounded-2xl border border-black/20 px-7 py-4 text-base font-bold">Talk to us</Link> */}
          </div>
        </div>
        <div className="grid gap-4">
          {hero ? (
            <Link href={postHref(primaryTask, hero, primaryRoute)} className="group overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-sm">
              <div className="relative aspect-[16/10]">
                <img src={getEditablePostImage(hero)} alt={hero.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
            </Link>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {side.map((item) => (
              <Link key={item.id} href={postHref(primaryTask, item, primaryRoute)} className="rounded-3xl border border-black/10 bg-white p-4">
                <p className="line-clamp-2 text-lg font-bold leading-tight">{item.title}</p>
                <p className="mt-2 line-clamp-2 text-sm text-black/60">{getEditableExcerpt(item, 90)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const items = safePosts(posts).slice(0, 8)
  if (!items.length) return null
  return (
    <section className="bg-[#f3f1e8] py-12">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl font-black tracking-tight">Trusted by creators and teams</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {items.slice(0, 4).map((item, i) => (
            <Link key={item.id} href={postHref(primaryTask, item, primaryRoute)} className="rounded-2xl bg-white p-4 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9AB17A]">Spotlight {i + 1}</p>
              <p className="mt-3 line-clamp-2 text-sm font-bold">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const items = safePosts(posts).slice(2, 8)
  if (!items.length) return null
  return (
    <section className="bg-[#f6f4eb] py-14">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-5xl font-black tracking-tight">Find it fast, every time</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <Link key={item.id} href={postHref(primaryTask, item, primaryRoute)} className="overflow-hidden rounded-[22px] border border-black/10 bg-white">
              <img src={getEditablePostImage(item)} alt={item.title} className="aspect-[5/3] w-full object-cover" />
              <div className="p-5">
                <h3 className="line-clamp-2 text-2xl font-black leading-tight">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm text-black/65">{getEditableExcerpt(item, 120)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const items = safePosts(posts).slice(8, 14)
  if (!items.length) return null
  return (
    <section className="bg-[#20241d] py-16 text-white">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-5xl font-black tracking-tight">Discover, learn, and create</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {items.map((item, idx) => (
            <Link key={item.id} href={postHref(primaryTask, item, primaryRoute)} className="grid overflow-hidden rounded-3xl border border-white/15 bg-white/5 sm:grid-cols-[200px_1fr]">
              <img src={getEditablePostImage(item)} alt={item.title} className={`h-full w-full object-cover ${idx % 2 === 0 ? 'sm:aspect-square' : 'sm:aspect-[4/5]'}`} />
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C3CC9B]">Editorial</p>
                <h3 className="mt-3 line-clamp-2 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm text-white/75">{getEditableExcerpt(item, 120)}</p>
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
    <section className="bg-[#f3f1e8] py-20">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Build your visual presence with confidence</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-black/65">Access image-first publishing, profile storytelling, and clear discovery paths across every page.</p>
        <Link href="/signup" className="mt-8 inline-flex rounded-2xl bg-[#0f6fff] px-8 py-4 text-base font-bold text-white">Create your account</Link>
      </div>
    </section>
  )
}
