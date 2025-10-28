import { resolvers } from './resolvers.js'; 

export const typeDefs = `#graphql
  type Query {
    hello: String,
    name: String,
    birthYear: Int,
    currentYear: Int,
    age: Int,
  }
`;