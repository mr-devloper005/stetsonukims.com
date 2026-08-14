import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const decodeEntities = (value: string) => value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
const stripHtml = (value: string) => decodeEntities(value).replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-2xl border border-white/8 bg-[#161616] transition hover:border-white/15 ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-md bg-[#6366f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5">
        {!image ? <span className="rounded-md bg-[#6366f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">{taskLabel}</span> : null}
        <h2 className="mt-3 line-clamp-3 text-xl font-bold leading-tight tracking-[-0.02em] text-white">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-white/45">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium text-white/40 transition group-hover:text-[#6366f1]">Open result <ArrowRight className="h-3.5 w-3.5" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-2xl border border-white/8 bg-[#161616] p-6 md:grid-cols-[0.8fr_1.2fr] lg:p-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/50">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="self-end rounded-xl border border-white/6 bg-[#0f0f0f] p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-lg border border-white/8 bg-[#161616] px-4 py-3">
                <Search className="h-4 w-4 text-white/40" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-white/30" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-lg border border-white/8 bg-[#161616] px-4 py-3">
                  <Filter className="h-3.5 w-3.5 text-white/40" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-white/30" />
                </label>
                <select name="task" defaultValue={task} className="rounded-lg border border-white/8 bg-[#161616] px-4 py-3 text-[13px] font-medium text-white/80 outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#6366f1] text-[13px] font-semibold text-white transition hover:bg-[#5558e6]" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">{results.length} results</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-[#161616] p-10 text-center">
              <p className="text-xl font-bold text-white">No matching posts found.</p>
              <p className="mt-3 text-[14px] text-white/45">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
