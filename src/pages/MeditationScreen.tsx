import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/home.css';
import '../styles/capsule-page.css';

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
    visualTheme: 'sad' | 'stressed' | 'angry' | 'tired' | 'happy';
    promptText: string;
    activeVisual: React.ReactNode; 
    doneVisual: React.ReactNode;
    audioFile: string;
    returnPath: string; //bc tired is /normal
}

function RainEffect({ intense = false }: { intense?: boolean }) {
    const drops = Array.from({ length: intense ? 500 : 200 }, (_, i) => ({
        id: i,
        opacity: Math.random() * (intense ? 0.9 : 0.6),
        left: `${Math.random() * 120 - 10}vw`,
        borderLeftWidth: `${Math.random() * 8}vmin`,
        animationDuration: `${Math.random() * (intense ? 2 : 3) + (intense ? 0.5 : 2)}s`,
        animationDelay: `${Math.random() * -12}s`,
    }));

    return (
        <div className="mood-capsule-page__effect mood-capsule-page__rain">
            {drops.map((drop) => (
                <div
                    key={drop.id}
                    className="mood-capsule-page__drop"
                    style={{
                        opacity: drop.opacity,
                        left: drop.left,
                        borderLeftWidth: drop.borderLeftWidth,
                        animationDuration: drop.animationDuration,
                        animationDelay: drop.animationDelay,
                    }}
                />
            ))}
        </div>
    );
}

function WaveEffect() {
    return (
        <div className="mood-capsule-page__effect">
            <div className="mood-capsule-page__wave-riser">
                <svg className="mood-capsule-page__wave-svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
                    <path className="mood-capsule-page__wave-path" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
                </svg>
                <div className="mood-capsule-page__water-body" />
            </div>
        </div>
    );
}

