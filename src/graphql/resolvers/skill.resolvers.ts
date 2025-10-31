import { GraphQLError } from 'graphql';
import type { GraphQLContext } from '../context.js';
import { isAdmin } from '../../guards/auth.guard.js';
import { SkillModel } from '../../models/Skill.js';
import { UserModel } from '../../models/User.js';

export const skillResolvers = {
  Query: {
    skills: async () => await SkillModel.find(),
    skill: async (_: unknown, { id }: { id: string }) => await SkillModel.findById(id),
  },
  Mutation: {
    createSkill: async (_: unknown, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const existingSkill = await SkillModel.findOne({ name: args.name }).lean();
      if (existingSkill) {
        throw new GraphQLError('This skill already exists. Use updateSkill to modify it.', {
          extensions: {
            code: 'SKILL_ALREADY_EXISTS',
            skillId: existingSkill._id.toString(),
          },
        });
      }
      const newSkill = new SkillModel({ ...args, createdBy_id: context.user?.id });
      return await newSkill.save();
    },
    updateSkill: async (_: unknown, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await SkillModel.findByIdAndUpdate(
        id,
        { ...args, updatedBy_id: context.user?.id },
        { new: true }
      );
    },
    deleteSkill: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await SkillModel.findByIdAndDelete(id);
    },
  },
  Skill: {
    createdBy: async (skill: any) => await UserModel.findById(skill.createdBy_id),
    updatedBy: async (skill: any) => await UserModel.findById(skill.updatedBy_id),
  },
};
