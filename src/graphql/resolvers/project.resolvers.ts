import { GraphQLError } from 'graphql';
import type { GraphQLContext } from '../context.js';
import { isAdmin } from '../../guards/auth.guard.js';
import { ProjectModel } from '../../models/Project.js';
import { ProjectSkillModel } from '../../models/ProjectSkill.js';
import { SkillModel } from '../../models/Skill.js';
import { UserModel } from '../../models/User.js';
import { isDuplicateKeyError } from '../utils/errors.js';

export const projectResolvers = {
  Query: {
    projects: async (
      _: unknown,
      {
        status,
        featured,
        limit = 100,
        offset = 0,
      }: {
        status?: string;
        featured?: boolean;
        limit?: number;
        offset?: number;
      }
    ) => {
      // Build filter object
      const filter: any = {};
      if (status) {
        filter.status = status;
      }
      if (featured !== undefined) {
        filter.featured = featured;
      }

      // Execute query with sorting, pagination
      return await ProjectModel.find(filter)
        .sort({ featured: -1, order: 1, startDate: -1 })
        .limit(limit)
        .skip(offset);
    },
    project: async (_: unknown, { id }: { id: string }) => await ProjectModel.findById(id),
  },
  Mutation: {
    createProject: async (_: unknown, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const newProject = new ProjectModel({ ...args, createdBy_id: context.user?.id });
      return await newProject.save();
    },
    updateProject: async (_: unknown, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await ProjectModel.findByIdAndUpdate(
        id,
        { ...args, updatedBy_id: context.user?.id },
        { new: true }
      );
    },
    deleteProject: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await ProjectModel.findByIdAndDelete(id);
    },
    addSkillToProject: async (
      _: unknown,
      { projectId, skillId, usage_level }: { projectId: string; skillId: string; usage_level?: number },
      context: GraphQLContext
    ) => {
      isAdmin(context);

      const projectExists = await ProjectModel.exists({ _id: projectId });
      if (!projectExists) {
        throw new GraphQLError('Project not found.', {
          extensions: { code: 'PROJECT_NOT_FOUND' },
        });
      }

      const skillExists = await SkillModel.exists({ _id: skillId });
      if (!skillExists) {
        throw new GraphQLError('Skill not found.', {
          extensions: { code: 'SKILL_NOT_FOUND' },
        });
      }

      try {
        const payload = {
          project_id: projectId,
          skill_id: skillId,
          ...(usage_level !== undefined ? { usage_level } : {}),
        };

        return await ProjectSkillModel.create(payload);
      } catch (error: unknown) {
        if (isDuplicateKeyError(error)) {
          throw new GraphQLError('Skill already linked to this project.', {
            extensions: { code: 'PROJECT_SKILL_DUPLICATE' },
          });
        }

        throw error;
      }
    },
  },
  Project: {
    createdBy: async (project: any) => await UserModel.findById(project.createdBy_id),
    updatedBy: async (project: any) => await UserModel.findById(project.updatedBy_id),
    skills: async (project: any) => await ProjectSkillModel.find({ project_id: project._id }),
  },
};
