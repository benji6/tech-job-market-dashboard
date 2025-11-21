import UkSweJobPostings from "./components/JobPostings";
import Layoffs from "./components/Layoffs";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <UkSweJobPostings />
      <Layoffs />
    </div>
  );
}
