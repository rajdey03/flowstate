import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import flowstateLogo from '../assets/FlowState.svg';
import sadIcon from '../assets/sad.svg';
import stressedIcon from '../assets/stressed.svg';
import angryIcon from '../assets/angry.svg';
import tiredIcon from '../assets/tired.svg';
import happyIcon from '../assets/droplet.png';
import '../styles/progress.css';

type EmotionCategory = 'sad' | 'stressed' | 'angry' | 'tired';
type FeelingLabel = 'Sad' | 'Happy' | 'Stressed' | 'Angry' | 'Tired';

interface Capsule {
    id: string;
    emotion_category: EmotionCategory;
    duration_minutes: number;
}

interface ProgressRecord {
    capsule_id: string;
    created_at?: string;
    capsules?: Capsule | Capsule[] | null;
}

interface ProgressStats {
    minutesMeditated: number;
    moodsTracked: number;
    dayStreak: number;
    currentFeeling: string;
}

type StatPath =
    | '/progress/minutes-meditated'
    | '/progress/moods-tracked'
    | '/progress/day-streak';

const moodLabels: Record<EmotionCategory, string> = {
    sad: 'Sad',
    stressed: 'Stressed',
    angry: 'Angry',
    tired: 'Tired',
};

const storedFeelingLabels = new Set<FeelingLabel>(['Sad', 'Happy', 'Stressed', 'Angry', 'Tired']);
const feelingIcons: Record<FeelingLabel, string> = {
    Sad: sadIcon,
    Happy: happyIcon,
    Stressed: stressedIcon,
    Angry: angryIcon,
    Tired: tiredIcon,
};
const mockWeeklyMinutes = [8, 14, 10, 6, 15, 11, 9];
const mockWeeklyMinutesTotal = mockWeeklyMinutes.reduce((total, value) => total + value, 0);

const getStoredMoodCountTotal = () => {
    const storedCounts = localStorage.getItem('flowstate_mood_counts');
    if (!storedCounts) {
        return 0;
    }

    const parsedCounts = JSON.parse(storedCounts) as Partial<Record<FeelingLabel, number>>;
    return Object.values(parsedCounts).reduce((total, count) => total + (count ?? 0), 0);
};

const getWeekStart = (date: Date) => {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + offset);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
};

const getWeeklyDayStreak = (weeklyMinutes: number[]) => {
    let currentStreak = 0;
    for (let index = weeklyMinutes.length - 1; index >= 0; index -= 1) {
        if (weeklyMinutes[index] > 0) {
            currentStreak += 1;
            continue;
        }
        break;
    }

    if (weeklyMinutes.every((value) => value > 0)) {
        currentStreak = Math.max(currentStreak, 7);
    }

    return Math.max(currentStreak, 1);
};

const formatFeeling = (records: ProgressRecord[]) => {
    const latestWithMood = records.find((record) => {
        const capsule = Array.isArray(record.capsules) ? record.capsules[0] : record.capsules;
        return capsule?.emotion_category;
    });

    if (latestWithMood) {
        const capsule = Array.isArray(latestWithMood.capsules) ? latestWithMood.capsules[0] : latestWithMood.capsules;
        return capsule ? moodLabels[capsule.emotion_category] : 'Tired';
    }

    return 'Tired';
};

const buildFallbackStats = (currentFeeling?: string): ProgressStats => ({
    minutesMeditated: mockWeeklyMinutesTotal,
    moodsTracked: getStoredMoodCountTotal(),
    dayStreak: getWeeklyDayStreak(mockWeeklyMinutes),
    currentFeeling: currentFeeling ?? 'Tired',
});

const StatRing = ({
    value,
    label,
    accentClass,
    onClick,
    stateClass,
}: {
    value: number;
    label: string;
    accentClass: string;
    onClick: () => void;
    stateClass?: string;
}) => (
    <section className={`progress-stat ${stateClass ?? ''}`}>
        <div className={`progress-ring ${accentClass}`}>
            <div className="progress-ring__value">{value}</div>
            <button type="button" className="progress-pill" onClick={onClick}>
                <span>{label}</span>
                <span className="progress-pill__arrow">→</span>
            </button>
        </div>
    </section>
);

