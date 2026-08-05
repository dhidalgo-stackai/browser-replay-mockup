import { useEffect, useRef, useState } from 'react'
import {
  Globe,
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
  Refresh,
  Lock,
  Sparkle,
  SquarePlus,
  Search,
  Puzzle,
  User,
  ArrowUp,
  StackAILogo,
} from './icons.jsx'
import WorkflowRecorderPanel from './WorkflowRecorderPanel.jsx'
import FakeSite from './FakeSite.jsx'

function ExtIcon({ title, children, onClick, active = false }) {
  return (
    <div
      title={title}
      onClick={onClick}
      className={
        'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5f6368] hover:bg-[#e6e8eb] ' +
        (active ? 'bg-[#e6e8eb]' : '')
      }
    >
      {children}
    </div>
  )
}

const STEPS = [
  'Open the extension in this sandbox browser',
  'Click "Start Recording"',
  'Navigate and interact with any site',
  'Stop and save your workflow',
]

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  country: '',
  role: '',
  fullName: '',
  agree: false,
}

const DEFAULT_URL = 'stack-ai.com/sandbox/browser-navigation'
const SESSION_LOGIN_URL = 'https://app.example.com/login'

function SessionLoginPage({ signedIn, email, setEmail, password, setPassword, onSignIn }) {
  const [remember, setRemember] = useState(true)
  if (signedIn) {
    return (
      <div className="mx-auto flex w-full max-w-[380px] flex-col pt-10">
        <div className="mb-6 flex items-center justify-center gap-2 text-[15px] font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white">A</span>
          <span>Acme Portal</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="mb-1 text-[18px] font-semibold text-ink">You're signed in</h1>
          <p className="mb-5 text-[12.5px] text-muted">
            Welcome back{email ? `, ${email}` : ''}. Your session is active.
          </p>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-[11.5px] text-muted">
            <div className="mb-1 font-medium text-ink">Session details</div>
            <div>Signed in as <span className="text-ink">{email || 'user@company.com'}</span></div>
            <div>Session token: <span className="font-mono text-ink">acme_sess_84f…c1e</span></div>
          </div>
        </div>
        <p className="mt-4 text-center text-[11.5px] text-muted">
          Click <span className="font-medium text-ink">Save session</span> in the panel to store these credentials.
        </p>
      </div>
    )
  }
  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col pt-10">
      <div className="mb-6 flex items-center justify-center gap-2 text-[15px] font-semibold text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white">A</span>
        <span>Acme Portal</span>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <h1 className="mb-1 text-[18px] font-semibold text-ink">Sign in</h1>
        <p className="mb-5 text-[12.5px] text-muted">
          Log in with the account you want this browser session to remember.
        </p>

        <label className="mb-1 block text-[12px] font-medium text-gray-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mb-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <label className="mb-1 block text-[12px] font-medium text-gray-700">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
          className="mb-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <label className="mb-4 flex items-center gap-2 text-[12.5px] text-ink">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          Keep me signed in
        </label>

        <button
          onClick={() => onSignIn && onSignIn({ email, password, remember })}
          className="w-full rounded-md bg-blue-600 py-2 text-[13px] font-medium text-white hover:bg-blue-700"
        >
          Sign in
        </button>

        <div className="mt-4 flex items-center gap-2 text-[11.5px] text-muted">
          <span className="h-px flex-1 bg-gray-200" />
          or continue with
          <span className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onSignIn && onSignIn({ email: email || 'user@company.com', password: 'sso', remember: true, provider: 'Google' })}
            className="rounded-md border border-gray-300 bg-white py-1.5 text-[12.5px] text-ink hover:bg-gray-50"
          >
            Google
          </button>
          <button
            onClick={() => onSignIn && onSignIn({ email: email || 'user@company.com', password: 'sso', remember: true, provider: 'SSO' })}
            className="rounded-md border border-gray-300 bg-white py-1.5 text-[12.5px] text-ink hover:bg-gray-50"
          >
            SSO
          </button>
        </div>
      </div>
      <p className="mt-4 text-center text-[11.5px] text-muted">
        This is a sample login. Any credentials you enter stay in this sandbox.
      </p>
    </div>
  )
}

const HARDCODED_STEPS = [
  'Navigate to https://www.google.com/search?q=contact+form',
  'Click result "Contact us — Example Forms"',
  'Click "Username" field',
  'Type "ada.lovelace" into "Username"',
  'Click "Password" field',
  'Type "••••••••" into "Password"',
  'Click "Sign in"',
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
]

