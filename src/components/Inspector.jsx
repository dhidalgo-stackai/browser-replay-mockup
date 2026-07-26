import { useState, useEffect, useRef } from 'react'
import {
  Monitor,
  Compare,
  Grid,
  Kebab,
  X,
  Video,
  ChevronDown,
  Gear,
  ChevronUp,
  DownloadArrow,
  AlertTriangle,
  ListView,
  Braces,
  InfoCircle,
  ExternalLink,
  Play,
  Plus,
  Upload,
  Wrench,
  Cursor,
  Sparkle,
} from './icons.jsx'

function HeaderIconBtn({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100"
    >
      {children}
    </div>
  )
}

function CollapsibleSection({
  icon,
  label,
  badge,
  defaultOpen = false,
  bodyClass = 'border-b border-gray-100 px-4 pb-4 pt-1 text-[12.5px] leading-[1.5] text-muted',
  children,
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer select-none items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 text-[13px] text-ink"
      >
        <span className="flex items-center text-gray-600">{icon}</span>
        {label}
        {badge}
        <span className="ml-auto flex text-gray-400">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>
      {open && <div className={'anim-fade ' + bodyClass}>{children}</div>}
    </div>
  )
}

const RECORDINGS = [
  {
    name: 'Download vendor invoices',
    inputs: [
      { label: 'Portal email', value: 'ap-bot@acme.com' },
      { label: 'Portal password', value: '••••••••' },
      { label: 'Invoice status filter', value: 'open' },
    ],
  },
  {
    name: 'Extract Salesforce lead list',
    inputs: [
      { label: 'Report name', value: 'Weekly qualified leads' },
      { label: 'Date range', value: 'Last 7 days' },
    ],
  },
]

