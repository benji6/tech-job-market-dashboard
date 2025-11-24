import LayoffsByYear from "./LayoffsByYear";
import LayoffsByMonth from "./LayoffsByMonth";

export default function Layoffs() {
  return (
    <>
      <h1>Tech industry layoffs</h1>
      <p>
        Sources:{" "}
        <a href="https://layoffs.fyi" target="_blank">
          Layoffs.fyi
        </a>
        {", "}
        <a href="https://www.trueup.io/layoffs" target="_blank">
          trueup
        </a>
      </p>
      <small>
        <details>
          <summary>Notes</summary>
          <ul>
            <li>
              This is OSINT and is likely a significant underestimate, although
              it can give insight into trends.
            </li>
            <li>
              Latest data is not complete yet so the last period is likely
              understated (except the trueup annual 2025 data which is a
              projection).
            </li>
            <li>
              Trends in the monthly chart are computed with exponential moving
              averages. Where trueup data is available it is normalized to match
              the layoffs.fyi data within the overlapping period before
              calculating the trend.
            </li>
          </ul>
        </details>
      </small>
      <LayoffsByYear />
      <LayoffsByMonth />
    </>
  );
}
