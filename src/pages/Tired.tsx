import MeditationScreen from './MeditationScreen';
import midnightRainAudio from '../assets/midnight-rain.mp3';
import flowstateLogo from '../assets/FlowState.svg';
import tiredIcon from '../assets/tired.svg';

export default function Tired() {
    return (
        <MeditationScreen 
            moodCategory="tired"
            promptText="Recharge your energy"
            activeVisual={<img src={tiredIcon} alt="tired icon" style={{ width: '120px', height: '120px' }} />}
            doneVisual={<img src={flowstateLogo} alt="flowstate logo" style={{ width: '120px', height: '120px' }} />}
            audioFile={midnightRainAudio} 
        />
    );
}