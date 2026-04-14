import { useNavigate } from 'react-router-dom';
import flowstateLogo from '../assets/FlowState.svg';
import '../styles/progress.css';

interface ProgressDetailProps {
    title: string;
    description: string;
}

export default function ProgressDetail({ title, description }: ProgressDetailProps) {
    const navigate = useNavigate();

    return (
        <div className="progress-page">
            <div className="progress-shell progress-shell--detail">
                <img
                    src={flowstateLogo}
                    alt="FlowState logo"
                    className="progress-logo"
                />

                <div className="progress-detail">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>

                <div className="progress-footer progress-footer--detail">
                    <button
                        className="progress-home-link"
                        onClick={() => navigate('/progress')}
                    >
                        Back to Progress
                    </button>
                </div>
            </div>
        </div>
    );
}
