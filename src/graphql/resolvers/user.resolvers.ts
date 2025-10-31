import { UserModel } from '../../models/User.js';

export const userResolvers = {
  Query: {
    users: async () => await UserModel.find(),
    user: async (_: unknown, { id }: { id: string }) => await UserModel.findById(id),
  },
  Mutation: {
    createUser: async (_: unknown, args: any) => {
      const newUser = new UserModel(args);
      return await newUser.save();
    },
    updateUser: async (_: unknown, { id, ...args }: any) => {
      return await UserModel.findByIdAndUpdate(id, args, { new: true });
    },
    deleteUser: async (_: unknown, { id }: { id: string }) => {
      return await UserModel.findByIdAndDelete(id);
    },
  },
};

