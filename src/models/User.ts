import { Schema, model, type Model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Définir une interface pour le document (pour le typage)
// C'est ce qui rend notre modèle "conscient" de sa structure
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Optionnel car on ne veut pas toujours le renvoyer
  role: 'admin' | 'visitor';
}

// 2. Créer le Schéma Mongoose
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Enlève les espaces inutiles au début et à la fin
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Assure que les e-mails sont toujours en minuscules
    },
    password: {
      type: String,
      required: true,
      select: false, // Par défaut, ce champ ne sera pas renvoyé lors des requêtes
    },
    role: {
      type: String,
      enum: ['admin', 'visitor'], // Le rôle ne peut être que l'une de ces deux valeurs
      default: 'visitor',
    },
  },
  {
    // Ajoute automatiquement les champs createdAt et updatedAt
    timestamps: true,
  }
);

// 3. Ajouter un "pre-save hook" pour hacher le mot de passe
// Cette fonction s'exécutera automatiquement AVANT qu'un document User soit sauvegardé
userSchema.pre('save', async function (next) {
  // `this` fait référence au document utilisateur sur le point d'être sauvegardé
  
  // On ne hache le mot de passe que s'il a été modifié (ou s'il est nouveau)
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    // Génère un "sel" pour renforcer le hachage
    const salt = await bcrypt.genSalt(10);
    // Remplace le mot de passe en clair par sa version hachée
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // Si une erreur se produit, on la passe à la suite du processus
    if (error instanceof Error) {
      return next(error);
    }
    return next(new Error('Password hashing failed'));
  }
});

// 4. Créer et Exporter le Modèle
// On utilise notre interface pour typer le modèle
export const UserModel: Model<IUser> = model<IUser>('User', userSchema);