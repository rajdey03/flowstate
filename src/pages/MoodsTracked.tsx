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

const feelingOrder: FeelingLabel[] = ['Sad', 'Happy', 'Stressed', 'Angry', 'Tired'];

export default function MoodsTracked() {
    const navigate = useNavigate();
    const [isLeaving, setIsLeaving] = useState(false);
    const [currentFeeling, setCurrentFeeling] = useState<FeelingLabel>('Tired');
    const [moodCounts, setMoodCounts] = useState<Record<FeelingLabel, number>>({
        Sad: 0,
        Happy: 0,
        Stressed: 0,
        Angry: 0,
        Tired: 0,
    });

    useEffect(() => {
        const savedFeeling = localStorage.getItem('flowstate_last_feeling');
        if (savedFeeling && savedFeeling in feelingIcons) {
            setCurrentFeeling(savedFeeling as FeelingLabel);
        }

        const storedCounts = localStorage.getItem('flowstate_mood_counts');
        if (storedCounts) {
            const parsed = JSON.parse(storedCounts) as Partial<Record<FeelingLabel, number>>;
            setMoodCounts((previous) => ({
                ...previous,
                ...parsed,
            }));
        }
    }, []);

    const totalMoods = useMemo(
        () => feelingOrder.reduce((total, feeling) => total + (moodCounts[feeling] ?? 0), 0),
        [moodCounts]
    );

    const feelingIcon = feelingIcons[currentFeeling] ?? tiredIcon;
    const feelingIconClassName = `progress-feeling__icon ${currentFeeling === 'Happy' ? 'droplet-icon' : ''}`.trim();

    const handleBackToProgress = () => {
        setIsLeaving(true);

        setTimeout(() => {
            navigate('/progress', { state: { from: 'moods-tracked' } });
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
                    <h1>Moods Tracked</h1>
                    <p>Your mood tracker</p>
                </header>

                <div className="progress-stats-grid progress-stats-grid--minutes">
                    <section className="progress-stat progress-stat--fixed">
                        <div className="progress-ring progress-ring--minutes">
                            <div className="progress-ring__value">{totalMoods}</div>
                            <div className="progress-pill progress-pill--static">
                                <span>Moods Tracked</span>
                                <span className="progress-pill__arrow">→</span>
                            </div>
                        </div>
                    </section>

                    <section className={`weekly-card mood-card ${isLeaving ? 'weekly-card--slide-out' : 'weekly-card--slide-in'}`}>
                        <div className="mood-card__grid">
                            {feelingOrder.map((feeling) => (
                                <div key={feeling} className="mood-card__item">
                                    <img
                                        src={feelingIcons[feeling]}
                                        alt={`${feeling} icon`}
                                        className={`mood-card__icon ${feeling === 'Happy' ? 'droplet-icon' : ''}`.trim()}
                                    />
                                    <div className="mood-card__count">{moodCounts[feeling] ?? 0}</div>
                                    <div className="mood-card__pill">{feeling}</div>
                                </div>
                            ))}
                        </div>
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
