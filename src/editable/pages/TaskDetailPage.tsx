import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

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
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const decodeEntities = (value: string) => value
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&#x27;/g, "'")
  .replace(/&#x2F;/g, '/')

const stripTags = (html: string) => html.replace(/<[^>]*>/g, '')

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  const decoded = decodeEntities(value)
  if (/<[a-z][\s\S]*>/i.test(decoded)) {
    const plain = stripTags(decoded).trim()
    if (!plain) return ''
    return plain
      .split(/\n{2,}/)
      .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
      .join('')
  }
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
  const decoded = decodeEntities(raw)
  return /<[a-z][\s\S]*>/i.test(decoded) ? stripTags(decoded).trim() : raw
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const detailVars = { '--detail-bg': '#0a0a0a', '--detail-text': '#f0f0f0', '--detail-surface': '#161616', '--detail-accent': '#6366f1' } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[#0a0a0a] text-[#f0f0f0]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
      <ArrowLeft className="h-3.5 w-3.5" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
      <article className="min-w-0 rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8 lg:p-10">
        <BackLink task="article" />
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{categoryOf(post, 'Article')}</p>
        <h1 className="mt-4 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">{post.title}</h1>
        {images[0] ? <img src={images[0]} alt="" className="mt-8 max-h-[500px] w-full rounded-xl object-cover" /> : null}
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <article className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-[#0f0f0f] ring-1 ring-white/10">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-white/30" />}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">Business listing</p>
              <h1 className="mt-3 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">{post.title}</h1>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
      <aside className="rounded-2xl border border-white/8 bg-[#111111] p-7 text-white lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">Classified notice</p>
        <h1 className="mt-4 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl">{post.title}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[#6366f1] px-5 py-3 text-[13px] font-semibold text-white">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/15 px-5 py-3 text-[13px] font-semibold text-white">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const allImages = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {allImages.map((image, index) => {
            const isFirst = index === 0
            const isTall = index === 1
            return (
              <figure key={`${image}-${index}`} className={`overflow-hidden rounded-2xl border border-white/8 bg-[#161616] ${isFirst ? 'sm:col-span-1 sm:row-span-2' : ''}`}>
                <img src={image} alt="" className={`h-full w-full object-cover ${isFirst ? 'aspect-auto min-h-[300px] sm:min-h-full' : isTall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} />
              </figure>
            )
          })}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/8 bg-[#161616] p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70"><Camera className="h-3.5 w-3.5" /> Image story</div>
            <h1 className="mt-6 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">{post.title}</h1>
            <BodyContent post={post} compact />
          </div>
          <RelatedPanel task="image" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
      <article className="rounded-2xl border border-white/8 bg-[#161616] p-7 sm:p-10">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366f1]/15 text-[#6366f1]"><Bookmark className="h-8 w-8" /></div>
        <h1 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">{post.title}</h1>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#5558e6]">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-16">
      <article className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[100px_1fr]">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#6366f1]/15 text-[#6366f1]"><FileText className="h-10 w-10" /></div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">PDF resource</p>
            <h1 className="mt-3 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-xl border border-white/8 bg-[#0f0f0f]">
            <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-[#161616] p-4">
              <span className="text-[13px] font-semibold text-white">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#5558e6]">Download <Download className="h-3.5 w-3.5" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-2xl border border-white/8 bg-[#161616] p-8 text-center lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-8 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#0f0f0f] ring-2 ring-white/10">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-white/30" />}
        </div>
        <h1 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white">{post.title}</h1>
        {role ? <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6366f1]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-2xl border border-white/8 bg-[#161616] p-7 sm:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  const content = getContent(post)
  const keywords = Array.isArray(post.tags) ? post.tags.filter((t): t is string => typeof t === 'string' && t.trim() !== '') : []
  const contentKeywords = Array.isArray(content.keywords) ? content.keywords.filter((t): t is string => typeof t === 'string' && t.trim() !== '') : []
  const allKeywords = [...new Set([...keywords, ...contentKeywords])].slice(0, 15)
  return (
    <>
      <div className={`article-content mt-8 max-w-none ${compact ? 'text-[15px] leading-7' : 'text-[16px] leading-8'} text-white/70`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
      {allKeywords.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {allKeywords.map((tag) => (
            <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/60 transition hover:border-[#6366f1]/40 hover:bg-[#6366f1]/10 hover:text-[#6366f1]">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-xl border border-white/8 bg-[#0f0f0f] p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40"><Icon className="h-3.5 w-3.5" /> {label}</div>
          <p className="mt-2 break-words text-[13px] font-medium leading-6 text-white/70">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-xl object-cover ring-1 ring-white/8" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#161616]">
      <div className="flex items-center gap-2 p-4 text-[13px] font-semibold text-white"><MapPin className="h-4 w-4 text-[#6366f1]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-xl border border-white/8 bg-[#0f0f0f] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#5558e6]">Website <ExternalLink className="h-3.5 w-3.5" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-white/70 transition hover:bg-white/5"><Phone className="h-3.5 w-3.5" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-white/70 transition hover:bg-white/5"><Mail className="h-3.5 w-3.5" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[13px]"><span className="font-semibold uppercase tracking-[0.12em] text-white/40">{label}</span><span className="font-semibold text-white">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-2xl border border-white/8 bg-[#161616] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">About this post</p>
          <div className="mt-4 grid gap-3 text-[13px] font-medium text-white/60">
            <p className="inline-flex items-center gap-2"><Tag className="h-3.5 w-3.5" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-2xl border border-white/8 bg-[#161616] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-white">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 transition hover:text-white">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-xl border border-white/6 bg-[#0f0f0f] p-3 transition hover:border-white/15">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white/5"><FileText className="h-5 w-5 text-white/30" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-tight text-white">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-white/40">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-xl border border-white/8 bg-[#0f0f0f] p-5">
      <div className="flex items-center gap-2 text-[15px] font-bold text-white"><MessageCircle className="h-4 w-4 text-[#6366f1]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-lg border border-white/6 bg-[#161616] p-4">
            <p className="text-[13px] font-semibold text-white">{comment.name}</p>
            <p className="mt-2 text-[13px] leading-6 text-white/50">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-[13px] text-white/40">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
