import { GraphQLError } from 'graphql';
import type { GraphQLContext } from '../graphql/context.js';

/**
 * Garde qui vérifie si un utilisateur est authentifié.
 * Si l'utilisateur n'est pas dans le contexte, il lève une erreur.
 * @param context - Le contexte GraphQL.
 */
export const isAuth = (context: GraphQLContext): void => {
  if (!context.user) {
    // On utilise une erreur GraphQL standardisée. C'est une meilleure pratique.
    throw new GraphQLError('Vous devez être connecté pour effectuer cette action.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};

/**
 * Garde qui vérifie si un utilisateur est un administrateur.
 * Lève une erreur s'il n'est pas authentifié ou si son rôle n'est pas 'admin'.
 * @param context - Le contexte GraphQL.
 */
export const isAdmin = (context: GraphQLContext): void => {
  // 1. On vérifie d'abord si l'utilisateur est connecté.
  isAuth(context);

  // 2. Si oui, on vérifie son rôle.
  // On peut utiliser "!" (non-null assertion) sur context.user car isAuth garantit qu'il existe.
  if (context.user!.role !== 'admin') {
    throw new GraphQLError('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.', {
      extensions: { code: 'FORBIDDEN' }, // 'FORBIDDEN' est le code standard pour les problèmes de permission.
    });
  }
};