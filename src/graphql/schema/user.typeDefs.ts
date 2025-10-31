export const userTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(username: String!, email: String!, password: String!, role: String): User!
    updateUser(id: ID!, username: String, email: String, role: String): User
    deleteUser(id: ID!): User
  }
`;

