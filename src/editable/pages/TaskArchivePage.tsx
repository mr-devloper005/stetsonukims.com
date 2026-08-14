import Link from 'next/link'
import { UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableExcerpt, getEditablePostImage, getEditableCategory } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const q = params.toString()
  return q ? `${basePath}?${q}` : basePath
}

export async function EditableTaskArchiveRoute({ task, searchParams, basePath }: { task: TaskKey; searchParams?: Promise<{ category?: string; page?: string }>; basePath?: string }) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 18, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const page = pagination.page || 1
  const taskLabel = taskConfig?.label || task

  return (
    <EditableSiteShell>
      <main className="bg-[#0a0a0a] text-[#f0f0f0]">
        <section className="border-b border-white/6 bg-[#0a0a0a] py-12 lg:py-16">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">Gallery &middot; {taskLabel}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">Image posts with a gallery-first browsing experience.</h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/45">Image pages should lead with visual impact, stronger cards, and a portfolio-like rhythm.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Gallery', 'Visual-first', 'Portfolio mood'].map((chip) => (
                    <span key={chip} className="rounded-full border border-white/10 px-4 py-1.5 text-[12px] font-medium text-white/50">{chip}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-white/40">{pagination.total || posts.length} posts &middot; All categories</span>
                <form action={basePath} className="flex items-center gap-2">
                  <select name="category" defaultValue={category} className="h-10 rounded-lg border border-white/10 bg-[#161616] px-3 text-[13px] text-white/80 outline-none">
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="h-10 rounded-lg bg-[#6366f1] px-4 text-[13px] font-semibold text-white transition hover:bg-[#5558e6]">Apply</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
            {posts.map((post, index) => <ArchiveCard key={post.id || post.slug} task={task} post={post} basePath={basePath} index={index} />)}
          </div>
          {!posts.length ? <p className="rounded-2xl border border-dashed border-white/15 bg-[#161616] p-10 text-center text-[14px] text-white/45">No posts found for this category.</p> : null}
          <div className="mt-12 flex items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-lg border border-white/10 bg-[#161616] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/10">Previous</Link> : null}
            <span className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-[13px] font-semibold text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-lg border border-white/10 bg-[#161616] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/10">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function detailHref(task: TaskKey, slug: string, basePath: string) {
  if (task === 'profile') return `/profile/${slug}`
  return `${basePath}/${slug}`
}

function ArchiveCard({ task, post, basePath, index }: { task: TaskKey; post: SitePost; basePath: string; index: number }) {
  const href = detailHref(task, post.slug, basePath)

  if (task === 'image') {
    const aspects = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/2]']
    const aspect = aspects[index % aspects.length]
    return (
      <Link href={href} className="group block break-inside-avoid overflow-hidden rounded-2xl border border-white/8 bg-[#161616] transition hover:border-white/15 hover:shadow-lg hover:shadow-black/30">
        <div className="relative overflow-hidden">
          <img src={getEditablePostImage(post)} alt={post.title} className={`w-full object-cover transition duration-700 group-hover:scale-[1.03] ${aspect}`} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10">
            <span className="mb-1 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 backdrop-blur-sm">{getEditableCategory(post)}</span>
            <h2 className="line-clamp-2 text-[14px] font-semibold leading-snug text-white">{post.title}</h2>
          </div>
        </div>
      </Link>
    )
  }

  if (task === 'profile') {
    return (
      <Link href={href} className="block break-inside-avoid rounded-2xl border border-white/8 bg-[#161616] p-6 text-center transition hover:border-white/15">
        <img src={getEditablePostImage(post)} alt={post.title} className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-white/10" />
        <h2 className="mt-4 line-clamp-2 text-lg font-bold text-white">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-white/45">{getEditableExcerpt(post, 95)}</p>
        <UserRound className="mx-auto mt-3 h-4 w-4 text-[#6366f1]" />
      </Link>
    )
  }

  return (
    <Link href={href} className="group block break-inside-avoid overflow-hidden rounded-2xl border border-white/8 bg-[#161616] transition hover:border-white/15">
      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366f1]">{getEditableCategory(post)}</p>
        <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-tight text-white">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-white/45">{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}
