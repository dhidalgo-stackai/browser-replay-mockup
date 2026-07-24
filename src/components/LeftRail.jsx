import { useState } from 'react'
import {
  Cube,
  Search,
  Home,
  Database,
  Star,
  Grid,
  Globe,
  ShareNodes,
  BarChart,
  Briefcase,
  Sidebar,
  Bell,
  HelpCircle,
  Activity,
  ChevronDown,
  Sparkle,
  Compare,
  ArrowUp,
  StackAILogo,
} from './icons.jsx'

function RailIcon({ children, brand = false, notif = false, title }) {
  return (
    <div
      title={title}
      className={
        'relative mb-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-100 ' +
        (brand ? 'text-brand' : 'text-muted') +
        (notif
          ? " after:absolute after:right-1.5 after:top-1.5 after:h-2 after:w-2 after:rounded-full after:border-2 after:border-white after:bg-blue-500 after:content-['']"
          : '')
      }
    >
      {children}
    </div>
  )
}

function RailRow({ icon, label, brand = false, notif = false, active = false, right = null, indent = false, muted = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={
        'group relative mb-0.5 flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2 text-[13px] ' +
        (indent ? 'ml-4 ' : '') +
        (active
          ? 'bg-gray-100 text-ink'
          : (brand
              ? 'text-brand hover:bg-gray-100'
              : (muted ? 'text-muted hover:bg-gray-100 hover:text-ink' : 'text-ink hover:bg-gray-100')))
      }
    >
      <span className={'relative flex h-5 w-5 flex-shrink-0 items-center justify-center ' + (brand ? 'text-brand' : (muted ? 'text-muted' : 'text-ink'))}>
        {icon}
        {notif && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-white bg-blue-500" />}
      </span>
      <span className="truncate flex-1">{label}</span>
      {right}
    </div>
  )
}

function MoreSection() {
  const [open, setOpen] = useState(true)
  return (
    <>
      <div
        onClick={() => setOpen(v => !v)}
        className="group mt-0.5 mb-0.5 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-muted hover:bg-gray-100 hover:text-ink cursor-pointer"
      >
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
        </span>
        <span className="flex-1">More</span>
        <span className={'hidden group-hover:flex h-4 w-4 items-center justify-center text-muted transition-transform ' + (open ? '' : '-rotate-90')}>
          <ChevronDown size={14} />
        </span>
      </div>
      {open && (
        <>
          <RailRow icon={<Sparkle size={16} />} label="Browser automation" active indent onClick={() => { window.location.hash = '/browser-automation' }} />
          <RailRow icon={<Globe size={16} />} label="Environments" muted indent />
          <RailRow icon={<Compare size={16} />} label="Pull requests" muted indent />
        </>
      )}
    </>
  )
}

export default function LeftRail({ expanded = false, showMore = true }) {
  if (expanded) {
    return (
      <div className="sticky top-0 flex h-screen w-[240px] flex-shrink-0 flex-col border-r border-hairline bg-white px-2 py-2.5">
        <div className="mb-2 flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-1.5">
            <StackAILogo size={18} />
            <span className="text-[14px] font-semibold text-ink">StackAI</span>
          </div>
          <button className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-gray-100 hover:text-ink" title="Collapse sidebar">
            <Sidebar size={16} />
          </button>
        </div>

        <div className="mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-teal-600 text-[13px] font-semibold text-white">
            <StackAILogo size={14} color="#fff" />
          </div>
          <span className="flex-1 truncate text-[13px] font-medium text-ink">Stack AI Internal</span>
          <ChevronDown size={14} />
        </div>

        <RailRow
          muted
          icon={<Search size={16} />}
          label="Global search"
          right={<span className="rounded border border-hairline px-1.5 py-0.5 text-[10.5px] text-muted">⌘K</span>}
        />

        <div className="mt-2">
          <RailRow icon={<Grid size={16} />} label="Projects" onClick={() => { window.location.hash = '/' }} />
          <RailRow icon={<Database size={16} />} label="Knowledge bases" />
          <RailRow icon={<ShareNodes size={16} />} label="Connections" />
          <RailRow icon={<Sparkle size={16} />} label="Skills" />
          <RailRow icon={<BarChart size={16} />} label="Analytics" />
          <RailRow icon={<Globe size={16} />} label="Published agents" />

          {showMore && <MoreSection />}
        </div>

        <div className="flex-1" />

        <RailRow muted icon={<ArrowUp size={16} />} label="Upgrade" />
        <RailRow muted icon={<Bell size={16} />} label="Notifications" notif />
        <RailRow muted icon={<HelpCircle size={16} />} label="Help & more" />
        <RailRow
          muted
          icon={<Activity size={16} />}
          label="System status"
          right={<span className="h-2 w-2 rounded-full bg-green-500" />}
        />
        <div className="mt-1 flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">JM</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-ink">John Miller</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-14 flex-shrink-0 flex-col items-center border-r border-hairline bg-white py-2.5">
      <RailIcon><Search size={18} /></RailIcon>
      <RailIcon><Home size={18} /></RailIcon>
      <RailIcon><Database size={18} /></RailIcon>
      <RailIcon><Star size={18} /></RailIcon>
      <RailIcon><Grid size={18} /></RailIcon>
      <RailIcon><Globe size={18} /></RailIcon>
      <RailIcon><ShareNodes size={18} /></RailIcon>
      <RailIcon><BarChart size={18} /></RailIcon>
      <RailIcon><Briefcase size={18} /></RailIcon>

      <div className="flex-1" />

      <RailIcon><Sidebar size={18} /></RailIcon>
      <RailIcon notif><Bell size={18} /></RailIcon>
      <RailIcon><HelpCircle size={18} /></RailIcon>
      <RailIcon><Activity size={18} /></RailIcon>
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">D</div>
    </div>
  )
}
