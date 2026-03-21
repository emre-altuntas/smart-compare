import { useEffect, useRef, useState } from 'react'
import './index.css'

const SPORTS = [
  { id: 'f1', name: 'Formula 1', entityTypes: ['athletes'] },
  { id: 'football', name: 'Football', entityTypes: ['athletes', 'teams'] },
  { id: 'basketball', name: 'Basketball', entityTypes: ['athletes'] },
]

const ENTITY_TYPE_OPTIONS = [
  { id: 'athletes', name: 'Athletes' },
  { id: 'teams', name: 'Teams' },
]

const ENTITY_OPTIONS = {
  f1: {
    athletes: [
      { id: 'verstappen', name: 'Max Verstappen' },
      { id: 'hamilton', name: 'Lewis Hamilton' },
      { id: 'schumacher', name: 'Michael Schumacher' },
    ],
  },
  football: {
    athletes: [
      { id: 'messi', name: 'Lionel Messi' },
      { id: 'ronaldo', name: 'Cristiano Ronaldo' },
    ],
    teams: [
      { id: 'real-madrid', name: 'Real Madrid' },
      { id: 'barcelona', name: 'Barcelona' },
    ],
  },
  basketball: {
    athletes: [
      { id: 'lebron-james', name: 'LeBron James' },
      { id: 'michael-jordan', name: 'Michael Jordan' },
    ],
  },
}

const DEFAULT_SELECTIONS = {
  f1: { entityType: 'athletes', a: 'verstappen', b: 'hamilton' },
  football: {
    athletes: { a: 'messi', b: 'ronaldo' },
    teams: { a: 'real-madrid', b: 'barcelona' },
  },
  basketball: { entityType: 'athletes', a: 'lebron-james', b: 'michael-jordan' },
}

const ENTITY_LABELS = Object.values(ENTITY_OPTIONS).reduce((lookup, sportOptions) => {
  Object.values(sportOptions).forEach((options) => {
    options.forEach((option) => {
      lookup[option.id] = option.name
    })
  })
  return lookup
}, {})

function splitDisplayName(name) {
  return name.split(' ').map((part, index) => <div key={`${name}-${index}`}>{part}</div>)
}

function formatStatValue(value) {
  if (typeof value === 'number' && !Number.isInteger(value)) {
    return value.toFixed(1)
  }

  return `${value}`
}

