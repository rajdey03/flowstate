import MeditationScreen from './MeditationScreen';
import whiteNoiseAudio from '../assets/underwater-white-noise.mp3';

export default function Stressed() {
    return (
        <MeditationScreen 
            moodCategory="stressed"
            promptText="Breathe deeply. Let the ice melt."
            activeVisual="🧊"
            doneVisual="💧"
            audioFile={whiteNoiseAudio} // The last 3 variables are just placeholders until i add the images and audios we want
        />
    );
}

