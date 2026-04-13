import MeditationScreen from './MeditationScreen';
import whiteNoiseAudio from '../assets/underwater-white-noise.mp3';
import flowstateLogo from '../assets/FlowState.svg';
import stressedIcon from '../assets/stressed.svg';

export default function Stressed() {
    return (
        <MeditationScreen 
            moodCategory="stressed"
            promptText="Unwind your mind"
            activeVisual={<img src={stressedIcon} alt="stressed icon" style={{ width: '120px', height: '120px' }} />}
            doneVisual={<img src={flowstateLogo} alt="flowstate logo" style={{ width: '120px', height: '120px' }} />}
            audioFile={whiteNoiseAudio} 
        />
    );
}

