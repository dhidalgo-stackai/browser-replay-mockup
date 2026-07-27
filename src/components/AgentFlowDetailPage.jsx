import { useEffect, useState } from 'react'
import LeftRail from './LeftRail.jsx'
import { Folder, Gear, Save, Play, Kebab, Plus, X } from './icons.jsx'

const MODELS = [
  'claude-sonnet-5',
  'claude-opus-4-8',
  'claude-haiku-4-5',
  'gpt-4o',
]

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-[12.5px] font-medium text-ink">{label}</label>
        {hint && <span className="text-[11.5px] text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Section({ title, desc, children, action }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-hairline px-4 py-3">
        <div>
          <div className="text-[13.5px] font-semibold text-ink">{title}</div>
          {desc && <div className="mt-0.5 text-[12px] text-muted">{desc}</div>}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

export default function AgentFlowDetailPage() {
  const [prompt, setPrompt] = useState(
    'Log into Salesforce Lightning, open the "Qualified leads — weekly" report, export it as CSV, and upload the file to the shared drive at /Sales/Leads/{{week}}.'
  )
  const [model, setModel] = useState('claude-sonnet-5')
  const [maxSteps, setMaxSteps] = useState(40)
  const [temp, setTemp] = useState(0.2)
  const [dirty, setDirty] = useState(false)
  const [inputs, setInputs] = useState([
    { name: 'week', type: 'text', desc: 'ISO week label, e.g. 2026-W30', required: true },
    { name: 'destination', type: 'text', desc: 'Shared-drive folder path', required: false },
  ])
  const touch = (fn) => (...args) => { setDirty(true); fn(...args) }

  const tabFromHash = () => {
    const m = (window.location.hash || '').match(/^#\/browser-automation\/agent\/(runs|references)/)
    return m ? m[1] : 'overview'
  }
  const [tab, setTabState] = useState(tabFromHash)
  useEffect(() => {
    const onChange = () => setTabState(tabFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  const setTab = (id) => {
    setTabState(id)
    const target = id === 'overview'
      ? '#/browser-automation/agent'
      : `#/browser-automation/agent/${id}`
    if (window.location.hash !== target) window.location.hash = target
  }

  const addInput = () =>
    touch(setInputs)([...inputs, { name: '', type: 'text', desc: '', required: false }])
  const updateInput = (i, patch) =>
    touch(setInputs)(inputs.map((x, idx) => (idx === i ? { ...x, ...patch } : x)))
  const removeInput = (i) => touch(setInputs)(inputs.filter((_, idx) => idx !== i))

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftRail />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <div className="relative flex flex-shrink-0 items-center gap-3 border-b border-hairline bg-white px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 text-[14px] text-muted">
            <span className="opacity-60"><Folder size={16} /></span>
            <a href="#/browser-automation" className="hover:text-ink">Browser automation</a>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-ink">Extract Salesforce lead list</span>
            <span className="ml-1.5 rounded-[4px] bg-violet-50 px-1.5 py-0.5 text-[10.5px] font-medium text-violet-700 ring-1 ring-violet-200">
              AI Agent
            </span>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="pointer-events-auto inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
              {[
                ['overview', 'Overview'],
                ['runs', 'Runs'],
                ['references', 'References'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={
                    'cursor-pointer rounded-md px-3 py-1 text-[13px] font-medium transition ' +
                    (tab === id
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
              v2
            </div>

            <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100">
              <Gear size={18} />
            </button>

            <div className="h-5 w-px bg-gray-200" />

            <button
              onClick={() => setDirty(false)}
              className="relative flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium"
            >
              <Save size={13} />
              Save
              {dirty && (
                <span className="pointer-events-none absolute -right-1 -top-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
                </span>
              )}
            </button>

            <button className="relative flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 font-medium text-white">
              <Play size={13} />
              Run agent
            </button>

            <div className="h-5 w-px bg-gray-200" />
            <div className="cursor-pointer px-1 text-muted"><Kebab size={18} /></div>
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          <main className="no-scrollbar min-w-0 flex-1 overflow-y-auto bg-[#fafafa]">
            <div className="mx-auto flex w-full max-w-[880px] flex-col gap-5 px-8 py-6">

              {/* Header (shared across tabs) */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-hairline">
                  <img
                    src="https://logo.clearbit.com/salesforce.com"
                    alt=""
                    className="h-6 w-6"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[18px] font-semibold text-ink">Extract Salesforce lead list</div>
                  <div className="text-[12.5px] text-muted">lightning.force.com · Authored by AI Agent · Last planned July 18, 2026</div>
                </div>
              </div>

              {tab === 'overview' && <>
              {/* Task prompt */}
              <Section
                title="Task prompt"
                desc="What the agent should accomplish. Use {{input_name}} to reference inputs below."
              >
                <textarea
                  value={prompt}
                  onChange={(e) => { setPrompt(e.target.value); setDirty(true) }}
                  rows={5}
                  className="w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] leading-[1.55] text-ink outline-none focus:border-gray-400"
                />
              </Section>

              {/* Model config */}
              <Section title="Agent configuration">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Model">
                    <select
                      value={model}
                      onChange={(e) => { setModel(e.target.value); setDirty(true) }}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-gray-400"
                    >
                      {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </Field>
                  <Field label="Max steps" hint="Hard cap per run">
                    <input
                      type="number"
                      min={1}
                      value={maxSteps}
                      onChange={(e) => { setMaxSteps(Number(e.target.value)); setDirty(true) }}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-gray-400"
                    />
                  </Field>
                  <Field label="Temperature" hint={temp.toFixed(1)}>
                    <input
                      type="range"
                      min={0} max={1} step={0.1}
                      value={temp}
                      onChange={(e) => { setTemp(Number(e.target.value)); setDirty(true) }}
                    />
                  </Field>
                </div>
              </Section>

              {/* Inputs */}
              <Section
                title="Inputs"
                desc="Parameters callers pass in. Referenced in the task prompt via {{name}}."
                action={
                  <button
                    onClick={addInput}
                    className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[12px] font-medium text-ink hover:bg-gray-50"
                  >
                    <Plus size={12} /> Add input
                  </button>
                }
              >
                {inputs.length === 0 ? (
                  <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-6 text-center text-[12.5px] text-muted">
                    No inputs yet. Add one to reference it from the task prompt.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {inputs.map((inp, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md border border-hairline bg-white px-2.5 py-2">
                        <input
                          value={inp.name}
                          onChange={(e) => updateInput(i, { name: e.target.value })}
                          placeholder="name"
                          className="w-[140px] rounded-[4px] border border-gray-200 px-2 py-1 text-[12.5px] font-mono text-ink outline-none focus:border-gray-400"
                        />
                        <select
                          value={inp.type}
                          onChange={(e) => updateInput(i, { type: e.target.value })}
                          className="rounded-[4px] border border-gray-200 bg-white px-1.5 py-1 text-[12px] text-ink outline-none"
                        >
                          <option value="text">text</option>
                          <option value="number">number</option>
                          <option value="date">date</option>
                          <option value="secret">secret</option>
                        </select>
                        <input
                          value={inp.desc}
                          onChange={(e) => updateInput(i, { desc: e.target.value })}
                          placeholder="Description"
                          className="min-w-0 flex-1 rounded-[4px] border border-gray-200 px-2 py-1 text-[12.5px] text-ink outline-none focus:border-gray-400"
                        />
                        <label className="flex items-center gap-1 text-[11.5px] text-muted">
                          <input
                            type="checkbox"
                            checked={inp.required}
                            onChange={(e) => updateInput(i, { required: e.target.checked })}
                          />
                          required
                        </label>
                        <button
                          onClick={() => removeInput(i)}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-gray-100 hover:text-ink"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Site knowledge */}
              <Section
                title="Site knowledge"
                desc="Selectors and shortcuts the agent has learned across runs. Reused to speed up future runs."
              >
                <div className="flex flex-col gap-1.5">
                  {[
                    ['App launcher', 'nav → App Launcher → “Reports”'],
                    ['Report title', 'link text “Qualified leads — weekly”'],
                    ['Export menu', '⋯ button → Export → CSV (Formatted)'],
                    ['Modal wait', 'Export modal takes ~2.4s to render'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3 rounded-md bg-gray-50 px-3 py-2 text-[12.5px]">
                      <span className="font-medium text-ink">{k}</span>
                      <span className="text-muted">{v}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Credentials */}
              <Section title="Credentials" desc="Bound signed-in sessions the agent may use.">
                <div className="flex items-center gap-2 rounded-md border border-hairline px-3 py-2 text-[12.5px]">
                  <div className="h-6 w-6 rounded-md bg-sky-500" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-ink">https://stackai.lightning.force.com</div>
                    <div className="text-muted">username: analytics@stack.ai</div>
                  </div>
                  <button className="text-[12px] text-muted hover:text-ink">Change</button>
                </div>
              </Section>
              </>}

              {tab === 'runs' && (
                <Section title="Runs" desc="Each agent run generates its own plan. Failed steps may be re-planned automatically.">
                  <div className="flex flex-col divide-y divide-hairline">
                    {[
                      { id: 'run_20260718_0912', started: 'Jul 18, 2026 · 09:12', status: 'success', steps: 14, healed: 1, duration: '1m 42s', model: 'claude-sonnet-5', cost: '$0.031' },
                      { id: 'run_20260711_0912', started: 'Jul 11, 2026 · 09:12', status: 'success', steps: 16, healed: 3, duration: '2m 08s', model: 'claude-sonnet-5', cost: '$0.038' },
                      { id: 'run_20260704_0913', started: 'Jul 4, 2026 · 09:13', status: 'failed', steps: 8, healed: 2, duration: '54s', model: 'claude-sonnet-5', cost: '$0.019' },
                      { id: 'run_20260627_0912', started: 'Jun 27, 2026 · 09:12', status: 'success', steps: 13, healed: 0, duration: '1m 28s', model: 'claude-sonnet-5', cost: '$0.027' },
                      { id: 'run_20260620_0912', started: 'Jun 20, 2026 · 09:12', status: 'success', steps: 13, healed: 0, duration: '1m 31s', model: 'claude-sonnet-5', cost: '$0.027' },
                    ].map((r) => (
                      <button key={r.id} className="flex items-center gap-3 px-1 py-2.5 text-left hover:bg-gray-50">
                        <span className={
                          'flex h-2 w-2 flex-shrink-0 rounded-full ' +
                          (r.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500')
                        } />
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-ink">{r.started}</div>
                          <div className="text-[11.5px] text-muted">
                            {r.steps} steps · {r.healed} healed · {r.duration} · {r.model} · {r.cost}
                          </div>
                        </div>
                        <span className={
                          'rounded-[4px] px-1.5 py-0.5 text-[10.5px] font-medium ring-1 ' +
                          (r.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-rose-50 text-rose-700 ring-rose-200')
                        }>
                          {r.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {tab === 'references' && (
                <Section title="Used by" desc="Workflows that call this agent flow.">
                  <div className="flex flex-col divide-y divide-hairline">
                    {[
                      { name: 'Weekly sales digest', owner: 'Jenny Liang', last: 'Jul 18, 2026' },
                      { name: 'Pipeline hygiene sweep', owner: 'Jacob ZY Yoon', last: 'Jul 11, 2026' },
                      { name: 'Exec Monday snapshot', owner: 'David Hidalgo', last: 'Jul 6, 2026' },
                    ].map((w) => (
                      <a key={w.name} href="#" className="flex items-center gap-3 px-1 py-2.5 hover:bg-gray-50">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[11px] font-semibold text-gray-700 ring-1 ring-hairline">
                          {w.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-ink">{w.name}</div>
                          <div className="text-[11.5px] text-muted">Owner: {w.owner} · Last used {w.last}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </Section>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
