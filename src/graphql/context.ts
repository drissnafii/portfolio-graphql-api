import type { ExpressContextFunctionArgument } from '@as-integrations/express5';

import { IUser } from '../models/User.js';

export type GraphQLContext = {
  token?: string;
  user?: IUser;
};

export const createContext = async ({req,}: ExpressContextFunctionArgument): Promise<GraphQLContext> => {
  const token = req.headers.authorization;
  
  return { token };
};