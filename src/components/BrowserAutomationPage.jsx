import { useState } from 'react'
import LeftRail from './LeftRail.jsx'
import { Search, Plus, Upload, Kebab, ChevronDown } from './icons.jsx'

const RECORDINGS = [
  {
    name: 'Download vendor invoices',
    author: 'John Miller',
    org: true,
    desc: 'Sign in to NetSuite vendor portal and download all open invoices for AP reconciliation. Runs on a weekly schedule.',
    updated: 'July 22, 2026',
    site: 'portal.netsuite.com',
  },
  {
    name: 'Extract Salesforce lead list',
    author: 'StackAI',
    org: true,
    desc: 'Pulls the weekly qualified-leads report from Salesforce Lightning and drops it into the shared drive.',
    updated: 'July 18, 2026',
    site: 'lightning.force.com',
  },
  {
    name: 'Sync Zendesk tickets',
    author: 'Shani Fargun',
    desc: 'Scrapes new Zendesk tickets tagged "billing" and pushes them into the CRM as follow-up tasks.',
    updated: 'July 14, 2026',
    site: 'company.zendesk.com',
  },
  {
    name: 'Post weekly ops report',
    author: 'Jenny Liang',
    desc: 'Logs into Notion, opens the ops dashboard, and posts a snapshot into the #weekly-ops Slack channel.',
    updated: 'July 11, 2026',
    site: 'notion.so',
  },
  {
    name: 'Update pricing sheet on Shopify',
    author: 'Ppaudel',
    desc: 'Adjusts SKU pricing on the Shopify admin from a source spreadsheet. Verifies each change before saving.',
    updated: 'July 6, 2026',
    site: 'admin.shopify.com',
  },
  {
    name: 'Competitor page screenshots',
    author: 'David Hidalgo',
    desc: 'Visits a rotating list of competitor product pages and archives full-page screenshots for weekly review.',
    updated: 'July 2, 2026',
    site: 'various',
  },
  {
    name: 'Renew SSL certificate',
    author: 'StackAI',
    org: true,
    desc: 'Signs into the registrar, walks the renewal flow, and captures the new expiration date into the runbook.',
    updated: 'June 27, 2026',
    site: 'registrar.example',
  },
  {
    name: 'Refresh HubSpot deals',
    author: 'Jacob ZY Yoon',
    desc: 'Marks stalled deals as "needs review" and reassigns based on last-touch date.',
    updated: 'June 21, 2026',
    site: 'app.hubspot.com',
  },
  {
    name: 'test recording',
    author: 'David Hidalgo',
    desc: 'quick smoke test — do not schedule',
    updated: 'June 30, 2026',
    site: '—',
  },
]

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-full border px-3 py-1 text-[12.5px] ' +
        (active
          ? 'border-ink bg-white text-ink'
          : 'border-hairline bg-white text-muted hover:text-ink')
      }
    >
      {children}
    </button>
  )
}

function Card({ r }) {
  const initials = r.author.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <a
      href="#/browser-automation/recording"
      className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-white hover:border-gray-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5">
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-ink">{r.name}</div>
          <div className="mt-0.5 text-[12px] text-muted">By {r.author}</div>
        </div>
        <button className="text-muted opacity-0 group-hover:opacity-100" onClick={e => e.preventDefault()}>
          <Kebab size={16} />
        </button>
      </div>
      <div className="px-4 pt-2.5">
        <p className="text-[12.5px] leading-[1.5] text-gray-600 line-clamp-3 min-h-[54px]">{r.desc}</p>
      </div>
      <div className="mx-4 mt-3 border-t border-hairline" />
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">{initials}</div>
        <div className="text-[11.5px] text-muted">Updated on {r.updated}</div>
      </div>
    </a>
  )
}

export default function BrowserAutomationPage() {
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  const filtered = RECORDINGS.filter(r => {
    if (filter === 'org' && !r.org) return false
    if (filter === 'custom' && r.org) return false
    if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftRail expanded />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-hairline bg-white px-6 py-3">
          <div className="text-[15px] font-semibold text-ink">Browser automation</div>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-gray-50">
              <Upload size={14} /> Import
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[13px] font-medium text-white hover:opacity-90">
              <Plus size={14} sw={2.2} /> New recording
            </button>
          </div>
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bg-gray-50">
          <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-5 px-8 py-6">
            <p className="text-[13px] text-muted">Reusable browser recordings your agents can replay on demand.</p>

            <div className="flex items-center gap-3">
              <div className="relative w-[260px]">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"><Search size={14} /></span>
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search recordings…"
                  className="w-full rounded-lg border border-hairline bg-white py-1.5 pl-8 pr-3 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <Chip active={filter === 'org'} onClick={() => setFilter(filter === 'org' ? 'all' : 'org')}>StackAI</Chip>
              <Chip active={filter === 'custom'} onClick={() => setFilter(filter === 'custom' ? 'all' : 'custom')}>Custom</Chip>
              <div className="h-6 w-px bg-hairline" />
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 py-1.5 text-[12.5px] text-ink hover:bg-gray-50">
                All authors <ChevronDown size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(r => <Card key={r.name} r={r} />)}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
