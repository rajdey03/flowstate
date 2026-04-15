import sadImage from '../assets/sad.png'
import MoodCapsulePage from '../components/MoodCapsulePage'

function SadRain() {
  const drops = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    opacity: Math.random() * 0.6,
    left: `${Math.random() * 120 - 10}vw`,
    borderLeftWidth: `${Math.random() * 8}vmin`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * -12}s`,
  }))

  return (
    <div className="mood-capsule-page__effect mood-capsule-page__rain">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="mood-capsule-page__drop"
          style={{
            opacity: drop.opacity,
            left: drop.left,
            borderLeftWidth: drop.borderLeftWidth,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay,
          }}
        />
      ))}
    </div>
  )
}

function SadWave() {
  return (
    <div className="mood-capsule-page__effect">
      <div className="mood-capsule-page__wave-riser">
        <svg className="mood-capsule-page__wave-svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path className="mood-capsule-page__wave-path" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
        <div className="mood-capsule-page__water-body" />
      </div>
    </div>
  )
}

export default function Sad() {
  return (
    <MoodCapsulePage
      iconSrc={sadImage}
      iconAlt="sad"
      title="Take it gently"
      subtitle="Choose a quiet reset and give yourself a little space to breathe."
      themeClass="mood-capsule-page--sad"
      queryEmotion="sad"
      meditatePath="/sad/meditate"
      backgroundEffects={
        <>
          <SadRain />
          <SadWave />
        </>
      }
    />
  )
}
