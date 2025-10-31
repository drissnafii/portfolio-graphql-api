import { ProfileModel } from '../../models/Profile.js';
import { ProjectModel } from '../../models/Project.js';
import { SkillModel } from '../../models/Skill.js';
import { ExperienceModel } from '../../models/Experience.js';
import { sortByFields } from '../utils/sort.js';
import type { OrderByArg } from '../utils/sort.js';

export const portfolioResolvers = {
  Query: {
    getPortfolio: async () => {
      const [profile, projects, skills, experiences] = await Promise.all([
        ProfileModel.findOne().lean(),
        ProjectModel.find().sort({ startDate: -1 }).lean(),
        SkillModel.find().sort({ order: 1 }).lean(),
        ExperienceModel.find().sort({ startDate: -1 }).lean(),
      ]);

      return { profile, projects, skills, experiences };
    },
  },
  PortfolioPayload: {
    projects: (
      payload: { projects?: Record<string, unknown>[] },
      { orderBy }: { orderBy?: OrderByArg }
    ) => sortByFields(payload.projects ?? [], orderBy),
    skills: (
      payload: { skills?: Record<string, unknown>[] },
      { orderBy }: { orderBy?: OrderByArg }
    ) => sortByFields(payload.skills ?? [], orderBy),
  },
};
