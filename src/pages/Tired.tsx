import tiredImage from '../assets/tired.svg'
import MoodCapsulePage from '../components/MoodCapsulePage'

export default function Tired() {
  return (
    <MoodCapsulePage
      iconSrc={tiredImage}
      iconAlt="tired"
      title="Unwind your mind"
      subtitle="Take a moment for yourself with meditation guides chosen just for you."
      themeClass="mood-capsule-page--tired"
      queryEmotion="tired"
      meditatePath="/tired/meditate"
    />
  )
}
