import type { GraphQLContext } from '../context.js';
import { isAdmin } from '../../guards/auth.guard.js';
import { ExperienceModel } from '../../models/Experience.js';
import { UserModel } from '../../models/User.js';

export const experienceResolvers = {
  Query: {
    experiences: async () => await ExperienceModel.find(),
    experience: async (_: unknown, { id }: { id: string }) => await ExperienceModel.findById(id),
  },
  Mutation: {
    createExperience: async (_: unknown, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const newExperience = new ExperienceModel({ ...args, createdBy_id: context.user?.id });
      return await newExperience.save();
    },
    updateExperience: async (_: unknown, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await ExperienceModel.findByIdAndUpdate(
        id,
        { ...args, updatedBy_id: context.user?.id },
        { new: true }
      );
    },
    deleteExperience: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await ExperienceModel.findByIdAndDelete(id);
    },
  },
  Experience: {
    createdBy: async (experience: any) => await UserModel.findById(experience.createdBy_id),
    updatedBy: async (experience: any) => await UserModel.findById(experience.updatedBy_id),
  },
};
