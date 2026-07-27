import { useEffect, useRef, useState } from 'react'
import LeftRail from './LeftRail.jsx'
import { Search, Plus, Upload, Kebab, ChevronDown, X, Braces, PageFile, InfoCircle, Folder } from './icons.jsx'
import Tooltip from './Tooltip.jsx'
import SandboxModal from './SandboxModal.jsx'

function EyeIcon({ size = 14, off = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      {off && <line x1="4" y1="20" x2="20" y2="4" />}
    </svg>
  )
}

const CREDENTIALS = [
  { key: 'https://console.anthropic.com', username: 'api@stack.ai', updatedBy: 'Ppaudel', date: 'February 27, 2026', color: 'bg-indigo-500', createdBy: 'Ppaudel', createdColor: 'bg-indigo-500', usedByList: ['Download vendor invoices', 'Extract Salesforce lead list', 'Sync Zendesk tickets', 'Refresh HubSpot deals'], timesUsed: 128, access: ['Ppaudel', 'David Hidalgo', 'Jenny Liang', 'Jacob ZY Yoon', 'German Parada', 'Shani Fargun', 'John Miller'] },
  { key: 'https://bridge.stack.ai', username: 'bridge-svc', updatedBy: 'German Parada', date: 'April 16, 2026', color: 'bg-gray-300', createdBy: 'German Parada', createdColor: 'bg-gray-300', usedByList: ['Post weekly ops report', 'Renew SSL certificate'], timesUsed: 47, access: ['German Parada', 'David Hidalgo', 'Jenny Liang'] },
  { key: 'https://api.bridge.stack.ai', username: '—', updatedBy: 'German Parada', date: 'April 16, 2026', color: 'bg-gray-300', createdBy: 'German Parada', createdColor: 'bg-gray-300', usedByList: ['Post weekly ops report', 'Renew SSL certificate'], timesUsed: 47, access: ['German Parada', 'David Hidalgo'] },
  { key: 'https://platform.openai.com', username: 'davidh@stack.ai', updatedBy: 'David Hidalgo', date: 'May 3, 2026', color: 'bg-emerald-500', createdBy: 'David Hidalgo', createdColor: 'bg-emerald-500', usedByList: ['Download vendor invoices', 'Extract Salesforce lead list', 'Update pricing sheet on Shopify', 'Competitor page screenshots', 'Refresh HubSpot deals', 'test recording'], timesUsed: 312, access: ['David Hidalgo', 'Ppaudel', 'Jenny Liang', 'Jacob ZY Yoon', 'German Parada', 'Shani Fargun', 'John Miller', 'Kate Ruiz', 'Zack Otto', 'Marta Silva'] },
  { key: 'https://app.segment.com', username: 'analytics', updatedBy: 'Jenny Liang', date: 'May 12, 2026', color: 'bg-amber-500', createdBy: 'Jacob ZY Yoon', createdColor: 'bg-rose-500', usedByList: ['Post weekly ops report'], timesUsed: 9, access: ['Jenny Liang', 'Jacob ZY Yoon'] },
]

const AVATAR_COLORS = ['bg-indigo-100', 'bg-emerald-100', 'bg-amber-100', 'bg-rose-100', 'bg-sky-100', 'bg-violet-100', 'bg-teal-100', 'bg-pink-100', 'bg-orange-100', 'bg-cyan-100']
function colorFor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function AccessStack({ users, onClick }) {
  const max = 4
  const shown = users.slice(0, max)
  const extra = users.length - shown.length
  return (
    <Tooltip
      label={
        <ul className="pointer-events-auto flex max-h-[220px] flex-col gap-0.5 overflow-y-auto px-1 py-1 text-[12px] font-normal text-ink">
          {users.map((u) => (
            <li key={u} className="flex items-center gap-2 px-2 py-1">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] font-semibold text-gray-700 ring-1 ring-gray-200">{u[0]}</div>
              <span className="truncate">{u}</span>
            </li>
          ))}
        </ul>
      }
      width={200}
    >
      <button onClick={onClick} className="flex items-center -space-x-1 rounded-md p-0.5 -m-0.5 hover:bg-gray-100">
        {shown.map((u) => (
          <div
            key={u}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-[10.5px] font-semibold text-gray-700 ring-1 ring-gray-200"
          >
            {u[0]}
          </div>
        ))}
        {extra > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200">
            +{extra}
          </div>
        )}
      </button>
    </Tooltip>
  )
}

function UserCell({ name, color }) {
  const initial = name[0]
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-gray-700 ring-1 ring-gray-200 bg-gray-100">{initial}</div>
      <div className="truncate text-[12.5px] text-ink">{name}</div>
    </div>
  )
}

