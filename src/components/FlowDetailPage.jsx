import { useState, useEffect, useRef } from 'react'
import LeftRail from './LeftRail.jsx'
import ReplayModal from './ReplayModal.jsx'
import Tooltip from './Tooltip.jsx'
import {
  Folder, Gear, Save, Play, ChevronDown, Kebab, Plus, X,
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
const IcCalendar = (p) => <Ic {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></Ic>
const IcHash = (p) => <Ic {...p}><path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18" /></Ic>
const IcTarget = (p) => <Ic {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></Ic>

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

function BrowserFrame({ children }) {
  return (
    <div className="pointer-events-none flex h-[80px] w-[140px] flex-none flex-col overflow-hidden rounded-md bg-white">
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
      <div className="flex h-full flex-col gap-[3px] px-1.5 py-1">
        <div className="text-[5px] text-gray-500">{chip.slice(0, 24)}</div>
        <div className="text-[6px] font-medium leading-tight text-[#1a0dab] underline decoration-[0.5px]">
          {chip.length > 30 ? chip.slice(0, 30) + '…' : chip}
        </div>
        <div className="text-[5px] leading-[6px] text-gray-500">
          Trusted forms for teams building workflows online today.
        </div>
      </div>
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
            className="anim-pop absolute left-0 top-[calc(100%+4px)] z-10 w-[200px] overflow-hidden rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
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

const ON_ERROR_OPTIONS = [
  ['agent',  'Agent intervenes', 'Agent analyzes the failure and decides how to recover.'],
  ['stop',   'Stop workflow',    'Fail the run immediately.'],
  ['skip',   'Skip step',        'Continue to the next step.'],
  ['human',  'Human in the loop','Pause and request human review before continuing.'],
]

function onErrorLabel(id) {
  const opt = ON_ERROR_OPTIONS.find(o => o[0] === id)
  return opt ? opt[1] : id
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        'relative h-[22px] w-[38px] flex-none cursor-pointer rounded-full transition-colors ' +
        (checked ? 'bg-ink' : 'bg-gray-200')
      }
    >
      <span
        className={
          'absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all ' +
          (checked ? 'left-[18px]' : 'left-[2px]')
        }
      />
    </button>
  )
}

function Slider({ value, min, max, step = 1, onChange }) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-ink"
    />
  )
}

function OnErrorDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
        className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-hairline bg-white px-3 text-[13px] text-ink hover:bg-gray-50"
      >
        <span>{onErrorLabel(value)}</span>
        <IcCaret size={12} className="ml-auto text-gray-400" />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="anim-pop absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-md border border-hairline bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
        >
          {ON_ERROR_OPTIONS.map(([id, name, desc]) => (
            <button
              key={id}
              type="button"
              onClick={() => { onChange(id); setOpen(false) }}
              className={
                'flex w-full cursor-pointer flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-gray-50 ' +
                (value === id ? 'bg-gray-50' : '')
              }
            >
              <span className="text-[12.5px] font-medium text-ink">{name}</span>
              <span className="text-[11.5px] text-muted">{desc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FailurePolicyControls({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })
  const desc = ON_ERROR_OPTIONS.find(o => o[0] === value.onError)?.[2]
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2">
          <span className="text-[13px] font-medium text-ink [text-decoration:underline_dotted] underline-offset-[6px] decoration-gray-300">
            On Error
          </span>
        </div>
        <OnErrorDropdown value={value.onError} onChange={(v) => set({ onError: v })} />
        {desc && (
          <div className="mt-1.5 text-[11.5px] text-muted">{desc}</div>
        )}
      </div>
      {value.onError === 'agent' && (
        <div>
          <div className="mb-2">
            <span className="text-[13px] font-medium text-ink [text-decoration:underline_dotted] underline-offset-[6px] decoration-gray-300">
              Prompt
            </span>
            <span className="ml-1.5 text-[11.5px] text-muted">What should the agent do?</span>
          </div>
          <textarea
            value={value.agentPrompt || ''}
            onChange={(e) => set({ agentPrompt: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            rows={3}
            placeholder="Describe how the agent should recover from a failure at this step."
            className="w-full resize-y rounded-md border border-hairline bg-white px-3 py-2 text-[13px] text-ink outline-none placeholder:text-gray-400 focus:border-gray-300"
          />
        </div>
      )}
    </div>
  )
}

function policyEqual(a, b) {
  return a.retry === b.retry && a.maxRetries === b.maxRetries &&
    a.retryInterval === b.retryInterval && a.onError === b.onError
}

function policySummary(p) {
  const parts = []
  parts.push(p.retry ? `Retry ×${p.maxRetries}` : 'No retry')
  parts.push(onErrorLabel(p.onError).toLowerCase())
  return parts.join(' · ')
}

function StepItem({ step, stepId, stepNumber, boundInput, boundInputType, defaults, availableInputs = [], onOpenSettings }) {
  const { verb, prefix, chip } = stepParts(step)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [override, setOverride] = useState(null)
  const [overrideVisible, setOverrideVisible] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const literalMatch = prefix.match(/^"([^"]+)"/)
  const capturedLiteral = literalMatch ? literalMatch[1] : (verb === 'Select' && chip ? chip : '')
  const defaultSource = boundInput ? 'input' : 'fixed'
  const [valueSource, setValueSource] = useState(defaultSource)
  const [boundInputName, setBoundInputName] = useState(boundInput || (availableInputs[0]?.name ?? ''))
  const [fixedValue, setFixedValue] = useState(capturedLiteral)
  const [sourceMenuOpen, setSourceMenuOpen] = useState(false)
  const [inputMenuOpen, setInputMenuOpen] = useState(false)
  const valueDirty = valueSource !== defaultSource ||
    (valueSource === 'input' && boundInputName !== boundInput) ||
    (valueSource === 'fixed' && fixedValue !== capturedLiteral)
  const showsValue = verb === 'Type' || verb === 'Select'
  const policy = override || defaults
  const isOverridden = override != null && !policyEqual(override, defaults)
  const displayInput = valueSource === 'input' ? boundInputName : null
  const displayType = displayInput ? (availableInputs.find(x => x.name === displayInput)?.type || boundInputType) : boundInputType
  const displayLiteral = valueSource === 'fixed' ? fixedValue : capturedLiteral
  return (
    <section
      id={stepId}
      className="group scroll-mt-24 rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-gray-300"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setPolicyOpen(o => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPolicyOpen(o => !o) } }}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2 pl-3 pr-3 text-left"
      >
        <span className="w-5 flex-none text-center text-[11px] tabular-nums text-gray-400">{stepNumber}</span>
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-hairline bg-white text-muted shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
          {stepIcon(verb)}
        </span>
        <span className="text-[13px] font-medium text-ink">{verb}</span>
        {showsValue && displayInput ? (
          <>
            <span
              className="inline-flex items-center gap-1 rounded-md border border-hairline bg-gray-50 px-2 py-0.5 text-[12px] text-ink"
            >
              {(() => {
                const I = displayType === 'select' ? IcSelect
                  : displayType === 'boolean' ? IcCheckSq
                  : displayType === 'date' ? IcCalendar
                  : displayType === 'number' ? IcHash
                  : IcType
                return <I size={11} className="text-muted" />
              })()}
              {displayInput}
            </span>
            {chip && (
              <>
                <span className="text-[12px] text-muted">into</span>
                <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted">"{chip}"</span>
              </>
            )}
          </>
        ) : showsValue ? (
          <>
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 font-mono text-[12px] text-ink">"{displayLiteral}"</span>
            {chip && (
              <>
                <span className="text-[12px] text-muted">into</span>
                <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted">"{chip}"</span>
              </>
            )}
          </>
        ) : (
          <>
            {prefix && <span className="text-[12.5px] text-muted">{prefix}</span>}
            {chip && (
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted">
                {chip}
              </span>
            )}
          </>
        )}
        <div className="ml-auto flex flex-none items-center gap-2">
          {(isOverridden || valueDirty) && (
            <span title={valueDirty ? 'Custom value source' : 'Custom failure handling'} className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          )}
          <span
            title={policyOpen ? 'Hide settings' : 'Edit settings'}
            className={
              'flex h-6 w-6 items-center justify-center rounded-md text-muted transition-opacity ' +
              (policyOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')
            }
          >
            <IcPencil size={13} />
          </span>
          <span className="pointer-events-none flex h-7 w-7 flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white p-0">
            <span className="block scale-[0.30] origin-center">
              <StepThumbnail verb={verb} prefix={prefix} chip={chip} />
            </span>
          </span>
        </div>
      </div>
      {policyOpen && (
        <div className="anim-fade flex gap-6 rounded-b-lg border-t border-hairline bg-gray-50 px-4 py-3">
          <div className="min-w-0 flex-1">
            {showsValue && (
              <div className="mb-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-medium text-ink">Value</span>
                </div>
                <div className="relative min-w-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setInputMenuOpen(o => !o) }}
                    className="flex h-8 w-full cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2.5 text-left text-[12.5px] text-ink hover:bg-gray-50"
                  >
                    <IcType size={11} className="text-muted" />
                    <span className="truncate">{boundInputName || 'Choose input…'}</span>
                    <IcCaret size={11} className="ml-auto text-gray-400" />
                  </button>
                  {inputMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="anim-pop absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                    >
                      {availableInputs.length === 0 && (
                        <div className="px-2.5 py-2 text-[12px] text-muted">No inputs defined</div>
                      )}
                      {availableInputs.map((inp) => (
                        <button
                          key={inp.name}
                          type="button"
                          onClick={() => { setBoundInputName(inp.name); setInputMenuOpen(false) }}
                          className="flex w-full cursor-pointer items-center gap-2 px-2.5 py-1.5 text-left hover:bg-gray-50"
                        >
                          <IcType size={11} className="text-muted" />
                          <span className="text-[12.5px] font-medium text-ink">{inp.name}</span>
                          <span className="text-[11px] text-muted">· {inp.type}</span>
                          {inp.value && <span className="ml-auto truncate font-mono text-[11px] text-muted">"{inp.value}"</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 h-px w-full bg-hairline" />
              </div>
            )}
            {(isOverridden || overrideVisible) ? (
              <>
                <FailurePolicyControls value={policy} onChange={setOverride} />
                <button
                  type="button"
                  onClick={() => { setOverride(null); setOverrideVisible(false) }}
                  className="mt-3 cursor-pointer text-[11.5px] font-medium text-muted hover:text-ink"
                >
                  Reset to default
                </button>
              </>
            ) : (
              <div>
                <div className="mb-1.5 text-[12.5px] font-medium text-ink">
                  Failure handling
                </div>
                <div className="text-[12px] text-muted">
                  {policySummary(defaults)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOverrideVisible(true)}
                    className="cursor-pointer rounded-md border border-hairline bg-white px-2.5 py-1 text-[12px] font-medium text-ink hover:bg-gray-50"
                  >
                    Override for this step
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenSettings?.()}
                    className="cursor-pointer rounded-md border border-hairline bg-white px-2.5 py-1 text-[12px] font-medium text-ink hover:bg-gray-50"
                  >
                    Edit defaults
                  </button>
                </div>
              </div>
            )}
          </div>
          <Tooltip label="Captured from the last replay">
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); setPreviewOpen(true) }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setPreviewOpen(true) } }}
              className="flex h-[200px] w-[360px] flex-none cursor-pointer items-center justify-center overflow-hidden rounded-md border border-hairline bg-white p-0 hover:border-gray-300 hover:ring-2 hover:ring-gray-200 focus:outline-none"
            >
              <span className="pointer-events-none block scale-[2.5] origin-center">
                <StepThumbnail verb={verb} prefix={prefix} chip={chip} />
              </span>
            </span>
          </Tooltip>
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

function NodeRefPreview() {
  return (
    <div className="overflow-hidden rounded-md border border-hairline bg-white">
      <div className="flex gap-1 border-b border-hairline p-1">
        <div className="flex-1 rounded-sm border border-hairline bg-white px-1.5 py-0.5 text-center text-[8px] font-semibold text-ink">Nodes</div>
        <div className="flex-1 rounded-sm px-1.5 py-0.5 text-center text-[8px] text-muted">Variables</div>
      </div>
      <div className="flex flex-col gap-0.5 p-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-sm bg-ink text-white text-[6px]">✦</span>
            <span className="text-[8px] font-semibold text-ink">OpenAI Agent</span>
          </div>
          <IcCaret size={7} className="text-gray-400 rotate-180" />
        </div>
        {[
          ['citation_list', 'array'],
          ['completion', 'string'],
          ['subflow_tool_input', 'string'],
        ].map(([name, type]) => (
          <div key={name} className="flex items-center justify-between rounded-sm px-1 py-0.5 hover:bg-gray-50">
            <div className="flex items-center gap-1">
              <span className="text-[7px] text-orange-500">◇</span>
              <span className="font-mono text-[8px] text-ink">{name}</span>
            </div>
            <span className="font-mono text-[7px] text-muted">{type}</span>
          </div>
        ))}
        <div className="mt-0.5 flex items-center gap-1 px-1 py-0.5">
          <IcClock size={8} className="text-muted" />
          <span className="text-[8px] text-ink">Scheduled Execution 2</span>
        </div>
      </div>
    </div>
  )
}

function RowKebabMenu({ items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title="More"
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100"
      >
        <Kebab size={14} />
      </button>
      {open && (
        <div className="anim-pop absolute right-0 top-[calc(100%+4px)] z-20 w-[180px] overflow-hidden rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          {items.map(([k, label, action]) => (
            <button
              key={k}
              type="button"
              onClick={() => { action(); setOpen(false) }}
              className={
                'flex w-full cursor-pointer items-center px-2.5 py-1.5 text-left text-[12.5px] hover:bg-gray-50 ' +
                (k === 'delete' ? 'text-red-600' : 'text-ink')
              }
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StepMultiPicker({ selectedIds, onChange, stepOptions, onLocate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])
  const selected = stepOptions.filter(s => selectedIds.includes(s.stepId))
  const detail = selected.length === 0
    ? null
    : selected.length === 1
      ? `Step ${selected[0].stepNumber}`
      : `Steps ${selected.map(s => s.stepNumber).join(', ')}`
  const toggle = (id) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id])
  }
  const firstSelected = selected[0]
  return (
    <div className="flex flex-none items-center gap-1">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="inline-flex h-7 min-w-[140px] cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2 text-[12px] text-ink hover:bg-gray-50"
        >
          <span className="flex-1 text-left">
            <span className="text-muted">Used in </span>
            {detail
              ? <span className="text-ink">{detail}</span>
              : <span className="text-muted">…</span>}
          </span>
          <IcCaret size={11} className="text-gray-400" />
        </button>
        {open && (
          <div className="anim-pop absolute right-0 top-[calc(100%+4px)] z-20 max-h-[280px] w-[280px] overflow-y-auto rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
            {stepOptions.length === 0 && (
              <div className="px-2.5 py-2 text-[12px] text-muted">No compatible steps</div>
            )}
            {stepOptions.map(s => {
              const checked = selectedIds.includes(s.stepId)
              return (
                <button
                  key={s.stepId}
                  type="button"
                  onClick={() => toggle(s.stepId)}
                  className="flex w-full cursor-pointer items-center gap-2 px-2.5 py-1.5 text-left text-[12.5px] text-ink hover:bg-gray-50"
                >
                  <span className="w-4 flex-none tabular-nums text-[11px] text-gray-400">{s.stepNumber}</span>
                  <span className="truncate">{s.label}</span>
                  <span className="ml-auto flex h-3.5 w-3.5 flex-none items-center justify-center text-ink">
                    {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      <button
        type="button"
        disabled={!firstSelected}
        onClick={() => firstSelected && onLocate?.(firstSelected.stepId)}
        title={firstSelected ? `Scroll to step ${firstSelected.stepNumber}` : 'No step selected'}
        className={
          'flex h-7 w-7 flex-none items-center justify-center rounded-md border border-hairline bg-white ' +
          (firstSelected ? 'cursor-pointer text-muted hover:bg-gray-50 hover:text-ink' : 'cursor-not-allowed text-gray-300')
        }
      >
        <IcTarget size={13} />
      </button>
    </div>
  )
}

function SchemaRow({ input, onJumpToStep, stepOptions = [] }) {
  const [source, setSource] = useState(input.source)
  const [value, setValue] = useState(input.value)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])
  const sourceLabels = {
    fixed: 'Fixed value',
    dynamic: 'Dynamic',
    credential: 'Credential',
  }
  const [credentialList, setCredentialList] = useState([
    { name: 'NetSuite login', meta: 'Created by You, 3 days ago' },
    { name: 'Salesforce API key', meta: 'Created by You, 2 weeks ago' },
    { name: 'Gmail OAuth', meta: 'Created by You, 1 month ago' },
  ])
  const [credential, setCredential] = useState(credentialList[0].name)
  const [selectedSteps, setSelectedSteps] = useState(input.stepId ? [input.stepId] : [])
  const [credMenuOpen, setCredMenuOpen] = useState(false)
  const [credQuery, setCredQuery] = useState('')
  const [newCredOpen, setNewCredOpen] = useState(false)
  const credMenuRef = useRef(null)
  useEffect(() => {
    if (!credMenuOpen) return
    const onDown = (e) => {
      if (credMenuRef.current && !credMenuRef.current.contains(e.target)) setCredMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [credMenuOpen])
  return (
    <div id={`schema-${input.name}`} className="scroll-mt-24 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md border border-hairline bg-gray-50 px-2 py-0.5 text-[12px] text-ink">
          {(() => {
            const t = input.type
            const I = t === 'select' ? IcSelect
              : t === 'boolean' ? IcCheckSq
              : t === 'date' ? IcCalendar
              : t === 'number' ? IcHash
              : IcType
            return <I size={11} className="text-muted" />
          })()}
          {input.name}
        </span>
        <span className="text-[11px] text-muted">{input.type}</span>
        <div className="ml-auto">
          <RowKebabMenu items={[
            ['delete', 'Delete input',   () => {}],
          ]} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div ref={menuRef} className="relative flex-none">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }}
            className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2 text-[12px] text-ink hover:bg-gray-50"
          >
            {sourceLabels[source]}
            <IcCaret size={11} className="text-gray-400" />
          </button>
          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="anim-pop absolute left-0 top-[calc(100%+4px)] z-10 w-[220px] rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            >
              {[
                ['fixed', 'Fixed value', <span className="text-[11.5px] font-normal text-muted">Same value used every run.</span>],
                ['dynamic', 'Dynamic', (
                  <div className="flex flex-col">
                    <div className="border-b border-hairline bg-gray-50 p-2">
                      <NodeRefPreview />
                    </div>
                    <div className="px-2.5 py-2 text-[11.5px] font-normal text-muted">
                      Not hardcoded — the value comes from another node when used in a workflow.
                    </div>
                  </div>
                )],
                ['credential', 'Credential', <span className="text-[11.5px] font-normal text-muted">Injected from the vault, never in logs.</span>],
              ].map(([k, name, tip]) => (
                <Tooltip key={k} label={tip} side="right" width={k === 'dynamic' ? 280 : 200} className="block w-full">
                  <button
                    type="button"
                    onClick={() => { setSource(k); setMenuOpen(false) }}
                    className="flex w-full cursor-pointer items-center gap-0.5 px-2.5 py-1.5 text-left text-[12.5px] font-medium text-ink hover:bg-gray-50"
                  >
                    {name}
                  </button>
                </Tooltip>
              ))}
            </div>
          )}
        </div>
        {source === 'fixed' ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-7 min-w-0 flex-1 rounded-md border border-hairline bg-white px-2 font-mono text-[12px] text-ink outline-none focus:border-gray-300"
          />
        ) : source === 'credential' ? (
          <div ref={credMenuRef} className="relative min-w-0 flex-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCredMenuOpen(o => !o) }}
              className="flex h-7 w-full cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2 text-[12px] text-ink hover:bg-gray-50"
            >
              <IcShield size={11} className="text-muted" />
              <span className="min-w-0 flex-1 truncate text-left">{credential}</span>
              <IcCaret size={11} className="text-gray-400" />
            </button>
            {credMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="anim-pop absolute left-0 top-[calc(100%+4px)] z-10 w-[280px] overflow-hidden rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-1.5 border-b border-hairline px-2.5 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                  </svg>
                  <input
                    autoFocus
                    value={credQuery}
                    onChange={(e) => setCredQuery(e.target.value)}
                    placeholder="Search connections..."
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-muted outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setCredMenuOpen(false); setNewCredOpen(true) }}
                  className="flex w-full cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-left text-[12px] text-ink hover:bg-gray-50"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New connection
                </button>
                <button
                  type="button"
                  onClick={() => setCredMenuOpen(false)}
                  className="flex w-full cursor-pointer items-center gap-1.5 border-b border-hairline px-2.5 py-1.5 text-left text-[12px] text-ink hover:bg-gray-50"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                  Manage connections
                </button>
                <div className="max-h-[240px] overflow-y-auto py-1">
                  {credentialList
                    .filter(c => c.name.toLowerCase().includes(credQuery.toLowerCase()))
                    .map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => { setCredential(c.name); setCredMenuOpen(false); setCredQuery('') }}
                        className="flex w-full cursor-pointer flex-col items-start px-2.5 py-1.5 text-left hover:bg-gray-50"
                      >
                        <span className="flex items-center gap-1.5 text-[12px] text-ink">
                          <IcShield size={11} className="text-muted" />
                          <span className="truncate">{c.name}</span>
                        </span>
                        <span className="pl-[18px] text-[11px] text-muted">{c.meta}</span>
                      </button>
                    ))}
                  {credentialList.filter(c => c.name.toLowerCase().includes(credQuery.toLowerCase())).length === 0 && (
                    <div className="px-2.5 py-2 text-[11.5px] text-muted">No matching connections</div>
                  )}
                </div>
              </div>
            )}
            {newCredOpen && (
              <NewConnectionModal
                onClose={() => setNewCredOpen(false)}
                onCreate={(name) => {
                  const entry = { name, meta: 'Created by You, just now' }
                  setCredentialList(list => [entry, ...list])
                  setCredential(name)
                  setNewCredOpen(false)
                }}
              />
            )}
          </div>
        ) : (
          <span className="min-w-0 flex-1 truncate text-[12px] italic text-muted">
            Not hardcoded — another node will pass this value when used in a workflow
          </span>
        )}
        <StepMultiPicker
          selectedIds={selectedSteps}
          onChange={setSelectedSteps}
          stepOptions={stepOptions}
          onLocate={onJumpToStep}
        />
      </div>
    </div>
  )
}

function NewInputRow({ stepOptions, onRemove, onJumpToStep }) {
  const [name, setName] = useState('new_input')
  const [type, setType] = useState('text')
  const [source, setSource] = useState('fixed')
  const [value, setValue] = useState('')
  const [selectedSteps, setSelectedSteps] = useState([])
  const [typeOpen, setTypeOpen] = useState(false)
  const [srcOpen, setSrcOpen] = useState(false)
  const typeLabel = { text: 'Text', number: 'Number', select: 'Select', boolean: 'Boolean', date: 'Date' }
  const srcLabel = { fixed: 'Fixed value', dynamic: 'Dynamic', credential: 'Credential' }
  const TypeIc = type === 'select' ? IcSelect : type === 'boolean' ? IcCheckSq : type === 'date' ? IcCalendar : type === 'number' ? IcHash : IcType
  return (
    <div className="scroll-mt-24 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md border border-hairline bg-white px-1.5 py-0.5 text-[12px] text-ink">
          <TypeIc size={11} className="text-muted" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^a-z0-9_]/gi, '_'))}
            className="w-[110px] bg-transparent font-mono text-[12px] text-ink outline-none"
          />
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setTypeOpen(o => !o)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-hairline bg-white px-2 py-0.5 text-[11.5px] text-muted hover:bg-gray-50"
          >
            {typeLabel[type]} <IcCaret size={10} />
          </button>
          {typeOpen && (
            <div className="anim-pop absolute left-0 top-[calc(100%+4px)] z-10 w-[140px] overflow-hidden rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
              {Object.entries(typeLabel).map(([k, name]) => (
                <button key={k} type="button" onClick={() => { setType(k); setTypeOpen(false) }}
                  className="flex w-full cursor-pointer items-center px-2.5 py-1.5 text-left text-[12.5px] text-ink hover:bg-gray-50">
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="ml-auto">
          <RowKebabMenu items={[
            ['delete', 'Delete input', onRemove],
          ]} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="relative flex-none">
          <button
            type="button"
            onClick={() => setSrcOpen(o => !o)}
            className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2 text-[12px] text-ink hover:bg-gray-50"
          >
            {srcLabel[source]} <IcCaret size={11} className="text-gray-400" />
          </button>
          {srcOpen && (
            <div className="anim-pop absolute left-0 top-[calc(100%+4px)] z-10 w-[180px] overflow-hidden rounded-md border border-hairline bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
              {Object.entries(srcLabel).map(([k, name]) => (
                <button key={k} type="button" onClick={() => { setSource(k); setSrcOpen(false) }}
                  className="flex w-full cursor-pointer items-center px-2.5 py-1.5 text-left text-[12.5px] text-ink hover:bg-gray-50">
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
        {source === 'fixed' ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Default value"
            className="h-7 min-w-0 flex-1 rounded-md border border-hairline bg-white px-2 font-mono text-[12px] text-ink outline-none focus:border-gray-300 placeholder:text-muted"
          />
        ) : source === 'credential' ? (
          <span className="inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-hairline bg-gray-50 px-2 py-1 text-[12px] text-muted">
            <IcShield size={11} /> Choose credential…
          </span>
        ) : (
          <span className="min-w-0 flex-1 truncate text-[12px] italic text-muted">
            Provided by the caller at runtime
          </span>
        )}
        <StepMultiPicker
          selectedIds={selectedSteps}
          onChange={setSelectedSteps}
          stepOptions={stepOptions}
          onLocate={onJumpToStep}
        />
      </div>
    </div>
  )
}

function InputSchemaPanel({ schema, onJumpToStep, stepOptions = [] }) {
  const [drafts, setDrafts] = useState([])
  const addDraft = () => setDrafts(d => [...d, { id: Date.now() + Math.random() }])
  const removeDraft = (id) => setDrafts(d => d.filter(x => x.id !== id))
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="flex items-center gap-2 px-1">
        <Tooltip
          label="Inputs the workflow builder renders when this recording is called. Fixed values are baked in; dynamic and credential values are supplied per run."
          wide
        >
          <span className="cursor-help text-[13px] font-semibold text-ink">Inputs</span>
        </Tooltip>
        <span className="text-[12px] text-muted">· {schema.length + drafts.length}</span>
        <button
          type="button"
          onClick={addDraft}
          className="ml-auto inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-hairline bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink hover:bg-gray-50"
        >
          <Plus size={12} sw={2.2} />
          New input
        </button>
      </div>
      <section className="rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="divide-y divide-hairline">
          {schema.map(input => (
            <SchemaRow key={input.name} input={input} onJumpToStep={onJumpToStep} stepOptions={stepOptions} />
          ))}
          {drafts.map(d => (
            <NewInputRow key={d.id} stepOptions={stepOptions} onJumpToStep={onJumpToStep} onRemove={() => removeDraft(d.id)} />
          ))}
        </div>
      </section>
    </div>
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

function NewConnectionModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('OAuth')
  const types = ['OAuth', 'API key', 'Username & password']
  const canCreate = name.trim().length > 0
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] overflow-hidden rounded-lg border border-hairline bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
      >
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <IcShield size={12} className="text-muted" />
            New connection
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-3 px-4 py-4">
          <label className="flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-muted">Name</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NetSuite login"
              className="h-8 rounded-md border border-hairline bg-white px-2 text-[12.5px] text-ink outline-none focus:border-gray-300"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-muted">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-8 cursor-pointer rounded-md border border-hairline bg-white px-2 text-[12.5px] text-ink outline-none focus:border-gray-300"
            >
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <p className="text-[11.5px] text-muted">
            Credentials are injected from the vault at run time and never appear in logs.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-hairline bg-gray-50 px-4 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-7 cursor-pointer rounded-md border border-hairline bg-white px-2.5 text-[12px] text-ink hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canCreate}
            onClick={() => onCreate(name.trim())}
            className={
              'h-7 rounded-md px-2.5 text-[12px] font-medium text-white ' +
              (canCreate ? 'cursor-pointer bg-ink hover:bg-black' : 'cursor-not-allowed bg-gray-300')
            }
          >
            Create connection
          </button>
        </div>
      </div>
    </div>
  )
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-8"
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

function SidebarSection({ icon, title, children, defaultOpen = false, bodyPadded = true, openSignal }) {
  const [open, setOpen] = useState(defaultOpen)
  useEffect(() => {
    if (openSignal !== undefined && openSignal > 0) setOpen(true)
  }, [openSignal])
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full cursor-pointer select-none items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 text-left text-[13px] text-ink"
      >
        <span className="flex items-center text-gray-600">{icon}</span>
        {title}
        <IcCaret
          size={14}
          className={'ml-auto text-gray-400 transition-transform ' + (open ? 'rotate-180' : '')}
        />
      </button>
      {open && (
        <div className={'anim-fade border-b border-gray-100 text-[12.5px] leading-[1.5] text-muted ' + (bodyPadded ? 'px-4 pb-4 pt-1' : 'pb-2')}>
          {children}
        </div>
      )}
    </section>
  )
}

export default function FlowDetailPage() {
  const [tab, setTab] = useState('overview')
  const [replayOpen, setReplayOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [failureOpenSignal, setFailureOpenSignal] = useState(0)
  const [description, setDescription] = useState(
    'Logs into the NetSuite vendor portal and downloads open invoices for accounts payable.'
  )
  const [descEditing, setDescEditing] = useState(false)
  const tabFromHash = () => {
    const m = (window.location.hash || '').match(/^#\/browser-automation\/recording\/(steps|runs|references)/)
    return m ? m[1] : 'steps'
  }
  const [mainTab, setMainTabState] = useState(tabFromHash)
  useEffect(() => {
    const onChange = () => setMainTabState(tabFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  const setMainTab = (id) => {
    setMainTabState(id)
    const target = id === 'steps'
      ? '#/browser-automation/recording'
      : `#/browser-automation/recording/${id}`
    if (window.location.hash !== target) window.location.hash = target
  }
  const [openRun, setOpenRun] = useState(null)
  const [runPreview, setRunPreview] = useState(null)
  const [defaultPolicy, setDefaultPolicy] = useState({
    retry: true,
    maxRetries: 2,
    retryInterval: 1000,
    onError: 'stop',
  })
  const [dirty, setDirty] = useState(true)
  const updatePolicy = (v) => { setDefaultPolicy(v); setDirty(true) }
  const goSteps = () => {
    const url = `${window.location.origin}${window.location.pathname}#/browser-automation/recording`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftRail />

      <div className="flex min-w-0 flex-1 flex-col">
      {/* Topbar — mirrors src/components/Topbar.jsx styling */}
      <div className="relative flex flex-shrink-0 items-center gap-3 border-b border-hairline bg-white px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 text-[14px] text-muted">
          <span className="opacity-60"><Folder size={16} /></span>
          <a href="#/browser-automation" className="hover:text-ink">Browser automation</a>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-ink">Download vendor invoices</span>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
            {[
              ['steps', 'Recording'],
              ['runs', 'Analytics'],
              ['references', 'References'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => { if (id === 'runs') setOpenRun(null); setMainTab(id) }}
                className={
                  'cursor-pointer rounded-md px-3 py-1 text-[13px] font-medium transition ' +
                  (mainTab === id
                    ? 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.08)]'
                    : 'text-muted hover:text-ink')
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-2 py-1 text-xs font-medium text-gray-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            v3
          </div>
          {mainTab === 'steps' && (
            <button
              type="button"
              onClick={() => setSettingsOpen(o => !o)}
              aria-label="Settings"
              className={
                'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md ' +
                (settingsOpen ? 'bg-gray-100 text-ink' : 'text-muted hover:bg-gray-100')
              }
            >
              <Gear size={18} />
            </button>
          )}

          <div className="h-5 w-px bg-gray-200" />

          <button
            onClick={() => setDirty(false)}
            className="relative flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium">
            <Save size={13} />
            Save
            {dirty && (
              <span className="pointer-events-none absolute -right-1 -top-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
              </span>
            )}
          </button>

          <button
            onClick={() => setReplayOpen(true)}
            className="relative flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 font-medium text-white">
            <Play size={13} />
            Replay
          </button>

          <div className="h-5 w-px bg-gray-200" />

          <div className="cursor-pointer px-1 text-muted"><Kebab size={18} /></div>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <main className={`${mainTab === 'steps' ? 'canvas-dots' : 'bg-[#fafafa]'} no-scrollbar min-w-0 flex-1 overflow-y-auto`}>
          <div className={`mx-auto flex w-full ${mainTab === 'runs' && !openRun ? 'max-w-[1200px]' : 'max-w-[880px]'} flex-col gap-5 px-8 py-6`}>

            {mainTab === 'steps' && (() => {
              const stepDefs = [
                { text: 'Navigate to https://www.google.com/search?q=contact+form' },
                { text: 'Click result "Contact us — Example Forms"' },
                { text: 'Click "First name" field' },
                { text: 'Type "Ada" into "First name"',       input: 'first_name' },
                { text: 'Click "Last name" field' },
                { text: 'Type "Lovelace" into "Last name"',   input: 'last_name' },
                { text: 'Select "United States" in "Country"', input: 'country' },
                { text: 'Select "Engineer" in "Role"',         input: 'role' },
                { text: 'Click "Next"' },
                { text: 'Click "Full name" field' },
                { text: 'Type "Ada Lovelace" into "Full name"', input: 'full_name' },
                { text: 'Check "I agree to the terms"' },
                { text: 'Click "Submit"' },
              ]
              const stepIdFor = (i) => `step-${i + 1}`
              const schema = stepDefs
                .map((s, i) => ({ ...s, index: i }))
                .filter(s => s.input)
                .map(s => {
                  const { verb, prefix, chip } = stepParts(s.text)
                  const valMatch = prefix.match(/^"([^"]+)"/)
                  return {
                    name: s.input,
                    type: verb === 'Select' ? 'select' : 'text',
                    source: 'fixed',
                    value: valMatch ? valMatch[1] : '',
                    stepId: stepIdFor(s.index),
                    stepNumber: s.index + 1,
                    stepLabel: `${verb} ${chip}`,
                    stepVerb: verb,
                  }
                })
              const flashAndScroll = (id) => {
                const el = document.getElementById(id)
                if (!el) return
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('ring-2', 'ring-blue-300')
                setTimeout(() => el.classList.remove('ring-2', 'ring-blue-300'), 1200)
              }
              const jumpToStep = (id) => flashAndScroll(id)
              const jumpToInput = (name) => flashAndScroll(`schema-${name}`)
              return (
                <div className="flex min-w-0 flex-col">
                  <InputSchemaPanel
                    schema={schema}
                    onJumpToStep={jumpToStep}
                    stepOptions={stepDefs
                      .map((s, i) => ({ ...stepParts(s.text), index: i }))
                      .filter(s => s.verb === 'Type' || s.verb === 'Select')
                      .map(s => ({
                        stepId: stepIdFor(s.index),
                        stepNumber: s.index + 1,
                        label: `${s.verb} ${s.chip}`.trim(),
                      }))}
                  />
                  <div className="mt-10 flex min-w-0 flex-col gap-2.5">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[13px] font-semibold text-ink">Steps</span>
                      <span className="text-[12px] text-muted">· {stepDefs.length}</span>
                    </div>
                    {stepDefs.map((s, i) => (
                      <StepItem
                        key={i}
                        step={s.text}
                        stepId={stepIdFor(i)}
                        stepNumber={i + 1}
                        boundInput={s.input}
                        boundInputType={schema.find(x => x.name === s.input)?.type}
                        defaults={defaultPolicy}
                        availableInputs={schema}
                        onOpenSettings={() => { setSettingsOpen(true); setFailureOpenSignal(s => s + 1) }}
                      />
                    ))}
                    <div className="h-16" />
                  </div>
                </div>
              )
            })()}

            {mainTab === 'runs' && openRun && (() => {
              const runSteps = [
                { text: 'Navigate to https://portal.netsuite.com/login', dur: '1.2s', status: 'ok' },
                { text: 'Type "ada@example.com" into "Email"',            dur: '2.0s', status: 'ok' },
                { text: 'Type "••••••••" into "Password"',                dur: '2.8s', status: 'ok' },
                { text: 'Click "Sign in"',                                dur: '3.6s', status: 'ok' },
                { text: 'Navigate to https://portal.netsuite.com/dashboard', dur: '5.1s', status: 'ok' },
                { text: 'Click "Invoices"',                               dur: '6.4s', status: openRun.st === 'fail' ? 'fail' : 'ok' },
              ]
              return (
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => setOpenRun(null)}
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[12.5px] text-muted hover:text-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    Back to runs
                  </button>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h2 className="m-0 text-[18px] font-semibold tracking-tight text-ink">Run details</h2>
                      <span className={
                        'rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ' +
                        (openRun.st === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')
                      }>
                        {openRun.st === 'ok' ? 'Succeeded' : 'Failure'}
                      </span>
                    </div>
                    <div className="text-[12.5px] text-muted">Inspect a single run. Click a step to see inputs and outputs.</div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-2.5">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[13px] font-semibold text-ink">Steps</span>
                      <span className="text-[12px] text-muted">· {runSteps.length}</span>
                    </div>
                    {runSteps.map((s, i) => {
                      const { verb, prefix, chip } = stepParts(s.text)
                      const showsValue = verb === 'Type' || verb === 'Select'
                      const literalMatch = prefix.match(/^"([^"]+)"/)
                      const displayLiteral = literalMatch ? literalMatch[1] : ''
                      return (
                        <section
                          key={i}
                          className="group rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-gray-300"
                        >
                          <div className="flex w-full items-center gap-2.5 rounded-lg py-2 pl-3 pr-3 text-left">
                            <span className="w-5 flex-none text-center text-[11px] tabular-nums text-gray-400">{i + 1}</span>
                            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-hairline bg-white text-muted shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
                              {stepIcon(verb)}
                            </span>
                            <span className="text-[13px] font-medium text-ink">{verb}</span>
                            {showsValue ? (
                              <>
                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 font-mono text-[12px] text-ink">"{displayLiteral}"</span>
                                {chip && (
                                  <>
                                    <span className="text-[12px] text-muted">into</span>
                                    <span className="min-w-0 truncate font-mono text-[12px] text-muted">"{chip}"</span>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {prefix && <span className="text-[12.5px] text-muted">{prefix}</span>}
                                {chip && (
                                  <span className="min-w-0 truncate font-mono text-[12px] text-muted">
                                    {chip}
                                  </span>
                                )}
                              </>
                            )}
                            <div className="ml-auto flex flex-none items-center gap-2">
                              <span className={'h-1.5 w-1.5 rounded-full ' + (s.status === 'ok' ? 'bg-emerald-500' : 'bg-red-500')} />
                              <span className={'text-[12px] ' + (s.status === 'ok' ? 'text-muted' : 'text-red-700')}>{s.status === 'ok' ? 'Succeeded' : 'Failed'}</span>
                              <span className="font-mono text-[11.5px] text-muted">{s.dur}</span>
                              <Tooltip label="Captured from this run">
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => { e.stopPropagation(); setRunPreview({ verb, prefix, chip }) }}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setRunPreview({ verb, prefix, chip }) } }}
                                  className="flex h-7 w-7 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-md border border-hairline bg-white p-0 hover:border-gray-300 hover:ring-2 hover:ring-gray-200 focus:outline-none"
                                >
                                  <span className="pointer-events-none block scale-[0.30] origin-center">
                                    <StepThumbnail verb={verb} prefix={prefix} chip={chip} />
                                  </span>
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        </section>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {mainTab === 'runs' && !openRun && (() => {
              const StatCard = ({ label, value, bars, hint, accent = 'ink' }) => {
                const days = ['Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25']
                const vals = bars.map(b => b.v)
                const rawMax = Math.max(...vals, 1)
                const rawMin = Math.min(...vals)
                const yMax = rawMax
                const yMin = Math.max(0, Math.min(rawMin, Math.floor(rawMax * 0.3)))
                const W = 560, H = 120, PL = 34, PR = 8, PT = 8, PB = 22
                const iw = W - PL - PR, ih = H - PT - PB
                const n = vals.length
                const pts = vals.map((v, i) => {
                  const x = PL + (n === 1 ? iw / 2 : (i * iw) / (n - 1))
                  const t = yMax === yMin ? 0.5 : (v - yMin) / (yMax - yMin)
                  const y = PT + ih - t * ih
                  return [x, y]
                })
                const smooth = (p) => {
                  if (p.length < 2) return ''
                  let d = `M ${p[0][0]} ${p[0][1]}`
                  for (let i = 0; i < p.length - 1; i++) {
                    const p0 = p[i - 1] || p[i]
                    const p1 = p[i]
                    const p2 = p[i + 1]
                    const p3 = p[i + 2] || p2
                    const c1x = p1[0] + (p2[0] - p0[0]) / 6
                    const c1y = p1[1] + (p2[1] - p0[1]) / 6
                    const c2x = p2[0] - (p3[0] - p1[0]) / 6
                    const c2y = p2[1] - (p3[1] - p1[1]) / 6
                    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
                  }
                  return d
                }
                const linePath = smooth(pts)
                const areaPath = linePath + ` L ${pts[pts.length - 1][0]} ${PT + ih} L ${pts[0][0]} ${PT + ih} Z`
                const stroke = accent === 'red' ? '#ef4444' : '#374151'
                const fillTop = accent === 'red' ? 'rgba(239,68,68,0.14)' : 'rgba(55,65,81,0.10)'
                const gradId = `sc-grad-${label.replace(/\s+/g, '-').toLowerCase()}`
                return (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center gap-1.5 border-b border-gray-200 bg-[#f2f2f2] px-3.5 py-2.5 text-[12.5px] text-muted">
                      {label}
                      <span className="text-gray-400"><Ic size={12}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></Ic></span>
                    </div>
                    <div className="px-4 pb-2 pt-3">
                      <div className="text-[28px] font-semibold tabular-nums leading-tight tracking-tight text-ink">{value}</div>
                      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={fillTop} />
                            <stop offset="100%" stopColor={fillTop.replace(/,[^,]+\)$/, ',0)')} />
                          </linearGradient>
                        </defs>
                        <text x={PL - 6} y={PT + 4} textAnchor="end" fontSize="11" fill="#6b7280">{yMax}</text>
                        <text x={PL - 6} y={PT + ih + 4} textAnchor="end" fontSize="11" fill="#6b7280">{yMin}</text>
                        <path d={areaPath} fill={`url(#${gradId})`} />
                        <path d={linePath} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        {days.map((d, i) => {
                          const x = PL + (n === 1 ? iw / 2 : (i * iw) / (n - 1))
                          return <text key={d} x={x} y={H - 6} textAnchor="middle" fontSize="11" fill="#6b7280">{d}</text>
                        })}
                      </svg>
                      {hint && <div className="mt-1.5 text-[11px] text-muted">{hint}</div>}
                    </div>
                  </div>
                )
              }
              const runBars = [
                { v: 42 }, { v: 48 }, { v: 39 }, { v: 44 }, { v: 51 }, { v: 46 }, { v: 40 },
              ]
              const errorBars = [
                { v: 0 }, { v: 1 }, { v: 0 }, { v: 2, fail: true }, { v: 0 }, { v: 1, fail: true }, { v: 0 },
              ]
              const userBars = [
                { v: 3 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 4 }, { v: 4 }, { v: 3 },
              ]
              const durBars = [
                { v: 38 }, { v: 41 }, { v: 39 }, { v: 45 }, { v: 42 }, { v: 40 }, { v: 41 },
              ]

              const runs = [
                ['ok',   'Succeeded',                  '2 hours ago',        'AP Reconciliation',   'Builder',        'v11', 'dhidalgo@stack-ai.com', '41s',    '—'],
                ['ok',   'Succeeded',                  'Yesterday, 6:00 AM', 'AP Reconciliation',   'Trigger',        'v11', 'System',                '39s',    '—'],
                ['fail', 'Failed · agent intervened', 'Jul 8, 6:00 AM',     'Vendor payment sync', 'Trigger',        'v10', 'System',                '2m 04s', 'Selector drift'],
                ['ok',   'Succeeded',                  'Jul 7, 6:00 AM',     'AP Reconciliation',   'Builder',        'v10', 'dhidalgo@stack-ai.com', '40s',    '—'],
                ['ok',   'Succeeded · agent intervened', 'Jul 5, 6:00 AM',   'Audit trail export',  'Chat assistant', 'v9',  'dhidalgo@stack-ai.com', '1m 58s', 'Recovered'],
                ['ok',   'Succeeded',                  'Jul 4, 6:00 AM',     'AP Reconciliation',   'Trigger',        'v9',  'System',                '42s',    '—'],
                ['ok',   'Succeeded',                  'Jul 3, 6:00 AM',     'AP Reconciliation',   'Trigger',        'v9',  'System',                '40s',    '—'],
                ['ok',   'Succeeded',                  'Jul 2, 6:00 AM',     'Vendor payment sync', 'Trigger',        'v8',  'System',                '38s',    '—'],
              ]

              return (
                <div className="flex flex-col gap-4">
                  {/* Top action bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2.5 py-1.5 text-[12.5px] text-ink hover:bg-gray-50">
                      Last 7 days <IcCaret size={12} className="text-gray-400" />
                    </button>
                    <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2.5 py-1.5 text-[12.5px] text-ink hover:bg-gray-50">
                      <IcCalendar size={12} className="text-gray-400" />
                      Jul 19, 2026 &nbsp;–&nbsp; Jul 25, 2026
                    </button>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Runs" value="284" bars={runBars} />
                    <StatCard label="Users" value="7" bars={userBars} />
                    <StatCard label="Errors" value="3" bars={errorBars} accent="red" />
                    <StatCard label="Median duration" value="41s" bars={durBars} />
                  </div>

                  {/* Search + download */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <input
                        placeholder="Search runs by workflow or trigger"
                        className="w-full rounded-md border border-hairline bg-white py-1.5 pl-3 pr-3 text-[12.5px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-gray-300"
                      />
                    </div>
                    <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-white px-2.5 py-1.5 text-[12.5px] text-ink hover:bg-gray-50">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M6 11l6 6 6-6M4 21h16" /></svg>
                      Download Logs
                    </button>
                  </div>

                  {/* Recent runs table */}
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="grid grid-cols-[1.2fr_1fr_0.5fr_0.9fr_1.3fr_1.2fr_0.6fr_0.9fr] gap-3 border-b border-gray-200 bg-[#f2f2f2] px-4 py-2.5 text-[11px] font-medium text-muted">
                      <div className="flex items-center gap-1">Status</div>
                      <div className="flex items-center gap-1">Started <IcCaret size={10} /></div>
                      <div className="flex items-center gap-1">Version</div>
                      <div className="flex items-center gap-1">Run type</div>
                      <div className="flex items-center gap-1">Ran by</div>
                      <div className="flex items-center gap-1">Called by</div>
                      <div className="flex items-center justify-end gap-1">Duration</div>
                      <div className="flex items-center gap-1">Notes</div>
                    </div>
                    {runs.map(([st, status, when, calledBy, runType, version, ranBy, dur, notes], i) => {
                      const isSystem = ranBy === 'System'
                      const runTypeStyle = runType === 'Trigger'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : runType === 'Builder'
                          ? 'bg-gray-100 text-gray-700 border-gray-200'
                          : 'bg-violet-50 text-violet-700 border-violet-200'
                      const runTypeDot = runType === 'Trigger' ? 'bg-amber-500' : runType === 'Builder' ? 'bg-gray-400' : 'bg-violet-500'
                      return (
                        <div
                          key={i}
                          onClick={() => setOpenRun({ st, status, when, calledBy, trigger: runType, dur, notes })}
                          className="grid cursor-pointer grid-cols-[1.2fr_1fr_0.5fr_0.9fr_1.3fr_1.2fr_0.6fr_0.9fr] items-center gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0 hover:bg-gray-50">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className={'h-2 w-2 flex-none rounded-full ' + (st === 'ok' ? 'bg-emerald-500' : 'bg-red-500')} />
                            <div className={'truncate text-[12.5px] ' + (st === 'ok' ? 'text-ink' : 'text-red-700')}>{status}</div>
                          </div>
                          <div className="truncate text-[12.5px] text-muted">{when}</div>
                          <div className="truncate font-mono text-[12px] tabular-nums text-ink">{version}</div>
                          <div className="min-w-0">
                            <span className={'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11.5px] ' + runTypeStyle}>
                              <span className={'h-1.5 w-1.5 rounded-full ' + runTypeDot} />
                              {runType}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className={'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11.5px] ' + (isSystem ? 'border-gray-200 bg-gray-50 text-gray-600' : 'border-blue-200 bg-blue-50 text-blue-700')}>
                              {isSystem ? (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                              ) : (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                              )}
                              <span className="truncate">{ranBy}</span>
                            </span>
                          </div>
                          <div className="truncate text-[12.5px] text-ink">{calledBy}</div>
                          <div className="text-right font-mono text-[12.5px] tabular-nums text-ink">{dur}</div>
                          <div className="truncate text-[12.5px] text-muted">{notes}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {mainTab === 'references' && (
              <div>
                <div className="mb-2 flex items-baseline gap-2 px-1">
                  <span className="text-[13px] font-semibold text-ink">Used by</span>
                  <span className="text-[12px] text-muted">4 workflow projects reference this recording</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  {[
                    ['AP Reconciliation', 'Finance ops', '842 runs · Scheduled daily 6:00 AM'],
                    ['Vendor payment sync', 'Finance ops', '318 runs · Triggered by new invoice'],
                    ['Month-end close', 'Accounting', '96 runs · Scheduled monthly'],
                    ['Audit trail export', 'Compliance', '28 runs · Manual'],
                  ].map(([name, team, meta], i) => (
                    <a key={i} href="#" className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-hairline px-4 py-3 last:border-b-0 hover:bg-gray-50">
                      <div className="grid h-8 w-8 place-items-center rounded-md border border-hairline bg-gray-50 text-muted">
                        <Ic size={15}>
                          <rect x="3" y="4" width="6" height="6" rx="1" />
                          <rect x="15" y="4" width="6" height="6" rx="1" />
                          <rect x="9" y="14" width="6" height="6" rx="1" />
                          <path d="M6 10v2h12v-2" />
                          <path d="M12 12v2" />
                        </Ic>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-ink">{name}</div>
                        <div className="truncate text-[11.5px] text-muted">{team} · {meta}</div>
                      </div>
                      <ChevronDown size={13} className="-rotate-90 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {mainTab === 'sessions' && (
              <div className="overflow-hidden rounded-lg border border-hairline bg-white">
                {[
                  ['NetSuite prod session', 'Active · last used 12m ago', 'active'],
                  ['NetSuite staging session', 'Idle · last used yesterday', 'idle'],
                  ['NetSuite prod session (backup)', 'Expired · Jul 6', 'expired'],
                ].map(([name, sub, state], i) => (
                  <div key={i} className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2.5 border-b border-hairline px-4 py-3 last:border-b-0 hover:bg-gray-50">
                    <div className={
                      'h-2 w-2 rounded-full ' +
                      (state === 'active' ? 'bg-emerald-500' : state === 'idle' ? 'bg-amber-400' : 'bg-gray-300')
                    } />
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium text-ink">{name}</div>
                      <div className="truncate text-[11.5px] text-muted">{sub}</div>
                    </div>
                    <div className="text-[12px] text-muted">Playwright</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right rail — full viewport height, own scroll */}
        {mainTab === 'runs' && openRun && (
        <aside className="anim-slide-right no-scrollbar flex w-[380px] flex-none flex-col overflow-y-auto border-l border-hairline bg-white">
          <div className="flex flex-none items-center gap-2 border-b border-hairline px-5 py-3">
            <div className="text-[14px] font-semibold text-ink">General</div>
            <span className={
              'rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ' +
              (openRun.st === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')
            }>
              {openRun.st === 'ok' ? 'Success' : 'Failure'}
            </span>
            <button
              type="button"
              onClick={() => setOpenRun(null)}
              aria-label="Close run"
              className="ml-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col divide-y divide-hairline">
            <div className="flex flex-col gap-3 px-5 py-4">
              {[
                ['Run ID', 'b8e4f736-1955-4800-9067-94d131b51b20', true],
                ['Conversation', '—'],
                ['Started', openRun.when],
                ['Duration', openRun.dur],
                ['Trigger', openRun.trigger],
                ['Called by', openRun.calledBy],
                ['Sandbox', 'fresh · gen 14'],
                ['User', 'dhidalgo@stack-ai.com'],
                ['Runtime', 'Playwright'],
              ].map(([k, v, mono]) => (
                <div key={k} className="flex items-baseline gap-3">
                  <div className="w-[100px] flex-none text-[11px] uppercase tracking-[0.06em] text-muted">{k}</div>
                  <div className={'min-w-0 flex-1 truncate text-[12.5px] text-ink ' + (mono ? 'font-mono' : '')}>{v}</div>
                </div>
              ))}
            </div>
            <SidebarSection icon={<IcArrow size={16} />} title="Input" defaultOpen={false}>
              <div className="flex flex-col gap-3.5">
                {[
                  ['Vendor Name', 'variable', 'The vendor whose invoices are being downloaded.'],
                  ['Invoice Date Range', 'variable', 'Date window for the invoices to fetch.'],
                  ['Portal URL', 'variable', 'The vendor billing portal entry point.'],
                  ['Portal Credentials', 'credential', 'Username and password used to sign into the portal.'],
                  ['MFA Token', 'credential', 'One-time code retrieved from the authenticator.'],
                  ['Download Folder', 'variable', 'Destination path for saved invoice PDFs.'],
                ].map(([name, type, desc]) => (
                  <div key={name} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <div className="text-[13px] font-medium text-ink">{name}</div>
                      <div className="text-[11.5px] text-muted">{type}</div>
                    </div>
                    <div className="text-[12px] leading-snug text-muted">{desc}</div>
                  </div>
                ))}
              </div>
            </SidebarSection>
            <SidebarSection icon={<IcArrow size={16} />} title="Outputs" defaultOpen={false}>
              <div className="flex flex-col gap-3.5">
                {[
                  ['Success', 'boolean', 'Whether the replay completed successfully.'],
                  ['Task ID', 'string', 'The sandbox-local workflow backend task ID.'],
                  ['Status', 'string', 'Terminal replay status.'],
                  ['Sandbox ID', 'string', 'The browser navigation sandbox used for replay.'],
                  ['Stream URL', 'string', 'The stream URL for observing replay in the browser navigation sandbox.'],
                  ['Result', 'array', 'Step-by-step replay result payload.'],
                  ['Error', 'string', 'Replay error if the task failed.'],
                ].map(([name, type, desc]) => (
                  <div key={name} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <div className="text-[13px] font-medium text-ink">{name}</div>
                      <div className="text-[11.5px] text-muted">{type}</div>
                    </div>
                    <div className="text-[12px] leading-snug text-muted">{desc}</div>
                  </div>
                ))}
              </div>
            </SidebarSection>
            {openRun.st === 'fail' && (
              <SidebarSection icon={<IcShield size={16} />} title="Errors" defaultOpen={true}>
                <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                  {openRun.notes || 'Step failed'} — agent intervened and stopped the run.
                </div>
              </SidebarSection>
            )}
          </div>
        </aside>
        )}
        {settingsOpen && mainTab === 'steps' && (
        <aside className="anim-slide-right no-scrollbar flex w-[460px] flex-none flex-col overflow-y-auto border-l border-hairline bg-white shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.05)]">
          <div className="flex flex-none items-center gap-2 border-b border-gray-100 px-4 pb-2.5 pt-3.5">
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-gray-100 text-gray-600">
              <Gear size={16} />
            </div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
              Details
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              aria-label="Close settings"
              className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-1 flex-col">
          <SidebarSection icon={<IcClock size={18} />} title="Description" defaultOpen={true}>
            {descEditing ? (
              <textarea
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setDescEditing(false)}
                placeholder="Describe what this recording does…"
                className="min-h-[72px] w-full resize-y rounded-md border border-hairline bg-white px-2.5 py-2 text-[13px] leading-[1.5] text-ink placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
              />
            ) : (
              <div
                onDoubleClick={() => setDescEditing(true)}
                className="min-h-[72px] w-full cursor-text rounded-md bg-gray-50 px-2.5 py-2 text-[13px] leading-[1.5] text-ink hover:bg-gray-100"
              >
                {description || (
                  <span className="text-gray-400">Describe what this recording does…</span>
                )}
              </div>
            )}
          </SidebarSection>

          <SidebarSection icon={<IcClock size={18} />} title="About" defaultOpen={true}>
            <div className="flex flex-col gap-3">
              {[
                ['Target site', 'portal.netsuite.com'],
                ['Runtime', 'Playwright · isolated sandbox'],
                ['Owner', 'John Miller'],
                ['Last edited', '2 hours ago'],
                ['Created', 'Jun 14, 2026'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-3">
                  <div className="w-[110px] flex-none text-[12.5px] text-muted">{k}</div>
                  <div className="min-w-0 flex-1 truncate text-[13px] text-ink">{v}</div>
                </div>
              ))}
            </div>
          </SidebarSection>

          <SidebarSection icon={<IcShield size={18} />} title="If a step fails" defaultOpen={false} openSignal={failureOpenSignal}>
            <div className="mb-3 text-[11.5px] text-muted">
              Default failure handling for all steps. Each step can override this.
            </div>
            <FailurePolicyControls value={defaultPolicy} onChange={updatePolicy} />
          </SidebarSection>

          <SidebarSection icon={<IcSliders size={18} />} title="Configuration" defaultOpen={false}>
            <div className="flex flex-col gap-3">
              {[
                ['Credential', 'NetSuite vendor portal'],
                ['Session token', 'NetSuite prod session · active', true],
              ].map(([k, v, active]) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <div className="text-[12.5px] text-muted">{k}</div>
                  <div className="flex items-center gap-2 rounded-md border border-hairline bg-white px-2.5 py-1.5 text-[13px] text-ink">
                    <div className={'h-4 w-4 rounded border ' + (active ? 'border-emerald-400 bg-emerald-50' : 'border-hairline bg-gray-50')} />
                    <span>{v}</span>
                    <IcCaret size={12} className="ml-auto text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </SidebarSection>

          </div>
        </aside>
        )}
      </div>
      </div>
      {replayOpen && (
        <ReplayModal onClose={() => setReplayOpen(false)} flowName="Download vendor invoices" />
      )}
      {runPreview && (
        <StepPreviewModal
          verb={runPreview.verb}
          prefix={runPreview.prefix}
          chip={runPreview.chip}
          onClose={() => setRunPreview(null)}
        />
      )}
    </div>
  )
}
