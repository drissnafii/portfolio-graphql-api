export const portfolioTypeDefs = /* GraphQL */ `
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

  extend type Query {
    getPortfolio: PortfolioPayload!
  }
`;

