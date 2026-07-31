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
  ArrowLeft,
  Lock,
  StackAILogo,
} from './icons.jsx'
import Tooltip from './Tooltip.jsx'

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
  {
    name: 'Sync Zendesk tickets',
    site: 'zendesk.com',
    notShared: true,
    inputs: [
      { label: 'Tag filter', value: 'billing' },
    ],
  },
  {
    name: 'Check Hacker News top stories',
    site: 'news.ycombinator.com',
    noCredentials: true,
    inputs: [
      { label: 'Story count', value: '10' },
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
  const [sessionId, setSessionId] = useState(null)
  const [connectionId, setConnectionId] = useState(null)
  const [connectionTouched, setConnectionTouched] = useState(false)
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [endUserAuth, setEndUserAuth] = useState(false)
  useEffect(() => {
    if (connectionTouched) return
    const s = SESSIONS.find((x) => x.id === sessionId)
    if (s?.connectionId) setConnectionId(s.connectionId)
  }, [sessionId, connectionTouched])
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
            icon={<span className="text-orange-500"><Monitor size={14} /></span>}
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

      <CollapsibleSection icon={<Gear size={14} />} label="Settings" defaultOpen bodyClass="px-4 pb-4 pt-1 text-[12.5px] leading-[1.5] text-muted">
        <div className="ml-1 border-l border-hairline pl-5">
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
              <Tooltip side="left" label="Record and replay browser workflows. Save a recording to make it appear in the dropdown." width={260}>
                <span className="cursor-help text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
                  Browser Recording
                </span>
              </Tooltip>
              <span className="font-bold text-red-500">*</span>
            </div>
            <SavedRecordingSelector
              onOpenSandbox={onOpenSandbox}
              savedRecording={savedRecording}
              onSelectRecording={onSelectRecording}
              onClearRecording={onClearRecording}
              recordings={allRecordings}
              showLabel={false}
            />
            {savedRecording && (() => {
              const rec = allRecordings.find((r) => r.name === savedRecording)
              const noCreds = rec?.noCredentials
              return (
                <>
                  {!endUserAuth && !noCreds && (
                    <>
                      <div className="mt-3.5 mb-2 flex items-center gap-1.5">
                        <Tooltip
                          side="left"
                          width={300}
                          label="A saved browser session stores cookies and local storage from a prior login. Injecting one lets the replay skip the login flow entirely."
                        >
                          <span className="cursor-help text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
                            Session
                          </span>
                        </Tooltip>
                      </div>
                      <SessionSelect savedRecording={savedRecording} recordings={allRecordings} onOpenSandbox={() => setSessionModalOpen(true)} onChange={setSessionId} />
                      {rec?.notShared && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-[12px] leading-[1.5] text-blue-900">
                          <span className="mt-[1px] flex-none text-blue-500">
                            <InfoCircle size={13} />
                          </span>
                          <span>
                            This recording's browser session isn't shared with you. Record a new session or continue without one to run the replay.
                          </span>
                        </div>
                      )}

                      <div className="mt-3.5 mb-2 flex items-center gap-1.5">
                        <Tooltip
                          side="left"
                          width={300}
                          label="Credentials for the site's login flow. Used to sign in when there's no session, or to re-login if the injected session has expired."
                        >
                          <span className="cursor-help text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
                            Connection
                          </span>
                        </Tooltip>
                        {sessionId && (
                          <span className="text-[11.5px] text-muted">· locked to session</span>
                        )}
                      </div>
                      <ConnectionSelect
                        savedRecording={savedRecording}
                        recordings={allRecordings}
                        value={connectionId}
                        onChange={(id) => { setConnectionId(id); setConnectionTouched(true) }}
                        disabled={!!sessionId}
                      />
                      {!sessionId && (
                        <div className="mt-1.5 text-[12px] leading-[1.5] text-muted">
                          The replay will log in fresh with these credentials each run.
                        </div>
                      )}
                    </>
                  )}

                  {endUserAuth && (
                    <div className="mt-3.5 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-[12px] leading-[1.5] text-blue-900">
                      <span className="mt-[1px] flex-none text-blue-500">
                        <InfoCircle size={13} />
                      </span>
                      <span>
                        End-users will be prompted to sign in with their own credentials when the workflow runs. Your saved session and connection aren't used.
                      </span>
                    </div>
                  )}

                  {!noCreds && (
                    <div className="mt-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] text-ink">Use end-user connection</div>
                        <div className="text-[12px] text-muted">Require end-users to authenticate at runtime</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEndUserAuth((v) => !v)}
                        className={
                          'relative inline-flex h-[22px] w-[38px] flex-shrink-0 items-center rounded-full transition-colors ' +
                          (endUserAuth ? 'bg-ink' : 'bg-gray-200')
                        }
                      >
                        <span
                          className={
                            'inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform ' +
                            (endUserAuth ? 'translate-x-[18px]' : 'translate-x-[2px]')
                          }
                        />
                      </button>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}
        {!replayOnly && (
          <>
            <div className="mt-3.5 mb-2 text-[13px] text-ink underline decoration-gray-300 underline-offset-[3px]">
              Connection credentials
            </div>
            <div>
              <ConnectionSelect savedRecording={savedRecording} recordings={allRecordings} />
            </div>
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
        </div>
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
      {sessionModalOpen && (
        <SessionCaptureModal
          site={allRecordings.find((r) => r.name === savedRecording)?.site}
          onClose={() => setSessionModalOpen(false)}
        />
      )}
    </div>
  )
}

function SessionCaptureModal({ site, onClose }) {
  const [phase, setPhase] = useState('login') // 'login' | 'saving' | 'saved'
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [cookies, setCookies] = useState(false)
  const loginUrl = site ? `https://${site.replace(/^https?:\/\//, '')}/login` : 'https://example.com/login'
  const handleLogin = (e) => {
    e.preventDefault()
    if (!user.trim() || !pass.trim()) return
    setPhase('saving')
    setTimeout(() => setPhase('saved'), 900)
  }
  return (
    <div data-modal-root className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="flex h-[560px] w-[720px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-2 flex flex-1 items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[12px] text-ink">
            <Lock size={12} />
            <span className="truncate">{loginUrl}</span>
          </div>
          <div className="text-[11.5px] font-medium text-muted">Record session</div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center bg-gray-50 px-6">
          {phase === 'login' && (
            <form onSubmit={handleLogin} className="w-[340px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-center">
                <div className="text-[15px] font-semibold text-ink">Sign in to {site || 'the site'}</div>
                <div className="mt-1 text-[12px] text-muted">Complete your normal login. We'll capture the cookies when you're done.</div>
              </div>
              <div className="space-y-2.5">
                <input
                  autoFocus
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Username or email"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <button
                  type="submit"
                  className="mt-1 w-full rounded-md bg-ink px-3 py-2 text-[13px] font-medium text-white hover:bg-black"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-ink hover:bg-gray-50"
                >
                  Continue with SSO
                </button>
              </div>
              {!cookies && (
                <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-[11.5px] text-muted">
                  This site uses cookies.{' '}
                  <button type="button" onClick={() => setCookies(true)} className="underline">Accept</button>
                </div>
              )}
            </form>
          )}
          {phase === 'saving' && (
            <div className="text-center">
              <div className="text-[14px] font-medium text-ink">Capturing session…</div>
              <div className="mt-1 text-[12px] text-muted">Snapshotting cookies and local storage.</div>
            </div>
          )}
          {phase === 'saved' && (
            <div className="w-[340px] rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="text-[14px] font-semibold text-ink">Session saved</div>
              <div className="mt-1 text-[12px] text-muted">The replay will resume from these cookies. You can log in again anytime from Manage sessions.</div>
              <button
                onClick={onClose}
                className="mt-4 rounded-md bg-ink px-3 py-1.5 text-[13px] font-medium text-white hover:bg-black"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
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

export const CONNECTIONS = [
  { id: 'david-bn-1', name: "David's Browser Navigation connection (Salesforce)", user: 'David Hidalgo', when: '1 second ago', sites: ['salesforce.com'] },
  { id: 'david-bn-2', name: "David's Browser Navigation connection (Zendesk, NetSuite)", user: 'David Hidalgo', when: '2 hours ago', sites: ['zendesk.com', 'netsuite.com'] },
]

function ConnAvatar({ name }) {
  const initial = (name || '?')[0].toUpperCase()
  return (
    <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] font-medium text-ink">
      {initial}
    </span>
  )
}

const RUN_AS_OPTIONS = [
  {
    id: 'saved',
    label: 'Saved browser session',
    desc: 'Runs using a browser session you saved. Same session every time, regardless of who triggers the workflow.',
  },
  {
    id: 'end-user',
    label: 'End-user connection',
    desc: "Each end-user signs in with their own credentials when the workflow runs. Your saved session isn't used.",
  },
]

function RunAsSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  const selected = RUN_AS_OPTIONS.find((o) => o.id === value) || RUN_AS_OPTIONS[0]
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={fieldInputClass + ' flex items-center justify-between text-left'}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {RUN_AS_OPTIONS.map((o) => (
            <Tooltip key={o.id} side="left" width={260} className="!flex w-full" label={o.desc}>
              <button
                onClick={() => { onChange(o.id); setOpen(false) }}
                className={
                  'flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50 ' +
                  (o.id === value ? 'bg-gray-100' : '')
                }
              >
                <span>{o.label}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  )
}

function NewConnectionModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("David's Browser Navigation connection")
  const [creds, setCreds] = useState([{ url: '', user: '', secret: '' }])
  const updateCred = (i, key, val) => setCreds((cs) => cs.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)))
  const addCred = () => setCreds((cs) => [...cs, { url: '', user: '', secret: '' }])
  const removeCred = (i) => setCreds((cs) => (cs.length === 1 ? cs : cs.filter((_, idx) => idx !== i)))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="relative flex w-[520px] h-[560px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 && (
          <div className="px-8 py-14">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-gray-100"
            >
              <X size={16} />
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white ring-1 ring-gray-200 shadow-sm">
                  <StackAILogo size={22} />
                </div>
                <div className="flex gap-1">
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-500 ring-1 ring-gray-200 shadow-sm">
                  <Monitor size={22} />
                </div>
              </div>
              <div className="mt-5 text-[16px] font-semibold text-ink">Connect StackAI to Browser Navigation</div>
              <div className="mt-1 text-center text-[13px] text-muted">
                Choose how you'd like to connect your Browser Navigation workspace to StackAI.
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-ink ring-1 ring-gray-200">
                <Lock size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium text-ink">Connect Browser Navigation</div>
                <div className="text-[12px] text-muted">OAuth Connection</div>
              </div>
            </button>

          </div>
        )}

        {step === 2 && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative overflow-y-auto px-8 pb-4 pt-6">
              <button
                onClick={() => setStep(1)}
                className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-gray-100"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-gray-100"
              >
                <X size={16} />
              </button>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-orange-500 ring-1 ring-gray-200">
                  <Monitor size={16} />
                </div>
                <div className="text-[15px] font-semibold text-ink">Connect Browser Navigation</div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-1 text-[12.5px] text-ink">
                    Connection Name <span className="text-red-500">*</span>
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[12.5px] text-ink">
                    <span>Credentials <span className="text-red-500">*</span></span>
                    <span className="text-[11.5px] text-muted">{creds.length} {creds.length === 1 ? 'URL' : 'URLs'}</span>
                  </div>
                  <div className="space-y-2">
                    {creds.map((c, i) => (
                      <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/60 p-2.5">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[11.5px] font-medium text-muted">URL {i + 1}</span>
                          {creds.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCred(i)}
                              className="flex h-5 w-5 items-center justify-center rounded text-muted hover:bg-gray-200 hover:text-ink"
                              aria-label="Remove URL"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <input
                          value={c.url}
                          onChange={(e) => updateCred(i, 'url', e.target.value)}
                          placeholder="https://browser.example.com/nav"
                          className="mb-2 w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        <div className="flex gap-2">
                          <input
                            value={c.user}
                            onChange={(e) => updateCred(i, 'user', e.target.value)}
                            placeholder="User name"
                            className="w-1/2 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                          />
                          <input
                            type="password"
                            value={c.secret}
                            onChange={(e) => updateCred(i, 'secret', e.target.value)}
                            placeholder="Secret"
                            className="w-1/2 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addCred}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-1.5 text-[12.5px] text-ink hover:bg-gray-50"
                  >
                    <Plus size={12} /> Add another URL
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-end gap-2 rounded-b-2xl border-t border-gray-100 bg-[#fafafa] px-6 py-3">
              <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-[13px] text-ink hover:bg-gray-100">
                Cancel
              </button>
              {(() => {
                const valid = name.trim() && creds.every((c) => c.url.trim() && c.user.trim() && c.secret.trim())
                return (
                  <button
                    onClick={valid ? onClose : undefined}
                    disabled={!valid}
                    className={`rounded-lg px-4 py-1.5 text-[13px] font-medium ${valid ? 'bg-ink text-white hover:bg-black' : 'bg-gray-200 text-gray-400'}`}
                  >
                    Connect
                  </button>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ensureSessionAndConnectionForSite(site, label = 'David') {
  if (!site) return { sessionId: null, connectionId: null }
  let conn = CONNECTIONS.find((c) => c.sites?.includes(site))
  if (!conn) {
    conn = {
      id: `conn-${site}-${Date.now()}`,
      name: `${label}'s Browser Navigation connection (${site})`,
      user: 'David Hidalgo',
      when: 'Just now',
      sites: [site],
    }
    CONNECTIONS.push(conn)
  }
  let sess = SESSIONS.find((s) => s.site === site)
  if (!sess) {
    sess = {
      id: `sess-${site}-${Date.now()}`,
      name: `${label} · ${site}`,
      site,
      when: 'Just now',
      status: 'active',
      connectionId: conn.id,
    }
    SESSIONS.push(sess)
  }
  return { sessionId: sess.id, connectionId: conn.id }
}

export const SESSIONS = [
  { id: 'sf-david', name: 'David · Salesforce', site: 'salesforce.com', when: '4 minutes ago', status: 'active', connectionId: 'david-bn-1' },
  { id: 'sf-shared', name: 'Ops team · Salesforce', site: 'salesforce.com', when: 'Yesterday', status: 'active', connectionId: 'david-bn-1' },
  { id: 'zd-david', name: 'David · Zendesk', site: 'zendesk.com', when: '1 hour ago', status: 'active', connectionId: 'david-bn-2' },
  { id: 'ns-david', name: 'David · NetSuite', site: 'netsuite.com', when: '2 hours ago', status: 'active', connectionId: 'david-bn-2' },
  { id: 'ns-shared', name: 'Ops team · NetSuite', site: 'netsuite.com', when: '3 days ago', status: 'expiring', connectionId: 'david-bn-2' },
]

export function SessionSelect({ savedRecording, recordings = [], initialSelectedId = null, onOpenSandbox, onChange, site }) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(initialSelectedId)
  const [userTouched, setUserTouched] = useState(false)
  const [query, setQuery] = useState('')
  const rec = recordings.find((r) => r.name === savedRecording)
  const forSiteResolved = site || rec?.site
  const attachedId = rec && !rec.notShared ? SESSIONS.find((s) => s.site === rec.site)?.id : null
  useEffect(() => {
    if (userTouched) return
    setSelectedId(attachedId || initialSelectedId)
  }, [attachedId, userTouched, initialSelectedId])
  useEffect(() => { onChange && onChange(selectedId) }, [selectedId, onChange])
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  const selected = SESSIONS.find((s) => s.id === selectedId)
  const forSite = forSiteResolved
  const siteSessions = forSite ? SESSIONS.filter((s) => s.site === forSite) : SESSIONS
  const filtered = siteSessions.filter((s) =>
    !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.site.toLowerCase().includes(query.toLowerCase()),
  )
  const isAttached = selected && selected.id === attachedId
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={fieldInputClass + ' flex items-center justify-between text-left'}
      >
        <span className={'flex min-w-0 items-center gap-2 ' + (selected ? '' : 'text-gray-400')}>
          {selected && (
            <span
              className={
                'h-1.5 w-1.5 flex-none rounded-full ' +
                (selected.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500')
              }
            />
          )}
          <span className="truncate">{selected?.name || 'Continue without session'}</span>
        </span>
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
              placeholder="Search sessions..."
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <div className="border-b border-gray-100 py-1">
            <Tooltip side="left" width={240} className="!flex w-full" label="Opens the sandbox so you can log in once; cookies are saved as a session.">
              <button
                onClick={() => { setOpen(false); onOpenSandbox && onOpenSandbox() }}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50"
              >
                <Plus size={14} /> Record new session
              </button>
            </Tooltip>
            <Tooltip side="left" width={240} className="!flex w-full" label="Replay runs cold — it will hit the login page and need credentials to sign in.">
              <button
                onClick={() => { setSelectedId(null); setUserTouched(true); setOpen(false) }}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50"
              >
                <X size={12} /> Continue without session
              </button>
            </Tooltip>
            <button className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50">
              <ExternalLink size={14} /> Manage sessions
            </button>
          </div>
          <div className="max-h-[240px] overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-[12px] text-muted">
                No saved sessions{forSite ? ` for ${forSite}` : ''}.
              </div>
            )}
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedId(s.id); setUserTouched(true); setOpen(false) }}
                className={
                  'flex w-full flex-col gap-0.5 px-2.5 py-1.5 text-left hover:bg-gray-50 ' +
                  (s.id === selectedId ? 'bg-gray-100' : '')
                }
              >
                <div className="flex items-center gap-1.5 text-[13px] text-ink">
                  <span
                    className={
                      'h-1.5 w-1.5 flex-none rounded-full ' +
                      (s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500')
                    }
                  />
                  <span className="truncate">{s.name}</span>
                </div>
                <div className="flex items-center gap-1.5 pl-3 text-[11.5px] text-gray-500">
                  <span>{s.site}</span>
                  <span>·</span>
                  <span>Captured {s.when}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ConnectionSelect({ savedRecording, recordings = [], initialSelectedId = null, value, onChange, disabled = false, site }) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [internalId, setInternalId] = useState(initialSelectedId)
  const [userTouched, setUserTouched] = useState(false)
  const [query, setQuery] = useState('')
  const controlled = value !== undefined
  const selectedId = controlled ? value : internalId
  const setSelectedId = (id) => {
    if (!controlled) setInternalId(id)
    onChange && onChange(id)
  }
  useEffect(() => {
    if (controlled || userTouched) return
    const rec = recordings.find((r) => r.name === savedRecording)
    if (!rec) { setInternalId(initialSelectedId); return }
    const match = CONNECTIONS.find((c) => c.sites?.includes(rec.site))
    setInternalId(match ? match.id : initialSelectedId)
  }, [savedRecording, recordings, userTouched, initialSelectedId, controlled])
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  const selected = CONNECTIONS.find((c) => c.id === selectedId)
  const forSite = site || recordings.find((r) => r.name === savedRecording)?.site
  const siteConnections = forSite ? CONNECTIONS.filter((c) => c.sites?.includes(forSite)) : CONNECTIONS
  const filtered = siteConnections.filter((c) =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.user.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div ref={ref} className="relative">
      {(() => {
        const btn = (
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setOpen((o) => !o)}
            className={
              fieldInputClass.replace('bg-white', disabled ? 'bg-gray-50' : 'bg-white') +
              ' flex w-full items-center justify-between text-left ' +
              (disabled ? 'cursor-not-allowed text-gray-400' : '')
            }
          >
            <span className={'truncate ' + (selected && !disabled ? '' : 'text-gray-400')}>{selected?.name || 'Continue without connection'}</span>
            <span className="text-gray-400">
              {disabled ? <Lock size={12} /> : <ChevronDown size={14} />}
            </span>
          </button>
        )
        return disabled ? (
          <Tooltip side="left" width={260} className="w-full" label="Matches the session's owner. Clear the session above to pick a different connection.">
            {btn}
          </Tooltip>
        ) : (
          btn
        )
      })()}
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
            <button
              onClick={() => { setOpen(false); setModalOpen(true) }}
              className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50"
            >
              <Plus size={14} /> New connection
            </button>
            <button
              onClick={() => { setSelectedId(null); setUserTouched(true); setOpen(false) }}
              className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50"
            >
              <X size={12} /> Continue without connection
            </button>
            <button className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50">
              <ExternalLink size={14} /> Manage connections
            </button>
          </div>
          <div className="max-h-[240px] overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-[12px] text-muted">
                No connections{forSite ? ` for ${forSite}` : ''}.
              </div>
            )}
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedId(c.id); setUserTouched(true); setOpen(false) }}
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
      {modalOpen && <NewConnectionModal onClose={() => setModalOpen(false)} />}
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
  const [value, setValue] = useState('')
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
              {mode === 'ai' ? <Sparkle size={12} /> : mode === 'default' ? <Video size={12} /> : <Cursor size={12} />}
            </span>
            {mode === 'ai' ? 'AI auto-fill' : mode === 'default' ? 'Use default values' : 'Set manually'}
            <span className="text-gray-400">
              <ChevronDown size={12} />
            </span>
          </button>
          {modeOpen && (
            <div className="anim-pop absolute right-0 top-[calc(100%+4px)] z-40 w-[220px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
              {[
                { k: 'manual', icon: <Cursor size={13} />, iconClass: 'text-gray-500', title: 'Set manually', desc: 'You provide a value manually' },
                { k: 'ai', icon: <Sparkle size={13} />, iconClass: 'text-brand', title: 'AI auto-fill', desc: 'AI fills the value from conversation context' },
                { k: 'default', icon: <Video size={13} />, iconClass: 'text-gray-500', title: 'Use default values', desc: 'Load the value saved with the recording' },
              ].map((o) => (
                <div
                  key={o.k}
                  onClick={() => { setMode(o.k); setModeOpen(false); if (o.k === 'default') setValue(initial ?? '') }}
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
      <div ref={inputRef} className="flex items-start gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 focus-within:border-gray-400">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setPopoverOpen(true)}
          rows={1}
          className="min-h-[20px] flex-1 min-w-0 resize-y bg-transparent font-mono text-[12px] text-ink outline-none placeholder:text-gray-400"
          placeholder="Start typing to add values..."
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

function NewRecordingMenu({ onOpen }) {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [subPos, setSubPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)
  const subTriggerRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSubOpen(false) } }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  useEffect(() => {
    if (!subOpen || !subTriggerRef.current) return
    const r = subTriggerRef.current.getBoundingClientRect()
    const width = 260
    setSubPos({ top: r.top, left: Math.max(8, r.left - width - 4) })
  }, [subOpen])
  const pick = (session) => {
    setOpen(false)
    setSubOpen(false)
    onOpen && onOpen(session)
  }
  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink px-2.5 py-2 text-[13px] font-medium text-white hover:opacity-90"
      >
        <Plus size={14} sw={2.2} />
        New
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-[280px] rounded-lg border border-gray-200 bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <button
            onClick={() => pick(null)}
            className="flex w-full items-center px-3 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50"
          >
            Start with a new browser session
          </button>
          <div
            ref={subTriggerRef}
            onMouseEnter={() => setSubOpen(true)}
            onMouseLeave={() => setSubOpen(false)}
          >
            <button className="flex w-full items-center justify-between gap-2 whitespace-nowrap px-3 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50">
              <span>Start from existing browser session</span>
            </button>
            {subOpen && (
              <div
                onMouseEnter={() => setSubOpen(true)}
                onMouseLeave={() => setSubOpen(false)}
                style={{ position: 'fixed', top: subPos.top, left: subPos.left, width: 260 }}
                className="z-[60] rounded-lg border border-gray-200 bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                {SESSIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => pick(s)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50"
                  >
                    <span className={'h-1.5 w-1.5 flex-shrink-0 rounded-full ' + (s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    <span className="min-w-0 truncate">{s.name}</span>
                  </button>
                ))}
                <div className="my-1 border-t border-gray-200" />
                <a
                  href="#/browser-automation/sessions"
                  onClick={() => { setOpen(false); setSubOpen(false) }}
                  className="flex w-full items-center px-3 py-1.5 text-left text-[13px] text-ink hover:bg-gray-50"
                >
                  View all sessions
                </a>
              </div>
            )}
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
            Browser Recording
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
              <div className="border-b border-gray-100 px-3 py-2.5">
                <input
                  placeholder="Search for recordings..."
                  className="w-full bg-transparent text-[13px] text-ink placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="max-h-[280px] overflow-y-auto py-1">
                {recordings.map((r) => {
                  const isSel = r.name === savedRecording
                  return (
                    <div
                      key={r.name}
                      onClick={() => { onSelectRecording(r.name); setOpen(false) }}
                      className={
                        'mx-1 flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[13px] hover:bg-gray-100 ' +
                        (isSel ? 'bg-gray-100 text-ink' : 'text-ink')
                      }
                    >
                      <RecordingLogo site={r.site} name={r.name} />
                      <span className="flex-1 truncate">{r.name}</span>
                      {isSel && (
                        <span className="text-ink">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <NewRecordingMenu onOpen={onOpenSandbox} />
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
              Browser Recording
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
