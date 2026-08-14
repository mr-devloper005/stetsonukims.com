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
      <main className="bg-[#0a0a0a] text-[#f0f0f0]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.02fr] lg:items-start lg:px-8 lg:py-16">
          <article className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8 lg:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/50">We would love to hear about your goals. Whether you are building an image-first presence, highlighting creative profiles, or improving discoverability, our team is here to help.</p>

            <div className="mt-8 grid gap-4">
              {contactCards.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/6 bg-[#0f0f0f] p-5">
                  <item.icon className="h-5 w-5 text-[#6366f1]" />
                  <h2 className="mt-3 text-lg font-bold tracking-tight text-white">{item.title}</h2>
                  <p className="mt-2 text-[14px] leading-7 text-white/45">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/10 p-5">
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6366f1]"><Phone className="h-3.5 w-3.5" /> Direct support</p>
              <p className="mt-3 text-[14px] leading-7 text-white/60">Share your request with as much detail as possible. We will respond with a practical plan and clear turnaround expectations.</p>
            </div>
          </article>

          <aside className="rounded-2xl border border-white/8 bg-[#161616] p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-white">Start your request</h2>
            <p className="mt-2 text-[14px] leading-7 text-white/45">Tell us what you need and we will get back with a focused response within one business day.</p>
            <div className="mt-6">
              <EditableContactLeadForm />
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
