import {getJobs, getJob} from './db/jobs.js';
import { getCompany } from './db/companies.js';
export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_, { id }) => getJob(id),
    companyById: async (_, { id }) => getCompany(id),
    },
    Job:{
        company: (job) => getCompany(job.companyId),
        date: (job) => job.createdAt.slice(0, "YYYY-MM-DD".length),
    },
}