function SnowEffect() {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}vw`,
        duration: `${Math.random() * 8 + 7}s`,
        delay: `${Math.random() * -10}s`,
        size: `${Math.random() * 22 + 24}px`,
        leftIni: `${Math.random() * 14 - 7}vw`,
        leftEnd: `${Math.random() * 18 - 9}vw`,
        blur: i % 10 === 0 ? 'blur(5px)' : i % 6 === 0 ? 'blur(2px)' : i % 2 === 0 ? 'blur(1px)' : 'none',
    }));

    return (
        <div className="mood-capsule-page__effect mood-capsule-page__snow">
            {flakes.map((flake) => (
                <div
                    key={flake.id}
                    className="mood-capsule-page__snowflake"
                    style={{
                        left: flake.left,
                        animationDuration: flake.duration,
                        animationDelay: flake.delay,
                        fontSize: flake.size,
                        filter: flake.blur,
                        ['--left-ini' as string]: flake.leftIni,
                        ['--left-end' as string]: flake.leftEnd,
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
}

export default function MeditationScreen({ moodCategory, visualTheme, promptText, activeVisual, doneVisual, audioFile, returnPath }: FlowProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const timerSize = 'min(58vw, 46vh, 390px)';
    const enteredFromCapsulePage = location.state?.from === 'capsule-page';
    const [isLeavingToCapsules, setIsLeavingToCapsules] = useState(false);
    
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

    const handleCancel = () => {
        setIsActive(false);
        setIsLeavingToCapsules(true);

        window.setTimeout(() => {
            setSelectedCapsule(null);
            navigate(returnPath, { state: { from: 'meditation-screen' } });
        }, 320);
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

    const breathingText = getBreathingText();
    const meditationThemeClass = `mood-capsule-page--${visualTheme ?? moodCategory}`;
    const useLightText = visualTheme === 'sad' || visualTheme === 'angry' || visualTheme === 'tired';
    const meditationTextColor = useLightText ? 'rgba(255, 255, 255, 0.96)' : '#1a1a1a';
    const meditationTimerColor = useLightText ? 'rgba(255, 255, 255, 0.82)' : '#1a1a1a';
    const renderBackgroundEffects = () => {
        if (visualTheme === 'sad') {
            return (
                <>
                    <RainEffect />
                    <WaveEffect />
                </>
            );
        }

        if (visualTheme === 'stressed') {
            return <SnowEffect />;
        }

        if (visualTheme === 'angry') {
            return <RainEffect intense />;
        }

        return null;
    };

    return (
        <div
            className={`container mood-capsule-page ${meditationThemeClass}`}
            style={{
                minHeight: '100dvh',
                height: '100dvh',
                padding: '1rem',
                overflow: 'hidden',
            }}
        >
            {renderBackgroundEffects()}
            <audio ref={audioRef} src={audioFile} />

            {!isDone && selectedCapsule ? (
                <div
                    style={{
                        position: 'absolute',
                        top: '1.35rem',
                        left: '1.5rem',
                        zIndex: 1,
                        fontSize: 'clamp(2.6rem, 5vw, 4.25rem)',
                        lineHeight: 1,
                        filter: isActive ? 'drop-shadow(0 0 1em rgba(255,255,255,0.8))' : 'none',
                        transition: 'filter 0.5s ease',
                    }}
                >
                    {activeVisual}
                </div>
            ) : null}

            <div
                className="content"
                style={{
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                    minHeight: '100%',
                    height: '100%',
                    gap: '1rem',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div
                    className={`meditation-panel ${
                        isLeavingToCapsules
                            ? 'meditation-panel--leave'
                            : enteredFromCapsulePage
                                ? 'meditation-panel--enter'
                                : ''
                    }`}
                    style={{
                        justifyContent: 'center',
                        minHeight: '100%',
                    }}
                >
                {isDone ? (
                    <>
                        <h1 className="welcome" style={{ marginBottom: '0.35rem', fontSize: 'clamp(2rem, 4.2vw, 3.6rem)', color: meditationTextColor }}>
                            Session Complete
                        </h1>
                        <p style={{ color: meditationTextColor, fontSize: 'clamp(1rem, 1.8vw, 1.35rem)', fontWeight: 500, margin: 0 }}>
                            Great job taking time for yourself.
                        </p>
                        
                        <div style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', margin: '0.75rem 0', animation: 'logo-spin 4s ease-in-out' }}>
                            {doneVisual}
                        </div>
                        
                        <div className="options" style={{ justifyContent: 'center', marginTop: '0.25rem', gap: '0.85rem', flexWrap: 'nowrap', flex: '0 0 auto', alignItems: 'center' }}>
                            <button className="btn" style={{ justifyContent: 'center' }} onClick={() => handleNavigate('/')}>
                                Back to Home
                            </button>
                            <button className="btn" style={{ justifyContent: 'center' }} onClick={() => handleNavigate('/progress')}>
                                Check Progress
                            </button>
                        </div>
                    </>
                    ) 
                
                : selectedCapsule ? (
                    <>
                        <h1 className="welcome" style={{ marginBottom: '0.25rem', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: meditationTextColor }}>
                            {selectedCapsule.name}
                        </h1>
                        
                        <div
                            style={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '0.25rem auto 0',
                                width: timerSize,
                                height: timerSize,
                            }}
                        >
                            
                            <svg
                                viewBox="0 0 650 650"
                                width={timerSize}
                                height={timerSize}
                                style={{ transform: 'rotate(-90deg)' }}
                            >
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
                            
                            <div
                                style={{
                                    position: 'absolute',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '68%',
                                    maxWidth: '68%',
                                    inset: '16% 16% 16% 16%',
                                }}
                            >
                                <h2 style={{ 
                                    fontSize: breathingText.length > 24
                                        ? 'clamp(1.12rem, 2.2vw, 1.78rem)'
                                        : 'clamp(1.24rem, 2.6vw, 2.05rem)',
                                    color: meditationTextColor, 
                                    margin: '0', 
                                    fontWeight: 500, 
                                    transition: 'opacity 0.5s ease',
                                    textAlign: 'center',
                                    lineHeight: 1.05,
                                    maxWidth: '100%',
                                    overflowWrap: 'anywhere',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {breathingText}
                                </h2>
                                
                                <h3 style={{ 
                                    fontSize: 'clamp(1rem, 1.9vw, 1.55rem)', 
                                    color: meditationTimerColor, 
                                    margin: '0.55rem 0 0 0', 
                                    fontFamily: 'monospace', 
                                    opacity: 0.7,
                                    lineHeight: 1,
                                    textAlign: 'center',
                                }}>
                                    {formatTime(timeLeft)}
                                </h3>
                            </div>
                        </div>

                        <div className="options" style={{ justifyContent: 'center', marginTop: '0.35rem', gap: '0.85rem', flexWrap: 'nowrap', flex: '0 0 auto', alignItems: 'center' }}>
                            <button
                                className="btn"
                                style={{
                                    justifyContent: 'center',
                                }}
                                onClick={() => setIsActive(!isActive)}
                            >
                                {isActive ? '⏸ Pause' : 'Start'}
                            </button>
                            <button
                                className="btn"
                                style={{
                                    justifyContent: 'center',
                                }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) 
                
                
                : null //removed the part with capsule display- no need for duplicates
               
            }
                </div>
            </div>
        </div>
    );
}
