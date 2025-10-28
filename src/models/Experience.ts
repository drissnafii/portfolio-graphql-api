import { Schema, model, type Model, type Types } from 'mongoose';

export interface IExperience {
  createdBy_id: Types.ObjectId;
  updatedBy_id?: Types.ObjectId;
  position: string;
  company: string;
  location?: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  technologies?: string[];
  achievements?: string[];
  logo?: string;
}

const experienceSchema = new Schema<IExperience>(
  {
    createdBy_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy_id: { type: Schema.Types.ObjectId, ref: 'User' },
    position: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, required: true, default: false },
    technologies: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    logo: { type: String, trim: true },
  },
  { timestamps: true }
);

experienceSchema.index({ current: 1, startDate: -1 });

export const ExperienceModel: Model<IExperience> = model<IExperience>(
  'Experience',
  experienceSchema
);