import { useParams } from 'react-router';
import { companyByIdQuery } from '../lib/graphql/queries';
import JobList from '../components/JobList';
import { useQuery } from '@apollo/client';


function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error} = useQuery(companyByIdQuery, {
    variables: { id: companyId },
  });
  console.log('CompanyPage state:', {data, loading, error});

  const { company } = data;
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading company data.</div>;
  }
  if (!company) {
    return <div>No company found.</div>;
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="subtitle">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
