import cors from 'cors';
import express from 'express';
import {readFile} from 'fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express4';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

async function getContext({ req }) {
  if(req.auth) {
    const user = await getUser(req.auth.sub);
    return { user };
  }
  return {};
}

app.post('/login', handleLogin);
const typeDefs = await readFile('./schema.graphql', 'utf8');
const apolloServer = new ApolloServer({typeDefs, resolvers, introspection: true});
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, {context: getContext}));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}/graphql`);
});
