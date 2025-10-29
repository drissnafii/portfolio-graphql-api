import jwt from 'jsonwebtoken';
import { UserModel, type IUser } from '../models/User.js';

// Récupère la clé secrète depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Interface pour le payload décodé du JWT.
 */
interface JwtPayload {
  id: string;
  role: 'admin' | 'visitor';
}

/**
 * Tente de récupérer et de valider l'utilisateur à partir d'un token JWT.
 * @param token - Le token JWT, potentiellement préfixé par "Bearer ".
 * @returns L'utilisateur trouvé ou null si le token est invalide ou manquant.
 */
export const getUserFromToken = async (token?: string): Promise<IUser | null> => {
  // Si pas de token, pas d'utilisateur.
  if (!token) {
    return null;
  }

  // Le token est souvent envoyé sous la forme "Bearer <token>". On ne veut que le token.
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

  try {
    // 1. Vérifie et décode le token.
    // jwt.verify lèvera une erreur si le token est invalide (expiré, mauvaise signature).
    const decoded = jwt.verify(tokenValue, JWT_SECRET) as JwtPayload;

    // 2. Si le token est valide, cherche l'utilisateur dans la base de données.
    // C'est une sécurité importante : on s'assure que l'utilisateur existe toujours.
    const user = await UserModel.findById(decoded.id);

    return user;
  } catch (error: unknown) {
    // Si jwt.verify échoue, le token est invalide. On retourne null.
    if (error instanceof Error) {
      console.error('Invalid token:', error.message);
    } else {
      console.error('Invalid token:', error);
    }
    return null;
  }
};
