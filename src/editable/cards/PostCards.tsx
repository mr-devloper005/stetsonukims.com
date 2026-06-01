import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const image = typeof content.image === 'string' ? content.image : ''
  const summaryImage = Array.isArray(content.images) ? (content.images.find((it) => typeof it === 'string') as string | undefined) : ''
  return mediaUrl || image || summaryImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw = (typeof content.description === 'string' && content.description) || (typeof content.summary === 'string' && content.summary) || post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-[26px] border border-black/10 bg-black text-white">
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/75" />
      <div className="relative z-10 p-8 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C3CC9B]">{label}</p>
        <h3 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl">{post.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">{getEditableExcerpt(post, 180)}</p>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block w-[300px] shrink-0 overflow-hidden rounded-3xl border border-black/10 bg-white">
      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9AB17A]">Pick {index + 1}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-black">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9AB17A]">No. {String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-2 line-clamp-2 text-lg font-bold">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-black/65">{getEditableExcerpt(post, 80)}</p>
    </Link>
  )
}

export function ArticleListCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid gap-4 overflow-hidden rounded-3xl border border-black/10 bg-white p-3 sm:grid-cols-[220px_1fr]">
      <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full rounded-2xl object-cover" />
      <div className="p-2">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9AB17A]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-black leading-tight">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-black/65">{getEditableExcerpt(post, 160)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Read more <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

