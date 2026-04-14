import {useNavigate} from 'react-router-dom'
import '../styles/angry.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import angryImage from '../assets/angry.png'


/*capsules from the db format */
type Capsule = {
  id: string
  name: string
  emotion_category: string
  duration_minutes: number
}
//CodePen's rain animation is in JS, this is ts
function Rain() {
  const drops = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    opacity: Math.random() * 0.9,
    left: `${Math.random() * 120 - 10}vw`,
    borderLeftWidth: `${Math.random() * 8}vmin`,
    animationDuration: `${Math.random() * 2 + 0.5}s`,
    animationDelay: `${Math.random() * -12}s`,
    translateX: `${Math.random() * 10}%`,
  }))

  return (
    <div className="rainContainer">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="drop"
          style={{
            opacity: drop.opacity,
            left: drop.left,
            borderLeftWidth: drop.borderLeftWidth,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay,
          }}
        />
      ))}
    </div>
  )
}

export default function Angry(){
    const navigate= useNavigate()

    const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    async function fetchCapsules() {
      const { data, error } = await supabase
        .from('capsules')
        .select('id, name, emotion_category, duration_minutes')
        .eq('emotion_category', 'angry')
 
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
        <div className="angryContainer">
            <Rain /> {/**adding thunder storm rain effects --> credit CodePen open source css effects */}
            <div className="angryHeader">
                <img src={angryImage} alt="angry" className="angryImage" />
                <h1 className="angryTitle">
                    Angry</h1>
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
              onClick={() => navigate(`/capsule/${capsule.id}`)}
              aria-label={`Play ${capsule.name}`}
            >
              ▶
            </button>
          </div>
        ))}
        </div>

    </div>

    )
}

