import {useNavigate} from 'react-router-dom'
import '../styles/tired.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import dropletImage from '../assets/droplet.png'
import { useSlidePageTransition } from '../hooks/useSlidePageTransition'

/*capsules from the db format */
type Capsule = {
  id: string
  name: string
  emotion_category: string
  duration_minutes: number
}

const happyCapsuleNames = [
  'Morning Glow',
  'Bright Mind Reset',
  'Good Vibes Breathing',
  'Sunny Focus Flow',
  'Positive Energy Pause',
]


export default function Normal(){
    const navigate= useNavigate()
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


    return(
        <div className={`tiredContainer page-shell ${transitionClass}`}>
            <div className="tiredHeader">
                <img src={dropletImage} alt="happy" className="dropletImage" />
                <h1 className="tiredTitle">
                    Keep the good energy flowing </h1>
            </div> 
              
            <div className="capsuleList">
                {loading && <p className="statusText">Loading capsules...</p>}
                {!loading && capsules.length === 0 && (
                <p className="statusText">No capsules found.</p>
                )}
                {capsules.map((capsule, index) => {
                const displayName = happyCapsuleNames[index] ?? `Good Energy Session ${index + 1}`

                return (
                <div key={capsule.id} className="capsule">
                    <div className="capsuleInfo">
                    <span className="capsuleName">{displayName}</span>
                    <span className="capsuleDuration">{capsule.duration_minutes} min</span>
                    
                    </div>
            <button
              className="playBtn"
              onClick={() => navigate('/normal/meditate', { state: { capsule } })}
              aria-label={`Play ${displayName}`}
            >
              ▶
            </button>
          </div>
        )})}
        </div>

        <button className="backHomeBtn" onClick={() => navigateWithTransition('/', { state: { from: 'mood-page' }, leaveTo: 'right' })}>
          Back to Home
        </button>

    </div>

    )
}