function CredentialRow({ c, onOpenAccess }) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr_1.3fr_1.3fr_1fr_0.7fr_0.7fr_40px] items-center gap-4 border-b border-hairline px-5 py-3 text-[13px] hover:bg-gray-50/60">
      <div className="font-mono text-[12.5px] text-ink truncate">{c.key}</div>
      <div className="text-[12.5px] text-ink truncate">{c.username}</div>
      <div className="flex items-center gap-2 text-muted">
        <button className="text-gray-400 hover:text-ink"><EyeIcon size={14} /></button>
        <span className="tracking-[2px] leading-none">•••••••••••••</span>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-gray-700 ring-1 ring-gray-200 bg-gray-100">{c.updatedBy[0]}</div>
        <div className="min-w-0">
          <div className="truncate text-[12.5px] font-medium text-ink">{c.updatedBy}</div>
          <div className="truncate text-[11.5px] text-muted">{c.date}</div>
        </div>
      </div>
      <UserCell name={c.createdBy} color={c.createdColor} />
      <AccessStack users={c.access} onClick={onOpenAccess} />
      <div className="flex items-center gap-1.5 text-[12.5px] text-ink">
        <span>{c.usedByList.length}</span>
        <Tooltip
          label={
            <ul className="pointer-events-auto flex flex-col gap-0.5 px-1 py-1 text-[12px] font-normal text-ink">
              {c.usedByList.map((p) => (
                <li key={p}>
                  <a
                    href="#/browser-automation/recording"
                    className="block rounded px-2 py-1 hover:bg-gray-100 hover:text-ink"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          }
          width={240}
        >
          <button className="flex h-4 w-4 items-center justify-center text-muted hover:text-ink">
            <InfoCircle size={13} />
          </button>
        </Tooltip>
      </div>
      <div className="text-[12.5px] text-ink">{c.timesUsed}</div>
      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-gray-100"><Kebab size={16} /></button>
    </div>
  )
}

function CredentialsView({ onOpenAccess }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-muted">Secrets available to your browser recordings across environments.</p>
      <div className="rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1.3fr_1.3fr_1fr_0.7fr_0.7fr_40px] items-center gap-4 rounded-t-xl border-b border-gray-200 bg-[#f2f2f2] px-5 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted">
          <div>Name</div>
          <div>Username</div>
          <div>Password</div>
          <div>Last Updated By</div>
          <div>Created By</div>
          <div>Access</div>
          <div>Used By</div>
          <div>Times Used</div>
          <div />
        </div>
        {CREDENTIALS.map((c) => <CredentialRow key={c.key} c={c} onOpenAccess={onOpenAccess} />)}
        <div className="flex items-center justify-between rounded-b-xl border-t border-gray-200 bg-[#f2f2f2] px-5 py-2.5">
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
  )
}

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

function siteLogoDomain(site) {
  if (!site || site === '—' || site === 'various') return null
  if (site.includes('netsuite')) return 'netsuite.com'
  if (site.includes('force.com') || site.includes('salesforce')) return 'salesforce.com'
  if (site.includes('zendesk')) return 'zendesk.com'
  if (site.includes('notion')) return 'notion.so'
  if (site.includes('shopify')) return 'shopify.com'
  if (site.includes('hubspot')) return 'hubspot.com'
  if (site.includes('registrar')) return null
  return site.replace(/^https?:\/\//, '').split('/')[0]
}

function SiteLogo({ site, name }) {
  const domain = siteLogoDomain(site)
  const [failed, setFailed] = useState(false)
  const initial = (name || site || '?')[0].toUpperCase()
  if (!domain || failed) {
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[13px] font-semibold text-gray-600 ring-1 ring-hairline">
        {initial}
      </div>
    )
  }
  return (
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-hairline">
      <img
        src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
        onError={() => setFailed(true)}
        alt=""
        className="h-4 w-4 object-contain"
      />
    </div>
  )
}

function Card({ r }) {
  const initials = r.author.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <a
      href="#/browser-automation/recording"
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5">
        <div className="flex min-w-0 items-start gap-2.5">
          <SiteLogo site={r.site} name={r.name} />
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-ink">{r.name}</div>
            <div className="mt-0.5 truncate text-[12px] text-muted">{r.site}</div>
          </div>
        </div>
        <button className="text-muted opacity-0 group-hover:opacity-100" onClick={e => e.preventDefault()}>
          <Kebab size={16} />
        </button>
      </div>
      <div className="px-4 pt-2.5">
        <p className="text-[12.5px] leading-[1.5] text-gray-600 line-clamp-3 min-h-[54px]">{r.desc}</p>
      </div>
      <div className="mx-4 mt-3 border-t border-hairline" />
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[5px] bg-gray-100 text-[10px] font-semibold text-gray-600">{initials}</div>
          <div className="truncate text-[11.5px] text-muted">{r.author}</div>
        </div>
        <div className="flex-shrink-0 text-[11.5px] text-muted">Updated on {r.updated}</div>
      </div>
    </a>
  )
}

