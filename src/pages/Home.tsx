import {useNavigate} from 'react-router-dom'
import '../styles/home.css'
import flowstateLogo from '../assets/FlowState.svg';

export default function Home(){
    const navigate= useNavigate()

    const handleMoodSelect = (path: string) => {
        setTimeout(() => {
            navigate(path);
        }, 400);
    };


    return(
        /* Tired and Happy will lead to Normal meditations at /normal */
        
        <div className="container">
            <div className="content" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                width: '100%'
            }}>
                <img 
                    src={flowstateLogo} 
                    alt="flowstate logo" 
                    className="logo" 
                    style={{ width: '250px', height: 'auto'}} 
                />
                <h1 className="welcome">
                    Welcome back!
                </h1>

                <h1 className="welcome">
                    How are you feeling today?
                </h1>

                <div className="options">


                    <button className="btn" onClick={() => handleMoodSelect('/sad')}> Sad </button>
                    <button className="btn" onClick={() => handleMoodSelect('/normal')}> Happy </button>
                    <button className="btn" onClick={() => handleMoodSelect('/stressed')}> Stressed </button>
                    <button className="btn" onClick={() => handleMoodSelect('/angry')}> Angry </button>
                    <button className="btn" onClick={() => handleMoodSelect('/normal')}> Tired </button>

                </div>

            

            </div>

            <button 
                className="progressBtn" 
                style={{ 
                    position: 'absolute', 
                    bottom: '3rem', 
                    left: '65%', 
                    transform: 'translateX(-50%)'
                }} 
                onClick={() => handleMoodSelect('/progress')}
            >
                ♾️View<br/>Progress Tracker

            </button>
        </div>
    )
}

