import { Folder, Gear, Save, Play, ChevronDown, Kebab } from './icons.jsx'

function IconButton({ title, children }) {
  return (
    <div
      title={title}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-gray-100"
    >
      {children}
    </div>
  )
}

export default function Topbar() {
  return (
    <div className="flex flex-shrink-0 items-center gap-3 border-b border-hairline bg-white px-3.5 py-2.5">
      <div className="flex items-center gap-1.5 text-[14px] text-muted">
        <span className="opacity-60">
          <Folder size={16} />
        </span>
        <span>dhidalgo@stack-ai.com Personal Folder</span>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-ink">New Workflow (14) Copy</span>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <div className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
          11.0.0
        </div>

        <div
          title="Theme toggle"
          className="relative h-[22px] w-10 cursor-pointer rounded-[20px] bg-ink after:absolute after:right-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:content-['']"
        />

        <IconButton title="Settings">
          <Gear size={18} />
        </IconButton>

        <div className="h-5 w-px bg-gray-200" />

        <IconButton title="Save">
          <Save size={18} />
        </IconButton>

        <div className="h-5 w-px bg-gray-200" />

        <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium">
          <Play size={14} />
          Run
        </button>

        <button className="relative flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 font-medium text-white">
          Publish
          <ChevronDown size={14} sw={2.5} />
          <span className="absolute -right-[3px] -top-[3px] h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500" />
        </button>

        <div className="h-5 w-px bg-gray-200" />

        <div className="cursor-pointer px-1 text-muted">
          <Kebab size={18} />
        </div>
      </div>
    </div>
  )
}
