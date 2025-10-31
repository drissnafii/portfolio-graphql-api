import { ProjectModel } from '../../models/Project.js';
import { SkillModel } from '../../models/Skill.js';

export const projectSkillResolvers = {
  ProjectSkill: {
    project: async (projectSkill: any) => await ProjectModel.findById(projectSkill.project_id),
    skill: async (projectSkill: any) => await SkillModel.findById(projectSkill.skill_id),
  },
};

