export const typeDefs = `#graphql
  scalar Date

  enum OrderDirection {
    asc
    desc
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

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

  type ProjectSkill {
    id: ID!
    project: Project!
    skill: Skill!
    usage_level: Int
  }

  # Un type de réponse pour le login, c'est une bonne pratique
  type AuthPayload {
    token: String!
    user: User!
  }

  # Un type spécial pour la réponse de la query getPortfolio
  type PortfolioPayload {
    profile: Profile
    projects(orderBy: ProjectOrderByInput): [Project!]!
    skills(orderBy: SkillOrderByInput): [Skill!]!
    experiences: [Experience!]!
  }

  input ProjectOrderByInput {
    featured: OrderDirection
    startDate: OrderDirection
    order: OrderDirection
    title: OrderDirection
  }

  input SkillOrderByInput {
    level: OrderDirection
    name: OrderDirection
    category: OrderDirection
    order: OrderDirection
  }

  type Query {
    # User
    users: [User!]!
    user(id: ID!): User

    # Profile
    profiles: [Profile!]!
    profile(id: ID!): Profile

    # Experience
    experiences: [Experience!]!
    experience(id: ID!): Experience

    # Project
    projects: [Project!]!
    project(id: ID!): Project

    # Skill
    skills: [Skill!]!
    skill(id: ID!): Skill

    # Portfolio
    getPortfolio: PortfolioPayload!
  }

  # Add other input types for mutations

  type Mutation {
    # On ajoute la mutation de connexion ici
    login(email: String!, password: String!): AuthPayload!

    # User
    createUser(username: String!, email: String!, password: String!, role: String): User!
    updateUser(id: ID!, username: String, email: String, role: String): User
    deleteUser(id: ID!): User

    # Profile
    createProfile(
      # Required fields
      lastName: String!
      firstName: String!
      title: String!
      biography: String!
      email: String!
      # Optional fields
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
      lastName: String, firstName: String, title: String, biography: String, email: String
      phone: String, address: String, photo: String, github: String, linkedin: String, twitter: String, website: String, cv: String
    ): Profile
    deleteProfile(id: ID!): Profile

    # Experience
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

    # Project
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

    # Skill
    createSkill(name: String!, category: String!, level: Int!): Skill!
    updateSkill(id: ID!, name: String, category: String, level: Int): Skill
    deleteSkill(id: ID!): Skill

    # ProjectSkill
    addSkillToProject(
      projectId: ID!
      skillId: ID!
      usage_level: Int
    ): ProjectSkill!
  }
`;
