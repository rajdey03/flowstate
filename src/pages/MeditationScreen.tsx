import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/home.css';

/*
REMOVE THIS-- capsule views already integrated
interface Capsule {
    id: string;
    name: string;
    duration_minutes: number;
}
    */

interface FlowProps {
    moodCategory: 'sad' | 'stressed' | 'angry' | 'tired';
    promptText: string;
    activeVisual: React.ReactNode; 
    doneVisual: React.ReactNode;
    audioFile: string;
    returnPath: string; //bc tired is /normal
}

export default function MeditationScreen({ moodCategory, promptText, activeVisual, doneVisual, audioFile, returnPath }: FlowProps) {
    const location = useLocation();
    const navigate = useNavigate();
    
    //REMOVE const [capsules, setCapsules] = useState<Capsule[]>([]);
    const [selectedCapsule, setSelectedCapsule] = useState<{ id: string; name: string; duration_minutes: number } | null>(null);
    
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    //don't show the capsules twice, show meditation for selected
    useEffect(() => {
            const passed = location.state?.capsule
            if (passed){
                setSelectedCapsule(passed)
                setTimeLeft(passed.duration_minutes * 60)
            }
        }, [])

    const handleNavigate = (path: string) => {
        setTimeout(() => {
            navigate(path);
        }, 400);
    };
    /* REMOVE THIS, capsules present in previous view
    useEffect(() => {
        const fetchCapsules = async () => {
            const { data, error } = await supabase
                .from('capsules')
                .select('*')
                .eq('emotion_category', moodCategory);
            
            if (error) 
                console.error("Error fetching capsules:", error);
            else setCapsules(data || []);
        };
        fetchCapsules();
    }, [moodCategory]);
    */

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } 
        else if (timeLeft === 0 && isActive && !isDone) {
            handleComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isDone]);

    useEffect(() => {
        if (audioRef.current) {
            if (isActive) {
                audioRef.current.play().catch(e => console.log("Audio blocked:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isActive]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (audio.duration && audio.currentTime >= audio.duration - 0.3) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log(e)); 
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    /* REMOVE
    const handleStartMeditation = (capsule: Capsule) => {
        setSelectedCapsule(capsule);
        setTimeLeft(capsule.duration_minutes * 60);
        setIsDone(false);
        setIsActive(false);
    };
    */

    const handleComplete = async () => {
        setIsActive(false);
        setIsDone(true);
        
        let userId = localStorage.getItem('flowstate_user_id');
        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem('flowstate_user_id', userId);
        }

        if (selectedCapsule) {
            const { error } = await supabase.from('user_progress').insert([
                { anonymous_user_id: userId, capsule_id: selectedCapsule.id }
            ]);
            
            if (error) {
                console.error("Database Save Error:", error);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const getBreathingText = () => {
        if (!selectedCapsule) return promptText;
        
        const totalSeconds = selectedCapsule.duration_minutes * 60;
        
        if (!isActive && timeLeft === totalSeconds) return promptText; 
        if (!isActive && timeLeft < totalSeconds && timeLeft > 0) return "Paused"; 
        
        const elapsed = totalSeconds - timeLeft;
        const cycleTime = Math.floor(elapsed % 60); 
        
        if (cycleTime >= 50) {
            return "Pause... Hold your breath.";
        } else {
            const isBreatheIn = Math.floor(cycleTime / 5) % 2 === 0;
            return isBreatheIn ? "Breathe in..." : "Breathe out...";
        }
    };

    return (
        <div className="container">
            <audio ref={audioRef} src={audioFile} />

            <div className="content" style={{ alignItems: 'center', textAlign: 'center' }}>
                
                {isDone ? (
                    <>
                        <h1 className="welcome" style={{ marginBottom: '1rem' }}>
                            Session Complete
                        </h1>
                        <p style={{ color: '#1a1a1a', fontSize: '1.5rem', fontWeight: 500 }}>
                            Great job taking time for yourself.
                        </p>
                        
                        <div style={{ fontSize: '8rem', margin: '2rem 0', animation: 'logo-spin 4s ease-in-out' }}>
                            {doneVisual}
                        </div>
                        
                        <div className="options" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                            <button className="btn" onClick={() => handleNavigate('/')}>
                                Back to Home
                            </button>
                            <button className="btn" onClick={() => handleNavigate('/progress')}>
                                Check Progress
                            </button>
                        </div>
                    </>
                    ) 
                
                : selectedCapsule ? (
                    <>
                        <h1 className="welcome" style={{ marginBottom: '2rem' }}>{selectedCapsule.name}</h1>
                        
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4rem 0' }}>
                            
                            <svg height="650" width="650" style={{ transform: 'rotate(-90deg)' }}>
                                <circle
                                    stroke="rgba(0, 0, 0, 0.1)"
                                    fill="transparent"
                                    strokeWidth="16"
                                    r="300"
                                    cx="325"
                                    cy="325"
                                />
                                <circle
                                    stroke="#ffffff"
                                    fill="transparent"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 300}
                                    strokeDashoffset={
                                        (2 * Math.PI * 300) - 
                                        (timeLeft / (selectedCapsule.duration_minutes * 60)) * (2 * Math.PI * 300)
                                    }
                                    r="300"
                                    cx="325"
                                    cy="325"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                            
                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '450px' }}>
                                
                                <div style={{ 
                                    fontSize: '5rem', 
                                    marginBottom: '15px', 
                                    filter: isActive ? 'drop-shadow(0 0 1em rgba(255,255,255,0.8))' : 'none', 
                                    transition: 'filter 0.5s ease' 
                                }}>
                                    {activeVisual}
                                </div>
                                
                                <h2 style={{ 
                                    fontSize: '3.5rem', 
                                    color: '#1a1a1a', 
                                    margin: '0', 
                                    fontWeight: 500, 
                                    transition: 'opacity 0.5s ease',
                                    textAlign: 'center'
                                }}>
                                    {getBreathingText()}
                                </h2>
                                
                                <h3 style={{ 
                                    fontSize: '3rem', 
                                    color: '#1a1a1a', 
                                    margin: '15px 0 0 0', 
                                    fontFamily: 'monospace', 
                                    opacity: 0.7 
                                }}>
                                    {formatTime(timeLeft)}
                                </h3>
                            </div>
                        </div>

                        <div className="options" style={{ justifyContent: 'center', marginTop: '3rem' }}>
                            <button className="btn" onClick={() => setIsActive(!isActive)}>
                                {isActive ? '⏸ Pause' : 'Start'}
                            </button>
                            <button className="btn" onClick={() => {
                                setSelectedCapsule(null);
                                setIsActive(false);
                                handleNavigate(returnPath); 
                            }}>
                                Cancel
                            </button>
                        </div>
                    </>
                ) 
                
                
                : null //removed the part with capsule display- no need for duplicates
               
            }
            </div>
        </div>
    );
}