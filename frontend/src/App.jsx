import { useState, useEffect } from 'react'
import './index.css'

const SPORTS = [
  { id: 'f1', name: 'Formula 1', active: true },
  { id: 'football', name: 'Football', active: false },
  { id: 'basketball', name: 'Basketball', active: false },
]

const F1_ATHLETES = [
  { id: 'verstappen', name: 'Max Verstappen' },
  { id: 'hamilton', name: 'Lewis Hamilton' },
  { id: 'schumacher', name: 'Michael Schumacher' },
]

function StatRow({ label, valA, valB }) {
  const numA = parseFloat(valA) || 0
  const numB = parseFloat(valB) || 0
  const winA = numA > numB
  const winB = numB > numA
  
  return (
    <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-4 -mx-4">
      <div className={`w-1/3 text-center text-2xl font-black tabular-nums transition-opacity duration-300 ${winA ? 'text-accent-yellow opacity-100 drop-shadow-[0_0_8px_rgba(236,173,10,0.5)]' : 'text-accent-yellow opacity-35 drop-shadow-none'}`}>
        {valA}
      </div>
      <div className="w-1/3 text-center text-[13px] font-bold tracking-[0.2em] text-gray-text uppercase">
        {label}
      </div>
      <div className={`w-1/3 text-center text-2xl font-black tabular-nums transition-opacity duration-300 ${winB ? 'text-accent-yellow opacity-100 drop-shadow-[0_0_8px_rgba(236,173,10,0.5)]' : 'text-accent-yellow opacity-35 drop-shadow-none'}`}>
        {valB}
      </div>
    </div>
  )
}

function ComparisonCard({ data }) {
  if (!data || !data.a || !data.b) return null;
  const { a, b } = data;
  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-blue-primary/20 bg-dark-navy/80 p-8 shadow-[0_0_60px_-15px_rgba(32,157,215,0.3)] backdrop-blur-xl mt-8">
      <div className="flex justify-between mb-10 items-center gap-6 pb-6 border-b border-white/10">
        <h2 className="w-2/5 text-center text-4xl font-black text-white tracking-tight">{a.name}</h2>
        <div className="w-1/5 text-center text-purple-secondary/80 font-black italic text-xl">VS</div>
        <h2 className="w-2/5 text-center text-4xl font-black text-white tracking-tight">{b.name}</h2>
      </div>
      
      <div className="flex flex-col gap-1">
        <StatRow label="Wins" valA={a.wins} valB={b.wins} />
        <StatRow label="Podiums" valA={a.podiums} valB={b.podiums} />
        <StatRow label="Poles" valA={a.poles} valB={b.poles} />
        <StatRow label="Fastest Laps" valA={a.fastest_laps} valB={b.fastest_laps} />
        <StatRow label="Championships" valA={a.championships} valB={b.championships} />
        <StatRow label="Total Points" valA={a.total_points} valB={b.total_points} />
      </div>
    </div>
  )
}

function App() {
  const [sport, setSport] = useState('f1')
  const [athleteA, setAthleteA] = useState('verstappen')
  const [athleteB, setAthleteB] = useState('hamilton')
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!sport || !athleteA || !athleteB) return;
    setLoading(true)
    fetch(`/api/compare/athletes?sport=${sport}&a=${athleteA}&b=${athleteB}`)
      .then(res => res.json())
      .then(json => {
        if (!json.detail) setData(json)
        else setData(null)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [sport, athleteA, athleteB])

  return (
    <div className="min-h-screen py-16 px-6 font-sans antialiased text-white selection:bg-blue-primary/30">
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-primary/20 blur-[100px] -z-10 rounded-full"></div>
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">
          SMART<span className="text-blue-primary">COMPARE</span>
        </h1>
        <p className="text-gray-text text-xl font-medium tracking-wide">Select your legends. Uncover the stats.</p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between mb-8 p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-3 w-full md:w-1/4">
          <label className="text-xs uppercase tracking-[0.15em] text-gray-text font-bold pl-1">Sport</label>
          <div className="flex flex-col bg-black/60 p-1.5 rounded-xl border border-white/5">
            {SPORTS.map(s => (
              <button
                key={s.id}
                disabled={!s.active}
                onClick={() => setSport(s.id)}
                className={`flex-1 py-3 text-sm font-bold tracking-wide rounded-lg transition-all ${
                  sport === s.id 
                    ? 'bg-blue-primary text-white shadow-[0_0_15px_rgba(32,157,215,0.4)]' 
                    : s.active 
                      ? 'text-gray-300 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 cursor-not-allowed opacity-40'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center flex-1 w-full min-w-0">
           <div className="flex-1 w-full relative">
             <label className="block text-xs uppercase tracking-[0.15em] text-gray-text font-bold mb-3 pl-1">Athlete A</label>
             <div className="relative">
               <select 
                 className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl appearance-none font-bold text-lg hover:border-white/20 focus:outline-none focus:border-blue-primary transition-all cursor-pointer drop-shadow-sm pr-10"
                 value={athleteA}
                 onChange={e => setAthleteA(e.target.value)}
               >
                 {F1_ATHLETES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-text">▼</div>
             </div>
           </div>
           
           <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-secondary to-blue-primary shadow-[0_0_20px_rgba(117,57,145,0.4)] md:mt-8">
             <span className="text-white font-black italic text-lg leading-none mt-0.5 ml-0.5">VS</span>
           </div>
           
           <div className="flex-1 w-full relative">
             <label className="block text-xs uppercase tracking-[0.15em] text-gray-text font-bold mb-3 pl-1 md:text-right">Athlete B</label>
             <div className="relative">
               <select 
                 className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl appearance-none font-bold text-lg hover:border-white/20 focus:outline-none focus:border-blue-primary transition-all cursor-pointer drop-shadow-sm px-4 md:text-right md:pl-10"
                 value={athleteB}
                 onChange={e => setAthleteB(e.target.value)}
               >
                 {F1_ATHLETES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
               </select>
               <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-text hidden md:block">▼</div>
             </div>
           </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-32 space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-accent-yellow animate-[spin_1.5s_linear_infinite_reverse]"></div>
            </div>
            <p className="text-blue-primary font-bold tracking-widest text-sm uppercase animate-pulse">Calculating Stats...</p>
          </div>
        ) : (
          <ComparisonCard data={data} />
        )}
      </div>
    </div>
  )
}

export default App
