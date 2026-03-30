import MeditationScreen from './MeditationScreen';

export default function Stressed() {
    return (
        <MeditationScreen 
            moodCategory="stressed"
            promptText="Breathe deeply. Let the ice melt."
            activeVisual="🧊"
            doneVisual="💧"
            audioFile="/assets/white_noise.mp3" // The last 3 variables are just placeholders until i add the images and audios we want
        />
    );
}

