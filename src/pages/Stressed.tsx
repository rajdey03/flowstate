import { type CSSProperties } from 'react'
import stressedImage from '../assets/stressed.png'
import MoodCapsulePage from '../components/MoodCapsulePage'

function Snow() {
  const flakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    duration: `${Math.random() * 8 + 7}s`,
    delay: `${Math.random() * -10}s`,
    size: `${Math.random() * 22 + 24}px`,
    leftIni: `${Math.random() * 14 - 7}vw`,
    leftEnd: `${Math.random() * 18 - 9}vw`,
    blur: i % 10 === 0 ? 'blur(5px)' : i % 6 === 0 ? 'blur(2px)' : i % 2 === 0 ? 'blur(1px)' : 'none',
  }))

  const getFlakeStyle = (flake: (typeof flakes)[number]) => ({
    left: flake.left,
    animationDuration: flake.duration,
    animationDelay: flake.delay,
    fontSize: flake.size,
    filter: flake.blur,
    ['--left-ini' as string]: flake.leftIni,
    ['--left-end' as string]: flake.leftEnd,
  }) as CSSProperties

  return (
    <div className="mood-capsule-page__effect mood-capsule-page__snow">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="mood-capsule-page__snowflake"
          style={getFlakeStyle(flake)}
        >
          ❄
        </div>
      ))}
    </div>
  )
}

export default function Stressed() {
  return (
    <MoodCapsulePage
      iconSrc={stressedImage}
      iconAlt="stressed"
      title="Ease the pressure"
      subtitle="Take a moment for yourself with meditation guides chosen to slow everything down."
      themeClass="mood-capsule-page--stressed"
      queryEmotion="stressed"
      meditatePath="/stressed/meditate"
      backgroundEffects={<Snow />}
    />
  )
}
