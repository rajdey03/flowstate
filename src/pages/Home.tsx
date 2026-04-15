import '../styles/home.css'
import flowstateLogo from '../assets/FlowState.svg';
import { useSlidePageTransition } from '../hooks/useSlidePageTransition';

export default function Home(){
    const { transitionClass, navigateWithTransition } = useSlidePageTransition({
        'mood-page': 'page-shell--enter-from-left',
    });

    const handleMoodSelect = (path: string, feeling?: string) => {
        if (feeling) {
            localStorage.setItem('flowstate_last_feeling', feeling);

            const storedCounts = localStorage.getItem('flowstate_mood_counts');
            const moodCounts = storedCounts ? JSON.parse(storedCounts) as Record<string, number> : {};
            moodCounts[feeling] = (moodCounts[feeling] ?? 0) + 1;
            localStorage.setItem('flowstate_mood_counts', JSON.stringify(moodCounts));
        }

        navigateWithTransition(path, { state: { from: 'home' }, leaveTo: 'left', duration: 360 });
    };


    return(
        /* Happy leads to /normal and tired leads to /tired */
        
        <div className={`container page-shell ${transitionClass}`}>
            <div className="content">
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

                <div className="actionsRow">
                    <div className="options">
                        <button className="btn" onClick={() => handleMoodSelect('/sad', 'Sad')}> Sad </button>
                        <button className="btn" onClick={() => handleMoodSelect('/normal', 'Happy')}> Happy </button>
                        <button className="btn" onClick={() => handleMoodSelect('/stressed', 'Stressed')}> Stressed </button>
                        <button className="btn" onClick={() => handleMoodSelect('/angry', 'Angry')}> Angry </button>
                        <button className="btn" onClick={() => handleMoodSelect('/tired', 'Tired')}> Tired </button>
                    </div>
                </div>
            </div>

            <button
                className="progressBtn"
                onClick={() => handleMoodSelect('/progress')}
            >
                ♾️View<br/>Progress Tracker
            </button>
        </div>
    )
}
