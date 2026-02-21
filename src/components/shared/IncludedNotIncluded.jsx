export default function IncludedNotIncluded({ included = [], notIncluded = [] }) {
  if (included.length === 0 && notIncluded.length === 0) return null

  return (
    <div className="included-notincluded">
      <div className="list">
        <h3>What's Included</h3>
        <ul>
          {included.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="list">
        <h3>What's Not Included</h3>
        <ul>
          {notIncluded.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
