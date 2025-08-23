import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';

function HomePage() {
  const { jobs, loading, error} = useJobs();
  console.log('HomePage state:', {jobs, loading, error});

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

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
