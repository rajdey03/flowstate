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

function Wave() {
  return (
    <div className="waveContainer">
      <div className="wave wave1" />
      <div className="wave wave2" />
      <div className="wave wave3" />
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

