import {GraphQLClient, gql} from 'graphql-request';
import { getAccessToken } from '../auth';

const client = new GraphQLClient('http://localhost:9000/graphql', {
    headers : () => {
        const accessToken = getAccessToken();
        if(accessToken) {
            return {
                Authorization: `Bearer ${accessToken}`,
            };
        }
        return {};
    }
});

export async function fetchJobs() {
    const query  = gql`
        query {
            jobs {
                id
                title
                date
                company {
                    id
                    name
                }
            }
        }`
        const data = await client.request(query);
        return data.jobs;
};
export async function fetchJobById(id) {
    const query = gql`
        query($id: ID!) {
            job(id: $id) {
                id
                title
                description
                date
                company {
                    id
                    name
                }
            }
        }`;
    const variables = { id };
    const data = await client.request(query, variables);
    return data.job;
}

export async function deleteJob(id) {
    const mutation = gql`
        mutation DeleteJob($id: ID!) {
            deleteJob(id: $id) {
                id
            }
        }`;
    const data = await client.request(mutation, { id });
    return data.deleteJob;
    
}

export async function createJob(input) {
    const mutation = gql`
        mutation CreateJob ($input: CreateJobInput!) {
            createJob(input: $input) {
                id
            }
        }`;;
    const data = await client.request(mutation, {
        input: {
            companyId: input.companyId,
            title: input.title,
            description: input.description || '',
        }
    });
    return data.createJob;
}

export async function fetchCompanyById(id) {
    const query = gql`
        query($id: ID!) {
            companyById(id: $id) {
                id
                name
                description
                jobs {
                    id
                    title
                    description
                    date
                }
            }
        }`;
    const variables = { id };
    const data = await client.request(query, variables);
    return data.companyById;
}

