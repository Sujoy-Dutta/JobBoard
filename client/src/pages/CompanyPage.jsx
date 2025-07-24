import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchCompanyById } from '../lib/graphql/queries';
import JobList from '../components/JobList';


function CompanyPage() {
  const { companyId } = useParams();

  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  })

  useEffect(() => {
    (async () => {
      try {
        const companyData = await fetchCompanyById(companyId);
        setState({
          company: companyData,
          loading: false,
          error: false,
        });
      } catch {
        setState({
          company: null,
          loading: false,
          error: true,
        });
      }
    })();
  }, [companyId]);

  if (state.loading) {
    return <div>Loading...</div>;
  }
  if (state.error) {
    return <div>Error loading company data.</div>;
  }
  if (!state.company) {
    return <div>No company found.</div>;
  }

  return (
    <div>
      <h1 className="title">
        {state.company.name}
      </h1>
      <div className="box">
        {state.company.description}
      </div>
      <h2 className="subtitle">Jobs at {state.company.name}</h2>
      <JobList jobs={state.company.jobs} />
    </div>
  );
}

export default CompanyPage;
