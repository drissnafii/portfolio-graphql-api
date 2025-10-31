export const baseTypeDefs = /* GraphQL */ `
  scalar Date

  enum OrderDirection {
    asc
    desc
  }

  type Query {
    _empty: Boolean!
  }

  type Mutation {
    _empty: Boolean
  }
`;

