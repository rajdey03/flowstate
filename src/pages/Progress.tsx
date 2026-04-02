import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/home.css';

interface Capsule {
    id: string;
    name: string;
    emotion_category: 'sad' | 'stressed' | 'angry' | 'tired';
    duration_minutes: number;
}

interface GroupedCapsules {
    [key: string]: { capsule: Capsule; isCompleted: boolean }[];
}

export default function Progress() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [moodData, setMoodData] = useState<GroupedCapsules>({
        stressed: [],
        angry: [],
        tired: [],
        sad: []
    });

    const handleNavigate = (path: string) => {
        setTimeout(() => {
            navigate(path);
        }, 400);
    };

    useEffect(() => {
        const fetchChecklists = async () => {
            const { data: allCapsules, error: capsError } = await supabase
                .from('capsules')
                .select('*');

            if (capsError) {
                console.error("Error fetching capsules:", capsError);
                setLoading(false);
                return;
            }

            const userId = localStorage.getItem('flowstate_user_id');
            let completedIds = new Set<string>();

            if (userId) {
                const { data: userProgress } = await supabase
                    .from('user_progress')
                    .select('capsule_id')
                    .eq('anonymous_user_id', userId);
                
                if (userProgress) {
                    completedIds = new Set(userProgress.map(p => p.capsule_id));
                }
            }

            const grouped: GroupedCapsules = { stressed: [], angry: [], tired: [], sad: [] };
            
            allCapsules?.forEach((cap: Capsule) => {
                if (grouped[cap.emotion_category]) {
                    grouped[cap.emotion_category].push({
                        capsule: cap,
                        isCompleted: completedIds.has(cap.id)
                    });
                }
            });

            setMoodData(grouped);
            setLoading(false);
        };

        fetchChecklists();
    }, []);

    const MoodChecklist = ({ title, data }: { title: string, data: { capsule: Capsule, isCompleted: boolean }[] }) => (
        <div className="stat-card" style={{ textAlign: 'left', minWidth: '300px', background: 'rgba(255, 255, 255, 0.85)', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1a1a1a', borderBottom: '2px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>
                {title}
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {data.map((item) => (
                    <li key={item.capsule.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', color: '#1a1a1a' }}>
                        {/* Show a green checkmark if completed, or an empty circle if not */}
                        <span>{item.isCompleted ? '✅' : '⭕'}</span>
                        
                        {/* CHANGED: Removed the textDecoration line-through here! */}
                        <span style={{ opacity: item.isCompleted ? 0.6 : 1 }}>
                            {item.capsule.name}
                        </span>
                        
                        <span style={{ marginLeft: 'auto', fontSize: '0.9rem', opacity: 0.6 }}>
                            {item.capsule.duration_minutes}m
                        </span>
                    </li>
                ))}
                {data.length === 0 && <li style={{ opacity: 0.6 }}>No capsules yet...</li>}
            </ul>
        </div>
    );

    return (
        <div className="container" style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            position: 'relative' 
        }}>
            
            <h1 style={{ color: '#1a1a1a', fontSize: '3rem', marginBottom: '2rem', textShadow: '0 2px 10px rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.7)', padding: '10px 30px', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
                Your Progress Map
            </h1>

            {loading ? (
                <p style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '10px', color: '#1a1a1a' }}>Loading your progress...</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    <MoodChecklist title="Stress Management" data={moodData.stressed} />
                    <MoodChecklist title="Anger Management" data={moodData.angry} />
                    <MoodChecklist title="Tired Management" data={moodData.tired} />
                    <MoodChecklist title="Sadness Management" data={moodData.sad} />
                </div>
            )}

            <button 
                className="btn" 
                style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.9)' }} 
                onClick={() => handleNavigate('/')}
            >
                Back to Home
            </button>
        </div>
    );
}