export const profileTypeDefs = /* GraphQL */ `
  type Profile {
    id: ID!
    createdBy: User!
    updatedBy: User
    lastName: String!
    firstName: String!
    title: String!
    biography: String!
    email: String!
    phone: String
    address: String
    photo: String
    github: String
    linkedin: String
    twitter: String
    website: String
    cv: String
  }

  extend type Query {
    profiles: [Profile!]!
    profile(id: ID!): Profile
  }

  extend type Mutation {
    createProfile(
      lastName: String!
      firstName: String!
      title: String!
      biography: String!
      email: String!
      phone: String
      address: String
      photo: String
      github: String
      linkedin: String
      twitter: String
      website: String
      cv: String
    ): Profile!
    updateProfile(
      id: ID!
      lastName: String
      firstName: String
      title: String
      biography: String
      email: String
      phone: String
      address: String
      photo: String
      github: String
      linkedin: String
      twitter: String
      website: String
      cv: String
    ): Profile
    deleteProfile(id: ID!): Profile
  }
`;

