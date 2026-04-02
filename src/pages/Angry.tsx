import MeditationScreen from './MeditationScreen';
import midnightRainAudio from '../assets/midnight-rain.mp3';
import flowstateLogo from '../assets/FlowState.svg';
import angryIcon from '../assets/angry.svg';

export default function Angry() {
    return (
        <MeditationScreen 
            moodCategory="angry"
            promptText="Release the tension, regain control"
            activeVisual={<img src={angryIcon} alt="angry icon" style={{ width: '120px', height: '120px' }} />}
            doneVisual={<img src={flowstateLogo} alt="flowstate logo" style={{ width: '120px', height: '120px' }} />}
            audioFile={midnightRainAudio}
        />
    );
}