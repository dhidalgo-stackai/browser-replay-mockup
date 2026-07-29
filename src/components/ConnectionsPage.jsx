import { useState } from 'react'
import LeftRail from './LeftRail.jsx'
import { Search, Plus, Kebab, ChevronDown, InfoCircle, ShareNodes, Monitor } from './icons.jsx'
import Tooltip from './Tooltip.jsx'

const CONNECTIONS = [
  { provider: 'Browser Navigation', logo: null, name: "David's Browser Navigation connection", createdBy: 'David Hidalgo', date: 'July 29, 2026', apps: [{ name: 'Salesforce', logo: 'salesforce.com' }] },
  { provider: 'Browser Navigation', logo: null, name: "David's Browser Navigation connection", createdBy: 'David Hidalgo', date: 'July 29, 2026', apps: [{ name: 'Zendesk', logo: 'zendesk.com' }, { name: 'NetSuite', logo: 'netsuite.com' }] },
  { provider: 'SharePoint', logo: 'sharepoint.com', name: "Erik's SharePoint connection", createdBy: 'Erik Wrede', date: 'July 28, 2026' },
  { provider: 'Firecrawl', logo: 'firecrawl.dev', name: "Alberto's Firecrawl connection", createdBy: 'Alberto Arrighi', date: 'July 27, 2026' },
  { provider: 'Slack (Bot Token)', logo: 'slack.com', name: 'AIS Take Home Assignment Connection', createdBy: 'Zach Beeler', date: 'July 27, 2026' },
  { provider: 'Asana', logo: 'asana.com', name: "John's Asana Connector - Test Triggers connection", createdBy: 'John Miller', date: 'July 24, 2026' },
  { provider: 'MCP', logo: 'https://api.stackai.com/providers/mcp/icon', name: "Shani's MCP connection (circleback)", createdBy: 'Shani Fargun', date: 'July 20, 2026' },
  { provider: 'Outlook (OAuth2)', logo: 'outlook.com', name: "David's Outlook (OAuth2) connection - dhidalgo@St…", createdBy: 'David Hidalgo', date: 'July 20, 2026' },
  { provider: 'Gmail', logo: 'gmail.com', name: "David's Gmail connection - dhidalgo@stack-ai.com", createdBy: 'David Hidalgo', date: 'July 20, 2026' },
  { provider: 'Gmail', logo: 'gmail.com', name: "David's Gmail connection - dhidalgo@stack-ai.com", createdBy: 'David Hidalgo', date: 'July 20, 2026' },
  { provider: 'Gmail', logo: 'gmail.com', name: "David's Gmail connection - dhidalgo@stack-ai.com", createdBy: 'David Hidalgo', date: 'July 20, 2026' },
  { provider: 'GitHub', logo: 'github.com', name: "Zach's GitHub connection", createdBy: 'Zach Beeler', date: 'July 16, 2026' },
  { provider: 'Slack', logo: 'slack.com', name: "Jenny's Slack connection", createdBy: 'Jenny Liang', date: 'July 14, 2026' },
  { provider: 'Google Drive', logo: 'drive.google.com', name: "John's Google Drive connection - jmiller@stack-ai.c…", createdBy: 'John Miller', date: 'July 9, 2026' },
  { provider: 'Google Sheets', logo: 'docs.google.com', name: "Shani's Google Sheets connection", createdBy: 'Shani Fargun', date: 'July 8, 2026' },
  { provider: 'Asana (MCP)', logo: 'asana.com', name: "Jenny's Asana (MCP) connection", createdBy: 'Jenny Liang', date: 'July 2, 2026' },
  { provider: 'Outlook (OAuth2)', logo: 'outlook.com', name: "Max's Outlook (OAuth2) connection - mpoff@Stack…", createdBy: 'Max Poff', date: 'July 1, 2026' },
]

function ProviderLogo({ domain, name }) {
  const [failed, setFailed] = useState(false)
  const initial = (name || '?')[0].toUpperCase()
  if (name === 'Browser Navigation') {
    return (
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white text-orange-500 ring-1 ring-hairline">
        <Monitor size={14} />
      </div>
    )
  }
  if (!domain || failed) {
    return (
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] font-semibold text-gray-600 ring-1 ring-hairline">
        {initial}
      </div>
    )
  }
  return (
    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-hairline">
      <img
        src={domain.startsWith('http') ? domain : `https://icons.duckduckgo.com/ip3/${domain}.ico`}
        onError={() => setFailed(true)}
        alt=""
        className="h-4 w-4 object-contain"
      />
    </div>
  )
}

