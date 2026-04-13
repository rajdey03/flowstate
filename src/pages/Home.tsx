import {useNavigate} from 'react-router-dom'
import '../styles/home.css'

export default function Home(){
    const navigate= useNavigate()


    return(
        /* Tired and Happy will lead to Normal meditations at /normal */
        
        <div className="container">
            <div className="content">

                <h1 className="welcome">
                    Welcome back to Flow💧State! <br/> How are you feeling today? 😊
                </h1>

                <div className="options">


                    <button className="btn" onClick={() => navigate('/sad')}> Sad </button>
                    <button className="btn" onClick={() => navigate('/normal')}> Happy </button>
                    <button className="btn" onClick={() => navigate('/stressed')}> Stressed </button>
                    <button className="btn" onClick={() => navigate('/angry')}> Angry </button>

                    <button className="btn" onClick={() => navigate('/normal')}> Tired </button>

                </div>


            </div>

            <button className="progressBtn" onClick={() => navigate('/progress')}>
                ♾️View<br/>Progress
            </button>
        </div>
    )
}

