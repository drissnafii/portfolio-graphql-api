import bcrypt from 'bcrypt';
import { UserModel } from '../../models/User.js';
import { generateToken } from '../../utils/jwt.js';

export const authResolvers = {
  Mutation: {
    login: async (_: unknown, { email, password }: any) => {
      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials: User not found.');
      }

      if (!user.password) {
        throw new Error('Server error: User password not found.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials: Password incorrect.');
      }

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
  },
};
