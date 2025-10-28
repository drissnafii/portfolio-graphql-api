import type { GraphQLContext } from './context.js';

export const resolvers = {
  Query: {
    hello: () => 'API is up and running!',
    name: () => 'My Name is Driss',
    birthYear: () => 2005,
    currentYear: () => new Date().getFullYear(),
    age: (_parent: any, _args: any, _context: GraphQLContext, _info: any) => {
      const birthYear = 2005;
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    },
  },
};