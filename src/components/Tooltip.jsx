import { useState, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Tooltip({ label, children, side = 'top', className = '', wide = false, width, padded = true }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const tipRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return
    const a = anchorRef.current.getBoundingClientRect()
    const t = tipRef.current?.getBoundingClientRect() || { width: width || 200, height: 40 }
    const gap = 6
    let top = 0, left = 0
    if (side === 'top') { top = a.top - t.height - gap; left = a.left + a.width / 2 - t.width / 2 }
    else if (side === 'bottom') { top = a.bottom + gap; left = a.left + a.width / 2 - t.width / 2 }
    else if (side === 'left') { top = a.top + a.height / 2 - t.height / 2; left = a.left - t.width - gap }
    else if (side === 'right') { top = a.top + a.height / 2 - t.height / 2; left = a.right + gap }
    setCoords({ top, left })
  }, [open, side, width])

  return (
    <span
      ref={anchorRef}
      className={'relative inline-flex ' + className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && label && createPortal(
        <span
          ref={tipRef}
          role="tooltip"
          style={{ position: 'fixed', top: coords.top, left: coords.left, width: width || undefined }}
          className={
            'pointer-events-none z-[100] overflow-hidden rounded-md border border-hairline bg-white text-[11.5px] font-medium text-ink shadow-[0_4px_12px_rgba(0,0,0,0.12)] ' +
            (padded ? 'px-2 py-1 ' : '') +
            (width ? 'whitespace-normal ' : wide ? 'w-64 whitespace-normal ' : 'whitespace-nowrap ')
          }
        >
          {label}
        </span>,
        document.body
      )}
    </span>
  )
}
