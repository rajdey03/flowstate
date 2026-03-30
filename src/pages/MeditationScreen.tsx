import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/home.css';

interface Capsule {
    id: string;
    name: string;
    duration_minutes: number;
}

interface FlowProps {
    moodCategory: 'sad' | 'stressed' | 'angry' | 'tired';
    promptText: string;
    activeVisual: React.ReactNode; 
    doneVisual: React.ReactNode;
    audioFile: string;
}

export default function MeditationScreen({ moodCategory, promptText, activeVisual, doneVisual, audioFile }: FlowProps) {
    const navigate = useNavigate();
    
    const [capsules, setCapsules] = useState<Capsule[]>([]);
    const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
    
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

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

    const handleStartMeditation = (capsule: Capsule) => {
        setSelectedCapsule(capsule);
        setTimeLeft(capsule.duration_minutes * 60);
        setIsDone(false);
        setIsActive(false);
    };

    const handleComplete = async () => {
        setIsActive(false);
        setIsDone(true);
        
        let userId = localStorage.getItem('flowstate_user_id');
        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem('flowstate_user_id', userId);
        }

        if (selectedCapsule) {
            await supabase.from('user_progress').insert([
                { anonymous_user_id: userId, capsule_id: selectedCapsule.id }
            ]);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="container">
            <audio ref={audioRef} src={audioFile} loop />

            <div className="content" style={{ alignItems: 'center', textAlign: 'center' }}>
                
                {isDone ? (
                    <>
                        <h1 className="welcome">Done!</h1>
                        <div style={{ fontSize: '8rem', margin: '1rem 0', animation: 'logo-spin 4s ease-in-out' }}>
                            {doneVisual}
                        </div>
                        <div className="options" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                            <button className="btn" onClick={() => navigate('/')}>Home Page</button>
                            <button className="btn" onClick={() => navigate('/progress')}>View Progress</button>
                        </div>
                    </>
                ) 
                
                : selectedCapsule ? (
                    <>
                        <h1 className="welcome">{selectedCapsule.name}</h1>
                        <p style={{ color: '#1a1a1a', fontSize: '1.2rem', marginBottom: '2rem' }}>{promptText}</p>
                        
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem 0' }}>
                            
                            <svg height="300" width="300" style={{ transform: 'rotate(-90deg)' }}>
                                <circle
                                    stroke="rgba(0, 0, 0, 0.1)"
                                    fill="transparent"
                                    strokeWidth="8"
                                    r="130"
                                    cx="150"
                                    cy="150"
                                />
                                <circle
                                    stroke="#ffffff"
                                    fill="transparent"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 130}
                                    strokeDashoffset={
                                        (2 * Math.PI * 130) - 
                                        (timeLeft / (selectedCapsule.duration_minutes * 60)) * (2 * Math.PI * 130)
                                    }
                                    r="130"
                                    cx="150"
                                    cy="150"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                            
                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ 
                                    fontSize: '4rem', 
                                    marginBottom: '10px', 
                                    filter: isActive ? 'drop-shadow(0 0 1em rgba(255,255,255,0.8))' : 'none', 
                                    transition: 'filter 0.5s ease' 
                                }}>
                                    {activeVisual}
                                </div>
                                <h2 style={{ fontSize: '3rem', color: '#1a1a1a', margin: '0', fontFamily: 'monospace', fontWeight: 600 }}>
                                    {formatTime(timeLeft)}
                                </h2>
                            </div>
                        </div>

                        <div className="options" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                            <button className="btn" onClick={() => setIsActive(!isActive)}>
                                {isActive ? '⏸ Pause' : 'Start'}
                            </button>
                            <button className="btn" onClick={() => {
                                setSelectedCapsule(null);
                                setIsActive(false);
                            }}>
                                Cancel
                            </button>
                        </div>
                    </>
                ) 
                
                : (
                    <>
                        <h1 className="welcome" style={{ textTransform: 'capitalize' }}>{moodCategory}?</h1>
                        <p style={{ color: '#1a1a1a', fontSize: '1.2rem', marginBottom: '1rem' }}>
                            Choose an exercise to help you find your flow:
                        </p>
                        
                        <div className="options" style={{ flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                            {capsules.length === 0 ? <p>Loading capsules...</p> : null}
                            
                            {capsules.map((capsule) => (
                                <button 
                                    key={capsule.id} 
                                    className="btn" 
                                    style={{ width: '100%', maxWidth: '400px', justifyContent: 'space-between' }}
                                    onClick={() => handleStartMeditation(capsule)}
                                >
                                    <span>{capsule.name}</span>
                                    <span style={{ opacity: 0.7 }}>{capsule.duration_minutes} min</span>
                                </button>
                            ))}
                        </div>
                        <button className="btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>Back</button>
                    </>
                )}
            </div>
        </div>
    );
}