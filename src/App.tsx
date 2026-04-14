import './App.css'
import Home from './pages/Home.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sad from './pages/Sad.tsx'
import Normal from './pages/Normal.tsx'
import Tired from './pages/Tired.tsx'
import Angry from './pages/Angry.tsx'
import Stressed from './pages/Stressed.tsx'
import Progress from './pages/Progress.tsx'
import MinutesMeditated from './pages/MinutesMeditated.tsx'
import MoodsTracked from './pages/MoodsTracked.tsx'
import DayStreak from './pages/DayStreak.tsx'
import Meditation from './pages/MeditationScreen.tsx'

//some visuals for the meditation before and after
import angryIcon from './assets/angry.png'
import dropletIcon from './assets/droplet.png'
import sadIcon from './assets/sad.png'
import stressedIcon from './assets/stressed.png'
import tiredIcon from './assets/tired.svg'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/normal" element={< Normal/>} />
        <Route path="/tired" element={<Tired />} />
        <Route path="/stressed" element={<Stressed/>}/>
        <Route path="/sad" element={<Sad/>} />
        <Route path="/angry" element={<Angry/>} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/progress/minutes-meditated" element={<MinutesMeditated />} />
        <Route path="/progress/moods-tracked" element={<MoodsTracked />} />
        <Route path="/progress/day-streak" element={<DayStreak />} />
        
        <Route path="/sad/meditate" element={<Meditation moodCategory="sad" promptText="Take a deep breath..." activeVisual={<img src={sadIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletIcon} className="droplet-icon" style={{ width: '80px' }} />} audioFile="/src/assets/underwater-white-noise.mp3" returnPath="/sad"/>} />
        <Route path="/stressed/meditate" element={<Meditation moodCategory="stressed" promptText="Let it go..." activeVisual={<img src={stressedIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletIcon} className="droplet-icon" style={{ width: '80px' }} />} audioFile="/src/assets/midnight-rain.mp3" returnPath="/stressed"/>} />
        <Route path="/angry/meditate" element={<Meditation moodCategory="angry" promptText="Breathe and release..." activeVisual={<img src={angryIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletIcon} className="droplet-icon" style={{ width: '80px' }} />} audioFile="/src/assets/midnight-rain.mp3" returnPath="/angry"/>} />
        <Route path="/normal/meditate" element={<Meditation moodCategory="tired" promptText="Stay present and keep the calm going..." activeVisual={<img src={dropletIcon} className="droplet-icon" style={{ width: '80px' }} />} doneVisual={<img src={dropletIcon} className="droplet-icon" style={{ width: '80px' }} />} audioFile="/src/assets/underwater-white-noise.mp3" returnPath="/normal"/>} />
        <Route path="/tired/meditate" element={<Meditation moodCategory="tired" promptText="Rest and restore..." activeVisual={<img src={tiredIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletIcon} className="droplet-icon" style={{ width: '80px' }} />} audioFile="/src/assets/underwater-white-noise.mp3" returnPath="/tired"/>} />
      


      </Routes>
    
    
    
    </BrowserRouter>
  )
}

export default App
