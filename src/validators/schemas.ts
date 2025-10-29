import { z } from 'zod';

// Auth
export const loginInputSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(6, { error: 'Password must be at least 6 characters' }),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

// Users
export const createUserInputSchema = z.object({
  username: z.string().min(2, { error: 'Username must have at least 2 characters' }).max(100, { error: 'Username too long' }),
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(6, { error: 'Password must be at least 6 characters' }),
  role: z.enum(['admin', 'visitor']).default('visitor'),
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Profiles (aligns with GraphQL createProfile required fields)
export const createProfileInputSchema = z.object({
  lastName: z.string().min(1, { error: "Last name is required" }),
  firstName: z.string().min(1, { error: "First name is required" }),
  title: z.string().min(1, { error: "Title is required" }),
  biography: z.string().min(1, { error: "Biography is required" }),
  email: z.email({ error: "Invalid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.url({ error: "Invalid URL for photo" }).optional(),
  github: z.url({ error: "Invalid URL for GitHub" }).optional(),
  linkedin: z.url({ error: "Invalid URL for LinkedIn" }).optional(),
  twitter: z.url({ error: "Invalid URL for Twitter" }).optional(),
  website: z.url({ error: "Invalid URL for website" }).optional(),
  cv: z.url({ error: "Invalid URL for CV" }).optional(),
});
export type CreateProfileInput = z.infer<typeof createProfileInputSchema>;

// Experiences
export const createExperienceInputSchema = z.object({
  position: z.string().min(1, { error: 'Position is required' }),
  company: z.string().min(1, { error: 'Company is required' }),
  description: z.string().min(1, { error: 'Description is required' }),
  startDate: z.date({ error: 'Invalid start date' }),
  current: z.boolean(),
  location: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  logo: z.url({ error: 'Invalid logo URL' }).optional(),
});
export type CreateExperienceInput = z.infer<typeof createExperienceInputSchema>;

export const updateExperienceInputSchema = z.object({
  position: z.string().min(1, { error: 'Position is required' }).optional(),
  company: z.string().min(1, { error: 'Company is required' }).optional(),
  description: z.string().min(1, { error: 'Description is required' }).optional(),
  startDate: z.date({ error: 'Invalid start date' }).optional(),
  endDate: z.date({ error: 'Invalid end date' }).optional(),
  current: z.boolean().optional(),
  location: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  logo: z.url({ error: 'Invalid logo URL' }).optional(),
});
export type UpdateExperienceInput = z.infer<typeof updateExperienceInputSchema>;

// Projects
export const createProjectInputSchema = z.object({
  title: z.string().min(1, { error: 'Title is required' }),
  description: z.string().min(1, { error: 'Description is required' }),
  startDate: z.date({ error: 'Invalid start date' }),
  status: z.string().min(1, { error: 'Status is required' }),
  featured: z.boolean(),
  technologies: z.array(z.string()).optional(),
  projectUrl: z.url({ error: 'Invalid project URL' }).optional(),
  githubUrl: z.url({ error: 'Invalid GitHub URL' }).optional(),
  images: z.array(z.url({ error: 'Invalid image URL' })).optional(),
  endDate: z.date({ error: 'Invalid end date' }).optional(),
});
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const updateProjectInputSchema = z.object({
  title: z.string().min(1, { error: 'Title is required' }).optional(),
  description: z.string().min(1, { error: 'Description is required' }).optional(),
  startDate: z.date({ error: 'Invalid start date' }).optional(),
  status: z.string().min(1, { error: 'Status is required' }).optional(),
  featured: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
  projectUrl: z.url({ error: 'Invalid project URL' }).optional(),
  githubUrl: z.url({ error: 'Invalid GitHub URL' }).optional(),
  images: z.array(z.url({ error: 'Invalid image URL' })).optional(),
  endDate: z.date({ error: 'Invalid end date' }).optional(),
});
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Skills
export const createSkillInputSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
  category: z.string().min(1, { error: 'Category is required' }),
  level: z.number({ error: 'Level must be a number' }).int({ error: 'Level must be an integer' }),
  icon: z.url({ error: 'Invalid icon URL' }).optional(),
  description: z.string().optional(),
  order: z.number().int().optional(),
});
export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;

export const updateSkillInputSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }).optional(),
  category: z.string().min(1, { error: 'Category is required' }).optional(),
  level: z.number().int().optional(),
  icon: z.url({ error: 'Invalid icon URL' }).optional(),
  description: z.string().optional(),
  order: z.number().int().optional(),
});
export type UpdateSkillInput = z.infer<typeof updateSkillInputSchema>;