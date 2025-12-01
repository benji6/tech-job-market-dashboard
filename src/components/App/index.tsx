import ComputerProgrammingJobs from "../ComputerProgrammingJobs";
import UkSweJobPostings from "../JobPostings";
import LayoffsByMonth from "../LayoffsByMonth";
import LayoffsByYear from "../LayoffsByYear";
import Notes from "../Notes";
import PostingsVsLayoffs from "../PostingsVsLayoffs";
import Sources from "../Sources";
import "./index.css";

export default function App() {
  return (
    <>
      <h1>Tech job market dashboard</h1>
      <div className="dashboard">
        <div>
          <UkSweJobPostings />
        </div>
        <div>
          <LayoffsByYear />
        </div>
        <div>
          <LayoffsByMonth />
        </div>
        <div>
          <PostingsVsLayoffs />
        </div>
        <div>
          <ComputerProgrammingJobs />
        </div>
      </div>
      <Notes />
      <Sources />
    </>
  );
}