function NewCredentialModal({ onClose }) {
  const [key, setKey] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const canAdd = key.trim() && password.trim()

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm p-6"
    >
      <div className="anim-modal w-full max-w-[520px] overflow-hidden rounded-[14px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div className="text-[17px] font-semibold text-ink">New Credential</div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          <div>
            <label className="block text-[13px] font-medium text-ink underline decoration-gray-300 decoration-[1px] underline-offset-[3px]">
              Site <span className="text-red-500">*</span>
            </label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="example.com"
              className="mt-1.5 h-9 w-full rounded-[8px] border border-hairline bg-white px-3 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-ink underline decoration-gray-300 decoration-[1px] underline-offset-[3px]">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="user@company.com"
              className="mt-1.5 h-9 w-full rounded-[8px] border border-hairline bg-white px-3 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-ink underline decoration-gray-300 decoration-[1px] underline-offset-[3px]">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="sk-abc123"
                className="h-9 w-full rounded-[8px] border border-hairline bg-white px-3 pr-9 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-muted hover:text-ink"
              >
                <EyeIcon size={15} off={showPw} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-ink underline decoration-gray-300 decoration-[1px] underline-offset-[3px]">
              Share access
            </label>
            <div className="mt-1.5 flex flex-col gap-2">
              <div className="relative">
                <input
                  placeholder="Add groups or people..."
                  className="h-9 w-full rounded-[8px] border border-hairline bg-white px-3 pr-8 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
              <div className="flex items-center justify-between rounded-[8px] border border-hairline px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[11px] font-semibold text-gray-700 ring-1 ring-gray-200">D</div>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium text-ink">David Hidalgo</div>
                    <div className="truncate text-[11.5px] text-muted">davidh@stack.ai</div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-ink hover:bg-gray-100">
                  Admin <ChevronDown size={11} />
                </button>
              </div>
              <div className="mt-1 text-[11.5px] font-medium uppercase tracking-[0.04em] text-muted">General Access</div>
              <div className="flex items-center justify-between rounded-[8px] border border-hairline px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="11" width="16" height="9" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium text-ink">Restricted</div>
                    <div className="truncate text-[11.5px] text-muted">Only people you add can access this credential</div>
                  </div>
                </div>
                <button className="inline-flex flex-shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-ink hover:bg-gray-100">
                  Set access <ChevronDown size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-hairline bg-gray-50/70 px-6 py-3.5">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-ink hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!canAdd}
            onClick={onClose}
            className={
              'rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-white ' +
              (canAdd ? 'bg-ink hover:opacity-90' : 'bg-gray-300 cursor-not-allowed')
            }
          >
            Add Credential
          </button>
        </div>
      </div>
    </div>
  )
}

function ImportModal({ onClose }) {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [tab, setTab] = useState('file') // 'file' | 'script'
  const [script, setScript] = useState('')
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    if (files && files[0]) setFile(files[0])
  }

  const canImport = tab === 'file' ? !!file : script.trim().length > 0

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm p-6"
    >
      <div className="anim-modal w-full max-w-[560px] overflow-hidden rounded-[14px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <div className="text-[17px] font-semibold text-ink">Import recording</div>
            <div className="mt-1 text-[13px] text-muted">
              Upload a recording file or paste a Playwright script.
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex gap-1 border-b border-hairline">
            <button
              onClick={() => setTab('file')}
              className={
                'relative -mb-px px-3 py-2 text-[13px] font-medium ' +
                (tab === 'file'
                  ? 'border-b-2 border-ink text-ink'
                  : 'text-muted hover:text-ink')
              }
            >
              Upload file
            </button>
            <button
              onClick={() => setTab('script')}
              className={
                'relative -mb-px px-3 py-2 text-[13px] font-medium ' +
                (tab === 'script'
                  ? 'border-b-2 border-ink text-ink'
                  : 'text-muted hover:text-ink')
              }
            >
              Playwright script
            </button>
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          {tab === 'file' ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFiles(e.dataTransfer.files)
              }}
              className={
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed px-6 py-9 text-center transition ' +
                (dragOver
                  ? 'border-ink bg-gray-50'
                  : 'border-hairline bg-white hover:border-gray-300')
              }
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-muted ring-1 ring-hairline">
                <PageFile size={18} />
              </div>
              <div className="text-[13.5px] font-medium text-ink">
                {file ? file.name : 'Drop your recording here or click to browse'}
              </div>
              <div className="text-[12px] text-muted">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : '.json or .stackai'}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".json,.stackai"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          ) : (
            <div>
              <div className="mb-2 flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1.5 text-[12px] text-emerald-800">
                <Braces size={14} />
                Pasted scripts are validated and compiled into an allowlisted step manifest.
              </div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder={"import { test } from '@playwright/test'\n\ntest('flow', async ({ page }) => {\n  await page.goto('https://…')\n})"}
                className="h-[180px] w-full resize-none rounded-[10px] border border-hairline bg-white px-3 py-2 font-mono text-[12px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-hairline bg-white px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={!canImport}
            onClick={onClose}
            className={
              'rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-white ' +
              (canImport ? 'bg-ink hover:opacity-90' : 'bg-gray-300 cursor-not-allowed')
            }
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}

