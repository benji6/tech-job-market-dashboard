export default function Notes() {
  return (
    <>
      <h2>Notes</h2>
      <ul>
        <li>
          <a
            href="https://github.com/benji6/tech-job-market-dashboard"
            target="_blank"
          >
            Code open source on GitHub
          </a>
        </li>
        <li>
          A lot of this data is OSINT and carries all the typical caveats,
          although it can give insight into trends
        </li>
        <li>
          Latest layoff data is not complete yet so the last period is likely
          understated (except the trueup annual 2025 data which is a projection)
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
