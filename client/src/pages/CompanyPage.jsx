import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchCompanyById } from '../lib/graphql/queries';


function CompanyPage() {
  const { companyId } = useParams();

  const [company, setComapny] = useState(null);

  useEffect(() => {
    fetchCompanyById(companyId).then(setComapny);
  }, [companyId]);
  
  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
    </div>
  );
}

export default CompanyPage;
