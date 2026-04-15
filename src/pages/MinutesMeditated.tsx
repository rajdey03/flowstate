import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import flowstateLogo from '../assets/FlowState.svg';
import sadIcon from '../assets/sad.svg';
import stressedIcon from '../assets/stressed.svg';
import angryIcon from '../assets/angry.svg';
import tiredIcon from '../assets/tired.svg';
import happyIcon from '../assets/droplet.png';
import '../styles/progress.css';

type FeelingLabel = 'Sad' | 'Happy' | 'Stressed' | 'Angry' | 'Tired';

const feelingIcons: Record<FeelingLabel, string> = {
    Sad: sadIcon,
    Happy: happyIcon,
    Stressed: stressedIcon,
    Angry: angryIcon,
    Tired: tiredIcon,
};

const storedFeelingLabels = new Set<FeelingLabel>(['Sad', 'Happy', 'Stressed', 'Angry', 'Tired']);
const weekdayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mockWeeklyMinutes = [8, 14, 10, 6, 15, 11, 9];
const mockWeeklyMinutesTotal = mockWeeklyMinutes.reduce((total, value) => total + value, 0);

export default function MinutesMeditated() {
    const navigate = useNavigate();
    const [isLeaving, setIsLeaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [minutesMeditated, setMinutesMeditated] = useState(0);
    const [currentFeeling, setCurrentFeeling] = useState<FeelingLabel>('Tired');
    const [weeklyMinutes, setWeeklyMinutes] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        const savedFeeling = localStorage.getItem('flowstate_last_feeling');
        if (savedFeeling && storedFeelingLabels.has(savedFeeling as FeelingLabel)) {
            setCurrentFeeling(savedFeeling as FeelingLabel);
        }
        setMinutesMeditated(mockWeeklyMinutesTotal);
        setWeeklyMinutes(mockWeeklyMinutes);
        setLoading(false);
    }, []);

    const maxMinutes = useMemo(
        () => Math.max(...weeklyMinutes, 1),
        [weeklyMinutes]
    );

    const feelingIcon = feelingIcons[currentFeeling] ?? tiredIcon;
    const feelingIconClassName = `progress-feeling__icon ${currentFeeling === 'Happy' ? 'droplet-icon' : ''}`.trim();
    const handleBackToProgress = () => {
        setIsLeaving(true);

        setTimeout(() => {
            navigate('/progress', { state: { from: 'minutes-meditated' } });
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
                    <h1>Minutes Meditated</h1>
                    <p>Your weekly insight</p>
                </header>

                <div className="progress-stats-grid progress-stats-grid--minutes">
                    <section className="progress-stat progress-stat--fixed">
                        <div className="progress-ring progress-ring--minutes">
                            <div className="progress-ring__value">{loading ? '...' : minutesMeditated}</div>
                            <div className="progress-pill progress-pill--static">
                                <span>Minutes Meditated</span>
                                <span className="progress-pill__arrow">→</span>
                            </div>
                        </div>
                    </section>

                    <section className={`weekly-card ${isLeaving ? 'weekly-card--slide-out' : 'weekly-card--slide-in'}`}>
                        {loading ? (
                            <p className="progress-loading progress-loading--inline">Loading your week...</p>
                        ) : (
                            <div className="weekly-chart">
                                {weekdayLabels.map((day, index) => (
                                    <div key={day} className="weekly-chart__row">
                                        <span className="weekly-chart__label">{day}</span>
                                        <div className="weekly-chart__track">
                                            <div
                                                className="weekly-chart__bar"
                                                style={{ width: `${(weeklyMinutes[index] / maxMinutes) * 100}%` }}
                                            />
                                        </div>
                                        <span className="weekly-chart__value">{weeklyMinutes[index]} min</span>
                                    </div>
                                ))}
                            </div>
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
