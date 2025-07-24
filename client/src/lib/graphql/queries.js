import {GraphQLClient, gql} from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

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

