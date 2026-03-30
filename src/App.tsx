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

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/normal" element={< Normal/>} />
        <Route path="/angry" element={<Angry/>}/>
        <Route path="/stressed" element={<Stressed/>}/>
        <Route path="/sad" element={<Sad/>} />


      </Routes>
    
    
    
    </BrowserRouter>
  )
}

export default App
