import {useNavigate} from 'react-router-dom'
import '../styles/home.css'

export default function Angry(){
    const navigate= useNavigate()


    return(
        <div className="container">
            <div className="content">

                <h1 className="welcome">
                    Welcome back! <br/> How are you feeling today?
                </h1>

                <div className="options">

                    <button className="btn" onClick={() => navigate('/sad')}> Sad </button>
                    <button className="btn" onClick={() => navigate('/happy')}> Happy </button>
                    <button className="btn" onClick={() => navigate('/stressed')}> Stressed </button>
                    <button className="btn" onClick={() => navigate('/tired')}> Tired </button>

                </div>


            </div>
        </div>
    )
}

