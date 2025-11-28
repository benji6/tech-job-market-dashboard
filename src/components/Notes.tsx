export default function Notes() {
  return (
    <>
      <h2>Notes</h2>
      <ul>
        <li>
          This is OSINT and is likely a significant underestimate, although it
          can give insight into trends
        </li>
        <li>
          Latest data is not complete yet so the last period is likely
          understated (except the trueup annual 2025 data which is a projection)
        </li>
        <li>
          Trends in the monthly chart are computed with exponential moving
          averages
        </li>
        <li>
          Where trueup data is available it is normalized to match the
          layoffs.fyi data within the overlapping period before calculating the
          trend
        </li>
      </ul>
    </>
  );
}
