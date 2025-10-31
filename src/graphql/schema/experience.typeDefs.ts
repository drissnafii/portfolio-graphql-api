export const experienceTypeDefs = /* GraphQL */ `
  type Experience {
    id: ID!
    createdBy: User!
    updatedBy: User
    position: String!
    company: String!
    location: String
    description: String!
    startDate: Date!
    endDate: Date
    current: Boolean!
    technologies: [String!]
    achievements: [String!]
    logo: String
  }

  extend type Query {
    experiences: [Experience!]!
    experience(id: ID!): Experience
  }

  extend type Mutation {
    createExperience(
      position: String!
      company: String!
      description: String!
      startDate: Date!
      current: Boolean!
      location: String
      endDate: Date
      technologies: [String!]
      achievements: [String!]
      logo: String
    ): Experience!
    updateExperience(
      id: ID!
      position: String
      company: String
      description: String
      startDate: Date
      endDate: Date
      current: Boolean
      location: String
      technologies: [String!]
      achievements: [String!]
      logo: String
    ): Experience
    deleteExperience(id: ID!): Experience
  }
`;

