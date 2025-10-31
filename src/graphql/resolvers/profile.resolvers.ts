import type { GraphQLContext } from '../context.js';
import { isAdmin } from '../../guards/auth.guard.js';
import { ProfileModel } from '../../models/Profile.js';
import { UserModel } from '../../models/User.js';

export const profileResolvers = {
  Query: {
    profiles: async () => await ProfileModel.find(),
    profile: async (_: unknown, { id }: { id: string }) => await ProfileModel.findById(id),
  },
  Mutation: {
    createProfile: async (_: unknown, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const newProfile = new ProfileModel({ ...args, createdBy_id: context.user?.id });
      return await newProfile.save();
    },
    updateProfile: async (_: unknown, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await ProfileModel.findByIdAndUpdate(
        id,
        { ...args, updatedBy_id: context.user?.id },
        { new: true }
      );
    },
    deleteProfile: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await ProfileModel.findByIdAndDelete(id);
    },
  },
  Profile: {
    createdBy: async (profile: any) => await UserModel.findById(profile.createdBy_id),
    updatedBy: async (profile: any) => await UserModel.findById(profile.updatedBy_id),
  },
};
