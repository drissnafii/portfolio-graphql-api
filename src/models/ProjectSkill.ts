import { Schema, model, type Model, type Types } from 'mongoose';

// Cette table relie un projet à une compétence, avec un niveau d'utilisation spécifique
export interface IProjectSkill {
  project_id: Types.ObjectId;
  skill_id: Types.ObjectId;
  usage_level?: number; // Niveau d'utilisation de la compétence DANS CE projet (1-5)
}

const projectSkillSchema = new Schema<IProjectSkill>(
  {
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    skill_id: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    usage_level: { type: Number, min: 1, max: 5 },
  },
  // Pas besoin de `updatedAt` ici, juste `createdAt` pour savoir quand le lien a été fait
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Index composé unique pour éviter les doublons : une compétence ne peut être liée qu'une seule fois au même projet
projectSkillSchema.index({ project_id: 1, skill_id: 1 }, { unique: true });

export const ProjectSkillModel: Model<IProjectSkill> = model<IProjectSkill>(
  'ProjectSkill',
  projectSkillSchema
);