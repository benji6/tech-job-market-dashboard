import { useState } from "react";
import ComputerProgrammingJobs from "../ComputerProgrammingJobs";
import ComputerScienceGraduates from "../ComputerScienceGraduates";
import UkSweJobPostings from "../JobPostings";
import LayoffsByMonth from "../LayoffsByMonth";
import LayoffsByYear from "../LayoffsByYear";
import Notes from "../Notes";
import NetDemand from "../NetDemand";
import RemoteShare from "../RemoteShare";
import Sources from "../Sources";
import "./index.css";

export default function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <h1>Tech job market dashboard</h1>
      <div className="dashboard-controls">
        <label className="fullscreen-toggle">
          <input
            type="checkbox"
            checked={isFullscreen}
            onChange={(e) => setIsFullscreen(e.target.checked)}
          />
          Fullscreen charts
        </label>
      </div>
      <div
        className={`dashboard${isFullscreen ? " dashboard--fullscreen" : ""}`}
      >
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
          <NetDemand />
        </div>
        <div>
          <ComputerProgrammingJobs />
        </div>
        <div>
          <ComputerScienceGraduates />
        </div>
        <div>
          <RemoteShare />
        </div>
      </div>
      <Notes />
      <Sources />
    </>
  );
}
