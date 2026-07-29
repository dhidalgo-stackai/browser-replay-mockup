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
  Search,
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
  openWhen,
  bodyClass = 'px-4 pb-4 pt-1 text-[12.5px] leading-[1.5] text-muted',
  children,
}) {
  const [open, setOpen] = useState(defaultOpen)
  useEffect(() => {
    if (openWhen) setOpen(true)
  }, [openWhen])
  return (
    <div>
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer select-none items-center gap-2.5 border-t border-gray-100 px-4 py-3.5 text-[13px] text-ink"
      >
        <span className="flex items-center text-gray-600">{icon}</span>
        {label}
        {badge}
        <span className="ml-auto flex text-gray-400">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className={open ? 'min-h-0' : 'min-h-0 overflow-hidden'}>
          <div className={bodyClass}>{children}</div>
        </div>
      </div>
    </div>
  )
}

const RECORDINGS = [
  {
    name: 'Download vendor invoices',
    site: 'netsuite.com',
    inputs: [
      { label: 'Vendor name', value: 'Acme Supplies' },
      { label: 'Invoice status filter', value: 'open' },
      { label: 'Date range', value: 'Last 30 days' },
    ],
  },
  {
    name: 'Extract Salesforce lead list',
    site: 'salesforce.com',
    inputs: [
      { label: 'Report name', value: 'Weekly qualified leads' },
      { label: 'Date range', value: 'Last 7 days' },
    ],
  },
]

function RecordingLogo({ site, name, size = 16 }) {
  const [failed, setFailed] = useState(false)
  if (!site || failed) {
    return (
      <span className="text-brand">
        <Video size={13} />
      </span>
    )
  }
  return (
    <img
      src={`https://icons.duckduckgo.com/ip3/${site}.ico`}
      onError={() => setFailed(true)}
      alt=""
      style={{ width: size, height: size }}
      className="flex-shrink-0 rounded-[3px] object-contain"
    />
  )
}

