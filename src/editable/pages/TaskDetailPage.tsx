import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 8)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 20) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

function content(post: SitePost) {
  return post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}
function text(v: unknown) { return typeof v === 'string' ? v.trim() : '' }
function body(post: SitePost) {
  const c = content(post)
  return text(c.body) || text(c.description) || post.summary || 'Details coming soon.'
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function sanitizeHref(rawHref: string) {
  const href = rawHref.trim()
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(href)) return href
  return '#'
}

function preserveAnchors(raw: string) {
  return raw.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_match, href: string, label: string) => {
    const safeHref = sanitizeHref(href)
    const safeLabel = label.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || safeHref
    return `[[[LINK:${safeHref}|${safeLabel}]]]`
  })
}

function restoreAnchors(raw: string) {
  return raw.replace(/\[\[\[LINK:([^|]+)\|([\s\S]*?)\]\]\]/g, (_match, href: string, label: string) => {
    const safeHref = sanitizeHref(href)
    const safeLabel = escapeHtml(label.trim())
    return `<a href="${safeHref}" target="_blank" rel="noreferrer noopener">${safeLabel}</a>`
  })
}

function linkifyPlainText(raw: string) {
  const pattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<]*)?|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi
  const parts = raw.split(pattern)
  return parts
    .map((part) => {
      if (!part) return ''
      if (/^\[\[\[LINK:/.test(part)) return part
      if (pattern.test(part)) {
        pattern.lastIndex = 0
        const cleaned = part.replace(/[),.;:!?]+$/g, '')
        const trailing = part.slice(cleaned.length)
        const href = cleaned.includes('@') && !cleaned.startsWith('http') && !cleaned.startsWith('www.')
          ? `mailto:${cleaned}`
          : cleaned.startsWith('http')
            ? cleaned
            : cleaned.startsWith('www.')
              ? `https://${cleaned}`
              : `https://${cleaned}`
        return `<a href="${sanitizeHref(href)}" target="_blank" rel="noreferrer noopener">${escapeHtml(cleaned)}</a>${escapeHtml(trailing)}`
      }
      return escapeHtml(part)
    })
    .join('')
}

function htmlToParagraphHtml(raw: string) {
  const withAnchors = preserveAnchors(raw)
  const withBreaks = withAnchors
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|section|article)>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '- ')
  const plain = withBreaks.replace(/<(?!\[\[\[LINK:)[^>]*>/g, ' ').replace(/\u00a0/g, ' ').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  if (!plain) return '<p>Details coming soon.</p>'
  return restoreAnchors(
    plain
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
      .map((part) => `<p>${linkifyPlainText(part)}</p>`)
    .join('')
  )
}

function asHtml(raw: string) {
  if (/<[a-z][\s\S]*>/i.test(raw)) return htmlToParagraphHtml(raw)
  return raw.split(/\n{2,}/).map((p) => `<p>${escapeHtml(p)}</p>`).join('')
}

function detailHref(task: TaskKey, slug: string) {
  if (task === 'profile') return `/profile/${slug}`
  const route = getTaskConfig(task)?.route || `/${task}`
  return `${route}/${slug}`
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const route = getTaskConfig(task)?.route || `/${task}`
  const role = text(content(post).role) || text(content(post).designation) || text(content(post).company) || 'Profile'
  return (
    <EditableSiteShell>
      <main className="bg-[#f3f1e8] text-[#1d1d1b]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
          <article className="rounded-[28px] border border-black/10 bg-white p-6 sm:p-9">
            <Link href={route} className="inline-flex items-center gap-2 rounded-xl border border-black/15 px-4 py-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Back</Link>
            {task === 'profile' ? (
              <div className="mt-8 grid gap-6 rounded-3xl border border-black/10 bg-[#f6f4eb] p-5 sm:grid-cols-[170px_1fr] sm:items-center sm:p-7">
                <img src={getEditablePostImage(post)} alt={post.title} className="h-40 w-40 rounded-full border border-black/10 object-cover shadow-sm" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9AB17A]">{role}</p>
                  <h1 className="mt-2 text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl">{post.title}</h1>
                  <p className="mt-3 text-base leading-8 text-black/65">{getEditableExcerpt(post, 230)}</p>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-[#9AB17A]">{task}</p>
                <h1 className="mt-3 text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">{post.title}</h1>
                <p className="mt-4 text-base leading-8 text-black/65">{getEditableExcerpt(post, 230)}</p>
                <img src={getEditablePostImage(post)} alt={post.title} className="mt-7 max-h-[620px] w-full rounded-3xl object-cover" />
              </>
            )}
            <div className="article-content mt-8 text-lg leading-9 text-black/80" dangerouslySetInnerHTML={{ __html: asHtml(body(post)) }} />
            {task === 'article' ? <Comments comments={comments} /> : null}
          </article>
          {task !== 'image' && task !== 'profile' ? (
            <aside className="space-y-5">
              <div className="rounded-3xl border border-black/10 bg-white p-5">
                <h2 className="text-lg font-black">More like this</h2>
                <div className="mt-4 grid gap-3">
                  {related.map((item) => (
                    <Link key={item.id || item.slug} href={detailHref(task, item.slug)} className="grid gap-3 rounded-2xl border border-black/10 bg-[#f6f4eb] p-3 sm:grid-cols-[82px_1fr]">
                      <img src={getEditablePostImage(item)} alt={item.title} className="h-[82px] w-full rounded-xl object-cover sm:w-[82px]" />
                      <div>
                        <p className="line-clamp-2 text-sm font-bold">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-black/60">{getEditableExcerpt(item, 70)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function Comments({ comments }: { comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-3xl border border-black/10 bg-[#f6f4eb] p-5">
      <h3 className="inline-flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</h3>
      <div className="mt-4 grid gap-3">
        {comments.slice(0, 5).map((item) => (
          <div key={item.id} className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-sm font-bold">{item.name}</p>
            <p className="mt-2 text-sm text-black/70">{item.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-black/60">No comments yet.</p> : null}
      </div>
    </section>
  )
}
