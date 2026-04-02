import MeditationScreen from './MeditationScreen';
import midnightRainAudio from '../assets/midnight-rain.mp3';
import flowstateLogo from '../assets/FlowState.svg';
import sadIcon from '../assets/sad.svg';

export default function Sad() {
    return (
        <MeditationScreen 
            moodCategory="sad"
            promptText="Gentle breaths for a heavy heart"
            activeVisual={<img src={sadIcon} alt="sad icon" style={{ width: '120px', height: '120px' }} />}
            doneVisual={<img src={flowstateLogo} alt="flowstate logo" style={{ width: '120px', height: '120px' }} />}
            audioFile={midnightRainAudio}
        />
    );
}