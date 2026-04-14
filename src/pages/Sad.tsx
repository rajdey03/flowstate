import {useNavigate} from 'react-router-dom'
import '../styles/sad.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import sadImage from '../assets/sad.png'


//animation credits: https://codepen.io/Spate/pen/gOGJMgG
/*capsules from the db format */
type Capsule = {
  id: string
  name: string
  emotion_category: string
  duration_minutes: number
}

//see animation credits
function Wave() {
  return (
    <div className="waveContainer">
      <div className = "waterRiser">
      <svg className="waveSvg" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path className="wavePath" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
      <div className="waterBody" />
      </div>
    </div>
  )
}

//from angry
function Rain() {
  const drops = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    opacity: Math.random() * 0.6,
    left: `${Math.random() * 120 - 10}vw`,
    borderLeftWidth: `${Math.random() * 8}vmin`,
    animationDuration: `${Math.random() * 3 + 2}s`,
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


export default function Sad(){
    const navigate= useNavigate()

    const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    async function fetchCapsules() {
      const { data, error } = await supabase
        .from('capsules')
        .select('id, name, emotion_category, duration_minutes')
        .eq('emotion_category', 'sad')
 
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
        <div className="sadContainer">
          <Rain />
          <Wave />
            <div className="sadHeader">
                <img src={sadImage} alt="sad" className="sadImage" />
                <h1 className="sadTitle">
                    Sad </h1>
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
              onClick={() => navigate('/sad/meditate')} 
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

