import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sad from './pages/Sad.tsx'
import Normal from './pages/Normal.tsx'
import Angry from './pages/Angry.tsx'
import Stressed from './pages/Stressed.tsx'
import Progress from './pages/Progress.tsx'
import Meditation from './pages/MeditationScreen.tsx'

//some visuals for the meditation before and after
import angryIcon from './assets/angry.png'
import dropletIcon from './assets/droplet.png'
import sadIcon from './assets/sad.png'
import stressedIcon from './assets/stressed.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/normal" element={< Normal/>} />
        <Route path="/stressed" element={<Stressed/>}/>
        <Route path="/sad" element={<Sad/>} />
        <Route path="/angry" element={<Angry/>} />
        <Route path="/progress" element={<Progress />} />
        
        <Route path="/sad/meditate" element={<Meditation moodCategory="sad" promptText="Take a deep breath..." activeVisual={<img src={sadIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletImg} style={{ width: '80px' }} />} audioFile="/src/assets/underwater-white-noise.mp3" />} />
        <Route path="/stressed/meditate" element={<Meditation moodCategory="stressed" promptText="Let it go..." activeVisual={<img src={stressedIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletImg} style={{ width: '80px' }} />} audioFile="/src/assets/midnight-rain.mp3" />} />
        <Route path="/angry/meditate" element={<Meditation moodCategory="angry" promptText="Breathe and release..." activeVisual={<img src={angryIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletImg} style={{ width: '80px' }} />} audioFile="/src/assets/midnight-rain.mp3" />} />
        <Route path="/tired/meditate" element={<Meditation moodCategory="tired" promptText="Rest and restore..." activeVisual={<img src={dropletIcon} style={{ width: '80px' }} />} doneVisual={<img src={dropletImg} style={{ width: '80px' }} />} audioFile="/src/assets/underwater-white-noise.mp3" />} />
      


      </Routes>
    
    
    
    </BrowserRouter>
  )
}

export default App
