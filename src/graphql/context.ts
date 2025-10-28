import type { ExpressContextFunctionArgument } from '@as-integrations/express5';

export type GraphQLContext = {
  token?: string;
  // user?: UserDocument; 
};

export const createContext = async ({
  req,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> => {
  const token = req.headers.authorization;
  
  return { token };
};