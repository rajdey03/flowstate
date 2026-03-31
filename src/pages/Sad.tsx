import MeditationScreen from './MeditationScreen';
import midnightRainAudio from '../assets/midnight-rain.mp3';

export default function Sad() {
    return (
        <MeditationScreen 
            moodCategory="sad"
            promptText="Watch the ocean. Find your calm."
            activeVisual="🌊"
            doneVisual="💧"
            audioFile={midnightRainAudio} // The last 3 variables are just placeholders until i add the images and audios we want
        />
    );
}