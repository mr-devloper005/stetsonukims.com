import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

function isPlaceholder(url?: string) {
  return !url || url.includes('placeholder.svg')
}

export function getEditableRawPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const image = typeof content.image === 'string' ? content.image : ''
  const summaryImage = Array.isArray(content.images) ? (content.images.find((it) => typeof it === 'string') as string | undefined) : ''
  const resolved = mediaUrl || image || summaryImage || ''
  return isPlaceholder(resolved) ? '' : resolved
}

export function getEditablePostImage(post?: SitePost | null) {
  return getEditableRawPostImage(post) || '/placeholder.svg?height=900&width=1400'
}

export function getEditableInitials(post?: SitePost | null) {
  const words = String(post?.title || '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return '?'
  const first = words[0]?.[0] || ''
  const second = words.length > 1 ? words[words.length - 1]?.[0] || '' : ''
  return `${first}${second}`.toUpperCase()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw = (typeof content.description === 'string' && content.description) || (typeof content.summary === 'string' && content.summary) || post?.summary || ''
  const decoded = raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
  const clean = decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-2xl border border-white/8 bg-[#161616]">
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
      <div className="relative z-10 flex min-h-[400px] flex-col justify-end p-8">
        <span className="mb-3 inline-block w-fit rounded-md bg-[#6366f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">{label}</span>
        <h3 className="text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl">{post.title}</h3>
        <p className="mt-3 max-w-xl text-[14px] leading-6 text-white/60">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/60 transition group-hover:text-[#6366f1]">View story <ArrowRight className="h-3.5 w-3.5" /></span>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index: _index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block w-[300px] shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-[#161616] transition hover:border-white/15">
      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366f1]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="rounded-xl border border-white/8 bg-[#161616] p-4 transition hover:border-white/15">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366f1]">No. {String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold text-white">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-[13px] text-white/45">{getEditableExcerpt(post, 80)}</p>
    </Link>
  )
}

export function ArticleListCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid gap-4 overflow-hidden rounded-2xl border border-white/8 bg-[#161616] p-3 transition hover:border-white/15 sm:grid-cols-[220px_1fr]">
      <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full rounded-xl object-cover" />
      <div className="p-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366f1]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-tight text-white">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-white/45">{getEditableExcerpt(post, 160)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/50 transition group-hover:text-[#6366f1]">Read more <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}
