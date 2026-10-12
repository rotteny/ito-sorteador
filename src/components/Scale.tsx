import './Scale.css'

interface ScaleProps {
  min: string
  max: string
}

const SEGMENTS = [1, 2, 3, 4, 5, 6] as const

/** Régua 1 ↔ 100 com as 6 cores e as legendas "1 = min" / "100 = max". */
export function Scale({ min, max }: ScaleProps) {
  return (
    <div className="scale">
      <div className="scale__bar" aria-hidden="true">
        <span className="scale__end">1</span>
        {SEGMENTS.map((n) => (
          <span key={n} className={`scale__seg scale__seg--${n}`} />
        ))}
        <span className="scale__end scale__end--max">100</span>
      </div>
      <div className="scale__legend">
        <span>1 = {min}</span>
        <span className="scale__legend-max">100 = {max}</span>
      </div>
    </div>
  )
}