function SegmentedToggle({ options, value, onChange, mode, className = '' }) {
  return (
    <div
      className={`inline-flex p-2 rounded-[1.2rem] border shadow-[0_0_50px_rgba(0,0,0,0.2)] backdrop-blur-2xl ${
        mode === 'night' ? 'bg-night-surface-alt/80 border-night-border' : 'bg-morning-card/65 border-morning-border'
      } ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`relative px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-black tracking-[0.15em] uppercase rounded-xl transition-all duration-500 overflow-hidden ${
            value === option.id
              ? mode === 'night'
                ? 'text-night-text shadow-[0_20px_50px_rgba(141,198,255,0.35)] bg-night-chip z-10'
                : 'text-white shadow-[0_20px_50px_rgba(32,157,215,0.4)] bg-blue-primary z-10'
              : mode === 'night'
                ? 'text-night-muted hover:text-night-text hover:bg-night-hover'
                : 'text-morning-muted-strong hover:text-morning-text hover:bg-morning-hover'
          }`}
        >
          {option.name}
        </button>
      ))}
    </div>
  )
}

function AutocompleteSelect({
  value,
  selectedLabel,
  onChange,
  label,
  searchPath,
  sport,
  focusColor,
  disabledOptionIds = [],
  mode,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(selectedLabel)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    setInputValue(selectedLabel)
  }, [selectedLabel])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setInputValue(selectedLabel)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedLabel])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      setLoading(true)
      setSearchError('')

      fetch(`${searchPath}?sport=${sport}&q=${encodeURIComponent(inputValue.trim())}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          const json = await response.json()
          if (!response.ok || json.detail) {
            throw new Error(json.detail || 'Search failed')
          }
          return json.results ?? []
        })
        .then((results) => {
          setOptions(results)
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            return
          }
          setSearchError('Search unavailable')
          setOptions([])
        })
        .finally(() => {
          setLoading(false)
        })
    }, 180)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [inputValue, isOpen, searchPath, sport])

  const accentClasses =
    focusColor === 'blue'
      ? 'border-blue-primary ring-blue-primary/30 group-hover:text-blue-primary text-blue-primary'
      : 'border-purple-secondary ring-purple-secondary/30 group-hover:text-purple-secondary text-purple-secondary'

  return (
    <div className="relative group w-full" ref={containerRef}>
      <label
        className={`block text-xs sm:text-sm uppercase tracking-[0.2em] font-black mb-3 ml-2 transition-colors ${
          mode === 'night' ? 'text-gray-text' : 'text-morning-muted-strong'
        } ${focusColor === 'blue' ? 'group-hover:text-blue-primary' : 'group-hover:text-purple-secondary'}`}
      >
        {label}
      </label>
      <div
        className={`rounded-[1.5rem] border shadow-2xl backdrop-blur-2xl transition-all ${
          mode === 'night'
            ? 'bg-night-surface/85 border-night-border text-night-text'
            : 'bg-morning-card/80 border-morning-border text-morning-text'
        } ${isOpen ? `ring-4 ${accentClasses}` : ''}`}
      >
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5">
          <svg
            viewBox="0 0 24 24"
            className={`${focusColor === 'blue' ? 'text-blue-primary' : 'text-purple-secondary'} h-5 w-5 sm:h-6 sm:w-6 shrink-0`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={inputValue}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setInputValue(event.target.value)
              setIsOpen(true)
            }}
            placeholder={selectedLabel}
            className="w-full bg-transparent outline-none text-xl sm:text-3xl font-black placeholder:opacity-60"
          />
        </div>

        {isOpen && (
          <div className={`border-t ${mode === 'night' ? 'border-white/10' : 'border-morning-border-soft'} px-2 py-2`}>
            {loading ? (
              <div className={`px-4 py-4 text-sm font-black uppercase tracking-[0.18em] ${mode === 'night' ? 'text-night-muted' : 'text-morning-muted'}`}>
                Searching
              </div>
            ) : searchError ? (
              <div className={`px-4 py-4 text-sm font-black uppercase tracking-[0.12em] ${mode === 'night' ? 'text-night-muted' : 'text-morning-muted'}`}>
                {searchError}
              </div>
            ) : options.length === 0 ? (
              <div className={`px-4 py-4 text-sm font-black uppercase tracking-[0.12em] ${mode === 'night' ? 'text-night-muted' : 'text-morning-muted'}`}>
                No matches
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.slug}
                  type="button"
                  disabled={disabledOptionIds.includes(option.slug)}
                  onClick={() => {
                    onChange(option.slug)
                    setInputValue(option.name)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-4 rounded-[1rem] text-lg sm:text-xl font-black transition-colors ${
                    disabledOptionIds.includes(option.slug)
                      ? 'text-gray-text/40 cursor-not-allowed'
                      : mode === 'night'
                        ? 'text-night-text hover:bg-night-hover'
                        : 'text-morning-text hover:bg-morning-hover'
                  }`}
                >
                  {option.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PointsLabel({ mode, pointsView, onToggle }) {
  const isAdjusted = pointsView === 'adjusted'

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <span className="leading-tight tracking-[0.08em] sm:tracking-[0.14em]">
        {isAdjusted ? 'Adjusted Total Points' : 'Total Points'}
      </span>
      <button
        type="button"
        aria-label={isAdjusted ? 'Show raw total points' : 'Show adjusted total points'}
        aria-pressed={isAdjusted}
        onClick={onToggle}
        className={`relative h-5 w-9 sm:h-6 sm:w-10 shrink-0 rounded-full border transition-all duration-300 ${
          isAdjusted
            ? 'bg-blue-primary border-blue-primary'
            : mode === 'night'
              ? 'bg-night-shadow border-night-border'
              : 'bg-morning-chip border-morning-border-strong'
        }`}
      >
        <span
          className={`absolute top-[1px] left-[1px] h-4 w-4 sm:h-[18px] sm:w-[18px] rounded-full bg-morning-card shadow-[0_4px_12px_rgba(3,33,71,0.22)] transition-transform duration-300 ${
            isAdjusted ? 'translate-x-4 sm:translate-x-[1.05rem]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function StatRow({
  label,
  valA,
  valB,
  mode,
  pointsView = 'raw',
  onPointsToggle = null,
  sideWidthClass = 'w-2/5',
  centerWidthClass = 'w-1/5',
}) {
  const numA = Number(valA) || 0
  const numB = Number(valB) || 0
  const winA = numA > numB
  const winB = numB > numA
  const tieClass = mode === 'night' ? 'text-night-text opacity-90' : 'text-morning-panel opacity-90'
  const winnerClass =
    mode === 'night'
      ? 'text-night-winner opacity-100 drop-shadow-[0_0_16px_rgba(127,200,255,0.45)] scale-[1.02]'
      : 'text-morning-winner opacity-100 drop-shadow-[0_0_20px_rgba(63,143,208,0.35)] scale-[1.02]'
  const loserClass = mode === 'night' ? 'text-night-winner/35 scale-95' : 'text-morning-winner/35 scale-95'

  return (
    <div
      className={`flex justify-between items-center py-3 sm:py-4 border-b last:border-0 transition-colors rounded-xl px-2 sm:px-5 -mx-2 sm:-mx-5 group ${
        mode === 'night' ? 'border-white/10 hover:bg-white/[0.03]' : 'border-morning-border-soft hover:bg-morning-hover-soft'
      }`}
    >
      <div
        className={`${sideWidthClass} text-center text-2xl sm:text-4xl lg:text-5xl font-black tabular-nums transition-all duration-500 tracking-tight ${
          winA ? winnerClass : winB ? loserClass : tieClass
        }`}
      >
        {formatStatValue(valA)}
      </div>
      <div className={`${centerWidthClass} flex items-center justify-center`}>
        <div
          className={`relative flex items-center justify-center gap-1 text-center text-[9px] sm:text-[10px] lg:text-xs font-black tracking-[0.12em] sm:tracking-[0.2em] uppercase transition-colors leading-tight ${
            mode === 'night' ? 'text-night-muted-strong group-hover:text-night-text' : 'text-morning-muted group-hover:text-morning-text'
          }`}
        >
          {onPointsToggle ? <PointsLabel mode={mode} pointsView={pointsView} onToggle={onPointsToggle} /> : label}
        </div>
      </div>
      <div
        className={`${sideWidthClass} text-center text-2xl sm:text-4xl lg:text-5xl font-black tabular-nums transition-all duration-500 tracking-tight ${
          winB ? winnerClass : winA ? loserClass : tieClass
        }`}
      >
        {formatStatValue(valB)}
      </div>
    </div>
  )
}

function ComparisonCard({ data, mode, pointsView, onPointsViewChange }) {
  if (!data?.a || !data?.b) {
    return null
  }

  const { a, b, stats, sport } = data

  return (
    <div
      className={`w-full max-w-5xl mx-auto rounded-[1.5rem] sm:rounded-[2rem] border p-4 sm:p-6 lg:p-8 shadow-[0_0_80px_-30px_rgba(32,157,215,0.25)] backdrop-blur-3xl mt-6 relative overflow-hidden ${
        mode === 'night' ? 'border-night-border bg-night-surface/85' : 'border-morning-border-strong bg-morning-card/75'
      }`}
    >
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] blur-[150px] rounded-[100%] pointer-events-none ${
          mode === 'night' ? 'bg-blue-primary/10' : 'bg-blue-primary/20'
        }`}
      />

      <div
        className={`flex flex-col xl:flex-row justify-between mb-5 xl:mb-6 items-center gap-3 xl:gap-0 pb-5 xl:pb-6 border-b relative z-10 w-full ${
          mode === 'night' ? 'border-night-border' : 'border-morning-border-subtle'
        }`}
      >
        <h2 className={`w-full xl:w-[45%] text-center text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-2xl leading-none ${mode === 'night' ? 'text-night-text' : 'text-morning-text'}`}>
          {splitDisplayName(a.name)}
        </h2>

        <div className="w-full xl:w-[10%] flex items-center justify-center my-2 xl:my-0">
          <span className={`font-black italic text-4xl sm:text-5xl tracking-tighter select-none ${mode === 'night' ? 'text-night-dim/40' : 'text-morning-glow'}`}>
            VS
          </span>
        </div>

        <h2 className={`w-full xl:w-[45%] text-center text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-2xl leading-none ${mode === 'night' ? 'text-night-text' : 'text-morning-text'}`}>
          {splitDisplayName(b.name)}
        </h2>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 relative z-10">
        {stats.map((stat) => {
          const isF1Points = sport === 'f1' && stat.key === 'total_points'
          const valueKey = isF1Points && pointsView === 'adjusted' ? stat.adjusted_key : stat.key

          return (
            <StatRow
              key={stat.key}
              label={stat.label}
              valA={a.values[valueKey]}
              valB={b.values[valueKey]}
              mode={mode}
              pointsView={pointsView}
              onPointsToggle={
                isF1Points
                  ? () => onPointsViewChange(pointsView === 'adjusted' ? 'raw' : 'adjusted')
                  : null
              }
              sideWidthClass={isF1Points ? 'w-[35%] sm:w-[38%]' : 'w-2/5'}
              centerWidthClass={isF1Points ? 'w-[30%] sm:w-[24%]' : 'w-1/5'}
            />
          )
        })}
      </div>
    </div>
  )
}

function ComparisonSkeleton({ mode }) {
  const skeletonRows = Array.from({ length: 6 }, (_, index) => index)

  return (
    <div
      className={`w-full max-w-5xl mx-auto rounded-[1.5rem] sm:rounded-[2rem] border p-4 sm:p-6 lg:p-8 mt-6 animate-pulse ${
        mode === 'night' ? 'border-night-border bg-night-surface/85' : 'border-morning-border-strong bg-morning-card/75'
      }`}
    >
      <div className={`h-20 rounded-[1.25rem] mb-6 ${mode === 'night' ? 'bg-night-hover/70' : 'bg-morning-hover'}`} />
      <div className="space-y-3">
        {skeletonRows.map((row) => (
          <div key={row} className={`h-16 rounded-[1rem] ${mode === 'night' ? 'bg-night-hover/60' : 'bg-morning-hover-soft'}`} />
        ))}
      </div>
    </div>
  )
}

function ErrorState({ mode, message, onRetry }) {
  return (
    <div
      className={`w-full max-w-3xl mx-auto rounded-[1.5rem] border p-8 sm:p-10 text-center mt-6 ${
        mode === 'night' ? 'border-night-border bg-night-surface/85 text-night-text' : 'border-morning-border-strong bg-morning-card/80 text-morning-text'
      }`}
    >
      <p className={`text-sm sm:text-base font-black tracking-[0.18em] uppercase ${mode === 'night' ? 'text-night-muted' : 'text-morning-muted'}`}>
        Load Error
      </p>
      <p className="mt-4 text-xl sm:text-2xl font-black leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-purple-secondary px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-morning-card transition-opacity hover:opacity-90"
      >
        Retry
      </button>
    </div>
  )
}

function resolveDefaultSelection(nextSport, nextEntityType) {
  if (nextSport === 'football') {
    return DEFAULT_SELECTIONS.football[nextEntityType]
  }

  return DEFAULT_SELECTIONS[nextSport]
}

function buildLoadErrorMessage(entityType, entityA, entityB) {
  const labelA = ENTITY_LABELS[entityA] || entityA
  const labelB = ENTITY_LABELS[entityB] || entityB
  const noun = entityType === 'teams' ? 'teams' : 'athletes'
  return `Could not load data for ${noun} ${labelA} and ${labelB}`
}

function App() {
  const [sport, setSport] = useState('f1')
  const [entityType, setEntityType] = useState('athletes')
  const [entityA, setEntityA] = useState(DEFAULT_SELECTIONS.f1.a)
  const [entityB, setEntityB] = useState(DEFAULT_SELECTIONS.f1.b)
  const [mode, setMode] = useState('night')
  const [pointsView, setPointsView] = useState('raw')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const selectedSport = SPORTS.find((entry) => entry.id === sport)
  const availableEntityTypes = selectedSport.entityTypes
  const selectedLabelA = ENTITY_LABELS[entityA] || ''
  const selectedLabelB = ENTITY_LABELS[entityB] || ''

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
    if (!availableEntityTypes.includes(entityType)) {
      setEntityType(availableEntityTypes[0])
      return
    }

    const defaults = resolveDefaultSelection(sport, entityType)
    setEntityA(defaults.a)
    setEntityB(defaults.b)
    setPointsView('raw')
    setData(null)
    setErrorMessage('')
  }, [sport, entityType, availableEntityTypes])

  useEffect(() => {
    if (!sport || !entityType || !entityA || !entityB) {
      return
    }

    const controller = new AbortController()
    const endpoint = entityType === 'teams' ? 'teams' : 'athletes'
    setLoading(true)
    setErrorMessage('')

    fetch(`/api/compare/${endpoint}?sport=${sport}&a=${entityA}&b=${entityB}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok || json.detail) {
          throw new Error(json.detail || 'Failed to load comparison data')
        }
        return json
      })
      .then((json) => {
        setData(json)
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return
        }
        setData(null)
        setErrorMessage(buildLoadErrorMessage(entityType, entityA, entityB))
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [sport, entityType, entityA, entityB, refreshKey])

  return (
    <div
      className={`min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-10 font-sans antialiased selection:bg-blue-primary/30 relative overflow-hidden transition-colors duration-500 ${
        mode === 'night' ? 'text-night-text bg-night-background' : 'text-morning-text bg-morning-sky'
      }`}
    >
      <div className={`fixed top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[200px] rounded-full pointer-events-none ${mode === 'night' ? 'bg-night-aura/25' : 'bg-blue-primary/20'}`} />
      <div className={`fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[200px] rounded-full pointer-events-none ${mode === 'night' ? 'bg-night-plum/25' : 'bg-morning-accent/25'}`} />

      <button
        type="button"
        aria-label={mode === 'night' ? 'Switch to morning mode' : 'Switch to night mode'}
        onClick={() => setMode(mode === 'night' ? 'morning' : 'night')}
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 h-10 w-10 sm:h-11 sm:w-11 rounded-full border flex items-center justify-center transition-colors ${
          mode === 'night'
            ? 'border-night-border-strong bg-night-surface text-night-text hover:bg-night-surface-hover'
            : 'border-morning-border-bright bg-morning-card/85 text-morning-text hover:bg-morning-card'
        }`}
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
            <span className={`bg-gradient-to-r bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(32,157,215,0.28)] ${mode === 'night' ? 'from-night-hero-start via-night-hero-mid to-night-hero-end' : 'from-morning-panel via-morning-panel-strong to-morning-panel-soft'}`}>
              SMART
            </span>
            <span className={`ml-2 sm:ml-3 ${mode === 'night' ? 'text-night-text' : 'text-morning-panel'}`}>COMPARE</span>
          </h1>
          <p className={`text-xs sm:text-sm font-black tracking-[0.18em] uppercase opacity-80 ${mode === 'night' ? 'text-night-muted' : 'text-morning-muted'}`}>
            Data Driven <span className="text-purple-secondary">Glory</span>
          </p>
        </header>

        <div className="flex justify-center mb-4 sm:mb-5">
          <SegmentedToggle options={SPORTS} value={sport} onChange={setSport} mode={mode} />
        </div>

        {availableEntityTypes.length > 1 && (
          <div className="flex justify-center mb-7 sm:mb-8">
            <SegmentedToggle
              options={ENTITY_TYPE_OPTIONS.filter((option) => availableEntityTypes.includes(option.id))}
              value={entityType}
              onChange={setEntityType}
              mode={mode}
              className="scale-[0.92] sm:scale-100"
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8 items-start justify-between mb-6">
          <AutocompleteSelect
            label={entityType === 'teams' ? 'Team A' : 'Competitor A'}
            value={entityA}
            selectedLabel={selectedLabelA}
            onChange={setEntityA}
            searchPath={entityType === 'teams' ? '/api/teams' : '/api/athletes'}
            sport={sport}
            focusColor="blue"
            disabledOptionIds={[entityB]}
            mode={mode}
          />

          <div className="hidden lg:flex w-12 shrink-0 h-20 items-center justify-center" />

          <AutocompleteSelect
            label={entityType === 'teams' ? 'Team B' : 'Competitor B'}
            value={entityB}
            selectedLabel={selectedLabelB}
            onChange={setEntityB}
            searchPath={entityType === 'teams' ? '/api/teams' : '/api/athletes'}
            sport={sport}
            focusColor="purple"
            disabledOptionIds={[entityA]}
            mode={mode}
          />
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <ComparisonSkeleton mode={mode} />
          ) : errorMessage ? (
            <ErrorState mode={mode} message={errorMessage} onRetry={() => setRefreshKey((value) => value + 1)} />
          ) : (
            <ComparisonCard data={data} mode={mode} pointsView={pointsView} onPointsViewChange={setPointsView} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
