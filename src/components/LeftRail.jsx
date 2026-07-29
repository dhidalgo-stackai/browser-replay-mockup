import { useEffect, useState } from 'react'
import {
  Search,
  Database,
  Grid,
  Globe,
  ShareNodes,
  BarChart,
  Sidebar,
  Bell,
  HelpCircle,
  Activity,
  ChevronDown,
  Sparkle,
  Monitor,
  Compare,
  ArrowUp,
  StackAILogo,
} from './icons.jsx'

const COLLAPSED_W = 56
const EXPANDED_W = 240

function Row({
  icon,
  label,
  isExpanded,
  right = null,
  active = false,
  brand = false,
  muted = false,
  notif = false,
  indent = false,
  onClick,
}) {
  const color = active
    ? 'bg-gray-100 text-ink'
    : brand
      ? 'text-brand hover:bg-gray-100'
      : muted
        ? 'text-muted hover:bg-gray-100 hover:text-ink'
        : 'text-ink hover:bg-gray-100'
  const fade =
    'transition-opacity duration-150 ' +
    (isExpanded ? 'opacity-100 delay-75' : 'opacity-0 pointer-events-none')
  return (
    <div
      onClick={onClick}
      style={{ marginLeft: indent && isExpanded ? 22 : 6, marginRight: 6 }}
      className={
        'group relative mb-0.5 flex h-8 cursor-pointer items-center gap-2 rounded-md px-1.5 text-[13px] ' +
        color
      }
    >
      <span
        className={
          'relative flex h-8 w-8 flex-shrink-0 items-center justify-center ' +
          (brand ? 'text-brand' : muted ? 'text-muted' : 'text-ink')
        }
      >
        {icon}
        {notif && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full border-2 border-white bg-blue-500" />
        )}
      </span>
      <span className={'min-w-0 flex-1 truncate whitespace-nowrap ' + fade}>{label}</span>
      {right && <span className={'flex-shrink-0 ' + fade}>{right}</span>}
    </div>
  )
}

function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash.replace(/^#/, '') || '/'
}

function MoreSection({ isExpanded, route }) {
  const [open, setOpen] = useState(route !== '/')
  const fade =
    'transition-opacity duration-150 ' +
    (isExpanded ? 'opacity-100 delay-75' : 'opacity-0 pointer-events-none')
  if (!isExpanded) return null
  return (
    <>
      <div
        onClick={() => setOpen(v => !v)}
        style={{ marginLeft: 6, marginRight: 6 }}
        className="group mt-0.5 mb-0.5 flex h-8 cursor-pointer items-center gap-2 rounded-md px-1.5 text-[13px] text-muted hover:bg-gray-100 hover:text-ink"
      >
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </span>
        <span className={'min-w-0 flex-1 whitespace-nowrap ' + fade}>{open ? 'Less' : 'More'}</span>
        <span
          className={
            'hidden h-4 w-4 items-center justify-center text-muted transition-transform group-hover:flex ' +
            (open ? '' : '-rotate-90') +
            ' ' +
            fade
          }
        >
          <ChevronDown size={14} />
        </span>
      </div>
      {open && (
        <div className="anim-fade">
          <Row
            isExpanded={isExpanded}
            icon={<Monitor size={18} />}
            label="Browser automation"
            active={route.startsWith('/browser-automation')}
            indent
            onClick={() => {
              window.location.hash = '/browser-automation'
            }}
          />
          <Row isExpanded={isExpanded} icon={<Globe size={18} />} label="Environments" muted indent />
          <Row isExpanded={isExpanded} icon={<Compare size={18} />} label="Pull requests" muted indent />
        </div>
      )}
    </>
  )
}

export default function LeftRail({ expanded = false, showMore = true }) {
  const [hovered, setHovered] = useState(false)
  const route = useRoute()
  const isExpanded = expanded || hovered
  const overlay = !expanded && hovered
  const fade =
    'transition-opacity duration-150 ' +
    (isExpanded ? 'opacity-100 delay-75' : 'opacity-0 pointer-events-none')

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: isExpanded ? EXPANDED_W : COLLAPSED_W }}
        className={
          (overlay ? 'absolute left-0 top-0 z-40 shadow-lg ' : 'sticky top-0 ') +
          'flex h-screen flex-col overflow-hidden border-r border-hairline bg-white py-2.5 transition-[width] duration-200 ease-out'
        }
      >
        {/* Header: StackAI logo + collapse button */}
        <div
          style={{ marginLeft: 6, marginRight: 6 }}
          className="mb-1 flex h-8 items-center gap-2 px-1.5"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            <StackAILogo size={18} />
          </span>
          <span className={'min-w-0 flex-1 truncate whitespace-nowrap text-[14px] font-semibold text-ink ' + fade}>
            StackAI
          </span>
          <button
            className={
              'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-muted hover:bg-gray-100 hover:text-ink ' +
              fade
            }
            title="Collapse sidebar"
          >
            <Sidebar size={16} />
          </button>
        </div>

        <Row
          isExpanded={isExpanded}
          muted
          icon={<Search size={18} />}
          label="Global search"
          right={<span className="rounded border border-hairline px-1.5 py-0.5 text-[10.5px] text-muted">⌘K</span>}
        />

        <div className="mt-2">
          <Row
            isExpanded={isExpanded}
            icon={<Grid size={18} />}
            label="Projects"
            active={route === '/'}
            onClick={() => {
              window.location.hash = '/'
            }}
          />
          <Row isExpanded={isExpanded} icon={<Database size={18} />} label="Knowledge bases" />
          <Row
            isExpanded={isExpanded}
            icon={<ShareNodes size={18} />}
            label="Connections"
            active={route.startsWith('/connections')}
            onClick={() => { window.location.hash = '/connections' }}
          />
          <Row isExpanded={isExpanded} icon={<Sparkle size={18} />} label="Skills" />
          <Row isExpanded={isExpanded} icon={<BarChart size={18} />} label="Analytics" />
          <Row isExpanded={isExpanded} icon={<Globe size={18} />} label="Published agents" />
          {showMore && <MoreSection isExpanded={isExpanded} route={route} />}
        </div>

        <div className="flex-1" />

        <Row isExpanded={isExpanded} muted icon={<ArrowUp size={18} />} label="Upgrade" />
        <Row isExpanded={isExpanded} muted icon={<Bell size={18} />} label="Notifications" notif />
        <Row isExpanded={isExpanded} muted icon={<HelpCircle size={18} />} label="Help & more" />
        <Row
          isExpanded={isExpanded}
          muted
          icon={<Activity size={18} />}
          label="System status"
          right={<span className="h-2 w-2 rounded-full bg-green-500" />}
        />

        <div
          style={{ marginLeft: 6, marginRight: 6 }}
          className="mt-1 flex h-9 cursor-pointer items-center gap-2 rounded-md px-1.5 hover:bg-gray-100"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
              JM
            </div>
          </span>
          <div className={'min-w-0 flex-1 ' + fade}>
            <div className="truncate whitespace-nowrap text-[13px] text-ink">John Miller</div>
          </div>
        </div>
      </div>
    </div>
  )
}
