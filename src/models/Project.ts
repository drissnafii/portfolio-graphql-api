import { Schema, model, type Model, type Types } from 'mongoose';

export interface IProject {
  createdBy_id: Types.ObjectId;
  updatedBy_id?: Types.ObjectId;
  title: string;
  description: string;
  technologies?: string[]; // Tableau de chaînes de caractères
  projectUrl?: string;
  githubUrl?: string;
  images?: string[]; // Tableau d'URLs
  startDate: Date;
  endDate?: Date; // Peut être null si le projet est en cours
  status: 'in_progress' | 'completed' | 'archived';
  order?: number;
  featured: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    createdBy_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    technologies: [{ type: String, trim: true }], // Mongoose gère ça comme un tableau
    projectUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    images: [{ type: String, trim: true }],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'archived'],
      default: 'in_progress',
      required: true,
    },
    order: { type: Number },
    featured: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
   }
);

// Ceci indique à Mongoose d'inclure les champs virtuels (comme notre 'id')
// lorsqu'un document est converti en JSON pour être envoyé via l'API.
projectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
// Index pour optimiser les requêtes fréquentes
projectSchema.index({ status: 1, featured: -1, order: 1 });
projectSchema.index({ startDate: -1 });

export const ProjectModel: Model<IProject> = model<IProject>(
  'Project',
  projectSchema
);