function useHashSubroute() {
  const [hash, setHash] = useState(() => window.location.hash || '')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  const path = hash.replace(/^#/, '')
  if (path.startsWith('/browser-automation/credentials')) return 'credentials'
  if (path.startsWith('/browser-automation/browser-recordings')) return 'browser-recordings'
  return 'recordings'
}

const TABS = [
  ['recordings', 'Browser recordings', '/browser-automation'],
  ['credentials', 'Credentials', '/browser-automation/credentials'],
]

function PageTabs({ active }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
      {TABS.map(([id, label, href]) => (
        <a
          key={id}
          href={`#${href}`}
          className={
            'cursor-pointer rounded-md px-3 py-1 text-[13px] font-medium transition ' +
            (active === id
              ? 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.08)]'
              : 'text-muted hover:text-ink')
          }
        >
          {label}
        </a>
      ))}
    </div>
  )
}

export default function BrowserAutomationPage() {
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [importOpen, setImportOpen] = useState(false)
  const [sandboxOpen, setSandboxOpen] = useState(false)
  const [credentialOpen, setCredentialOpen] = useState(false)
  const active = useHashSubroute()

  const filtered = RECORDINGS.filter(r => {
    if (filter === 'org' && !r.org) return false
    if (filter === 'custom' && r.org) return false
    if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftRail />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative flex flex-shrink-0 items-center gap-3 border-b border-hairline bg-[#fafafa] px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 text-[14px] text-muted">
            <span className="opacity-60"><Folder size={16} /></span>
            <span className="font-medium text-ink">Browser automation</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {active === 'recordings' && (
              <>
                <button
                  onClick={() => setImportOpen(true)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-hairline bg-white px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-gray-50"
                >
                  <Upload size={14} /> Import
                </button>
                <button
                  onClick={() => setSandboxOpen(true)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-transparent bg-ink px-3 py-1.5 text-[13px] font-medium text-white hover:opacity-90"
                >
                  <Plus size={14} sw={2.2} /> New recording
                </button>
              </>
            )}
            {active === 'credentials' && (
              <button
                onClick={() => setCredentialOpen(true)}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-transparent bg-ink px-3 py-1.5 text-[13px] font-medium text-white hover:opacity-90"
              >
                <Plus size={14} sw={2.2} /> New Credential
              </button>
            )}
          </div>
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="flex w-full flex-col gap-5 px-8 py-6">
            <div><PageTabs active={active} /></div>
            {active === 'recordings' && (
              <>
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
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 py-1.5 text-[12.5px] text-ink hover:bg-gray-50">
                    All authors <ChevronDown size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map(r => <Card key={r.name} r={r} />)}
                </div>
              </>
            )}

            {active === 'browser-recordings' && (
              <div className="rounded-xl border border-dashed border-hairline bg-white px-6 py-16 text-center">
                <div className="text-[14px] font-medium text-ink">No browser recordings yet</div>
                <p className="mt-1 text-[12.5px] text-muted">Recordings captured directly from the browser extension will appear here.</p>
              </div>
            )}

            {active === 'credentials' && <CredentialsView onOpenAccess={() => setCredentialOpen(true)} />}
          </div>
        </main>
      </div>

      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
      {credentialOpen && <NewCredentialModal onClose={() => setCredentialOpen(false)} />}
      {sandboxOpen && <SandboxModal onClose={() => setSandboxOpen(false)} onSaveRecording={() => setSandboxOpen(false)} />}
    </div>
  )
}
