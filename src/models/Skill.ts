import { Schema, model, type Model, type Types } from 'mongoose';

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'other';

export interface ISkill {
  createdBy_id: Types.ObjectId;
  updatedBy_id?: Types.ObjectId;
  name: string;
  category: SkillCategory;
  level: number; // De 1 à 5
  icon?: string;
  description?: string;
  order?: number;
}

const skillSchema = new Schema<ISkill>(
  {
    createdBy_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy_id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true, unique: true },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'other'],
      required: true,
    },
    level: { type: Number, required: true, min: 1, max: 5 },
    icon: { type: String, trim: true },
    description: { type: String, trim: true },
    order: { type: Number },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, level: -1, order: 1 });

export const SkillModel: Model<ISkill> = model<ISkill>('Skill', skillSchema);