import { useState } from 'react'

export default function Tooltip({ label, children, side = 'top', className = '', wide = false, width, padded = true }) {
  const [open, setOpen] = useState(false)

  const pos = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }[side]

  return (
    <span
      className={'relative inline-flex ' + className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && label && (
        <span
          role="tooltip"
          className={
            'pointer-events-none absolute z-50 overflow-hidden rounded-md border border-hairline bg-white text-[11.5px] font-medium text-ink shadow-[0_4px_12px_rgba(0,0,0,0.12)] ' +
            (padded ? 'px-2 py-1 ' : '') +
            (width ? 'whitespace-normal ' : wide ? 'w-64 whitespace-normal ' : 'whitespace-nowrap ') +
            pos
          }
          style={width ? { width } : undefined}
        >
          {label}
        </span>
      )}
    </span>
  )
}
