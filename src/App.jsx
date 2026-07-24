import { useEffect, useState } from 'react'
import Topbar from './components/Topbar.jsx'
import LeftRail from './components/LeftRail.jsx'
import Canvas from './components/Canvas.jsx'
import Inspector from './components/Inspector.jsx'
import SandboxModal from './components/SandboxModal.jsx'
import FlowDetailPage from './components/FlowDetailPage.jsx'
import BrowserAutomationPage from './components/BrowserAutomationPage.jsx'

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash.replace(/^#/, '') || '/'
}

export default function App() {
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [savedRecording, setSavedRecording] = useState(null)
  const [extraRecordings, setExtraRecordings] = useState([])
  const route = useHashRoute()
  const sandboxOpen = route.startsWith('/sandbox/browser-navigation')

  const openSandbox = () => { window.location.hash = '/sandbox/browser-navigation' }
  const closeSandbox = () => {
    if (window.location.hash) history.pushState('', '', window.location.pathname + window.location.search)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  if (route.startsWith('/browser-automation/recording')) return <FlowDetailPage />
  if (route.startsWith('/browser-automation')) return <BrowserAutomationPage />

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar />

      <div className="relative flex min-h-0 flex-1">
        <LeftRail />
        <Canvas onNodeClick={() => setInspectorOpen(true)} />

        {inspectorOpen && (
          <Inspector
            onOpenSandbox={openSandbox}
            onClose={() => setInspectorOpen(false)}
            savedRecording={savedRecording}
            onSelectRecording={setSavedRecording}
            onClearRecording={() => setSavedRecording(null)}
            extraRecordings={extraRecordings}
          />
        )}
      </div>

      {sandboxOpen && (
        <SandboxModal
          onClose={closeSandbox}
          onSaveRecording={(recording) => {
            const { name, inputs = [] } = typeof recording === 'string' ? { name: recording } : recording
            setExtraRecordings((prev) => {
              const without = prev.filter((r) => r.name !== name)
              return [{ name, inputs }, ...without]
            })
            setSavedRecording(name)
            closeSandbox()
          }}
        />
      )}
    </div>
  )
}
