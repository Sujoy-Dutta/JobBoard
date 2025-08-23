import { useQuery } from '@apollo/client';
import { companyByIdQuery, JobByIdQuery, JobsQuery} from './queries';

export function useCompany(id) {
    const { data, loading, error} = useQuery(companyByIdQuery, {
      variables: { id: id },
    })
    return { company: data?.companyById, loading, error: Boolean(error)}
  }

export function useJob(id) {
    console.log('useJob called with id:', id);
    const { data, loading, error} = useQuery(JobByIdQuery, {
        variables: { id: id },
    })
    return { job: data?.job, loading, error: Boolean(error)}
  }

  export function useJobs() {
    const { data, loading, error} = useQuery(JobsQuery, {
        fetchPolicy: 'network-only',
    })
    console.log('useJobs state:', {data, loading, error});
    return { jobs: data?.jobs, loading, error: Boolean(error)}
  }