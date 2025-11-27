import UkSweJobPostings from "./components/JobPostings";
import Layoffs from "./components/Layoffs";
import PostingsVsLayoffs from "./components/PostingsVsLayoffs";

export default function App() {
  return (
    <>
      <UkSweJobPostings />
      <Layoffs />
      <PostingsVsLayoffs />
    </>
  );
}
