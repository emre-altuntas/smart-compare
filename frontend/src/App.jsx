import { useState, useEffect } from 'react'

function App() {
  const [health, setHealth] = useState('Checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'ok') setHealth('Backend connected')
        else setHealth('Backend unavailable')
      })
      .catch(() => setHealth('Backend unavailable'))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      <h1 className="text-5xl font-bold text-accent-yellow mb-6">Smart Compare</h1>
      <div className="text-xl font-medium px-6 py-3 border border-blue-primary rounded-lg bg-black/20">
        Status: <span className={health === 'Backend connected' ? 'text-blue-primary' : 'text-gray-text'}>{health}</span>
      </div>
    </div>
  )
}

export default App