export default function Progress() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeStatPath, setActiveStatPath] = useState<StatPath | null>(null);
    const [restoringFromPath, setRestoringFromPath] = useState<StatPath | null>(null);
    const [stats, setStats] = useState<ProgressStats>({
        minutesMeditated: 0,
        moodsTracked: 0,
        dayStreak: 0,
        currentFeeling: 'Tired',
    });

    useEffect(() => {
        const fetchStats = async () => {
            const userId = localStorage.getItem('flowstate_user_id');
            const savedFeeling = localStorage.getItem('flowstate_last_feeling');
            const currentFeeling = savedFeeling && storedFeelingLabels.has(savedFeeling as FeelingLabel)
                ? savedFeeling
                : undefined;

            if (!userId) {
                setStats(buildFallbackStats(currentFeeling));
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('user_progress')
                .select('capsule_id, created_at, capsules!inner(id, emotion_category, duration_minutes)')
                .eq('anonymous_user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching progress:', error);
                setStats(buildFallbackStats(currentFeeling));
                setLoading(false);
                return;
            }

            const records = (data ?? []) as ProgressRecord[];
            const today = new Date();
            const weekStart = getWeekStart(today);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);
            const weeklyMinutes = [0, 0, 0, 0, 0, 0, 0];

            records.forEach((record) => {
                const capsule = Array.isArray(record.capsules) ? record.capsules[0] : record.capsules;
                const duration = capsule?.duration_minutes ?? 0;

                if (record.created_at) {
                    const completedAt = new Date(record.created_at);
                    if (completedAt >= weekStart && completedAt < weekEnd) {
                        const dayIndex = (completedAt.getDay() + 6) % 7;
                        weeklyMinutes[dayIndex] += duration;
                    }
                }
            });

            const resolvedWeeklyMinutes =
                weeklyMinutes.some((value) => value > 0) ? weeklyMinutes : mockWeeklyMinutes;
            const minutesMeditated = resolvedWeeklyMinutes.reduce((total, value) => total + value, 0);

            setStats({
                minutesMeditated,
                moodsTracked: getStoredMoodCountTotal(),
                dayStreak: getWeeklyDayStreak(resolvedWeeklyMinutes),
                currentFeeling: currentFeeling ?? formatFeeling(records),
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const from = location.state?.from;
        const returningPath =
            from === 'minutes-meditated'
                ? '/progress/minutes-meditated'
                : from === 'moods-tracked'
                    ? '/progress/moods-tracked'
                    : from === 'day-streak'
                        ? '/progress/day-streak'
                    : null;

        if (!returningPath) {
            return;
        }

        setActiveStatPath(returningPath);
        setRestoringFromPath(returningPath);

        const timeoutId = window.setTimeout(() => {
            setRestoringFromPath(null);
            setActiveStatPath(null);
        }, 420);

        return () => window.clearTimeout(timeoutId);
    }, [location.state]);

    const handleStatNavigate = (path: StatPath) => {
        setActiveStatPath(path);

        setTimeout(() => {
            navigate(path);
        }, 360);
    };

    const statCards = useMemo(
        () => [
            { value: stats.minutesMeditated, label: 'Minutes Meditated', accentClass: 'progress-ring--blue', path: '/progress/minutes-meditated' as const },
            { value: stats.moodsTracked, label: 'Moods Tracked', accentClass: 'progress-ring--purple', path: '/progress/moods-tracked' as const },
            { value: stats.dayStreak, label: 'Day Streak', accentClass: 'progress-ring--yellow', path: '/progress/day-streak' as const },
        ],
        [stats]
    );
    const feelingIcon = feelingIcons[(stats.currentFeeling as FeelingLabel)] ?? tiredIcon;
    const feelingIconClassName = `progress-feeling__icon ${stats.currentFeeling === 'Happy' ? 'droplet-icon' : ''}`.trim();
    const getStateClass = (path: StatPath) => {
        if (restoringFromPath === '/progress/minutes-meditated') {
            if (activeStatPath === path) {
                return 'progress-stat--selected';
            }

            return 'progress-stat--reappear';
        }

        if (restoringFromPath === '/progress/moods-tracked') {
            if (activeStatPath === path) {
                return 'progress-stat--restore-center';
            }

            return 'progress-stat--reappear';
        }

        if (restoringFromPath === '/progress/day-streak') {
            if (activeStatPath === path) {
                return 'progress-stat--restore-far-right';
            }

            return 'progress-stat--reappear';
        }

        if (activeStatPath === null) {
            return '';
        }

        if (activeStatPath === '/progress/moods-tracked' && path === activeStatPath) {
            return 'progress-stat--shift-left';
        }

        if (activeStatPath === '/progress/day-streak' && path === activeStatPath) {
            return 'progress-stat--shift-far-left';
        }

        return activeStatPath === path ? 'progress-stat--selected' : 'progress-stat--whoosh';
    };

    return (
        <div className="progress-page">
            <div className="progress-shell">
                <img
                    src={flowstateLogo}
                    alt="FlowState logo"
                    className="progress-logo"
                />

                <header className={`progress-header ${restoringFromPath ? 'progress-header--reentering' : 'progress-header--entering'}`}>
                    <h1>Progress Tracker</h1>
                    <p>A little progress goes a long way.</p>
                </header>

                {loading ? (
                    <p className="progress-loading">Loading your progress...</p>
                ) : (
                    <>
                        <div className="progress-stats-grid">
                            {statCards.map((card) => (
                                <StatRing
                                    key={card.label}
                                    value={card.value}
                                    label={card.label}
                                    accentClass={card.accentClass}
                                    onClick={() => handleStatNavigate(card.path)}
                                    stateClass={getStateClass(card.path)}
                                />
                            ))}
                        </div>

                        <div className="progress-footer">
                            <button
                                className="progress-home-link"
                                onClick={() => navigate('/')}
                            >
                                Back to Home
                            </button>

                            <div className="progress-feeling">
                                <img
                                    src={feelingIcon}
                                    alt={`${stats.currentFeeling} icon`}
                                    className={feelingIconClassName}
                                />
                                <div className="progress-feeling__content">
                                    <span className="progress-feeling__label">Currently Feeling:</span>
                                    <div className="progress-feeling__pill">{stats.currentFeeling}</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
