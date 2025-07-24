import { GraphQLError } from 'graphql';
import {getJobs, getJob, getJobsByCompanyId, createJob} from './db/jobs.js';
import { getCompany } from './db/companies.js';
export const resolvers = {
  Query: {
    jobs: async () => getJobs(),
    job: async (_, { id }) => {
      const job = getJob(id);
      if(!job) {
        return NotFoundError(`Job not found: ${id}`);
      }
      return job;
    },

    companyById: async (_, { id }) => {
      const company = await getCompany(id);
      if(!company) {
        return NotFoundError(`Company not found: ${id}`);
      }
      return company;
    },
    },
    Company: {
          jobs: async (company) => getJobsByCompanyId(company.id), 
    },
    Job:{
        company: (job) => getCompany(job.companyId),
        date: (job) => job.createdAt.slice(0, "YYYY-MM-DD".length),
    },

    Mutation: {
      createJob: async(_, { companyId, title, description }) => {
        return await createJob({ companyId, title, description });
      },
    },
}
function NotFoundError(message) {
    return new GraphQLError(message, {
      extensions: {
        code: 'NOT_FOUND',
      }
    });
  }