import { useState, useEffect } from 'react'
import { StackAILogo, X, ChevronDown, ChevronUp, InfoCircle, ListView, Play } from './icons.jsx'

function TrashIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

function RestartIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

function ExternalLinkIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function PencilIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}

// Extension side panel opened by clicking the Stack AI icon in the fake Chrome
// toolbar.

function HeaderIconBtn({ children, onClick, title }) {
  return (
    <div
      title={title}
      onClick={onClick}
      className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100"
    >
      {children}
    </div>
  )
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  )
}

function NavigateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function StepRow({ index, label, last, onEdit, state = 'idle' }) {
  const isDone = state === 'done'
  const isActive = state === 'active'
  const showEdit = /^(Type|Select)\b/.test(label)
  return (
    <div className="group relative flex items-center gap-2.5 pb-2.5 last:pb-0">
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
        {showEdit && (
          <button
            onClick={onEdit}
            title="Edit step"
            className="pointer-events-none flex flex-shrink-0 cursor-pointer items-center justify-center text-gray-500 opacity-0 transition-opacity hover:text-ink group-hover:pointer-events-auto group-hover:opacity-100"
          >
            <PencilIcon size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

function ListeningRow() {
  return (
    <div className="relative flex items-center gap-2.5">
      <span className="relative z-10 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center">
        <span className="h-[14px] w-[14px] animate-spin rounded-full border-[1.5px] border-gray-200 border-t-brand" />
      </span>
      <span className="text-[12.5px] italic text-muted">
        Listening for actions...
      </span>
    </div>
  )
}

function CollapsibleSection({ icon, label, trailing, defaultOpen = true, contentClassName = '', fill = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={fill ? 'flex min-h-0 flex-1 flex-col' : undefined}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex flex-shrink-0 cursor-pointer select-none items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 text-[13px] text-ink"
      >
        {icon && <span className="flex items-center text-gray-600">{icon}</span>}
        {label}
        <span className="ml-auto flex items-center gap-1.5 text-gray-400">
          {trailing}
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>
      {open && (
        <div className={`${fill ? 'min-h-0 flex-1 overflow-y-auto' : ''} border-b border-gray-100 px-4 pb-4 pt-3 ${contentClassName}`}>{children}</div>
      )}
    </div>
  )
}

function CheckIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function extractInputsFromSteps(steps) {
  const inputs = []
  const seen = new Set()
  for (const step of steps) {
    let m = step.match(/^Type "([^"]*)" into "([^"]+)"$/)
    if (m) {
      const [, value, label] = m
      if (!seen.has(label)) { seen.add(label); inputs.push({ label, value }) }
      continue
    }
    m = step.match(/^Select "([^"]*)" in "([^"]+)"$/)
    if (m) {
      const [, value, label] = m
      if (!seen.has(label)) { seen.add(label); inputs.push({ label, value }) }
    }
  }
  return inputs
}

function SaveWorkflowModal({ onClose, onSave, stepCount }) {
  const [name, setName] = useState('Google Search — Stack AI')
  const [description, setDescription] = useState(
    'Navigates to Google and searches for "stack ai".',
  )
  const [download, setDownload] = useState(false)

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
    >
      <div className="w-full overflow-hidden rounded-[14px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="border-b border-hairline px-5 py-3.5 text-[14px] font-semibold text-ink">
          Name your recording
        </div>

        <div className="max-h-[360px] overflow-y-auto px-5 pb-4 pt-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-medium text-ink">
                Steps
              </div>
              <div className="text-[11.5px] text-muted">
                {stepCount} {stepCount === 1 ? 'step' : 'steps'} captured
              </div>
            </div>
            <button
              onClick={() => { window.open('#/browser-automation/recording', '_blank', 'noopener') }}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11.5px] font-medium text-ink hover:bg-gray-50"
            >
              Edit steps
            </button>
          </div>

          <label className="mb-1 block text-[11.5px] text-muted">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Flight Search and Price Extraction"
            className="mb-2.5 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[12.5px] text-ink outline-none placeholder:text-gray-400 focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
          />

          <label className="mb-1 block text-[11.5px] text-muted">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Describe what this workflow does..."
            className="mb-3 w-full resize-none rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[12.5px] text-ink outline-none placeholder:text-gray-400 focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
          />

          <label
            onClick={() => setDownload((d) => !d)}
            className="flex cursor-pointer items-center gap-2 text-[12px] text-muted"
          >
            <span
              className={
                'flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded-[3px] border ' +
                (download
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-300 bg-white text-transparent')
              }
            >
              <CheckIcon size={9} />
            </span>
            Also download a copy
            <span className="group relative inline-flex items-center">
              <span
                className="flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-gray-300 text-[9px] font-semibold text-gray-400"
                aria-label="What does download a copy mean?"
              >
                i
              </span>
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-normal text-white shadow-lg group-hover:block">
                Saves a .json file of this recording to your device
              </span>
            </span>
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-hairline bg-gray-50 px-5 py-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg px-3 py-2 text-[12.5px] font-medium text-muted hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ name, description, download })}
            disabled={!name.trim()}
            className="cursor-pointer rounded-lg bg-ink px-3.5 py-2 text-[12.5px] font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save recording
          </button>
        </div>
      </div>
    </div>
  )
}

function RecordingTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="tabular-nums">{formatTime(seconds)}</span>
}

