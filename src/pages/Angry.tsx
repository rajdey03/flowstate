import angryImage from '../assets/angry.png'
import MoodCapsulePage from '../components/MoodCapsulePage'

function AngryRain() {
  const drops = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    opacity: Math.random() * 0.9,
    left: `${Math.random() * 120 - 10}vw`,
    borderLeftWidth: `${Math.random() * 8}vmin`,
    animationDuration: `${Math.random() * 2 + 0.5}s`,
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

export default function Angry() {
  return (
    <MoodCapsulePage
      iconSrc={angryImage}
      iconAlt="angry"
      title="Release the heat"
      subtitle="Pick a guide that helps you slow your breathing and let the tension pass."
      themeClass="mood-capsule-page--angry"
      queryEmotion="angry"
      meditatePath="/angry/meditate"
      backgroundEffects={<AngryRain />}
    />
  )
}
