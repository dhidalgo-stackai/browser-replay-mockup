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
  StackAILogo,
} from './icons.jsx'

const STEPS = [
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
  if (m) return m[0]
  if (/First name|Last name|Country|Role|Next/.test(step))
    return 'https://forms.example.com/contact'
  if (/Full name|agree|Submit/.test(step))
    return 'https://forms.example.com/confirm'
  return step
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

function ExtIcon({ title, children, active = false }) {
  return (
    <div
      title={title}
      className={
        'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#5f6368] hover:bg-[#e6e8eb] ' +
        (active ? 'bg-[#e6e8eb]' : '')
      }
    >
      {children}
    </div>
  )
}

function CheckIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function NavigateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function StepRow({ label, last, state }) {
  const isDone = state === 'done'
  const isActive = state === 'active'
  return (
    <div className="relative flex items-center gap-2.5 pb-2.5 last:pb-0">
      {!last && (
        <span className="absolute left-[11px] top-[22px] bottom-0 w-px bg-gray-200" />
      )}
      <span
        className={
          'relative z-10 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border ' +
          (isDone
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : isActive
            ? 'border-blue-500 bg-white text-blue-600'
            : 'border-gray-200 bg-white text-gray-500')
        }
      >
        {isDone ? (
          <CheckIcon size={12} />
        ) : isActive ? (
          <span className="h-[10px] w-[10px] animate-spin rounded-full border-[1.5px] border-blue-200 border-t-blue-600" />
        ) : (
          <NavigateIcon />
        )}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-ink">
          {label}
        </span>
      </div>
    </div>
  )
}

export default function ReplayModal({ onClose, flowName = 'Flow' }) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (done) return
    if (index >= STEPS.length) {
      setDone(true)
      return
    }
    timerRef.current = setTimeout(() => setIndex(i => i + 1), 1200)
    return () => clearTimeout(timerRef.current)
  }, [index, done])

  const currentUrl = extractUrl(STEPS[Math.min(index, STEPS.length - 1)])
  const addressDisplay = currentUrl.replace(/^https?:\/\//, '')

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIndex(0)
    setDone(false)
  }

  return (
    <div
      data-modal-root
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[1000] flex items-stretch justify-center bg-black/45 p-10"
    >
      <div className="flex w-full max-w-[1360px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-hairline px-[18px] py-3.5">
          <div className="flex items-center gap-2 text-[15px] font-semibold">
            <span className="text-muted"><Globe size={18} /></span>
            Replaying — {flowName}
          </div>
          <div className="ml-3">
            {done ? (
              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Replay complete
              </span>
            ) : (
              <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-700">
                <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-blue-200 border-t-blue-600" />
                Replaying workflow…
              </span>
            )}
          </div>
          <div
            onClick={onClose}
            className="ml-auto flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-gray-100"
          >
            <X size={18} />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col bg-[#f1f3f4]">
          <div className="flex items-end gap-1 bg-[#dfe1e5] px-2.5 pt-2">
            <div className="flex max-w-[220px] items-center gap-2 rounded-t-lg bg-[#f1f3f4] px-3 py-2 text-xs text-[#3c4043]">
              <span className="flex-shrink-0 text-[#5f6368]"><Globe size={14} /></span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">Stack AI — Replay</span>
              <span className="cursor-pointer text-[#5f6368]"><X size={12} sw={2.5} /></span>
            </div>
            <div className="mb-1 flex h-7 w-7 cursor-pointer items-center justify-center self-center text-[#5f6368]">
              <Plus size={14} />
            </div>
          </div>

          <div className="relative flex items-center gap-2 bg-[#f1f3f4] px-3 py-2">
            <NavBtn><ArrowLeft size={18} /></NavBtn>
            <NavBtn disabled><ArrowRight size={18} /></NavBtn>
            <NavBtn><Refresh size={16} /></NavBtn>

            <div className="flex flex-1 items-center gap-2.5 rounded-[20px] bg-white px-3.5 py-[7px] text-[13px] text-[#3c4043]">
              <div className="flex items-center gap-1.5 rounded-[14px] bg-[#e8eaed] px-2 py-0.5 text-[11.5px] text-[#3c4043]">
                <Lock size={12} />
                https
              </div>
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {addressDisplay}
              </span>
              <span className="cursor-pointer text-[#5f6368]"><Sparkle size={16} /></span>
              <span className="cursor-pointer text-[#5f6368]"><SquarePlus size={16} /></span>
            </div>

            <div className="flex items-center gap-0.5">
              <ExtIcon title="Reading list"><Search size={16} /></ExtIcon>
              <ExtIcon title="Bookmark"><Sparkle size={16} /></ExtIcon>
              <ExtIcon title="Stack AI Recorder" active><StackAILogo size={20} /></ExtIcon>
              <ExtIcon title="Extensions"><Puzzle size={16} /></ExtIcon>
              <ExtIcon title="Profile"><User size={16} /></ExtIcon>
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#1a73e8] text-[11px] font-semibold text-white">D</div>
          </div>

          <div className="flex min-h-0 flex-1">
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-white px-12 pb-12 pt-10 text-[#202124]">
              <div className="text-[15px] text-gray-500">
                {done ? 'Workflow replayed successfully' : 'Replaying browser…'}
              </div>
            </div>

            <div className="relative flex w-[340px] flex-shrink-0 flex-col overflow-hidden border-l border-hairline bg-white">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 pb-2.5 pt-3.5">
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-gray-100 text-ink">
                  <StackAILogo size={15} />
                </div>
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
                  Replay Steps
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto border-b border-gray-100 bg-gray-50/70 px-4 pb-4 pt-3">
                {STEPS.map((step, i) => {
                  let state = 'idle'
                  if (done || i < index) state = 'done'
                  else if (i === index) state = 'active'
                  return (
                    <StepRow
                      key={i}
                      label={step}
                      last={i === STEPS.length - 1}
                      state={state}
                    />
                  )
                })}
              </div>

              <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3">
                {done ? (
                  <div className="flex gap-2">
                    <button
                      onClick={restart}
                      className="h-8 flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-medium text-ink hover:bg-gray-50"
                    >
                      Rewatch
                    </button>
                    <button
                      onClick={onClose}
                      className="h-8 flex-1 cursor-pointer rounded-lg bg-ink px-3 text-[13px] font-medium text-white hover:opacity-90"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="flex h-8 items-center justify-center text-[11.5px] text-muted">
                    Step {Math.min(index + 1, STEPS.length)} of {STEPS.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
