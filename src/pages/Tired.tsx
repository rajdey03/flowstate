import { useNavigate } from 'react-router-dom'
import '../styles/tired.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import tiredImage from '../assets/tired.svg'
import { useSlidePageTransition } from '../hooks/useSlidePageTransition'

type Capsule = {
  id: string
  name: string
  emotion_category: string
  duration_minutes: number
}

export default function Tired() {
  const navigate = useNavigate()
  const { transitionClass, navigateWithTransition } = useSlidePageTransition({
    home: 'page-shell--enter-from-right',
  })

  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCapsules() {
      const { data, error } = await supabase
        .from('capsules')
        .select('id, name, emotion_category, duration_minutes')
        .eq('emotion_category', 'tired')

      if (error) {
        console.error('Error fetching capsules:', error)
      } else {
        setCapsules(data || [])
      }
      setLoading(false)
    }

    fetchCapsules()
  }, [])

  return (
    <div className={`tiredContainer page-shell ${transitionClass}`}>
      <div className="tiredHeader">
        <img src={tiredImage} alt="tired" className="dropletImage" />
        <h1 className="tiredTitle">
          You deserve some rest
        </h1>
      </div>

      <div className="capsuleList">
        {loading && <p className="statusText">Loading capsules...</p>}
        {!loading && capsules.length === 0 && (
          <p className="statusText">No capsules found.</p>
        )}
        {capsules.map((capsule) => (
          <div key={capsule.id} className="capsule">
            <div className="capsuleInfo">
              <span className="capsuleName">{capsule.name}</span>
              <span className="capsuleDuration">{capsule.duration_minutes} min</span>
            </div>
            <button
              className="playBtn"
              onClick={() => navigate('/tired/meditate', { state: { capsule } })}
              aria-label={`Play ${capsule.name}`}
            >
              ▶
            </button>
          </div>
        ))}
      </div>

      <button className="backHomeBtn" onClick={() => navigateWithTransition('/', { state: { from: 'mood-page' }, leaveTo: 'right' })}>
        Back to Home
      </button>
    </div>
  )
}
