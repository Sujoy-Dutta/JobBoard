import { GraphQLError } from 'graphql';
import {getJobs, getJob, getJobsByCompanyId, createJob, deleteJob, updateJob} from './db/jobs.js';
import { getCompany } from './db/companies.js';
export const resolvers = {
  Query: {
    jobs: async (_root, {limit, offset}) => getJobs(limit, offset),
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
      company: (job, _args, { companyLoader }) => {
        return companyLoader.load(job.companyId);
      },
      date: (job) => job.createdAt.slice(0, "YYYY-MM-DD".length),
    },

    Mutation: {
      createJob: async(_, { input: { title, description }}, { user }) => {
        if(!user) {
          throw new GraphQLError('Missing Authentication', {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          });
        }
        return await createJob({ companyId: user.companyId, title, description });
      },
      deleteJob: async(_, { id}, { user }) => {
        if(!user) {
          throw new GraphQLError('Missing Authentication', {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          });
        }
        const job =  await deleteJob(id, user.companyId);
        if(!job) {
          return NotFoundError(`Job not found: ${id}`);
        }
        return job;
      },
      updateJob: async(_, { id, companyId, input: { title, description }}, { user }) => {
        if(!user) {
          throw new GraphQLError('Missing Authentication', {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          });
        }
        const job = await updateJob({ id, companyId: user.companyId, title, description });
        if(!job) {
          return NotFoundError(`Job not found: ${id}`);
        }
        return job;
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