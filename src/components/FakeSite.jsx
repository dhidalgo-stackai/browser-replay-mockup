import { Search } from './icons.jsx'

const RESULTS = [
  {
    title: 'Stack AI — Enterprise AI Platform',
    url: 'https://www.stack-ai.com',
    snippet:
      'Build, deploy and manage AI agents and workflows across your enterprise. Trusted by teams to automate document processing, search, and more.',
  },
  {
    title: 'Stack AI Documentation',
    url: 'https://docs.stack-ai.com',
    snippet:
      'Guides, tutorials and API references for building with Stack AI. Get started in minutes with our step-by-step onboarding.',
  },
  {
    title: 'Stack AI on LinkedIn',
    url: 'https://www.linkedin.com/company/stack-ai',
    snippet:
      'Follow Stack AI on LinkedIn for product news, engineering deep-dives and open roles.',
  },
]

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Germany', 'Spain']

function TextField({ label, value, onChange, onLiveType, onCommit, onFocusStep, placeholder }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-[12px] font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onFocus={onFocusStep}
        onChange={(e) => {
          const v = e.target.value
          onChange(v)
          if (onLiveType) onLiveType(v)
        }}
        onBlur={onCommit}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  )
}

function HomePage({ onOpenForm }) {
  return (
    <div className="mx-auto w-full max-w-[560px] pt-20 text-center">
      <div className="mb-6 text-[42px] font-semibold tracking-tight text-[#4285f4]">
        <span className="text-[#4285f4]">G</span>
        <span className="text-[#ea4335]">o</span>
        <span className="text-[#fbbc05]">o</span>
        <span className="text-[#4285f4]">g</span>
        <span className="text-[#34a853]">l</span>
        <span className="text-[#ea4335]">e</span>
      </div>
      <div
        onClick={onOpenForm}
        className="mb-4 flex cursor-pointer items-center gap-2.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-sm hover:border-gray-300 hover:shadow"
      >
        <span className="text-gray-400">
          <Search size={16} />
        </span>
        <span className="flex-1 text-left text-[13px] text-gray-400">
          Type a query in the address bar above and press Enter
        </span>
      </div>
      <p className="text-[12px] text-muted">Your searches, clicks and form entries will be recorded.</p>
    </div>
  )
}

