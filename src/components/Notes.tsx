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
          There is a lag between layoffs being reported and appearing in the
          data, so the latest periods are likely understated.
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
