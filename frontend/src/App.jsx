import { useState, useEffect, useRef } from 'react'
import './index.css'

const SPORTS = [
  { id: 'football', name: 'Football', active: false },
  { id: 'basketball', name: 'Basketball', active: false },
  { id: 'f1', name: 'Formula 1', active: true },
]

const F1_ATHLETES = [
  { id: 'verstappen', name: 'Max Verstappen' },
  { id: 'hamilton', name: 'Lewis Hamilton' },
  { id: 'schumacher', name: 'Michael Schumacher' },
]

function CustomSelect({ options, value, onChange, label, focusColor, disabledOptionIds = [], mode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group w-full" ref={dropdownRef}>
      <label className={`block text-xs sm:text-sm uppercase tracking-[0.2em] font-black mb-3 ml-2 transition-colors ${mode === 'night' ? 'text-gray-text' : 'text-[#5b6a7e]'} ${focusColor === 'blue' ? 'group-hover:text-blue-primary' : 'group-hover:text-purple-secondary'}`}>
        {label}
      </label>
      <div 
        className={`w-full p-5 sm:p-6 rounded-[1.5rem] font-black text-xl sm:text-3xl transition-all cursor-pointer backdrop-blur-2xl shadow-2xl flex justify-between items-center ${mode === 'night' ? 'bg-[#152334]/85 border border-[#4a5f77] text-[#dbe4ee] hover:border-[#6f87a3]' : 'bg-white/80 border border-[#c5d8e8] text-[#032147] hover:border-[#7fb8d6]'} ${isOpen ? `ring-4 ${focusColor === 'blue' ? 'border-blue-primary ring-blue-primary/30' : 'border-purple-secondary ring-purple-secondary/30'}` : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="drop-shadow-lg">{selectedOption?.name}</span>
        <svg className={`w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${isOpen ? 'rotate-180' : ''} ${focusColor === 'blue' ? 'text-blue-primary' : 'text-purple-secondary'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 w-full mt-3 rounded-[1.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-4 duration-300 ${mode === 'night' ? 'bg-[#152334]/95 border border-[#4a5f77]' : 'bg-white/95 border border-[#c5d8e8]'}`}>
          {options.map(option => (
            <div
              key={option.id}
              className={`px-6 py-4 text-xl sm:text-2xl font-black transition-colors border-b border-white/5 last:border-0 ${
                disabledOptionIds.includes(option.id)
                  ? 'text-gray-600/40 cursor-not-allowed'
                  : `cursor-pointer hover:pl-8 ${value === option.id ? (focusColor === 'blue' ? 'bg-blue-primary/30 text-white' : 'bg-purple-secondary/30 text-white') : mode === 'night' ? 'text-[#9aaec3] hover:bg-[#263b55] hover:text-[#dbe4ee]' : 'text-[#36506d] hover:bg-[#e8f2f8] hover:text-[#032147]'}`
              }`}
              onClick={() => {
                if (disabledOptionIds.includes(option.id)) return;
                onChange(option.id);
                setIsOpen(false);
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatRow({ label, valA, valB, mode }) {
  const numA = parseFloat(valA) || 0
  const numB = parseFloat(valB) || 0
  const winA = numA > numB
  const winB = numB > numA
  const winnerClass = mode === 'night'
    ? 'text-[#7fc8ff] opacity-100 drop-shadow-[0_0_16px_rgba(127,200,255,0.45)] scale-[1.02]'
    : 'text-accent-yellow opacity-100 drop-shadow-[0_0_20px_rgba(236,173,10,0.6)] scale-[1.02]'
  const loserClass = mode === 'night' ? 'text-[#7fc8ff]/35 scale-95' : 'text-accent-yellow/35 scale-95'
  
  return (
    <div className={`flex justify-between items-center py-3 sm:py-4 border-b last:border-0 transition-colors rounded-xl px-2 sm:px-5 -mx-2 sm:-mx-5 group ${mode === 'night' ? 'border-white/10 hover:bg-white/[0.03]' : 'border-[#d8e6f1] hover:bg-[#f4f9fc]'}`}>
      <div className={`w-2/5 text-center text-2xl sm:text-4xl lg:text-5xl font-black tabular-nums transition-all duration-500 tracking-tight ${winA ? winnerClass : loserClass}`}>
        {valA}
      </div>
      <div className="w-1/5 flex items-center justify-center">
        <div className={`text-center text-[9px] sm:text-[10px] lg:text-xs font-black tracking-[0.12em] sm:tracking-[0.2em] uppercase transition-colors leading-tight ${mode === 'night' ? 'text-[#8ea1b6] group-hover:text-[#dbe4ee]' : 'text-[#6e7f95] group-hover:text-[#032147]'}`}>
          {label}
        </div>
      </div>
      <div className={`w-2/5 text-center text-2xl sm:text-4xl lg:text-5xl font-black tabular-nums transition-all duration-500 tracking-tight ${winB ? winnerClass : loserClass}`}>
        {valB}
      </div>
    </div>
  )
}

function ComparisonCard({ data, mode }) {
  if (!data || !data.a || !data.b) return null;
  const { a, b } = data;
  return (
    <div className={`w-full max-w-5xl mx-auto rounded-[1.5rem] sm:rounded-[2rem] border p-4 sm:p-6 lg:p-8 shadow-[0_0_80px_-30px_rgba(32,157,215,0.25)] backdrop-blur-3xl mt-6 relative overflow-hidden ${mode === 'night' ? 'border-[#4a5f77] bg-[#152334]/85' : 'border-[#8dc4df] bg-white/75'}`}>
      
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] blur-[150px] rounded-[100%] pointer-events-none ${mode === 'night' ? 'bg-blue-primary/10' : 'bg-blue-primary/20'}`}></div>
      
      <div className={`flex flex-col xl:flex-row justify-between mb-5 xl:mb-6 items-center gap-3 xl:gap-0 pb-5 xl:pb-6 border-b relative z-10 w-full ${mode === 'night' ? 'border-[#4a5f77]' : 'border-[#c8deed]'}`}>
        <h2 className={`w-full xl:w-[45%] text-center text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-2xl leading-none ${mode === 'night' ? 'text-[#dbe4ee]' : 'text-[#032147]'}`}>{a.name.split(' ').map((n, i) => <div key={i}>{n}</div>)}</h2>
        
        <div className="w-full xl:w-[10%] flex items-center justify-center my-2 xl:my-0">
           <span className={`font-black italic text-4xl sm:text-5xl tracking-tighter select-none ${mode === 'night' ? 'text-[#7f93a8]/40' : 'text-[#8ab3ce]'}`}>VS</span>
        </div>
        
        <h2 className={`w-full xl:w-[45%] text-center text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-2xl leading-none ${mode === 'night' ? 'text-[#dbe4ee]' : 'text-[#032147]'}`}>{b.name.split(' ').map((n, i) => <div key={i}>{n}</div>)}</h2>
      </div>
      
      <div className="flex flex-col gap-1.5 sm:gap-2 relative z-10">
        <StatRow label="Wins" valA={a.wins} valB={b.wins} mode={mode} />
        <StatRow label="Podiums" valA={a.podiums} valB={b.podiums} mode={mode} />
        <StatRow label="Poles" valA={a.poles} valB={b.poles} mode={mode} />
        <StatRow label="Fastest Laps" valA={a.fastest_laps} valB={b.fastest_laps} mode={mode} />
        <StatRow label="Total Points" valA={a.total_points} valB={b.total_points} mode={mode} />
        <StatRow label="Championships" valA={a.championships} valB={b.championships} mode={mode} />
      </div>
    </div>
  )
}

function App() {
  const [sport, setSport] = useState('f1')
  const [athleteA, setAthleteA] = useState('verstappen')
  const [athleteB, setAthleteB] = useState('schumacher')
  const [mode, setMode] = useState('night')
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const savedMode = window.localStorage.getItem('smartcompare-mode')
    if (savedMode === 'morning' || savedMode === 'night') {
      setMode(savedMode)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('smartcompare-mode', mode)
  }, [mode])

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
    <div className={`min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-10 font-sans antialiased selection:bg-blue-primary/30 relative overflow-hidden transition-colors duration-500 ${mode === 'night' ? 'text-[#dbe4ee] bg-[#0b1624]' : 'text-[#032147] bg-[#eef7fc]'}`}>
      {/* Background ambient lighting */}
      <div className={`fixed top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[200px] rounded-full pointer-events-none ${mode === 'night' ? 'bg-[#365b85]/25' : 'bg-blue-primary/20'}`}></div>
      <div className={`fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[200px] rounded-full pointer-events-none ${mode === 'night' ? 'bg-[#5f4c78]/25' : 'bg-accent-yellow/20'}`}></div>

      <button
        type="button"
        aria-label={mode === 'night' ? 'Switch to morning mode' : 'Switch to night mode'}
        onClick={() => setMode(mode === 'night' ? 'morning' : 'night')}
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 h-10 w-10 sm:h-11 sm:w-11 rounded-full border flex items-center justify-center transition-colors ${mode === 'night' ? 'border-[#6f87a3] bg-[#152334] text-[#dbe4ee] hover:bg-[#1c2f45]' : 'border-[#b4d1e4] bg-white/85 text-[#032147] hover:bg-white'}`}
      >
        {mode === 'night' ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a7 7 0 1 0 9 9 9 9 0 1 1-9-9" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-8 sm:mb-10 flex flex-col items-center mt-2">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-3">
            <span className={`bg-gradient-to-r bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(32,157,215,0.35)] animate-pulse ${mode === 'night' ? 'from-[#dbe4ee] via-[#8dc6ff] to-[#b59ad1]' : 'from-[#032147] via-blue-primary to-purple-secondary'}`}>
              SMART
            </span>
            <span className={`ml-2 sm:ml-3 ${mode === 'night' ? 'text-[#dbe4ee]' : 'text-[#032147]'}`}>COMPARE</span>
          </h1>
          <p className={`text-xs sm:text-sm font-black tracking-[0.18em] uppercase opacity-80 ${mode === 'night' ? 'text-[#95a5b8]' : 'text-[#60758e]'}`}>Data Driven <span className="text-purple-secondary">Glory</span></p>
        </header>

        {/* Centralized Sport Selection */}
        <div className="flex justify-center mb-7 sm:mb-8">
          <div className={`inline-flex p-2 rounded-[1.2rem] border shadow-[0_0_50px_rgba(0,0,0,0.2)] backdrop-blur-2xl ${mode === 'night' ? 'bg-[#1a2a3d]/80 border-[#4a5f77]' : 'bg-white/65 border-[#c5d8e8]'}`}>
            {SPORTS.map(s => (
              <button
                key={s.id}
                disabled={!s.active}
                onClick={() => setSport(s.id)}
                className={`relative px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-black tracking-[0.15em] uppercase rounded-xl transition-all duration-500 overflow-hidden ${
                  sport === s.id 
                    ? mode === 'night'
                      ? 'text-[#dbe4ee] shadow-[0_20px_50px_rgba(141,198,255,0.35)] bg-[#2f4f73] z-10'
                      : 'text-white shadow-[0_20px_50px_rgba(32,157,215,0.4)] bg-blue-primary z-10'
                    : s.active
                      ? mode === 'night'
                        ? 'text-[#95a5b8] hover:text-[#dbe4ee] hover:bg-[#263b55]'
                        : 'text-[#5b6a7e] hover:text-[#032147] hover:bg-[#e8f2f8]'
                      : 'text-gray-600/30 cursor-not-allowed hidden md:block'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Custom Athlete Selection */}
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8 items-start justify-between mb-6">
           <CustomSelect 
             label="Competitor A" 
             options={F1_ATHLETES} 
             value={athleteA} 
             onChange={setAthleteA} 
             focusColor="blue"
             disabledOptionIds={[athleteB]}
             mode={mode}
           />
           
           <div className="hidden lg:flex w-12 shrink-0 h-20 items-center justify-center">
             {/* Invisible spacer for desktop */}
           </div>

           <CustomSelect 
             label="Competitor B" 
             options={F1_ATHLETES} 
             value={athleteB} 
             onChange={setAthleteB} 
             focusColor="purple"
             disabledOptionIds={[athleteA]}
             mode={mode}
           />
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-60 space-y-12">
              <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                <div className="absolute inset-0 rounded-full border-t-8 border-r-8 border-blue-primary animate-spin opacity-90 drop-shadow-[0_0_20px_rgba(32,157,215,0.6)]"></div>
                <div className="absolute inset-4 rounded-full border-b-8 border-l-8 border-purple-secondary animate-[spin_1.2s_linear_infinite_reverse] opacity-90 drop-shadow-[0_0_20px_rgba(117,57,145,0.6)]"></div>
                <div className={`absolute inset-8 rounded-full border-t-8 border-r-8 animate-[spin_1.8s_linear_infinite] ${mode === 'night' ? 'border-[#7f93a8] drop-shadow-[0_0_20px_rgba(127,147,168,0.55)]' : 'border-accent-yellow drop-shadow-[0_0_20px_rgba(236,173,10,0.6)]'}`}></div>
              </div>
              <p className={`font-black tracking-[0.4em] text-xl sm:text-2xl uppercase animate-pulse ${mode === 'night' ? 'text-[#dbe4ee]' : 'text-[#032147]'}`}>Running Calculations</p>
            </div>
          ) : (
            <ComparisonCard data={data} mode={mode} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App

