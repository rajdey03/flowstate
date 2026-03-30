import MeditationScreen from './MeditationScreen';

export default function Sad() {
    return (
        <MeditationScreen 
            moodCategory="sad"
            promptText="Watch the ocean. Find your calm."
            activeVisual="🌊"
            doneVisual="💧"
            audioFile="/assets/gentle_rain.mp3" // The last 3 variables are just placeholders until i add the images and audios we want
        />
    );
}