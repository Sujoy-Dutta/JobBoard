// import {GraphQLClient} from 'graphql-request';
import { getAccessToken } from '../auth';
import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from '@apollo/client';

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//     headers : () => {
//         const accessToken = getAccessToken();
//         if(accessToken) {
//             return {
//                 Authorization: `Bearer ${accessToken}`,
//             };
//         }
//         return {};
//     }
// });

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql'});

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
    return forward(operation);
})

// const customLink = new ApolloLink((operation, forward) => {
//     console.log('GraphQL Operation:', operation);
//     return forward(operation);
// }
// )

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     watchQuery: {
    //         fetchPolicy: 'network-only',
    //     },
    //     query: {
    //         fetchPolicy: 'network-only',
    //     },
    // },
});


export const JobsQuery = gql`
        query Jobs{
            jobs {
                id
                title
                date
                company {
                    id
                    name
                }
            }
        }`;

export const companyByIdQuery = gql`
        query companyById($id: ID!) {
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
        }`
export async function fetchJobById(id) {
    const variables = { id };
    const { data } = await apolloClient.query({ 
        query : JobByIdQuery, 
        variables 
    });
    return data.job;
}

export async function deleteJob(id) {
    const mutation = gql`
        mutation DeleteJob($id: ID!) {
            deleteJob(id: $id) {
                id
            }
        }`;
    const { data } = await apolloClient.mutate({
        mutation,
        variables: { id },
    });

    return data.deleteJob;
    
}
 const jobDetailsFragment = gql`
    fragment JobDetails on Job {
                id
                title
                description
                date
                company {
                    id
                    name
                }
    }`;

 export const JobByIdQuery = gql`
        query JobsById($id: ID!) {
            job(id: $id) {
                ...JobDetails
            }
        }
        ${jobDetailsFragment}
    `;

export const createJobMutation = gql`
    mutation CreateJob ($input: CreateJobInput!) {
        job: createJob(input: $input) {
            ...JobDetails
        }
    }
    ${jobDetailsFragment}
`;
export async function createJob(input) {
    const mutation = gql`
        mutation CreateJob ($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetails
            }
        }
        ${jobDetailsFragment}
    `;
    const { data } = await apolloClient.mutate({
        mutation, 
            variables: { input: {
                title: input.title,
                description: input.description || '',
            }
        },
        update: (cache, { data }) => {
            console.log("Data", data)
            cache.writeQuery({
                query: JobByIdQuery,
                variables: { id: data.job.id },
                data
            })
        }
    });
    return data.job;
}

// export async function fetchCompanyById(id) {
//     const query = gql`
//         query($id: ID!) {
//             companyById(id: $id) {
//                 id
//                 name
//                 description
//                 jobs {
//                     id
//                     title
//                     description
//                     date
//                 }
//             }
//         }`;
//     const variables = { id };
//     const {data} = await apolloClient.query({ query, variables });
//     console.log('fetchCompanyById data:', data);
//     return data.companyById;
// }