function Avatar({ name }) {
  const initial = (name || '?')[0].toUpperCase()
  return (
    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[11px] font-semibold text-gray-700 ring-1 ring-gray-200">
      {initial}
    </div>
  )
}

function SortHeader({ children }) {
  return (
    <button className="inline-flex items-center gap-1 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted hover:text-ink">
      {children}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 9l4-4 4 4" />
        <path d="M8 15l4 4 4-4" />
      </svg>
    </button>
  )
}

function Row({ c }) {
  return (
    <div className="grid grid-cols-[36px_1.1fr_2fr_1.1fr_1fr_1.1fr_90px_40px] items-center gap-4 border-b border-hairline px-4 py-2.5 text-[13px] hover:bg-gray-50/60">
      <div className="flex items-center">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <ProviderLogo domain={c.logo} name={c.provider} />
        <span className="truncate text-[12.5px] text-ink">{c.provider}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="truncate text-[12.5px] text-ink">{c.name}</span>
        {c.apps && c.apps.length > 0 && (
          <span className="flex-shrink-0 text-[12.5px] text-ink">
            ({c.apps.map(a => a.name).join(', ')})
          </span>
        )}
        <Tooltip label={c.name} width={280}>
          <button className="flex h-4 w-4 flex-shrink-0 items-center justify-center text-muted hover:text-ink">
            <InfoCircle size={13} />
          </button>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <Avatar name={c.createdBy} />
        <span className="truncate text-[12.5px] text-ink">{c.createdBy}</span>
      </div>
      <div className="text-[12.5px] text-muted">{c.date}</div>
      <div className="flex items-center gap-1.5">
        <Avatar name={c.createdBy} />
        <button className="inline-flex items-center gap-1 rounded-md border border-hairline bg-white px-2 py-1 text-[12px] text-ink hover:bg-gray-50">
          <Plus size={11} sw={2.2} /> Add
        </button>
      </div>
      <div>
        <button className="rounded-md border border-hairline bg-white px-3 py-1 text-[12.5px] text-ink hover:bg-gray-50">
          Test
        </button>
      </div>
      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-gray-100">
        <Kebab size={16} />
      </button>
    </div>
  )
}

export default function ConnectionsPage() {
  const [q, setQ] = useState('')

  const filtered = CONNECTIONS.filter(c =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.provider.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftRail />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative flex flex-shrink-0 items-center gap-3 border-b border-hairline bg-[#fafafa] px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 text-[14px]">
            <span className="text-muted opacity-60"><ShareNodes size={16} /></span>
            <span className="font-medium text-ink">Connections</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-transparent bg-ink px-3 py-1.5 text-[13px] font-medium text-white hover:opacity-90">
              <Plus size={14} sw={2.2} /> New Connection
            </button>
          </div>
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="flex w-full flex-col gap-4 px-8 py-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted">
                  <Search size={14} />
                </span>
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search connections"
                  className="w-full rounded-lg border border-hairline bg-white py-1.5 pl-8 pr-3 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 py-1.5 text-[12.5px] text-ink hover:bg-gray-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M6 12h12M10 18h4" />
                </svg>
                Filters
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="grid grid-cols-[36px_1.1fr_2fr_1.1fr_1fr_1.1fr_90px_40px] items-center gap-4 rounded-t-xl border-b border-gray-200 bg-[#f2f2f2] px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted">
                <div><input type="checkbox" className="h-4 w-4 rounded border-gray-300" /></div>
                <div>Provider</div>
                <div>Connection Name</div>
                <div><SortHeader>Created by</SortHeader></div>
                <div><SortHeader>Created at</SortHeader></div>
                <div>General Access</div>
                <div>Test</div>
                <div />
              </div>
              {filtered.map((c, i) => <Row key={i} c={c} />)}
              <div className="flex items-center justify-between rounded-b-xl border-t border-gray-200 bg-[#f2f2f2] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <button className="rounded-md border border-hairline bg-white px-2.5 py-1 text-[12px] text-muted hover:bg-gray-50">‹ Prev</button>
                  <button className="rounded-md border border-hairline bg-white px-2.5 py-1 text-[12px] text-muted hover:bg-gray-50">Next ›</button>
                </div>
                <div className="flex items-center gap-1.5 text-[12px]">
                  <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-ink">15 rows</span>
                  <span className="px-2 py-1 text-muted">30</span>
                  <span className="px-2 py-1 text-muted">100</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
