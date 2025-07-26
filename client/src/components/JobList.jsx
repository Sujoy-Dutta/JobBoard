import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import { deleteJob } from '../lib/graphql/queries';

function JobList({ jobs }) {
  return (
    <ul className="box">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </ul>
  );
}

// ...existing code...
function JobItem({ job }) {
  const title = job.company
    ? `${job.title} at ${job.company.name}`
    : job.title;
  return (
    <li
      className="media"
      style={{
        border: '1px solid #b0b0b0', // darker grey border
        borderRadius: '6px',
        marginBottom: '14px',
        background: '#f7f7f7', // slightly darker background
        padding: '18px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}
    >
      <div className="media-left has-text-grey">
        {formatDate(job.date)}
      </div>
      <div className="media-content">
        <Link to={`/jobs/${job.id}`}>
          {title}
        </Link>
      </div>
      <div className="media-right">
        <button
          style={{
            backgroundColor: '#e3342f', // red
            color: '#fff',
            boxShadow: '0 2px 8px rgba(227,52,47,0.4)',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer'
          }}
         onClick={() => deleteJob(job.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
export default JobList;
