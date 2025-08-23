import { useQuery, useMutation } from '@apollo/client';
import { companyByIdQuery, JobByIdQuery, JobsQuery, createJobMutation} from './queries';

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

  export function useCreateJob() {
    const [mutate, {loading}] = useMutation(createJobMutation);

    const createJob = async({title, description}) => {
      const { data: {job}} = await mutate({
        variables: { input: {title, description}},
        update: (cache, {data}) =>{
          cache.writeQuery({
            query: JobByIdQuery,
            variables: { id: data.job.id},
            data
          })
        }
      })
      return job;
    };

    return {
      createJob,
      loading
    }
  }