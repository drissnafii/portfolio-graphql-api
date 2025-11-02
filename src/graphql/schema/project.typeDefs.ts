export const projectTypeDefs = /* GraphQL */ `
  type Project {
    id: ID!
    createdBy: User!
    updatedBy: User
    title: String!
    description: String!
    technologies: [String!]
    projectUrl: String
    githubUrl: String
    images: [String!]
    startDate: Date!
    endDate: Date
    status: String!
    order: Int
    featured: Boolean!
    skills: [ProjectSkill!]
  }

  extend type Query {
    projects(
      status: String
      featured: Boolean
      limit: Int
      offset: Int
    ): [Project!]!
    project(id: ID!): Project
  }

  extend type Mutation {
    createProject(
      title: String!
      description: String!
      startDate: Date!
      status: String!
      featured: Boolean!
      endDate: Date
      technologies: [String!]
      projectUrl: String
      githubUrl: String
      images: [String!]
      order: Int
    ): Project!
    updateProject(
      id: ID!
      title: String
      description: String
      startDate: Date
      endDate: Date
      status: String
      featured: Boolean
      technologies: [String!]
      projectUrl: String
      githubUrl: String
      images: [String!]
      order: Int
    ): Project
    deleteProject(id: ID!): Project
  }
`;