function ResultsPage({ query, onClickResult }) {
  return (
    <div className="mx-auto w-full max-w-[640px] pt-6">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="text-[22px] font-semibold text-[#4285f4]">Google</div>
        <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-ink">
          <span className="text-gray-400">
            <Search size={14} />
          </span>
          <span className="flex-1 truncate">{query || 'stack ai'}</span>
        </div>
      </div>
      <div className="mb-3 text-[12px] text-muted">About 12,300,000 results (0.42 seconds)</div>
      <div className="space-y-5">
        {RESULTS.map((r) => (
          <div
            key={r.url}
            onClick={() => onClickResult(r)}
            className="group cursor-pointer"
          >
            <div className="text-[12px] text-gray-600">{r.url}</div>
            <div className="text-[18px] font-medium text-[#1a0dab] group-hover:underline">
              {r.title}
            </div>
            <div className="mt-0.5 text-[13px] leading-snug text-gray-700">{r.snippet}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Form1Page({ data, setData, onStep, onLiveStep, onCommitLive, onNext }) {
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }))
  const liveType = (key, fieldLabel) => (v) => {
    if (v.trim()) onLiveStep(key, `Type "${v}" into "${fieldLabel}"`)
  }
  return (
    <div className="mx-auto w-full max-w-[460px] pt-4">
      <h2 className="mb-1 text-[20px] font-semibold text-ink">Contact details</h2>
      <p className="mb-5 text-[13px] text-muted">Tell us a bit about yourself to continue.</p>

      <TextField
        label="First name"
        value={data.firstName}
        onChange={set('firstName')}
        onFocusStep={() => onStep('Click "First name" field')}
        onLiveType={liveType('form1.firstName', 'First name')}
        onCommit={() => onCommitLive('form1.firstName')}
        placeholder="Jane"
      />
      <TextField
        label="Last name"
        value={data.lastName}
        onChange={set('lastName')}
        onFocusStep={() => onStep('Click "Last name" field')}
        onLiveType={liveType('form1.lastName', 'Last name')}
        onCommit={() => onCommitLive('form1.lastName')}
        placeholder="Doe"
      />

      <div className="mb-3">
        <label className="mb-1 block text-[12px] font-medium text-gray-700">Country</label>
        <select
          value={data.country}
          onChange={(e) => {
            const v = e.target.value
            set('country')(v)
            if (v) onStep(`Select "${v}" in "Country"`)
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Select a country…</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="mb-1 block text-[12px] font-medium text-gray-700">Role</label>
        <select
          value={data.role}
          onChange={(e) => {
            const v = e.target.value
            set('role')(v)
            if (v) onStep(`Select "${v}" in "Role"`)
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Select a role…</option>
          <option value="Engineer">Engineer</option>
          <option value="Designer">Designer</option>
          <option value="Product Manager">Product Manager</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        onClick={onNext}
        className="w-full cursor-pointer rounded-md bg-[#1a73e8] px-3 py-2 text-[13px] font-semibold text-white hover:bg-[#1765cc]"
      >
        Next
      </button>
    </div>
  )
}

function Form2Page({ data, setData, onStep, onLiveStep, onCommitLive, onSubmit }) {
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }))
  return (
    <div className="mx-auto w-full max-w-[460px] pt-4">
      <h2 className="mb-1 text-[20px] font-semibold text-ink">Confirm submission</h2>
      <p className="mb-5 text-[13px] text-muted">Enter your full name and accept the terms to submit.</p>

      <TextField
        label="Full name"
        value={data.fullName}
        onChange={set('fullName')}
        onFocusStep={() => onStep('Click "Full name" field')}
        onLiveType={(v) => {
          if (v.trim()) onLiveStep('form2.fullName', `Type "${v}" into "Full name"`)
        }}
        onCommit={() => onCommitLive('form2.fullName')}
        placeholder="Jane Doe"
      />

      <label
        onClick={() => {
          const next = !data.agree
          set('agree')(next)
          onStep(next ? 'Check "I agree to the terms"' : 'Uncheck "I agree to the terms"')
        }}
        className="mb-5 flex cursor-pointer items-start gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] text-ink"
      >
        <span
          className={
            'mt-0.5 flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-[3px] border ' +
            (data.agree ? 'border-[#1a73e8] bg-[#1a73e8] text-white' : 'border-gray-300 bg-white text-transparent')
          }
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        I agree to the terms and conditions
      </label>

      <button
        onClick={onSubmit}
        disabled={!data.agree || !data.fullName.trim()}
        className="w-full cursor-pointer rounded-md bg-[#1a73e8] px-3 py-2 text-[13px] font-semibold text-white hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit
      </button>
    </div>
  )
}

function DonePage() {
  return (
    <div className="mx-auto w-full max-w-[460px] pt-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="mb-1 text-[20px] font-semibold text-ink">Submission received</h2>
      <p className="text-[13px] text-muted">
        Thanks — your form has been submitted. You can stop the recording now.
      </p>
    </div>
  )
}

export default function FakeSite({ page, query, formData, setFormData, onStep, onLiveStep, onCommitLive, onNavigate }) {
  if (page === 'results') {
    return (
      <ResultsPage
        query={query}
        onClickResult={(r) => {
          onStep(`Click result "${r.title}"`)
          onNavigate('form1', 'https://forms.example.com/contact')
        }}
      />
    )
  }
  if (page === 'form1') {
    return (
      <Form1Page
        data={formData}
        setData={setFormData}
        onStep={onStep}
        onLiveStep={onLiveStep}
        onCommitLive={onCommitLive}
        onNext={() => {
          onStep('Click "Next"')
          onNavigate('form2', 'https://forms.example.com/confirm')
        }}
      />
    )
  }
  if (page === 'form2') {
    return (
      <Form2Page
        data={formData}
        setData={setFormData}
        onStep={onStep}
        onLiveStep={onLiveStep}
        onCommitLive={onCommitLive}
        onSubmit={() => {
          onStep('Click "Submit"')
          onNavigate('done', 'https://forms.example.com/thanks')
        }}
      />
    )
  }
  if (page === 'done') return <DonePage />
  return (
    <HomePage
      onOpenForm={() => {
        const url = 'https://forms.example.com/contact'
        onStep(`Navigate to ${url}`)
        onNavigate('form1', url)
      }}
    />
  )
}
