import Link from 'next/link'
import { Camera, FileText, Filter, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

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
      <main className="bg-[#f3f1e8] text-[#1d1d1b]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_330px] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9AB17A]">{taskLabel}</p>
            <h1 className="mt-3 text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">Premium browsing for {taskLabel.toLowerCase()}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-black/65">A clean discovery surface with refined cards, fast scanning, and safe post fallbacks.</p>
          </div>
          <form action={basePath} className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-black/55"><Filter className="h-4 w-4" /> Category</p>
            <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-xl border border-black/15 px-3 text-sm">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="mt-3 h-11 w-full rounded-xl bg-black text-sm font-bold text-white">Apply</button>
          </form>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => <ArchiveCard key={post.id || post.slug} task={task} post={post} basePath={basePath} index={index} />)}
          </div>
          {!posts.length ? <p className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/65">No posts found for this category.</p> : null}
          <div className="mt-10 flex items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-bold">Previous</Link> : null}
            <span className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-bold">Next</Link> : null}
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
    return (
      <Link href={href} className="group overflow-hidden rounded-3xl border border-black/10 bg-white">
        <img src={getEditablePostImage(post)} alt={post.title} className={`w-full object-cover ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
        <div className="p-4">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9AB17A]"><Camera className="h-3 w-3" /> Image</p>
          <h2 className="mt-2 line-clamp-2 text-xl font-black">{post.title}</h2>
        </div>
      </Link>
    )
  }
  if (task === 'profile') {
    return (
      <Link href={href} className="rounded-3xl border border-black/10 bg-white p-5 text-center">
        <img src={getEditablePostImage(post)} alt={post.title} className="mx-auto h-24 w-24 rounded-full object-cover" />
        <h2 className="mt-3 line-clamp-2 text-xl font-black">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm text-black/65">{getEditableExcerpt(post, 95)}</p>
        <UserRound className="mx-auto mt-3 h-4 w-4 text-[#9AB17A]" />
      </Link>
    )
  }
  return (
    <Link href={href} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/10] w-full object-cover" />
      <div className="p-5">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9AB17A]"><FileText className="h-3 w-3" /> Entry {index + 1}</p>
        <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm text-black/65">{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}
