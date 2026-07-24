/**
 * Icon set ported 1:1 from the original mockup's inline SVGs.
 * Stroke icons share the <Stroke> wrapper; solid icons use <Solid>.
 */

function Stroke({ size = 18, width, height, sw = 2, children, ...rest }) {
  return (
    <svg
      className="block"
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      {...rest}
    >
      {children}
    </svg>
  )
}

function Solid({ size = 18, width, height, children, ...rest }) {
  return (
    <svg
      className="block"
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const Folder = (p) => (
  <Stroke {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Stroke>
)

export const Gear = (p) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Stroke>
)

export const Save = (p) => (
  <Stroke {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </Stroke>
)

export const Play = (p) => (
  <Solid {...p}>
    <polygon points="6 4 20 12 6 20 6 4" />
  </Solid>
)

export const ChevronDown = (p) => (
  <Stroke {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Stroke>
)

export const ChevronUp = (p) => (
  <Stroke {...p}>
    <polyline points="18 15 12 9 6 15" />
  </Stroke>
)

export const ChevronLeft = (p) => (
  <Stroke {...p}>
    <polyline points="15 18 9 12 15 6" />
  </Stroke>
)

export const Kebab = (p) => (
  <Solid {...p}>
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </Solid>
)

export const X = (p) => (
  <Stroke {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Stroke>
)

export const Plus = (p) => (
  <Stroke sw={2.5} {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Stroke>
)

export const Search = (p) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Stroke>
)

export const Home = (p) => (
  <Stroke {...p}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-8h-6v8H5a2 2 0 0 1-2-2z" />
  </Stroke>
)

export const Database = (p) => (
  <Stroke {...p}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14a9 3 0 0 0 18 0V5" />
    <path d="M3 12a9 3 0 0 0 18 0" />
  </Stroke>
)

export const Star = (p) => (
  <Stroke {...p}>
    <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z" />
  </Stroke>
)

export const Grid = (p) => (
  <Stroke {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </Stroke>
)

export const Globe = (p) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
  </Stroke>
)

export const ShareNodes = (p) => (
  <Stroke {...p}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="12" cy="18" r="3" />
    <path d="M6 9v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" />
    <path d="M12 14v1" />
  </Stroke>
)

export const BarChart = (p) => (
  <Stroke {...p}>
    <line x1="4" y1="20" x2="4" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="20" y1="20" x2="20" y2="14" />
  </Stroke>
)

export const Briefcase = (p) => (
  <Stroke {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Stroke>
)

export const Sidebar = (p) => (
  <Stroke {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </Stroke>
)

export const Bell = (p) => (
  <Stroke {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Stroke>
)

export const HelpCircle = (p) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Stroke>
)

export const Activity = (p) => (
  <Stroke {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Stroke>
)

export const StarFilled = (p) => (
  <Solid {...p}>
    <path d="M12 2 L14 9 L21 10 L15.5 14.5 L17 21 L12 17.5 L7 21 L8.5 14.5 L3 10 L10 9 Z" />
  </Solid>
)

export const Undo = (p) => (
  <Stroke {...p}>
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </Stroke>
)

export const Redo = (p) => (
  <Stroke {...p}>
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
  </Stroke>
)

export const ZoomIn = (p) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </Stroke>
)

export const ZoomOut = (p) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="8" y1="11" x2="14" y2="11" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </Stroke>
)

export const Cursor = (p) => (
  <Solid {...p}>
    <path d="M4 3 L4 18 L8.5 14 L11 20 L13.5 19 L11 13 L17 13 Z" />
  </Solid>
)

export const Fit = (p) => (
  <Stroke {...p}>
    <path d="M3 8V5a2 2 0 0 1 2-2h3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
  </Stroke>
)

export const PageFile = (p) => (
  <Stroke {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </Stroke>
)

export const LayoutCube = (p) => (
  <Stroke {...p}>
    <path d="M12 2 L22 8 L12 14 L2 8 Z" />
    <path d="M2 16 L12 22 L22 16" />
  </Stroke>
)

export const Camera = (p) => (
  <Stroke {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </Stroke>
)

export const CalendarClock = (p) => (
  <Stroke {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="17" cy="16" r="2" />
  </Stroke>
)

export const Monitor = (p) => (
  <Stroke {...p}>
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <line x1="8" y1="22" x2="16" y2="22" />
    <line x1="12" y1="18" x2="12" y2="22" />
  </Stroke>
)

export const Cube = (p) => (
  <Solid {...p}>
    <path d="M12 2 L22 8 L12 14 L2 8 Z" />
    <path d="M2 12 L12 18 L22 12" fill="none" stroke="currentColor" strokeWidth="2" />
  </Solid>
)

export const Compare = (p) => (
  <Stroke {...p}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Stroke>
)

export const Video = (p) => (
  <Stroke {...p}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </Stroke>
)

export const DownloadArrow = (p) => (
  <Stroke {...p}>
    <path d="M12 3v12" />
    <polyline points="8 11 12 15 16 11" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </Stroke>
)

export const AlertTriangle = (p) => (
  <Stroke {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Stroke>
)

export const ListView = (p) => (
  <Stroke {...p}>
    <line x1="9" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="9" y1="18" x2="21" y2="18" />
    <line x1="4" y1="6" x2="4.01" y2="6" />
    <line x1="4" y1="12" x2="4.01" y2="12" />
    <line x1="4" y1="18" x2="4.01" y2="18" />
  </Stroke>
)

export const Braces = (p) => (
  <Stroke sw={2.2} {...p}>
    <path d="M8 4H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2" />
    <path d="M16 4h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2" />
  </Stroke>
)

export const InfoCircle = (p) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Stroke>
)

export const ExternalLink = (p) => (
  <Stroke {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </Stroke>
)

export const Upload = (p) => (
  <Stroke {...p}>
    <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
    <polyline points="12 2 12 15" />
    <polyline points="8 6 12 2 16 6" />
  </Stroke>
)

export const Wrench = (p) => (
  <Stroke {...p}>
    <path d="M4 4l6 6" />
    <circle cx="16" cy="16" r="4" />
    <path d="M20 20l-2-2" />
  </Stroke>
)

export const ArrowLeft = (p) => (
  <Stroke {...p}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </Stroke>
)

export const ArrowRight = (p) => (
  <Stroke {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Stroke>
)

export const Refresh = (p) => (
  <Stroke {...p}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Stroke>
)

export const Lock = (p) => (
  <Stroke {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Stroke>
)

export const Sparkle = (p) => (
  <Stroke {...p}>
    <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" />
  </Stroke>
)

export const SquarePlus = (p) => (
  <Stroke {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </Stroke>
)

export const Puzzle = (p) => (
  <Stroke {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v4h-2a2 2 0 0 0 0 4h2v4a2 2 0 0 1-2 2h-4v-2a2 2 0 0 0-4 0v2H6a2 2 0 0 1-2-2v-4H2a2 2 0 0 0 0-4h2V6a2 2 0 0 1 2-2h4V2a2 2 0 0 1 4 0v2z" />
  </Stroke>
)

export const User = (p) => (
  <Stroke {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Stroke>
)

export const ArrowUp = (p) => (
  <Stroke sw={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="11" y1="22" x2="11" y2="4" />
    <polyline points="4 11 11 4 18 11" />
  </Stroke>
)

/** Official Stack AI logo mark (single path). Defaults to black; pass `muted`
 *  for the white version, or `color` to override entirely. */
export function StackAILogo({ size = 20, muted = false, color }) {
  const fill = color ?? (muted ? '#fff' : '#1D1D1D')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 247 252"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        d="M246.977 202.478v-56.281c0-5.389-2.84-10.383-7.471-13.171l-49.898-29.894a3.836 3.836 0 0 1-1.862-3.298v-58.21c0-4.041-2.118-7.804-5.609-9.871L133.938 2.88a20.387 20.387 0 0 0-20.899 0l-48.2 28.873c-3.467 2.09-5.608 5.83-5.608 9.871V99.88a3.839 3.839 0 0 1-1.862 3.299L7.47 133.003A15.354 15.354 0 0 0 0 146.173v56.282c0 7.735 3.863 14.889 10.1 18.652l46.175 28.013a15.404 15.404 0 0 0 15.965 0l49.503-29.778c1.21-.721 2.723-.697 3.933.023l51.062 30.963a11.578 11.578 0 0 0 11.986 0l48.175-29.221C243.137 217.321 247 210.19 247 202.455l-.023.023Zm-128.865 0c0 4.135-1.978 7.898-5.097 9.802l-38.843 23.553c-3.188 1.928-7.005-.766-7.005-4.947v-45.899c0-4.134 1.978-7.897 5.097-9.802l38.843-23.553c3.188-1.928 7.005.767 7.005 4.948v45.898Zm59.231-102.366c0 4.135-1.978 7.898-5.097 9.803l-38.843 23.553c-3.189 1.928-7.005-.767-7.005-4.948V82.622c0-4.135 1.978-7.898 5.096-9.802l38.844-23.553c3.188-1.928 7.005.766 7.005 4.947v45.898Zm59.231 102.366c0 4.135-1.979 7.898-5.097 9.802l-38.844 23.553c-3.188 1.928-7.005-.766-7.005-4.947v-45.899c0-4.134 1.978-7.897 5.097-9.802l38.843-23.553c3.189-1.928 7.006.767 7.006 4.948v45.898Z"
        fill={fill}
      />
    </svg>
  )
}
