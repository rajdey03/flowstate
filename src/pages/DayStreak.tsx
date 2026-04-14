import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import flowstateLogo from '../assets/FlowState.svg';
import sadIcon from '../assets/sad.svg';
import stressedIcon from '../assets/stressed.svg';
import angryIcon from '../assets/angry.svg';
import tiredIcon from '../assets/tired.svg';
import happyIcon from '../assets/droplet.png';
import '../styles/progress.css';

type FeelingLabel = 'Sad' | 'Happy' | 'Stressed' | 'Angry' | 'Tired';

interface ProgressRecord {
    created_at?: string;
    capsules?: { duration_minutes: number } | { duration_minutes: number }[] | null;
}

const feelingIcons: Record<FeelingLabel, string> = {
    Sad: sadIcon,
    Happy: happyIcon,
    Stressed: stressedIcon,
    Angry: angryIcon,
    Tired: tiredIcon,
};

const storedFeelingLabels = new Set<FeelingLabel>(['Sad', 'Happy', 'Stressed', 'Angry', 'Tired']);
const mockWeeklyMinutes = [8, 14, 10, 6, 15, 11, 9];
const mockLongestStreak = 10;

const getWeekStart = (date: Date) => {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + offset);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
};

const getWeeklyMinutes = (records: ProgressRecord[]) => {
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const weeklyMinutes = [0, 0, 0, 0, 0, 0, 0];

    records.forEach((record) => {
        const capsule = Array.isArray(record.capsules) ? record.capsules[0] : record.capsules;
        const duration = capsule?.duration_minutes ?? 0;

        if (!record.created_at) {
            return;
        }

        const completedAt = new Date(record.created_at);
        if (completedAt >= weekStart && completedAt < weekEnd) {
            const dayIndex = (completedAt.getDay() + 6) % 7;
            weeklyMinutes[dayIndex] += duration;
        }
    });

    return weeklyMinutes.some((value) => value > 0) ? weeklyMinutes : mockWeeklyMinutes;
};

const getStreakStats = (weeklyMinutes: number[]) => {
    let currentStreak = 0;
    for (let index = weeklyMinutes.length - 1; index >= 0; index -= 1) {
        if (weeklyMinutes[index] > 0) {
            currentStreak += 1;
            continue;
        }
        break;
    }

    const atLeastWeeklyLogged = weeklyMinutes.every((value) => value > 0);
    if (atLeastWeeklyLogged) {
        currentStreak = Math.max(currentStreak, 7);
    }

    return {
        currentStreak: Math.max(currentStreak, 1),
        longestStreak: Math.max(mockLongestStreak, currentStreak, atLeastWeeklyLogged ? 7 : 0),
    };
};

export default function DayStreak() {
    const navigate = useNavigate();
    const [isLeaving, setIsLeaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentFeeling, setCurrentFeeling] = useState<FeelingLabel>('Tired');
    const [currentStreak, setCurrentStreak] = useState(7);
    const [longestStreak, setLongestStreak] = useState(mockLongestStreak);

    useEffect(() => {
        const savedFeeling = localStorage.getItem('flowstate_last_feeling');
        if (savedFeeling && storedFeelingLabels.has(savedFeeling as FeelingLabel)) {
            setCurrentFeeling(savedFeeling as FeelingLabel);
        }

        const fetchStreak = async () => {
            const userId = localStorage.getItem('flowstate_user_id');

            if (!userId) {
                const { currentStreak: mockStreak, longestStreak: mockLongest } = getStreakStats(mockWeeklyMinutes);
                setCurrentStreak(mockStreak);
                setLongestStreak(mockLongest);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('user_progress')
                .select('created_at, capsules!inner(duration_minutes)')
                .eq('anonymous_user_id', userId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching streak:', error);
                setLoading(false);
                return;
            }

            const records = (data ?? []) as ProgressRecord[];
            const { currentStreak: nextCurrentStreak, longestStreak: nextLongestStreak } = getStreakStats(
                getWeeklyMinutes(records)
            );

            setCurrentStreak(nextCurrentStreak);
            setLongestStreak(nextLongestStreak);
            setLoading(false);
        };

        fetchStreak();
    }, []);

    const streakIcons = useMemo(
        () => Array.from({ length: Math.max(currentStreak, 1) }, (_, index) => index),
        [currentStreak]
    );

    const feelingIcon = feelingIcons[currentFeeling] ?? tiredIcon;
    const feelingIconClassName = `progress-feeling__icon ${currentFeeling === 'Happy' ? 'droplet-icon' : ''}`.trim();

    const handleBackToProgress = () => {
        setIsLeaving(true);

        setTimeout(() => {
            navigate('/progress', { state: { from: 'day-streak' } });
        }, 360);
    };

    return (
        <div className="progress-page">
            <div className="progress-shell progress-shell--minutes">
                <img
                    src={flowstateLogo}
                    alt="FlowState logo"
                    className="progress-logo"
                />

                <header className={`progress-header ${isLeaving ? 'progress-header--leaving' : 'progress-header--entering'}`}>
                    <h1>Streak</h1>
                    <p>Your daily momentum</p>
                </header>

                <div className="progress-stats-grid progress-stats-grid--minutes">
                    <section className="progress-stat progress-stat--fixed">
                        <div className="progress-ring progress-ring--minutes">
                            <div className="progress-ring__value">{loading ? '...' : currentStreak}</div>
                            <div className="progress-pill progress-pill--static">
                                <span>Day Streak</span>
                                <span className="progress-pill__arrow">→</span>
                            </div>
                        </div>
                    </section>

                    <section className={`streak-panel ${isLeaving ? 'weekly-card--slide-out' : 'weekly-card--slide-in'}`}>
                        {loading ? (
                            <p className="progress-loading progress-loading--inline">Loading your streak...</p>
                        ) : (
                            <>
                                <p className="streak-panel__message">
                                    You are on a {currentStreak}-day streak! Keep going!
                                </p>
                                <div className="streak-panel__icons">
                                    {streakIcons.map((index) => (
                                        <img
                                            key={index}
                                            src={happyIcon}
                                            alt=""
                                            aria-hidden="true"
                                            className="streak-panel__icon droplet-icon"
                                        />
                                    ))}
                                </div>
                                <p className="streak-panel__subtext">Longest Streak Ever: {longestStreak} days</p>
                            </>
                        )}
                    </section>
                </div>

                <div className="progress-footer">
                    <button
                        className="progress-home-link"
                        onClick={handleBackToProgress}
                    >
                        Back to Progress
                    </button>

                    <div className="progress-feeling">
                        <img
                            src={feelingIcon}
                            alt={`${currentFeeling} icon`}
                            className={feelingIconClassName}
                        />
                        <div className="progress-feeling__content">
                            <span className="progress-feeling__label">Currently Feeling:</span>
                            <div className="progress-feeling__pill">{currentFeeling}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
