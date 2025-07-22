import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { fetchJobs } from '../lib/graphql/queries';

function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() =>{
    fetchJobs().then(setJobs)
  }, []);
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
