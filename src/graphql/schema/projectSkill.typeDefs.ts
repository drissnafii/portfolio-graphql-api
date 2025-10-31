export const projectSkillTypeDefs = /* GraphQL */ `
  type ProjectSkill {
    id: ID!
    project: Project!
    skill: Skill!
    usage_level: Int
  }

  extend type Mutation {
    addSkillToProject(
      projectId: ID!
      skillId: ID!
      usage_level: Int
    ): ProjectSkill!
  }
`;

