export const skillTypeDefs = /* GraphQL */ `
  type Skill {
    id: ID!
    createdBy: User!
    updatedBy: User
    name: String!
    category: String!
    level: Int!
    icon: String
    description: String
    order: Int
  }

  extend type Query {
    skills: [Skill!]!
    skill(id: ID!): Skill
  }

  extend type Mutation {
    createSkill(name: String!, category: String!, level: Int!): Skill!
    updateSkill(id: ID!, name: String, category: String, level: Int): Skill
    deleteSkill(id: ID!): Skill
  }
`;

