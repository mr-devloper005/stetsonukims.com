import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className="bg-[#0a0a0a] text-[#f0f0f0]">
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20">
        <div className="rounded-2xl border border-white/8 bg-[#161616] p-7 sm:p-10 lg:p-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{voice.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">{voice.headline}</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/50">{voice.description}</p>
          <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-3 text-[13px] font-medium text-white outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="rounded-lg bg-[#6366f1] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#5558e6]">Filter</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#161616] p-8 text-center">
            <h2 className="text-xl font-bold text-white">No articles found</h2>
            <p className="mt-3 text-[14px] text-white/45">Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="rounded-lg border border-white/10 bg-[#161616] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/10">Previous</Link> : null}
          <span className="rounded-lg bg-[#6366f1] px-5 py-2.5 text-[13px] font-semibold text-white">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-lg border border-white/10 bg-[#161616] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/10">Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className="bg-[#0a0a0a] text-[#f0f0f0]">
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-6 rounded-2xl border border-white/8 bg-[#161616] p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-10">
          <div className="min-w-0">
            <Link href="/article" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/70 transition hover:bg-white/10"><ChevronLeft className="h-3.5 w-3.5" /> Articles</Link>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{voice.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
          </div>
          <aside className="min-w-0 rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/10 p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366f1]">Reading note</p>
            <p className="mt-4 text-[14px] leading-7 text-white/50">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#5558e6]">Contact <ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8 lg:p-10">
          <p className="text-[15px] leading-8 text-white/50">{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
