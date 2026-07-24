import { useState } from 'react'
import LeftRail from './LeftRail.jsx'
import ReplayModal from './ReplayModal.jsx'
import {
  Folder, Gear, Save, Play, ChevronDown, Kebab, Plus,
  Globe, Cursor,
} from './icons.jsx'

/* Local micro-icons that aren't already in icons.jsx */
const Ic = ({ size = 14, sw = 1.8, className, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    {children}
  </svg>
)
const IcArrow = (p) => <Ic {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Ic>
const IcCaret = (p) => <Ic {...p}><path d="M7 10l5 5 5-5" /></Ic>
const IcPencil = (p) => <Ic {...p}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z" /></Ic>
const IcType = (p) => <Ic {...p}><path d="M4 7V5h16v2M9 5v14M15 19h-6" /></Ic>
const IcCheckSq = (p) => <Ic {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 12l3 3 5-6" /></Ic>
const IcSelect = (p) => <Ic {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 11l4 4 4-4" /></Ic>
const IcShield = (p) => <Ic {...p}><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" /></Ic>
const IcSliders = (p) => <Ic {...p}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></Ic>
const IcClock = (p) => <Ic {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ic>

function stepIcon(verb) {
  const size = 16
  switch (verb) {
    case 'Navigate': return <Globe size={size} />
    case 'Click':    return <Cursor size={size} />
    case 'Type':     return <IcType size={size} />
    case 'Select':   return <IcSelect size={size} />
    case 'Check':    return <IcCheckSq size={size} />
    default:         return <Cursor size={size} />
  }
}

function stepParts(step) {
  const verb = step.split(' ')[0]
  const rest = step.slice(verb.length + 1)
  const m = rest.match(/"([^"]+)"/)
  if (verb === 'Navigate') return { verb, prefix: 'to', chip: rest.replace(/^to\s+/, '') }
  if (verb === 'Type' && m) {
    const into = rest.match(/into\s+"([^"]+)"/)
    return { verb, prefix: `"${m[1]}" into`, chip: into ? into[1] : '' }
  }
  if (verb === 'Select' && m) {
    const inField = rest.match(/in\s+"([^"]+)"/)
    return { verb, prefix: `"${m[1]}" in`, chip: inField ? inField[1] : '' }
  }
  if (m) return { verb, prefix: '', chip: m[1] }
  return { verb, prefix: '', chip: rest }
}

function BrowserFrame({ children, url }) {
  return (
    <div className="pointer-events-none flex h-[80px] w-[140px] flex-none flex-col overflow-hidden rounded-md border border-hairline bg-white">
      <div className="flex flex-none items-center gap-[3px] border-b border-hairline bg-gray-50 px-1.5 py-1">
        <div className="h-1 w-1 rounded-full bg-gray-300" />
        <div className="h-1 w-1 rounded-full bg-gray-300" />
        <div className="h-1 w-1 rounded-full bg-gray-300" />
        <div className="ml-1 h-[8px] flex-1 truncate rounded-sm bg-white px-1 text-[5px] leading-[8px] text-gray-400">
          {url || 'localhost'}
        </div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

function MiniLabel({ children }) {
  return <div className="mb-[2px] text-[5px] font-medium text-gray-500">{children}</div>
}
function MiniInput({ value, highlight }) {
  return (
    <div className={'flex h-[10px] items-center rounded-[2px] border px-1 text-[5px] leading-[10px] ' +
      (highlight ? 'border-blue-500 bg-white text-ink ring-1 ring-blue-200' : 'border-gray-300 bg-white text-gray-400')}>
      {value || ' '}
    </div>
  )
}

function StepThumbnail({ verb, prefix, chip }) {
  if (verb === 'Navigate') {
    return (
      <BrowserFrame url={chip}>
        <div className="flex h-full items-center justify-center">
          <div className="text-[10px] font-semibold tracking-tight">
            <span className="text-[#4285f4]">G</span>
            <span className="text-[#ea4335]">o</span>
            <span className="text-[#fbbc05]">o</span>
            <span className="text-[#4285f4]">g</span>
            <span className="text-[#34a853]">l</span>
            <span className="text-[#ea4335]">e</span>
          </div>
        </div>
      </BrowserFrame>
    )
  }
  if (verb === 'Click' && /Example Forms|result/i.test(prefix + ' ' + chip)) {
    return (
      <BrowserFrame url="google.com/search">
        <div className="flex flex-col gap-[3px] px-1.5 py-1">
          <div className="text-[5px] text-gray-500">{chip.slice(0, 24)}</div>
          <div className="text-[6px] font-medium leading-tight text-[#1a0dab] underline decoration-[0.5px]">
            {chip.length > 30 ? chip.slice(0, 30) + '…' : chip}
          </div>
          <div className="text-[5px] leading-[6px] text-gray-500">
            Trusted forms for teams building workflows online today.
          </div>
        </div>
      </BrowserFrame>
    )
  }
  if (verb === 'Click' || verb === 'Type') {
    // Field-focused form
    const typedMatch = prefix.match(/^"([^"]+)"/)
    const typedValue = verb === 'Type' && typedMatch ? typedMatch[1] : ''
    return (
      <BrowserFrame url="forms.example.com/contact">
        <div className="flex flex-col gap-[3px] px-1.5 py-1.5">
          <MiniLabel>{chip}</MiniLabel>
          <MiniInput value={typedValue} highlight />
          <div className="mt-[2px] h-[8px] rounded-[2px] bg-[#1a73e8] text-center text-[5px] font-semibold leading-[8px] text-white">
            Next
          </div>
        </div>
      </BrowserFrame>
    )
  }
  if (verb === 'Select') {
    const selMatch = prefix.match(/^"([^"]+)"/)
    const selValue = selMatch ? selMatch[1] : ''
    return (
      <BrowserFrame url="forms.example.com/contact">
        <div className="flex flex-col gap-[3px] px-1.5 py-1.5">
          <MiniLabel>{chip}</MiniLabel>
          <div className="flex h-[10px] items-center justify-between rounded-[2px] border border-blue-500 bg-white px-1 text-[5px] leading-[10px] text-ink ring-1 ring-blue-200">
            <span className="truncate">{selValue}</span>
            <IcCaret size={6} className="text-gray-400" />
          </div>
        </div>
      </BrowserFrame>
    )
  }
  if (verb === 'Check') {
    return (
      <BrowserFrame url="forms.example.com/confirm">
        <div className="flex flex-col gap-[3px] px-1.5 py-1.5">
          <div className="flex items-center gap-1 rounded-[2px] border border-gray-200 bg-gray-50 px-1 py-[2px]">
            <span className="flex h-[6px] w-[6px] items-center justify-center rounded-[1px] bg-[#1a73e8] text-white">
              <svg width="4" height="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <span className="text-[5px] text-ink">{chip.length > 22 ? chip.slice(0, 22) + '…' : chip}</span>
          </div>
        </div>
      </BrowserFrame>
    )
  }
  return null
}

function ValueSourceRow({ label, initialValue }) {
  const [source, setSource] = useState('hardcoded')
  const [menuOpen, setMenuOpen] = useState(false)
  const [value, setValue] = useState(initialValue)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-none text-[11px] uppercase tracking-[0.06em] text-gray-400">
        {label}
      </div>
      <div className="relative flex-none">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }}
          className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2 text-[12px] text-ink hover:bg-gray-50"
        >
          {source === 'hardcoded' ? 'Hardcoded' : 'Dynamic'}
          <IcCaret size={11} className="text-gray-400" />
        </button>
        {menuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-[calc(100%+4px)] z-10 w-[200px] overflow-hidden rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
          >
            {[
              ['hardcoded', 'Hardcoded', 'Fixed value used every run'],
              ['dynamic', 'Dynamic', 'Pulled from the project at runtime'],
            ].map(([k, name, desc]) => (
              <button
                key={k}
                type="button"
                onClick={() => { setSource(k); setMenuOpen(false) }}
                className="flex w-full cursor-pointer flex-col items-start gap-0.5 px-2.5 py-1.5 text-left hover:bg-gray-50"
              >
                <span className="text-[12.5px] font-medium text-ink">{name}</span>
                <span className="text-[11px] text-muted">{desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {source === 'hardcoded' ? (
        <input
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setValue(e.target.value)}
          className="h-7 min-w-0 flex-1 rounded-md border border-hairline bg-white px-2 font-mono text-[12px] text-ink outline-none focus:border-gray-300"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate text-[12px] italic text-muted">
          Choose the value when using this recording in a workflow builder
        </span>
      )}
    </div>
  )
}

function StepDetails({ verb, chip }) {
  if (verb === 'Type') {
    return <ValueSourceRow label="Value" initialValue={chip} />
  }
  if (verb === 'Select') {
    return <ValueSourceRow label="Selection" initialValue={chip} />
  }
  return null
}

function StepItem({ step }) {
  const { verb, prefix, chip } = stepParts(step)
  const details = StepDetails({ verb, chip })
  const [previewOpen, setPreviewOpen] = useState(false)
  return (
    <section className="rounded-lg border border-hairline bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]">
      <header className="flex items-center gap-3 px-4 py-3">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-hairline bg-white text-muted shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
          {stepIcon(verb)}
        </span>
        <span className="text-[13px] font-medium text-ink">{verb}</span>
        {prefix && <span className="text-[12.5px] text-muted">{prefix}</span>}
        {chip && (
          <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted">
            {chip}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setPreviewOpen(true) }}
          title="View screenshot"
          className="ml-auto flex h-8 w-8 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-md border border-hairline bg-white p-0 hover:border-gray-300 hover:ring-2 hover:ring-gray-200 focus:outline-none"
        >
          <div className="pointer-events-none scale-[0.34] origin-center">
            <StepThumbnail verb={verb} prefix={prefix} chip={chip} />
          </div>
        </button>
      </header>
      {details && (
        <div className="border-t border-hairline px-4 py-3">
          {details}
        </div>
      )}
      {previewOpen && (
        <StepPreviewModal
          verb={verb}
          prefix={prefix}
          chip={chip}
          step={step}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </section>
  )
}

function BigBrowserFrame({ url, children, onClose }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-hairline bg-white shadow-2xl">
      <div className="flex flex-none items-center gap-2 border-b border-hairline bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-3 w-3 cursor-pointer rounded-full bg-[#ff5f57] hover:opacity-80"
          />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-3 flex flex-1 items-center gap-2">
          <div className="flex items-center gap-1 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
          <div className="flex h-7 flex-1 items-center gap-2 rounded-md border border-hairline bg-white px-3 text-[12px] text-gray-600">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span className="truncate">{url || 'localhost'}</span>
          </div>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-white">{children}</div>
    </div>
  )
}

function BigLabel({ children }) {
  return <div className="mb-1.5 text-[12px] font-medium text-gray-500">{children}</div>
}
function BigInput({ value, highlight, placeholder }) {
  return (
    <div className={'flex h-10 items-center rounded-md border px-3 text-[14px] ' +
      (highlight ? 'border-blue-500 bg-white text-ink ring-2 ring-blue-200' : 'border-gray-300 bg-white text-gray-400')}>
      {value || placeholder || ''}
      {highlight && <span className="ml-0.5 inline-block h-4 w-[1.5px] animate-pulse bg-blue-500" />}
    </div>
  )
}

function BigStepScreen({ verb, prefix, chip }) {
  if (verb === 'Navigate') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-[64px] font-normal tracking-tight">
          <span className="text-[#4285f4]">G</span>
          <span className="text-[#ea4335]">o</span>
          <span className="text-[#fbbc05]">o</span>
          <span className="text-[#4285f4]">g</span>
          <span className="text-[#34a853]">l</span>
          <span className="text-[#ea4335]">e</span>
        </div>
      </div>
    )
  }
  if (verb === 'Click' && /Example Forms|result/i.test(prefix + ' ' + chip)) {
    return (
      <div className="mx-auto max-w-[640px] px-8 py-8">
        <div className="mb-6 text-[13px] text-gray-500">About 12,400,000 results (0.42 seconds)</div>
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-gray-600">forms.example.com › contact</div>
          <div className="cursor-pointer text-[20px] leading-tight text-[#1a0dab] underline decoration-1 underline-offset-2">
            {chip}
          </div>
          <div className="text-[13.5px] leading-normal text-gray-700">
            Trusted forms for teams building workflows online today. Free to try — no signup required.
          </div>
        </div>
      </div>
    )
  }
  if (verb === 'Click' || verb === 'Type') {
    const typedMatch = prefix.match(/^"([^"]+)"/)
    const typedValue = verb === 'Type' && typedMatch ? typedMatch[1] : ''
    return (
      <div className="mx-auto max-w-[420px] px-8 py-10">
        <div className="mb-5 text-[20px] font-semibold text-ink">Contact us</div>
        <div className="flex flex-col gap-4">
          <div>
            <BigLabel>{chip}</BigLabel>
            <BigInput value={typedValue} highlight placeholder="" />
          </div>
          <button className="mt-2 h-10 rounded-md bg-[#1a73e8] text-[14px] font-medium text-white">Next</button>
        </div>
      </div>
    )
  }
  if (verb === 'Select') {
    const selMatch = prefix.match(/^"([^"]+)"/)
    const selValue = selMatch ? selMatch[1] : ''
    return (
      <div className="mx-auto max-w-[420px] px-8 py-10">
        <div className="mb-5 text-[20px] font-semibold text-ink">Contact us</div>
        <div className="flex flex-col gap-4">
          <div>
            <BigLabel>{chip}</BigLabel>
            <div className="flex h-10 items-center justify-between rounded-md border-2 border-blue-500 bg-white px-3 text-[14px] text-ink ring-2 ring-blue-200">
              <span className="truncate">{selValue}</span>
              <IcCaret size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (verb === 'Check') {
    return (
      <div className="mx-auto max-w-[420px] px-8 py-10">
        <div className="mb-5 text-[20px] font-semibold text-ink">Confirm</div>
        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-[#1a73e8] text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <span className="text-[14px] text-ink">{chip}</span>
        </label>
      </div>
    )
  }
  return null
}

function StepPreviewModal({ verb, prefix, chip, step, onClose }) {
  const urlMap = {
    Navigate: chip,
    Select: 'forms.example.com/contact',
    Check: 'forms.example.com/confirm',
    Type: 'forms.example.com/contact',
  }
  const url = urlMap[verb] || (verb === 'Click' && /Example Forms|result/i.test(prefix + ' ' + chip)
    ? 'google.com/search?q=contact+form'
    : 'forms.example.com/contact')
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-[600px] w-full max-w-[960px]"
      >
        <BigBrowserFrame url={url} onClose={onClose}>
          <BigStepScreen verb={verb} prefix={prefix} chip={chip} />
        </BigBrowserFrame>
      </div>
    </div>
  )
}

function IconButton({ title, children }) {
  return (
    <div title={title}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100">
      {children}
    </div>
  )
}

const Pill = ({ tone = 'muted', children }) => {
  const map = {
    good: 'bg-emerald-50 text-emerald-700',
    bad:  'bg-red-50 text-red-700',
    warn: 'bg-amber-50 text-amber-700',
    muted:'bg-gray-100 text-gray-600',
  }
  const dot = { good: 'bg-emerald-500', bad: 'bg-red-500', warn: 'bg-amber-500', muted: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ${map[tone]}`}>
      {tone !== 'muted' && <span className={`h-1.5 w-1.5 rounded-full ${dot[tone]}`} />}
      {children}
    </span>
  )
}

function Card({ title, sub, action, children, bodyClass = 'py-3', defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="bg-white">
      {(title || action) && (
        <header className="flex items-center gap-2.5 py-2.5">
          {title && (
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-ink">
              {title}
              {sub && <span className="font-normal text-[12px] text-muted">{sub}</span>}
              <IcCaret
                size={12}
                className={'text-gray-400 transition-transform ' + (open ? '' : '-rotate-90')} />
            </button>
          )}
          <div className="ml-auto">{action}</div>
        </header>
      )}
      {open && <div className={bodyClass}>{children}</div>}
    </section>
  )
}

function SectionDivider() {
  return <div className="h-px w-full bg-hairline" />
}

function SidebarSection({ icon, title, children, defaultOpen = false, bodyPadded = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full cursor-pointer items-center gap-2.5 px-5 py-3.5 text-left hover:bg-gray-50"
      >
        <span className="text-muted">{icon}</span>
        <span className="text-[14px] font-medium text-ink">{title}</span>
        <IcCaret
          size={16}
          className={'ml-auto text-gray-400 transition-transform ' + (open ? '' : '-rotate-90')}
        />
      </button>
      {open && (
        <div className={bodyPadded ? 'px-5 pb-4' : 'pb-2'}>
          {children}
        </div>
      )}
    </section>
  )
}

export default function FlowDetailPage() {
  const [tab, setTab] = useState('overview')
  const [replayOpen, setReplayOpen] = useState(false)
  const goSteps = () => {
    const url = `${window.location.origin}${window.location.pathname}#/browser-automation/recording`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftRail expanded />

      <div className="flex min-w-0 flex-1 flex-col">
      {/* Topbar — mirrors src/components/Topbar.jsx styling */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-hairline bg-white px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 text-[13px] text-muted">
          <span className="opacity-60"><Folder size={16} /></span>
          <a href="#/browser-automation" className="hover:text-ink">Browser automation</a>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-ink">Download vendor invoices</span>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">v3</div>
          <IconButton title="Settings"><Gear size={18} /></IconButton>

          <button
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium">
            <Save size={13} />
            Save
          </button>

          <button
            onClick={() => setReplayOpen(true)}
            className="relative flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 font-medium text-white">
            <Play size={13} />
            Run flow
            <ChevronDown size={13} sw={2.5} />
          </button>

          <div className="cursor-pointer px-1 text-muted"><Kebab size={18} /></div>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <main className="canvas-dots no-scrollbar min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[880px] flex-col gap-5 px-8 py-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-hairline bg-white text-[11px] font-semibold text-ink">NS</div>
                <h1 className="m-0 text-[20px] font-semibold tracking-tight text-ink">Download vendor invoices</h1>
              </div>
              <p className="m-0 text-[13px] text-muted">
                Logs into NetSuite and downloads the latest vendor invoices for accounts payable review.
              </p>
              <div className="flex items-center gap-2 text-[12.5px] text-muted">
                <Pill tone="good">Succeeded</Pill>
                <span>portal.netsuite.com</span>
                <span className="h-[3px] w-[3px] rounded-full bg-gray-300" />
                <span>Playwright</span>
                <span className="h-[3px] w-[3px] rounded-full bg-gray-300" />
                <span>Edited by John Miller · 2h ago</span>
              </div>
            </div>

{/* Steps column */}
            <div className="flex min-w-0 flex-col gap-4">
                {/* Steps */}
                {[
                  'Navigate to https://www.google.com/search?q=contact+form',
                  'Click result "Contact us — Example Forms"',
                  'Click "First name" field',
                  'Type "Ada" into "First name"',
                  'Click "Last name" field',
                  'Type "Lovelace" into "Last name"',
                  'Select "United States" in "Country"',
                  'Select "Engineer" in "Role"',
                  'Click "Next"',
                  'Click "Full name" field',
                  'Type "Ada Lovelace" into "Full name"',
                  'Check "I agree to the terms"',
                  'Click "Submit"',
                ].map((step, i) => <StepItem key={i} step={step} />)}

            </div>
          </div>
        </main>

        {/* Right rail — full viewport height, own scroll */}
        <aside className="no-scrollbar flex w-[400px] flex-none flex-col divide-y divide-hairline overflow-y-auto border-l border-hairline bg-white">
          <SidebarSection icon={<IcShield size={18} />} title="If a step fails" defaultOpen={false}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-md border border-hairline bg-white px-2.5 py-2 text-[13px] text-ink">
                <div className="h-4 w-4 rounded border border-hairline bg-gray-50" />
                <span>Agent intervenes</span>
                <IcCaret size={12} className="ml-auto text-gray-400" />
              </div>
              <div className="rounded-md border border-dashed border-hairline bg-gray-50 p-2.5 text-[12px] text-muted">
                Guidance to the agent when a selector breaks or the layout changes.
              </div>
            </div>
          </SidebarSection>

          <SidebarSection icon={<IcSliders size={18} />} title="Configuration" defaultOpen={false}>
            <div className="flex flex-col gap-3">
              {[
                ['Target site', 'portal.netsuite.com'],
                ['Credential', 'NetSuite vendor portal'],
                ['Session token', 'NetSuite prod session · active', true],
              ].map(([k, v, active]) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <div className="text-[10.5px] font-medium uppercase tracking-[0.07em] text-muted">{k}</div>
                  <div className="flex items-center gap-2 rounded-md border border-hairline bg-white px-2.5 py-1.5 text-[13px] text-ink">
                    <div className={'h-4 w-4 rounded border ' + (active ? 'border-emerald-400 bg-emerald-50' : 'border-hairline bg-gray-50')} />
                    <span>{v}</span>
                    <IcCaret size={12} className="ml-auto text-gray-400" />
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <div className="text-[10.5px] font-medium uppercase tracking-[0.07em] text-muted">Runtime</div>
                <div className="text-[13px] text-ink">Playwright · isolated sandbox</div>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection icon={<IcClock size={18} />} title="Recent runs" defaultOpen={false} bodyPadded={false}>
            {[
              ['g', 'Succeeded', '2 hours ago · Scheduled', '41s'],
              ['g', 'Succeeded', 'Yesterday, 6:00 AM · Scheduled', '39s'],
              ['r', 'Failed · agent intervened', 'Jul 8, 6:00 AM · Selector drift', '2m 04s'],
              ['g', 'Succeeded', 'Jul 7, 6:00 AM · Scheduled', '40s'],
              ['g', 'Succeeded · agent intervened', 'Jul 5, 6:00 AM · Manual', '1m 58s'],
            ].map(([st, top, bot, dur], i) => (
              <div key={i} className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2.5 border-b border-hairline px-5 py-2.5 last:border-b-0 hover:bg-gray-50">
                <div className={'h-2 w-2 rounded-full ' + (st === 'g' ? 'bg-emerald-500' : 'bg-red-500')} />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-ink">{top}</div>
                  <div className="truncate text-[11.5px] text-muted">{bot}</div>
                </div>
                <div className="font-mono text-[12px] tabular-nums text-gray-600">{dur}</div>
              </div>
            ))}
          </SidebarSection>
        </aside>
      </div>
      </div>
      {replayOpen && (
        <ReplayModal onClose={() => setReplayOpen(false)} flowName="Download vendor invoices" />
      )}
    </div>
  )
}
