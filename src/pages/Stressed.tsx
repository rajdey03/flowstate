import {useNavigate} from 'react-router-dom'
import '../styles/stressed.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import stressedImage from '../assets/stressed.png'

/*capsules from the db format */
type Capsule = {
  id: string
  name: string
  emotion_category: string
  duration_minutes: number
}

//Snow effect taken from open source codepen: https://codepen.io/siddharth-nalwaya/pen/wvXZqbq
function Snow() {
  return (
    <div className="snowContainer">
      {Array.from({ length: 50 }, (_, i) => (
        <div key={i} className="snow">❄</div>
        
      ))}
    </div>
  )
}

export default function Stressed(){
    const navigate= useNavigate()

    const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    async function fetchCapsules() {
      const { data, error } = await supabase
        .from('capsules')
        .select('id, name, emotion_category, duration_minutes')
        .eq('emotion_category', 'stressed')
 
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
        <div className="stressedContainer">
            <Snow /> {/*falling snow */}
            <div className="stressedHeader">
                <img src={stressedImage} alt="stressed" className="stressedImage" />
                <h1 className="stressedTitle">
                    Stressed </h1>
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
              onClick={() => navigate('/stressed/meditate', { state: { capsule } })}
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

