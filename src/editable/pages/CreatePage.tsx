'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'rounded-lg border border-white/8 bg-[#0f0f0f] px-4 py-3 text-[14px] font-medium text-white outline-none transition placeholder:text-white/30 focus:border-[#6366f1]/50'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[#0a0a0a] px-4 py-16 text-[#f0f0f0] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-white/8 bg-[#161616] p-7 md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex h-full min-h-72 items-center justify-center rounded-xl bg-[#0f0f0f]">
              <Lock className="h-16 w-16 text-white/20" />
            </div>
            <div className="self-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/50">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#5558e6]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-white/5">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-2xl border border-white/8 bg-[#161616] p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <aside>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/50">{pagesContent.create.hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`rounded-xl border p-4 text-left transition ${active ? 'border-[#6366f1]/50 bg-[#6366f1]/10 text-white' : 'border-white/8 bg-[#0f0f0f] text-white/70 hover:border-white/15'}`}>
                      <Icon className="h-4 w-4" />
                      <span className="mt-3 block text-[13px] font-semibold">{item.label}</span>
                      <span className="mt-1 block text-[11px] text-white/40">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-xl border border-white/6 bg-[#0f0f0f] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-xl font-bold tracking-[-0.02em] text-white">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/60">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
                  <p className="flex items-center gap-2 text-[13px] font-semibold"><CheckCircle2 className="h-4 w-4" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-[13px] text-emerald-400/70">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6366f1] text-[13px] font-semibold text-white transition hover:bg-[#5558e6]">
                <Send className="h-3.5 w-3.5" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
