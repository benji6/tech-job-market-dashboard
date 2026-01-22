import { useState } from "react";
import ComputerProgrammingJobs from "../ComputerProgrammingJobs";
import ComputerScienceGraduates from "../ComputerScienceGraduates";
import JobPostings from "../JobPostings";
import Vacancies from "../Vacancies";
import LayoffsByMonth from "../LayoffsByMonth";
import LayoffsByYear from "../LayoffsByYear";
import Notes from "../Notes";
import NetDemand from "../NetDemand";
import RemoteShare from "../RemoteShare";
import SeeAlso from "../SeeAlso";
import "./index.css";
import WorkforceJobs from "../WorkforceJobs";

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
        <JobPostings />
        <Vacancies />
        <LayoffsByYear />
        <LayoffsByMonth />
        <NetDemand />
        <ComputerProgrammingJobs />
        <WorkforceJobs />
        <ComputerScienceGraduates />
        <RemoteShare />
      </div>
      <Notes />
      <SeeAlso />
    </>
  );
}
