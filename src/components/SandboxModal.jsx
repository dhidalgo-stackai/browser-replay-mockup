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

const HARDCODED_STEPS = [
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
]

function extractUrl(step) {
  const m = step.match(/https?:\/\/\S+/)
  return m ? m[0] : step
}

export default function SandboxModal({ onClose, onSaveRecording }) {
  const [recorderOpen, setRecorderOpen] = useState(false)

  // Recording state (lifted from panel)
  const [phase, setPhase] = useState('idle') // 'idle' | 'recording' | 'finished'
  const [steps, setSteps] = useState([])

  // Fake browser state
  const [page, setPage] = useState('home') // 'home' | 'results' | 'form1' | 'form2' | 'done'
  const [addressValue, setAddressValue] = useState('')
  const [query, setQuery] = useState('')
  const [formData, setFormData] = useState(INITIAL_FORM)

  // Replay state
  const [replaySteps, setReplaySteps] = useState(null)
  const [replayIndex, setReplayIndex] = useState(0)
  const [replayDone, setReplayDone] = useState(false)
  const timerRef = useRef(null)

  const liveKeysRef = useRef({}) // key -> step index

  const addStep = (label) => setSteps((s) => [...s, label])

  const setLiveStep = (key, label) => {
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
    liveKeysRef.current = {}
  }

  const handleStart = () => {
    resetSandbox()
    setPhase('recording')
  }
  const handleFinish = () => {
    setSteps(HARDCODED_STEPS)
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
            Browser Navigation Sandbox
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
                <div className="flex flex-1 items-center justify-center pt-10">
                  <div className="w-full max-w-[520px]">
                    <h2 className="mb-6 text-center text-[22px] font-bold text-ink">
                      How to record the browser navigation?
                    </h2>
                    {STEPS.map((step, i) => (
                      <div
                        key={i}
                        className="mb-3 flex items-center gap-3.5 rounded-[10px] bg-[#f6f7f9] px-[18px] py-3.5 text-sm text-gray-700"
                      >
                        <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                          {i + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {recorderOpen && (
              <WorkflowRecorderPanel
                onClose={() => setRecorderOpen(false)}
                onReplay={startReplay}
                onStopReplay={stopReplay}
                onSaveRecording={onSaveRecording}
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
