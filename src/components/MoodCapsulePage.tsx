import { type ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useSlidePageTransition } from '../hooks/useSlidePageTransition'
import '../styles/capsule-page.css'
import '../styles/home.css'

type Capsule = {
  id: string
  name: string
  emotion_category: string
  duration_minutes: number
}

type MoodCapsulePageProps = {
  iconSrc: string
  iconAlt: string
  title: string
  subtitle: string
  themeClass: string
  queryEmotion: string
  meditatePath: string
  renameCapsule?: (capsule: Capsule, index: number) => string
  backgroundEffects?: ReactNode
}

export default function MoodCapsulePage({
  iconSrc,
  iconAlt,
  title,
  subtitle,
  themeClass,
  queryEmotion,
  meditatePath,
  renameCapsule,
  backgroundEffects,
}: MoodCapsulePageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { transitionClass, navigateWithTransition } = useSlidePageTransition({
    home: 'page-shell--enter-from-right',
  })

  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
  const [isLaunchingMeditation, setIsLaunchingMeditation] = useState(false)
  const [activeCapsuleId, setActiveCapsuleId] = useState<string | null>(null)
  const isReturningFromMeditation = location.state?.from === 'meditation-screen'

  useEffect(() => {
    async function fetchCapsules() {
      const { data, error } = await supabase
        .from('capsules')
        .select('id, name, emotion_category, duration_minutes')
        .eq('emotion_category', queryEmotion)

      if (error) {
        console.error('Error fetching capsules:', error)
      } else {
        const sortedCapsules = [...(data || [])].sort(
          (first, second) => first.duration_minutes - second.duration_minutes,
        )
        setCapsules(sortedCapsules)
      }

      setLoading(false)
    }

    fetchCapsules()
  }, [queryEmotion])

  const handleMeditationLaunch = (capsule: Capsule) => {
    setActiveCapsuleId(capsule.id)
    setIsLaunchingMeditation(true)

    window.setTimeout(() => {
      navigate(meditatePath, { state: { capsule, from: 'capsule-page' } })
    }, 360)
  }

  return (
    <div className={`mood-capsule-page page-shell ${transitionClass} ${themeClass}`}>
      {backgroundEffects}
      <img src={iconSrc} alt={iconAlt} className="mood-capsule-page__icon" />

      <main className="mood-capsule-page__content">
        <header className={`mood-capsule-page__header ${isLaunchingMeditation ? 'mood-capsule-page__header--leaving' : ''} ${isReturningFromMeditation ? 'mood-capsule-page__header--reenter' : ''}`}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        <section
          className={`mood-capsule-page__list ${isLaunchingMeditation ? 'mood-capsule-page__list--leaving' : ''}`}
          aria-label={`${title} meditation capsules`}
        >
          {loading && <p className="mood-capsule-page__status">Loading capsules...</p>}
          {!loading && capsules.length === 0 && (
            <p className="mood-capsule-page__status">No capsules found.</p>
          )}

          {capsules.map((capsule, index) => {
            const displayName = renameCapsule ? renameCapsule(capsule, index) : capsule.name

            return (
              <article
                key={capsule.id}
                className={`mood-capsule-page__card ${
                  isLaunchingMeditation
                    ? activeCapsuleId === capsule.id
                      ? 'mood-capsule-page__card--active'
                      : 'mood-capsule-page__card--leaving'
                    : isReturningFromMeditation
                      ? 'mood-capsule-page__card--reenter'
                      : ''
                }`}
              >
                <div className="mood-capsule-page__card-copy">
                  <span className="mood-capsule-page__card-title">{displayName}</span>
                  <span className="mood-capsule-page__card-separator" aria-hidden="true">-</span>
                  <span className="mood-capsule-page__card-duration">{capsule.duration_minutes} min</span>
                </div>

                <button
                  className="mood-capsule-page__play"
                  onClick={() => handleMeditationLaunch(capsule)}
                  aria-label={`Play ${displayName}`}
                >
                  <span className="mood-capsule-page__play-icon">▷</span>
                </button>
              </article>
            )
          })}
        </section>
      </main>

      <button
        className={`mood-capsule-page__home ${isLaunchingMeditation ? 'mood-capsule-page__home--leaving' : ''}`}
        onClick={() => navigateWithTransition('/', { state: { from: 'mood-page' }, leaveTo: 'right' })}
      >
        Back to Home
      </button>

      <button
        className={`progressBtn ${isLaunchingMeditation ? 'mood-capsule-page__progressBtn--leaving' : ''}`}
        onClick={() => navigate('/progress')}
      >
        View
        <br />
        Progress Tracker
      </button>
    </div>
  )
}