function extractUrl(step) {
  const m = step.match(/https?:\/\/\S+/)
  return m ? m[0] : step
}

export default function SandboxModal({ onClose, onSaveRecording, session = null, mode = 'recording' }) {
  const sessionMode = mode === 'session'
  const [recorderOpen, setRecorderOpen] = useState(false)

  // Recording state (lifted from panel)
  const [phase, setPhase] = useState('idle') // 'idle' | 'recording' | 'finished'
  const [steps, setSteps] = useState([])

  // Fake browser state
  const [page, setPage] = useState('home') // 'home' | 'results' | 'form1' | 'form2' | 'done' | 'login' | 'loggedIn'
  const [addressValue, setAddressValue] = useState('')
  const [query, setQuery] = useState('')
  const [formData, setFormData] = useState(INITIAL_FORM)

  // Session-mode state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [captured, setCaptured] = useState([]) // [{ kind, label, detail }]

  // Replay state
  const [replaySteps, setReplaySteps] = useState(null)
  const [replayIndex, setReplayIndex] = useState(0)
  const [replayDone, setReplayDone] = useState(false)
  const timerRef = useRef(null)

  const liveKeysRef = useRef({}) // key -> step index

  const addStep = (label) => { if (sessionMode) return; setSteps((s) => [...s, label]) }

  const setLiveStep = (key, label) => {
    if (sessionMode) return
    setSteps((prev) => {
      const idx = liveKeysRef.current[key]
      if (idx != null && idx < prev.length) {
        const next = prev.slice()
        next[idx] = label
        return next
      }
      liveKeysRef.current[key] = prev.length
      return [...prev, label]
    })
  }

  const commitLiveStep = (key) => {
    delete liveKeysRef.current[key]
  }

  const resetSandbox = () => {
    setSteps([])
    setPage('home')
    setAddressValue('')
    setQuery('')
    setFormData(INITIAL_FORM)
    setLoginEmail('')
    setLoginPassword('')
    setCaptured([])
    liveKeysRef.current = {}
  }

  const handleSignIn = ({ email, password, remember, provider }) => {
    setPage('loggedIn')
    setAddressValue('https://app.example.com/dashboard')
    const items = []
    if (provider) {
      items.push({ kind: 'sso', label: `${provider} SSO`, detail: email })
    } else {
      items.push({ kind: 'creds', label: 'Saved credentials', detail: email || 'user@company.com' })
    }
    items.push({ kind: 'cookie', label: 'Session cookie', detail: 'acme_sess_84f…c1e' })
    items.push({ kind: 'mfa', label: 'MFA token', detail: 'Trusted device · 30 days' })
    setCaptured(items)
  }

  const handleStart = () => {
    resetSandbox()
    if (sessionMode) {
      setAddressValue(SESSION_LOGIN_URL)
      setPage('login')
    }
    setPhase('recording')
  }
  const handleFinish = () => {
    if (!sessionMode) setSteps(HARDCODED_STEPS)
    liveKeysRef.current = {}
    setPhase('finished')
  }
  const handleDelete = () => {
    setPhase('idle')
    resetSandbox()
  }

  const navigateTo = (newPage, newUrl) => {
    setPage(newPage)
    setAddressValue(newUrl)
  }

  const submitAddressBar = () => {
    if (phase !== 'recording') return
    const v = addressValue.trim()
    if (!v) return
    const isUrl = /^https?:\/\//.test(v) || /\.[a-z]{2,}(\/|$)/i.test(v)
    const url = isUrl
      ? (v.startsWith('http') ? v : `https://${v}`)
      : `https://www.google.com/search?q=${encodeURIComponent(v)}`
    setQuery(isUrl ? v : v)
    setAddressValue(url)
    setPage('results')
    addStep(`Navigate to ${url}`)
  }

  const startReplay = (stepsToReplay) => {
    if (!stepsToReplay || stepsToReplay.length === 0) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setReplaySteps(stepsToReplay)
    setReplayIndex(0)
    setReplayDone(false)
  }

  const stopReplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setReplaySteps(null)
    setReplayIndex(0)
    setReplayDone(false)
  }

  useEffect(() => {
    if (!replaySteps) return
    if (replayIndex >= replaySteps.length) {
      setReplayDone(true)
      return
    }
    timerRef.current = setTimeout(() => {
      setReplayIndex((i) => i + 1)
    }, 1400)
    return () => clearTimeout(timerRef.current)
  }, [replaySteps, replayIndex])

  const replaying = !!replaySteps && !replayDone
  const currentReplayStep =
    replaySteps && replaySteps[Math.min(replayIndex, replaySteps.length - 1)]
  const replayUrl = replaying && currentReplayStep ? extractUrl(currentReplayStep) : null

  // Compute what the address bar shows / is editable
  const addressEditable = phase === 'recording' && !replaying
  let addressDisplay
  if (replaying && replayUrl) {
    addressDisplay = replayUrl.replace(/^https?:\/\//, '')
  } else if (phase === 'recording' || phase === 'finished') {
    addressDisplay = (addressValue || '').replace(/^https?:\/\//, '')
  } else {
    addressDisplay = DEFAULT_URL
  }

  const showFakeSite = (phase === 'recording' || phase === 'finished') && !replaying
  const showInstructions = phase === 'idle' && !replaying

  return (
    <div
      data-modal-root
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[1000] flex items-stretch justify-center bg-black/20 backdrop-blur-sm p-10"
    >
      <div className="flex w-full max-w-[1360px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        {/* Modal header */}
        <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-hairline px-[18px] py-3.5">
          <div className="flex items-center gap-2 text-[15px] font-semibold">
            <span className="text-muted">
              <Globe size={18} />
            </span>
            {mode === 'session' ? 'Browser Session Recorder' : 'Browser Navigation Recorder'}
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-hairline bg-gray-50 px-2 py-1 text-[12px] text-muted">
            <span className={'h-1.5 w-1.5 rounded-full ' + (session?.status === 'expiring' ? 'bg-amber-500' : 'bg-emerald-500')} />
            <span className="text-muted">Session:</span>
            <span className="font-medium text-ink">{session?.name || 'New browser session'}</span>
          </div>
          <div
            onClick={onClose}
            className="ml-auto flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-gray-100"
          >
            <X size={18} />
          </div>
        </div>

        {/* Fake Chrome browser */}
        <div className="flex min-h-0 flex-1 flex-col bg-[#f1f3f4]">
          {/* Tab strip */}
          <div className="flex items-end gap-1 bg-[#dfe1e5] px-2.5 pt-2">
            <div className="flex max-w-[220px] items-center gap-2 rounded-t-lg bg-[#f1f3f4] px-3 py-2 text-xs text-[#3c4043]">
              <span className="flex-shrink-0 text-[#5f6368]">
                <Globe size={14} />
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                Stack AI — Sandbox
              </span>
              <span className="cursor-pointer text-[#5f6368]">
                <X size={12} sw={2.5} />
              </span>
            </div>
            <div className="mb-1 flex h-7 w-7 cursor-pointer items-center justify-center self-center text-[#5f6368]">
              <Plus size={14} />
            </div>
          </div>

          {/* Toolbar */}
          <div className="relative flex items-center gap-2 bg-[#f1f3f4] px-3 py-2">
            <NavBtn>
              <ArrowLeft size={18} />
            </NavBtn>
            <NavBtn disabled>
              <ArrowRight size={18} />
            </NavBtn>
            <NavBtn>
              <Refresh size={16} />
            </NavBtn>

            <div className="flex flex-1 items-center gap-2.5 rounded-[20px] bg-white px-3.5 py-[7px] text-[13px] text-[#3c4043]">
              <div className="flex items-center gap-1.5 rounded-[14px] bg-[#e8eaed] px-2 py-0.5 text-[11.5px] text-[#3c4043]">
                <Lock size={12} />
                https
              </div>
              {addressEditable ? (
                <input
                  value={addressDisplay}
                  onChange={(e) => setAddressValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      submitAddressBar()
                    }
                  }}
                  placeholder="Search Google or type a URL"
                  className="flex-1 bg-transparent text-[13px] text-[#3c4043] outline-none placeholder:text-gray-400"
                />
              ) : (
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {addressDisplay}
                </span>
              )}
              <span className="cursor-pointer text-[#5f6368]">
                <Sparkle size={16} />
              </span>
              <span className="cursor-pointer text-[#5f6368]">
                <SquarePlus size={16} />
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              <ExtIcon title="Reading list">
                <Search size={16} />
              </ExtIcon>
              <ExtIcon title="Bookmark">
                <Sparkle size={16} />
              </ExtIcon>
              <ExtIcon
                title="Stack AI Recorder"
                active={recorderOpen}
                onClick={() => setRecorderOpen((o) => !o)}
              >
                <StackAILogo size={20} />
              </ExtIcon>
              <ExtIcon title="Extensions">
                <Puzzle size={16} />
              </ExtIcon>
              <ExtIcon title="Profile">
                <User size={16} />
              </ExtIcon>
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#1a73e8] text-[11px] font-semibold text-white">
              D
            </div>

            {/* Blinking pointer to the extension — hidden once opened */}
            {!recorderOpen && (
              <div className="pointer-events-none absolute right-[108px] top-[46px] z-[5] flex animate-bob flex-col items-end gap-1.5">
                <span className="mr-[11px] text-[#2563eb]">
                  <ArrowUp width={22} height={24} />
                </span>
                <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#1a1a1a] px-3 py-2 text-[13px] font-medium text-white shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                  <span>Click</span>
                  <span
                    className="inline-flex"
                    style={{
                      filter:
                        'drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff)',
                    }}
                  >
                    <StackAILogo size={18} />
                  </span>
                  <span>to open the recorder</span>
                </div>
              </div>
            )}
          </div>

          {/* Viewport + optional recorder side panel */}
          <div className="flex min-h-0 flex-1">
            <div className="flex min-h-0 flex-1 overflow-auto bg-white px-12 pb-12 pt-10 text-[#202124]">
              {replaying || replayDone ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-[15px] text-gray-500">
                    This would be replaying browser
                  </div>
                </div>
              ) : sessionMode && showFakeSite ? (
                <div className="flex-1">
                  <SessionLoginPage
                    signedIn={page === 'loggedIn'}
                    email={loginEmail}
                    setEmail={setLoginEmail}
                    password={loginPassword}
                    setPassword={setLoginPassword}
                    onSignIn={handleSignIn}
                  />
                </div>
              ) : sessionMode && showInstructions ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-sm text-gray-400">Click "Start capturing session" to begin</div>
                </div>
              ) : showFakeSite ? (
                <div className="flex-1">
                  <FakeSite
                    page={page}
                    query={query}
                    formData={formData}
                    setFormData={setFormData}
                    onStep={addStep}
                    onLiveStep={setLiveStep}
                    onCommitLive={commitLiveStep}
                    onNavigate={navigateTo}
                  />
                </div>
              ) : showInstructions ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-sm text-gray-400">Browser Navigation</div>
                </div>
              ) : null}
            </div>

            {recorderOpen && (
              <WorkflowRecorderPanel
                mode={mode}
                captured={captured}
                onClose={() => setRecorderOpen(false)}
                onReplay={startReplay}
                onStopReplay={stopReplay}
                onSaveRecording={onSaveRecording}
                session={session}
                phase={phase}
                steps={steps}
                onStart={handleStart}
                onFinish={handleFinish}
                onDelete={handleDelete}
                replaying={replaying}
                replayIndex={replayIndex}
                replayDone={replayDone}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReplayView({ steps, currentIndex, done }) {
  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-6 flex items-center justify-center gap-2">
        {done ? (
          <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12.5px] font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Replay complete
          </span>
        ) : (
          <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[12.5px] font-semibold text-blue-700">
            <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-blue-200 border-t-blue-600" />
            Replaying workflow…
          </span>
        )}
      </div>
      <h2 className="mb-6 text-center text-[22px] font-bold text-ink">
        {done ? 'Workflow replayed successfully' : 'Executing recorded steps'}
      </h2>
      {steps.map((step, i) => {
        const state = done || i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending'
        return (
          <div
            key={i}
            className={
              'mb-3 flex items-center gap-3.5 rounded-[10px] px-[18px] py-3.5 text-sm transition-colors ' +
              (state === 'active'
                ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-200'
                : state === 'done'
                ? 'bg-emerald-50/60 text-emerald-900'
                : 'bg-[#f6f7f9] text-gray-500')
            }
          >
            <span
              className={
                'flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ' +
                (state === 'active'
                  ? 'bg-blue-600 text-white'
                  : state === 'done'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-600')
              }
            >
              {state === 'done' ? '✓' : i + 1}
            </span>
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {step}
            </span>
            {state === 'active' && (
              <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-blue-200 border-t-blue-600" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function NavBtn({ disabled, children }) {
  return (
    <div
      className={
        'flex h-8 w-8 items-center justify-center rounded-full ' +
        (disabled
          ? 'cursor-default text-[#bdc1c6]'
          : 'cursor-pointer text-[#5f6368] hover:bg-[#e6e8eb]')
      }
    >
      {children}
    </div>
  )
}
