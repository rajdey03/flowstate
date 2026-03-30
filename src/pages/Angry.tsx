import MeditationScreen from './MeditationScreen';

export default function Angry() {
    return (
        <MeditationScreen 
            moodCategory="angry"
            promptText="Exhale slowly. Let the vapor condense."
            activeVisual="💨"
            doneVisual="💧"
            audioFile="/assets/deep_om.mp3" // The last 3 variables are just placeholders until i add the images and audios we want
        />
    );
}