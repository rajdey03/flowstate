import MeditationScreen from './MeditationScreen';

export default function Tired() {
    return (
        <MeditationScreen 
            moodCategory="tired"
            promptText="Rest your eyes. Let the snow settle."
            activeVisual="❄️"
            doneVisual="💧"
            audioFile="/assets/soft_wind.mp3" // The last 3 variables are just placeholders until i add the images and audios we want
        />
    );
}