export default function Inspector({ onOpenSandbox, onClose, savedRecording, onSelectRecording, onClearRecording, extraRecordings = [], replayOnly = false, title = 'Browser Navigation' }) {
  const allRecordings = [
    ...extraRecordings,
    ...RECORDINGS.filter((r) => !extraRecordings.some((e) => e.name === r.name)),
  ]
  const [mode, setMode] = useState(replayOnly ? 'manual' : 'ai')
  const [descEditing, setDescEditing] = useState(false)
  const [description, setDescription] = useState(
    'Replay a saved browser navigation recording from the shared browser navigation sandbox'
  )
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
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-orange-50 text-orange-500 ring-1 ring-inset ring-orange-200">
          <Monitor size={16} />
        </div>
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
          {title}
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

      {/* Description + Provider + Action */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        {descEditing ? (
          <textarea
            autoFocus
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setDescEditing(false)}
            className="mb-3 min-h-[52px] w-full resize-y rounded-md border border-hairline bg-white px-2 py-1.5 text-[12.5px] leading-[1.5] text-ink focus:border-gray-400 focus:outline-none"
          />
        ) : (
          <div
            onDoubleClick={() => setDescEditing(true)}
            className="mb-3 cursor-text text-[12.5px] leading-[1.5] text-muted"
          >
            {description}
          </div>
        )}

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
            value={replayOnly ? 'Browser Navigation Replay' : 'Browser Navigation'}
          />
        </Field>
      </div>

      <CollapsibleSection icon={<Gear size={14} />} label="Settings" defaultOpen>
        {!replayOnly && (
          <>
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
          </>
        )}
        {replayOnly && (
          <div className="mb-3.5">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
                Saved Recording
              </span>
              <span className="font-bold text-red-500">*</span>
              <span
                className="cursor-help text-gray-400 hover:text-gray-600"
                title="Record and replay browser workflows. Save a recording to make it appear in the dropdown."
              >
                <InfoCircle size={13} />
              </span>
            </div>
            <SavedRecordingSelector
              onOpenSandbox={onOpenSandbox}
              savedRecording={savedRecording}
              onSelectRecording={onSelectRecording}
              onClearRecording={onClearRecording}
              recordings={allRecordings}
              showLabel={false}
            />
          </div>
        )}
        {(!replayOnly || savedRecording) && (
          <>
            <div className="mb-2 text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
              Connection
            </div>
            <ConnectionSelect />
            <div className="mt-2 text-[12px] leading-[1.5] text-muted">
              <a className="underline decoration-gray-300 underline-offset-[3px]" href="#">
                Your credentials are encrypted and can be removed at any time
              </a>
              . You can manage all your connections{' '}
              <a className="underline decoration-gray-300 underline-offset-[3px]" href="#">
                here
              </a>
              .
            </div>
          </>
        )}
      </CollapsibleSection>

      {/* Inputs */}
      <CollapsibleSection
        icon={<DownloadArrow size={15} />}
        label="Inputs"
        openWhen={savedRecording}
        badge={
          savedRecording ? (
            <span className="flex items-center gap-1.5 rounded-[7px] bg-[#fef4e5] px-[9px] py-[3px] text-[11.5px] font-semibold text-[#b45309]">
              <AlertTriangle size={12} />
              Has required fields
            </span>
          ) : null
        }
        bodyClass="px-4 pb-4 pt-3"
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
          {mode === 'ai' ? (
            <AiInputs />
          ) : (
            <ManualInputs
              onOpenSandbox={onOpenSandbox}
              savedRecording={savedRecording}
              onSelectRecording={onSelectRecording}
              onClearRecording={onClearRecording}
              recordings={allRecordings}
              hideSelector={replayOnly}
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

function InputRow({ label, type = 'string', required = false, expanded = false, collapsible = false, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const isOpen = collapsible ? open : expanded
  return (
    <>
      <div
        className={'mb-2 flex items-center gap-1.5 ' + (collapsible ? 'cursor-pointer' : '')}
        onClick={collapsible ? () => setOpen((v) => !v) : undefined}
      >
        {collapsible && (
          <span className="-ml-1 flex h-4 w-4 items-center justify-center text-gray-500">
            <ChevronDown
              size={12}
              style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 120ms' }}
            />
          </span>
        )}
        <span className="text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
          {label}
        </span>
        {required && <span className="font-bold text-red-500">*</span>}
        <span className="ml-auto font-mono text-[12.5px] text-gray-400">{type}</span>
      </div>
      {isOpen && children && <div className="mb-3.5">{children}</div>}
    </>
  )
}

const fieldInputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[13px] text-ink placeholder:text-gray-400 focus:outline-none'

const CONNECTIONS = [
  { id: 'david-1', name: "David's Google Drive connection", user: 'David Hidalgo', when: '1 second ago' },
  { id: 'marta', name: "Marta's Gdrive connection", user: 'Marta Llopis', when: '12 hours ago' },
  { id: 'jenny', name: 'Google Drive', user: 'Jenny Liang', when: '17 hours ago' },
  { id: 'david-2', name: "David's Google Drive connection", user: 'David Hidalgo', when: '17 hours ago' },
]

function ConnAvatar({ name }) {
  const initial = (name || '?')[0].toUpperCase()
  return (
    <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] font-medium text-ink">
      {initial}
    </span>
  )
}

function ConnectionSelect() {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('david-1')
  const [query, setQuery] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  const selected = CONNECTIONS.find((c) => c.id === selectedId)
  const filtered = CONNECTIONS.filter((c) =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.user.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={fieldInputClass + ' flex items-center justify-between text-left'}
      >
        <span className="truncate">{selected?.name}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-100 px-2.5 py-2">
            <Search size={14} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search connections..."
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <div className="border-b border-gray-100 py-1">
            <button className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50">
              <Plus size={14} /> New connection
            </button>
            <button className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50">
              <ExternalLink size={14} /> Manage connections
            </button>
          </div>
          <div className="max-h-[240px] overflow-y-auto py-1">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedId(c.id); setOpen(false) }}
                className={
                  'flex w-full flex-col gap-0.5 px-2.5 py-1.5 text-left hover:bg-gray-50 ' +
                  (c.id === selectedId ? 'bg-gray-100' : '')
                }
              >
                <div className="flex items-center gap-1.5 text-[13px] text-ink">
                  <span className="truncate">{c.name}</span>
                  <InfoCircle size={12} />
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-gray-500">
                  <span>Created by</span>
                  <ConnAvatar name={c.user} />
                  <span>{c.user}</span>
                  <span>{c.when}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SaveRecordingToggle() {
  const [on, setOn] = useState(false)
  return (
    <div className="mt-2 flex items-center gap-2 text-[13px] text-ink">
      <span>Save recording to library</span>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={
          'relative ml-auto h-[18px] w-[30px] flex-none cursor-pointer rounded-full transition-colors ' +
          (on ? 'bg-ink' : 'bg-gray-200')
        }
      >
        <span
          className={
            'absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-all ' +
            (on ? 'left-[14px]' : 'left-[2px]')
          }
        />
      </button>
    </div>
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
        <SaveRecordingToggle />
      </InputRow>
      <InputRow label="Credentials" collapsible>
        <select className={fieldInputClass} defaultValue="">
          <option value="" disabled>
            Select credentials
          </option>
          <option value="none">None</option>
          <option value="default">Default</option>
        </select>
      </InputRow>
      <InputRow label="Sandbox ID" collapsible>
        <input className={fieldInputClass} placeholder="sbx_…" />
      </InputRow>
      <InputRow label="Session" collapsible>
        <input className={fieldInputClass} placeholder="Session ID" />
      </InputRow>
      <InputRow label="Model" collapsible>
        <input className={fieldInputClass} placeholder="claude-sonnet-5" />
      </InputRow>
      <InputRow label="Max Steps" type="integer" collapsible>
        <input type="number" className={fieldInputClass} placeholder="20" />
      </InputRow>
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

function SavedRecordingSelector({ onOpenSandbox, savedRecording, onSelectRecording, onClearRecording, recordings, showLabel = true }) {
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
      {showLabel && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
            Saved Recording
          </span>
          <span className="font-bold text-red-500">*</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 hover:border-gray-300"
          >
            <div className={'flex flex-1 items-center gap-2 text-[13px] ' + (savedRecording ? 'text-ink' : 'text-gray-400')}>
              {selected && <RecordingLogo site={selected.site} name={selected.name} />}
              <span className="truncate">{savedRecording || 'Select...'}</span>
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
                    onClick={() => { onSelectRecording(r.name); setOpen(false) }}
                    className={
                      'flex cursor-pointer items-center gap-2 px-2.5 py-2 text-[13px] hover:bg-gray-50 ' +
                      (isSel ? 'bg-gray-50 text-ink' : 'text-ink')
                    }
                  >
                    <RecordingLogo site={r.site} name={r.name} />
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
    </>
  )
}

function ManualInputs({ onOpenSandbox, savedRecording, onSelectRecording, onClearRecording, recordings = RECORDINGS, hideSelector = false }) {
  const selected = recordings.find((r) => r.name === savedRecording)

  return (
    <>
      {!hideSelector && (
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
          <div className="mb-3">
            <SavedRecordingSelector
              onOpenSandbox={onOpenSandbox}
              savedRecording={savedRecording}
              onSelectRecording={onSelectRecording}
              onClearRecording={onClearRecording}
              recordings={recordings}
              showLabel={false}
            />
          </div>
        </>
      )}

      {selected && (
        <div className="mb-3.5 flex flex-col gap-4">
          {selected.inputs.map((f) => (
            <HardcodedInputField key={f.label} label={f.label} initial={f.value} />
          ))}
        </div>
      )}

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