function PrimaryActions({ phase, onStart, onFinish, onSave, onReplay, onStopReplay, onDelete, timerKey, stepCount, replaying }) {
  let topRow
  if (phase === 'idle') {
    topRow = (
      <button
        onClick={onStart}
        className="flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-ink px-3 text-[13px] font-medium text-white hover:opacity-90"
      >
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Start Recording
      </button>
    )
  } else if (phase === 'recording') {
    topRow = (
      <div className="flex items-center gap-1.5">
        <button
          onClick={onDelete}
          title="Delete recording"
          className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-ink"
        >
          <TrashIcon size={15} />
        </button>
        <button
          onClick={onFinish}
          className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500 px-3 text-[13px] font-semibold text-white hover:bg-red-600"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
            <span className="h-2 w-2 rounded-[1px] bg-white" />
          </span>
          Stop
          <RecordingTimer key={timerKey} />
        </button>
      </div>
    )
  } else {
    topRow = (
      <div className="flex items-center gap-2">
        <button
          onClick={onDelete}
          title="Delete recording"
          className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-ink"
        >
          <TrashIcon size={15} />
        </button>
        <button
          onClick={replaying ? onStopReplay : onReplay}
          className="h-8 w-[84px] flex-shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-medium text-ink hover:bg-gray-50"
        >
          {replaying ? 'Stop' : 'Rewatch'}
        </button>
        <button
          onClick={onSave}
          className="h-8 flex-1 cursor-pointer rounded-lg bg-ink px-3 text-[13px] font-medium text-white hover:opacity-90"
        >
          Save
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      {topRow}
      {phase === 'finished' ? (
        <button
          onClick={() => { window.open('#/browser-automation/recording', '_blank', 'noopener') }}
          className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-[12.5px] font-medium text-gray-600 hover:text-ink"
        >
          Edit steps
          <ExternalLinkIcon size={12} />
        </button>
      ) : phase === 'recording' ? (
        <div className="flex h-8 items-center justify-center text-[11.5px] text-muted">
          {stepCount} {stepCount === 1 ? 'step' : 'steps'} captured
        </div>
      ) : phase === 'idle' ? (
        <div className="flex h-8 items-center justify-center text-[11.5px] text-muted">
          Perform actions in the browser to capture steps
        </div>
      ) : (
        <div aria-hidden className="h-8" />
      )}
    </div>
  )
}

export default function WorkflowRecorderPanel({
  onClose,
  onReplay,
  onStopReplay,
  onSaveRecording,
  phase,
  steps,
  onStart,
  onFinish,
  onDelete,
  replaying = false,
  replayIndex = 0,
  replayDone = false,
}) {
  const [saveOpen, setSaveOpen] = useState(false)
  const [recordingId, setRecordingId] = useState(0)
  const recording = phase === 'recording'
  const finished = phase === 'finished'

  return (
    <div
      role="dialog"
      aria-label="Workflow Recorder"
      className="relative flex w-[340px] flex-shrink-0 flex-col overflow-hidden border-l border-hairline bg-white"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 pb-2.5 pt-3.5">
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-gray-100 text-ink">
          <StackAILogo size={15} />
        </div>
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
          Workflow Recorder
        </div>
        <div className="ml-1 flex gap-0.5">
          <HeaderIconBtn title="Pin panel">
            <PinIcon />
          </HeaderIconBtn>
          <HeaderIconBtn title="Close" onClick={onClose}>
            <X size={16} />
          </HeaderIconBtn>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto border-b border-gray-100 px-4 pb-4 pt-3 bg-gray-50/70">
          {phase === 'idle' && (
            <div className="rounded-lg border border-dashed border-gray-200 px-3 py-5 text-center text-[12px] text-muted">
              No steps yet. Start a recording to capture your workflow.
            </div>
          )}
          {(recording || finished) && (
            <div className="flex min-h-full flex-col">
              <div className="flex-1">
                {steps.length === 0 && recording && (
                  <div className="mb-2.5 rounded-lg border border-dashed border-gray-200 bg-white/60 px-3 py-4 text-center text-[12px] text-muted">
                    Interact with the browser to capture steps.
                  </div>
                )}
                {steps.map((step, i) => {
                  let state = 'idle'
                  if (replayDone) state = 'done'
                  else if (replaying) {
                    if (i < replayIndex) state = 'done'
                    else if (i === replayIndex) state = 'active'
                    else state = 'idle'
                  }
                  return (
                    <StepRow
                      key={i}
                      index={i + 1}
                      label={step}
                      last={finished && i === steps.length - 1}
                      onEdit={() => {
                        const url = `${window.location.origin}${window.location.pathname}#/browser-automation/recording`
                        window.open(url, '_blank', 'noopener,noreferrer')
                      }}
                      state={state}
                    />
                  )
                })}
                {recording && <ListeningRow />}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3">
        <PrimaryActions
          phase={phase}
          timerKey={recordingId}
          stepCount={steps.length}
          onStart={() => {
            setRecordingId((n) => n + 1)
            onStart && onStart()
          }}
          onFinish={onFinish}
          onSave={() => setSaveOpen(true)}
          onReplay={() => onReplay && onReplay(steps)}
          onStopReplay={onStopReplay}
          replaying={replaying}
          onDelete={onDelete}
        />
      </div>

      {saveOpen && (
        <SaveWorkflowModal
          onClose={() => setSaveOpen(false)}
          stepCount={steps.length}
          onSave={({ name }) => {
            setSaveOpen(false)
            const inputs = extractInputsFromSteps(steps)
            onDelete && onDelete()
            if (onSaveRecording) onSaveRecording({ name, inputs })
          }}
        />
      )}
    </div>
  )
}
