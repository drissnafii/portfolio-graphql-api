import type { ExpressContextFunctionArgument } from '@as-integrations/express5';
import { getUserFromToken } from '../middlewares/auth.js';
import type { IUser } from '../models/User.js';

export type GraphQLContext = {
  token?: string;
  user?: IUser | null;
};

export const createContext = async ({ req, }: ExpressContextFunctionArgument): Promise<GraphQLContext> => {
  const token = req.headers.authorization;
  const user = await getUserFromToken(token);
  return { token, user };
};  