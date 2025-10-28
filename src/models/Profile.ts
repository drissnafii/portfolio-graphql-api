import { Schema, model, type Model, type Types } from 'mongoose';

// Interface pour le typage TypeScript
export interface IProfile {
  // Référence à l'utilisateur qui a créé/mis à jour ce profil (l'admin)
  createdBy_id: Types.ObjectId;
  updatedBy_id?: Types.ObjectId;
  lastName: string;
  firstName: string;
  title: string;
  biography: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  cv?: string;
}

// Définition du schéma Mongoose
const profileSchema = new Schema<IProfile>(
  {
    createdBy_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy_id: { type: Schema.Types.ObjectId, ref: 'User' },
    lastName: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    biography: { type: String, required: true }, // Markdown supporté
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    photo: { type: String, trim: true }, // URL
    github: { type: String, trim: true }, // URL
    linkedin: { type: String, trim: true }, // URL
    twitter: { type: String, trim: true }, // URL
    website: { type: String, trim: true }, // URL
    cv: { type: String, trim: true }, // URL
  },
  { timestamps: true }
);

// Export du modèle typé
export const ProfileModel: Model<IProfile> = model<IProfile>(
  'Profile',
  profileSchema
);