export default function Inspector({ onOpenSandbox, onClose, savedRecording, onSelectRecording, onClearRecording, extraRecordings = [] }) {
  const allRecordings = [
    ...extraRecordings,
    ...RECORDINGS.filter((r) => !extraRecordings.some((e) => e.name === r.name)),
  ]
  const [mode, setMode] = useState('ai')
  const panelRef = useRef(null)

  // Close the panel when clicking anywhere outside it — but ignore clicks on
  // the collapse toggle (which manages open state itself) and on the sandbox modal.
  useEffect(() => {
    if (!onClose) return
    const handleClick = (e) => {
      if (panelRef.current && panelRef.current.contains(e.target)) return
      if (e.target.closest('[data-inspector-toggle]')) return
      if (e.target.closest('[data-modal-root]')) return
      onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className="anim-slide-right relative flex w-[460px] flex-shrink-0 flex-col overflow-y-auto border-l border-hairline bg-white shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.05)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 pb-2.5 pt-3.5">
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-gray-100 text-gray-600">
          <Monitor size={16} />
        </div>
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
          Browser Navigation
        </div>
        <div className="rounded-md bg-gray-100 px-2 py-[3px] text-[11.5px] font-medium text-gray-600">
          action-3
        </div>
        <div className="ml-1.5 flex gap-0.5">
          <HeaderIconBtn>
            <Compare size={16} />
          </HeaderIconBtn>
          <HeaderIconBtn>
            <Grid size={16} />
          </HeaderIconBtn>
          <HeaderIconBtn>
            <Kebab size={16} />
          </HeaderIconBtn>
          <HeaderIconBtn onClick={onClose}>
            <X size={16} />
          </HeaderIconBtn>
        </div>
      </div>

      {/* Description */}
      <div className="border-b border-gray-100 px-4 pb-3.5 pt-2.5 text-[12.5px] leading-[1.5] text-muted">
        Replay a saved browser navigation recording from the shared browser
        navigation sandbox
      </div>

      {/* Provider + Action */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        <Field label="Provider" bare>
          <Select
            icon={<Monitor size={14} />}
            value="StackAI Computer"
          />
        </Field>

        <Field label="Action" bare className="mt-3">
          <Select
            icon={
              <span className="text-brand">
                <Video size={14} />
              </span>
            }
            value="Browser Navigation"
          />
        </Field>
      </div>

      {/* Inputs */}
      <CollapsibleSection
        icon={<DownloadArrow size={15} />}
        label="Inputs"
        defaultOpen
        badge={
          <span className="flex items-center gap-1.5 rounded-[7px] bg-[#fef4e5] px-[9px] py-[3px] text-[11.5px] font-semibold text-[#b45309]">
            <AlertTriangle size={12} />
            Has required fields
          </span>
        }
        bodyClass="border-b border-gray-100 px-4 pb-4 pt-3"
      >
        <div className="mb-3.5 inline-flex gap-0.5 rounded-lg bg-gray-100 p-[3px]">
          <ViewToggle active title="Tree view">
            <ListView size={16} />
          </ViewToggle>
          <ViewToggle title="JSON view">
            <Braces size={16} />
          </ViewToggle>
        </div>

        <div className="ml-1 border-l border-hairline pl-5">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
              Run mode
            </span>
            <span
              className="cursor-help text-gray-400 hover:text-gray-600"
              title="AI Agent: Claude drives the browser autonomously from a natural-language goal.&#10;Replay: Plays back a saved recording step by step."
            >
              <InfoCircle size={13} />
            </span>
          </div>
          <div className="mb-3.5 flex flex-col items-start gap-1.5">
            <div className="inline-flex items-center gap-0.5 rounded-[7px] bg-gray-100 p-[2px]">
              {[
                ['ai', 'AI Agent'],
                ['manual', 'Replay recording'],
              ].map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => setMode(key)}
                  className={
                    'cursor-pointer whitespace-nowrap rounded-[5px] px-2.5 py-[3px] text-[12.5px] ' +
                    (mode === key
                      ? 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                      : 'text-[#5f6368] hover:text-gray-700')
                  }
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="text-[12px] text-gray-500">
              {mode === 'ai'
                ? 'An AI agent model drives the browser from a natural-language goal.'
                : 'Plays back a saved recording step by step.'}
            </div>
          </div>

          {mode === 'ai' ? (
            <AiInputs />
          ) : (
            <ManualInputs
              onOpenSandbox={onOpenSandbox}
              savedRecording={savedRecording}
              onSelectRecording={onSelectRecording}
              onClearRecording={onClearRecording}
              recordings={allRecordings}
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Additional sections */}
      <CollapsibleSection icon={<Play size={14} />} label="Test Action">
        Run this action with sample inputs to preview the output before
        publishing.
      </CollapsibleSection>
      <CollapsibleSection icon={<Upload size={14} />} label="Outputs">
        The recording result and page data returned by this action.
      </CollapsibleSection>
      <CollapsibleSection icon={<Wrench size={14} />} label="Advanced Settings">
        Timeouts, retries, and error handling for this action.
      </CollapsibleSection>
    </div>
  )
}

function InputRow({ label, type = 'string', required = false, expanded = false, children }) {
  return (
    <>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
          {label}
        </span>
        {required && <span className="font-bold text-red-500">*</span>}
        <span className="ml-auto font-mono text-[12.5px] text-gray-400">{type}</span>
      </div>
      {expanded && children && <div className="mb-3.5">{children}</div>}
    </>
  )
}

function AiInputs() {
  return (
    <>
      <InputRow label="Task Prompt" required expanded>
        <textarea
          placeholder="Navigate to example.com and fill out the contact form"
          className="min-h-[64px] w-full resize-y rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[13px] text-ink placeholder:text-gray-400 focus:outline-none"
        />
      </InputRow>
      <InputRow label="Sandbox ID" />
      <InputRow label="Session" />
      <InputRow label="Model" />
      <InputRow label="Max Steps" type="integer" />
    </>
  )
}

function HardcodedInputField({ label, initial }) {
  const [value, setValue] = useState(initial ?? '')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tab, setTab] = useState('nodes')
  const [mode, setMode] = useState('manual')
  const [modeOpen, setModeOpen] = useState(false)
  const wrapRef = useRef(null)
  const modeRef = useRef(null)
  const inputRef = useRef(null)
  const popoverRef = useRef(null)

  useEffect(() => {
    if (!popoverOpen) return
    const handle = (e) => {
      if (inputRef.current?.contains(e.target)) return
      if (popoverRef.current?.contains(e.target)) return
      setPopoverOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [popoverOpen])

  useEffect(() => {
    if (!modeOpen) return
    const handle = (e) => {
      if (modeRef.current?.contains(e.target)) return
      setModeOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [modeOpen])

  return (
    <div ref={wrapRef} className="relative">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
          {label}
        </span>
        <div className="ml-auto relative" ref={modeRef}>
          <button
            onClick={() => setModeOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[12px] text-ink hover:bg-gray-50"
          >
            <span className={mode === 'ai' ? 'text-brand' : 'text-gray-500'}>
              {mode === 'ai' ? <Sparkle size={12} /> : <Cursor size={12} />}
            </span>
            {mode === 'ai' ? 'AI auto-fill' : 'Set manually'}
            <span className="text-gray-400">
              <ChevronDown size={12} />
            </span>
          </button>
          {modeOpen && (
            <div className="anim-pop absolute right-0 top-[calc(100%+4px)] z-40 w-[220px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
              {[
                { k: 'manual', icon: <Cursor size={13} />, iconClass: 'text-gray-500', title: 'Set manually', desc: 'You provide a value manually' },
                { k: 'ai', icon: <Sparkle size={13} />, iconClass: 'text-brand', title: 'AI auto-fill', desc: 'AI fills the value from conversation context' },
              ].map((o) => (
                <div
                  key={o.k}
                  onClick={() => { setMode(o.k); setModeOpen(false) }}
                  className={
                    'flex cursor-pointer gap-2 px-3 py-2 text-[13px] hover:bg-gray-50 ' +
                    (mode === o.k ? 'bg-gray-50' : '')
                  }
                >
                  <span className={'mt-0.5 ' + o.iconClass}>{o.icon}</span>
                  <span className="flex flex-col">
                    <span className="text-ink">{o.title}</span>
                    <span className="text-[12px] text-muted">{o.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {mode === 'ai' ? (
        <div className="rounded-md border border-dashed border-purple-200 bg-purple-50 px-2.5 py-2 text-[12.5px] text-brand">
          This value will be determined by AI
        </div>
      ) : (
      <div ref={inputRef} className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 focus-within:border-gray-400">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setPopoverOpen(true)}
          className="h-7 flex-1 min-w-0 bg-transparent font-mono text-[12px] text-ink outline-none placeholder:text-gray-400"
          placeholder={initial}
        />
      </div>
      )}
      {mode === 'manual' && popoverOpen && (
        <div ref={popoverRef} className="anim-pop absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
          <div className="px-3 pt-3">
            <div className="inline-flex w-full items-center gap-0.5 rounded-[9px] bg-gray-100 p-[3px]">
              {[
                ['nodes', 'Nodes'],
                ['variables', 'Variables'],
              ].map(([k, name]) => (
                <div
                  key={k}
                  onClick={() => setTab(k)}
                  className={
                    'flex-1 cursor-pointer rounded-[6px] px-2 py-1 text-center text-[12.5px] ' +
                    (tab === k
                      ? 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                      : 'text-[#5f6368] hover:text-gray-700')
                  }
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center px-3 py-8 text-[13px] text-muted">
            {tab === 'nodes' ? 'No nodes to reference' : 'No variables to reference'}
          </div>
          <div className="border-t border-gray-100">
            <div className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-[13px] text-ink hover:bg-gray-50">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded border border-gray-200 font-mono text-[11px] italic text-gray-500">
                f
              </span>
              Add Advanced Expression
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ManualInputs({ onOpenSandbox, savedRecording, onSelectRecording, onClearRecording, recordings = RECORDINGS }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handle = (e) => {
      if (menuRef.current?.contains(e.target)) return
      if (triggerRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const selected = recordings.find((r) => r.name === savedRecording)

  return (
    <>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="flex cursor-pointer text-muted">
          <ChevronDown size={14} />
        </span>
        <span className="text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
          Saved Recording
        </span>
        <span className="font-bold text-red-500">*</span>
        <span className="ml-auto font-mono text-[12.5px] text-gray-400">string</span>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <div
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 hover:border-gray-300"
          >
            <div className={'flex-1 text-[13px] ' + (savedRecording ? 'text-ink' : 'text-gray-400')}>
              {savedRecording || 'Select...'}
            </div>
            <div className="text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>
          {open && (
            <div
              ref={menuRef}
              className="anim-pop absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              {recordings.map((r) => {
                const isSel = r.name === savedRecording
                return (
                  <div
                    key={r.name}
                    onClick={() => {
                      onSelectRecording(r.name)
                      setOpen(false)
                    }}
                    className={
                      'flex cursor-pointer items-center gap-2 px-2.5 py-2 text-[13px] hover:bg-gray-50 ' +
                      (isSel ? 'bg-gray-50 text-ink' : 'text-ink')
                    }
                  >
                    <span className="text-brand">
                      <Video size={13} />
                    </span>
                    <span className="flex-1 truncate">{r.name}</span>
                    {isSel && <span className="text-[11.5px] text-muted">Selected</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <button
          onClick={onOpenSandbox}
          className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-ink px-2.5 py-2 text-[13px] font-medium text-white hover:opacity-90"
        >
          <Plus size={14} sw={2.2} />
          New
        </button>
        <div
          onClick={savedRecording ? onClearRecording : undefined}
          title="Clear"
          className="flex h-[26px] w-[26px] flex-shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={14} />
        </div>
      </div>

      {selected && (
        <div className="mb-3.5 flex flex-col gap-4">
          {selected.inputs.map((f) => (
            <HardcodedInputField key={f.label} label={f.label} initial={f.value} />
          ))}
        </div>
      )}

      <div className="flex gap-2.5 rounded-[10px] border border-[#dbe6fe] bg-[#eff5ff] px-3 py-3 text-[12.5px] leading-[1.5] text-[#1e40af]">
        <span className="mt-px flex-shrink-0 text-blue-500">
          <InfoCircle size={16} />
        </span>
        <span>
          Record and replay browser workflows. Save a recording to make it
          appear in the dropdown.{' '}
          <a href="#" className="text-[#1d4ed8] underline">
            Watch demo
          </a>
        </span>
      </div>

      <div className="mt-3 text-[12.5px] leading-[1.5] text-muted">
        {recordings.length} saved {recordings.length === 1 ? 'recording' : 'recordings'} available in the shared browser navigation sandbox.
      </div>
    </>
  )
}

function Field({ label, children, bare = false, className = '' }) {
  return (
    <div className={bare ? className : `border-b border-gray-100 px-4 py-3 ${className}`}>
      <label className="mb-1.5 block text-[12.5px] font-medium text-gray-700 underline decoration-gray-300 underline-offset-[3px]">
        {label}
      </label>
      {children}
    </div>
  )
}

function Select({ icon, value }) {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2">
      {icon && (
        <div className="flex h-5 w-5 items-center justify-center text-gray-600">
          {icon}
        </div>
      )}
      <div className="flex-1 text-[13px]">{value}</div>
      <div className="text-gray-400">
        <ChevronDown size={14} />
      </div>
    </div>
  )
}

function SectionHeader({ icon, label, trailing }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3.5 text-[13px] font-medium text-ink">
      <span className="flex items-center text-gray-600">{icon}</span>
      {label}
      {trailing}
    </div>
  )
}

function ViewToggle({ active, title, children }) {
  return (
    <div
      title={title}
      className={
        'flex h-[26px] w-[30px] cursor-pointer items-center justify-center rounded-md ' +
        (active
          ? 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
          : 'text-muted')
      }
    >
      {children}
    </div>
  )
}
