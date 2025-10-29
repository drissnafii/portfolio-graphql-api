import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Pour s'assurer que process.env est chargé
import type { IUser } from '../models/User.js';

// Récupère la clé secrète depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in my .env file.');
  process.exit(1);
}

/**
 * Génère un token JWT pour un utilisateur donné.
 * @param user - L'objet utilisateur (doit contenir au moins l'id et le rôle)
 * @returns Le token JWT signé.
 */
export const generateToken = (user: Pick<IUser, '_id' | 'role'>): string => {
  // Le "payload" contient les informations que nous voulons encoder dans le token.
  // Ne jamais y mettre d'informations sensibles comme le mot de passe !
  const payload = {
    id: user._id,
    role: user.role,
  };

  // On signe le token avec notre clé secrète. Il expirera dans 1 jour.
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d', // '1d' pour 1 jour, '7d' pour 7 jours, '1h' pour 1 heure
  });

  return token;
};
