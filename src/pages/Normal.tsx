import dropletImage from '../assets/droplet.png'
import MoodCapsulePage from '../components/MoodCapsulePage'

const happyCapsuleNames = [
  'Morning Glow',
  'Bright Mind Reset',
  'Good Vibes Breathing',
  'Sunny Focus Flow',
  'Positive Energy Pause',
]

export default function Normal() {
  return (
    <MoodCapsulePage
      iconSrc={dropletImage}
      iconAlt="happy"
      title="Keep the good energy flowing"
      subtitle="Pick a meditation guide that helps you stay present and carry that light mood forward."
      themeClass="mood-capsule-page--happy"
      queryEmotion="tired"
      meditatePath="/normal/meditate"
      renameCapsule={(_, index) => happyCapsuleNames[index] ?? `Good Energy Session ${index + 1}`}
    />
  )
}
