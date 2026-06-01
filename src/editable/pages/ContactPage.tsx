'use client'

import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const contactCards = [
  {
    icon: Mail,
    title: 'Editorial and content support',
    body: 'Need help with publishing quality visuals, profile stories, or structured content? We can guide your next steps.',
  },
  {
    icon: Sparkles,
    title: 'Creative partnerships',
    body: 'Planning a campaign, artist collaboration, or portfolio feature? Let us shape a polished presentation plan with you.',
  },
  {
    icon: MapPin,
    title: 'Growth and category planning',
    body: 'Looking to expand reach in specific topics or audience groups? We can help organize category flow for stronger discovery.',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f3f1e8] text-[#1d1d1b]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.02fr] lg:items-start lg:px-8 lg:py-16">
          <article className="rounded-[28px] border border-black/10 bg-white p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9AB17A]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-black/70">We would love to hear about your goals. Whether you are building an image-first presence, highlighting creative profiles, or improving discoverability, our team is here to help.</p>

            <div className="mt-8 grid gap-4">
              {contactCards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-black/10 bg-[#f6f4eb] p-5">
                  <item.icon className="h-5 w-5 text-[#9AB17A]" />
                  <h2 className="mt-3 text-xl font-black tracking-tight">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-black/65">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-black/10 bg-[#20241d] p-5 text-white">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#C3CC9B]"><Phone className="h-4 w-4" /> Direct support</p>
              <p className="mt-3 text-sm leading-7 text-white/85">Share your request with as much detail as possible. We will respond with a practical plan and clear turnaround expectations.</p>
            </div>
          </article>

          <aside className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-black tracking-[-0.04em]">Start your request</h2>
            <p className="mt-2 text-sm leading-7 text-black/60">Tell us what you need and we will get back with a focused response within one business day.</p>
            <div className="mt-6">
              <EditableContactLeadForm />
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
