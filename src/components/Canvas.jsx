import { useState } from 'react'
import {
  Play,
  ChevronDown,
  CalendarClock,
  Monitor,
  StarFilled,
  Plus,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Cursor,
  Fit,
  PageFile,
  LayoutCube,
  Camera,
  Video,
} from './icons.jsx'

const RECORDING_SITES = {
  'Download vendor invoices': 'netsuite.com',
  'Extract Salesforce lead list': 'salesforce.com',
}

function RecordingFavicon({ name, size = 12 }) {
  const site = RECORDING_SITES[name]
  const [failed, setFailed] = useState(false)
  if (!site || failed) {
    return <span className="text-gray-500"><Video size={size} /></span>
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

function Port({ side }) {
  return (
    <span
      className={
        'absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-[3px] border-[1.5px] border-gray-300 bg-white ' +
        (side === 'left' ? '-left-1.5' : '-right-1.5')
      }
    />
  )
}

function WorkflowNode({ icon, iconTone, title, desc, meta, selected, style, onClick, recording }) {
  return (
    <div
      style={style}
      onClick={onClick}
      className={
        'absolute w-[260px] cursor-pointer rounded-xl bg-white p-3.5 ' +
        (selected
          ? 'shadow-[0_4px_14px_rgba(0,0,0,0.06),0_0_0_1.5px_#b7bac0]'
          : 'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_0_0_1px_#ececec]')
      }
    >
      <Port side="left" />
      <Port side="right" />
      <div className="mb-2 flex items-center gap-2">
        <div className={
          'flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] ' +
          (iconTone === 'orange' ? 'bg-orange-50 text-orange-500 ring-1 ring-inset ring-orange-200' : 'bg-gray-100 text-gray-600')
        }>
          {icon}
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-semibold text-ink">
          {title}
        </div>
      </div>
      <div className="mb-3 text-[12.5px] leading-[1.45] text-muted">{desc}</div>
      {recording && (
        <div className="mb-3 flex w-full items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[12px] text-ink">
          <RecordingFavicon name={recording} />
          <span className="truncate">{recording}</span>
        </div>
      )}
      <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-2 text-[11.5px] text-muted">
        <div className="flex items-center gap-1">
          <ChevronDown size={12} />
          View Results
        </div>
        <div className="flex gap-2">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolIcon({ title, children }) {
  return (
    <div
      title={title}
      className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
    >
      {children}
    </div>
  )
}

function Divider() {
  return <div className="mx-1 h-[18px] w-px bg-gray-200" />
}

export default function Canvas({ onNodeClick, selectedNode, savedRecording }) {
  return (
    <div className="canvas-dots relative flex-1 overflow-hidden">
      <div className="absolute left-[100px] top-8 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <Play size={14} />
        Run
      </div>

      <svg className="pointer-events-none absolute inset-0">
        <path
          d="M 360 300 C 415 300, 415 340, 470 340"
          stroke="#c9ccd1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 730 340 C 775 340, 775 340, 820 340"
          stroke="#c9ccd1"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <WorkflowNode
        style={{ top: 220, left: 100 }}
        icon={<CalendarClock size={16} />}
        title="Scheduled Execution 2"
        desc="Trigger a workflow execution at a specific time."
        meta={['0.00 sec']}
      />

      <WorkflowNode
        style={{ top: 260, left: 470 }}
        selected={selectedNode === 'navigation'}
        onClick={() => onNodeClick?.('navigation')}
        icon={<Monitor size={16} />}
        iconTone="orange"
        title="Browser Navigation"
        desc="Replay a saved browser navigation recording from the shared browser..."
        meta={['0.00 sec', 'v1.0.0']}
      />

      <WorkflowNode
        style={{ top: 260, left: 820 }}
        selected={selectedNode === 'replay'}
        onClick={() => onNodeClick?.('replay')}
        icon={<Monitor size={16} />}
        iconTone="orange"
        title="Browser Navigation Replay"
        desc="Replay a saved browser navigation recording from the shared browser..."
        recording={savedRecording}
        meta={['0.00 sec', 'v1.0.0']}
      />

    </div>
  )
}
