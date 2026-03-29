import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Sad from './pages/Sad'
//import Happy from './pages/Happy'
//import Angry from './pages/Angry'
//import Tired from './pages/Tired'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
      </Routes>
    
    
    
    </BrowserRouter>
  )
}

export default App
