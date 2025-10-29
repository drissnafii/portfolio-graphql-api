
import { GraphQLContext } from './context.js';
import { UserModel } from '../models/User.js';
import { ProfileModel } from '../models/Profile.js';
import { ExperienceModel } from '../models/Experience.js';
import { ProjectModel } from '../models/Project.js';
import { SkillModel } from '../models/Skill.js';
import { ProjectSkillModel } from '../models/ProjectSkill.js';
import { GraphQLScalarType, Kind } from 'graphql';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js'; // Importe notre nouvelle fonction
import { isAdmin } from '../guards/auth.guard.js';

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      if (value instanceof Date) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
      }
      throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
      if (typeof value === 'number') {
        return new Date(value); // Convert incoming integer to Date
      }
      throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        // Convert hard-coded AST string to integer and then to Date
        return new Date(parseInt(ast.value, 10));
      }
      // Invalid hard-coded value (not an integer)
      return null;
    },
  }),

  Query: {
    // User
    users: async () => await UserModel.find(),
    user: async (_: any, { id }: { id: string }) => await UserModel.findById(id),

    // Profile
    profiles: async () => await ProfileModel.find(),
    profile: async (_: any, { id }: { id: string }) => await ProfileModel.findById(id),

    // Experience
    experiences: async () => await ExperienceModel.find(),
    experience: async (_: any, { id }: { id: string }) => await ExperienceModel.findById(id),

    // Project
    projects: async () => await ProjectModel.find(),
    project: async (_: any, { id }: { id: string }) => await ProjectModel.findById(id),

    // Skill
    skills: async () => await SkillModel.find(),
    skill: async (_: any, { id }: { id: string }) => await SkillModel.findById(id),
  },

  Mutation: {
    // Resolver pour la mutation de connexion
    login: async (_: any, { email, password }: any) => {
      // 1. Trouver l'utilisateur par son email
      // On utilise .select('+password') pour forcer Mongoose à inclure le champ
      // du mot de passe, qui est caché par défaut dans notre modèle.
      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials: User not found.');
      }

      // 2. Vérifier le mot de passe
      // 2. Vérifier le mot de passe
      // On compare le mot de passe fourni avec le hash stocké dans la base de données
      if (!user.password) {
        throw new Error('Server error: User password not found.');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials: Password incorrect.');
      }

      // 3. Si tout est correct, générer un token JWT
      const token = generateToken(user);

      // 4. Retourner le payload d'authentification
      return {
        token,
        user,
      };
    },

    // User
    createUser: async (_: any, args: any) => {
      const newUser = new UserModel(args);
      return await newUser.save();
    },
    updateUser: async (_: any, { id, ...args }: any) => {
      return await UserModel.findByIdAndUpdate(id, args, { new: true });
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      return await UserModel.findByIdAndDelete(id);
    },

    // Profile
    createProfile: async (_: any, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const newProfile = new ProfileModel({ ...args, createdBy_id: context.user?.id });
      return await newProfile.save();
    },
    updateProfile: async (_: any, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await ProfileModel.findByIdAndUpdate(id, { ...args, updatedBy_id: context.user?.id }, { new: true });
    },
    deleteProfile: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await ProfileModel.findByIdAndDelete(id);
    },

    // Experience
    createExperience: async (_: any, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const newExperience = new ExperienceModel({ ...args, createdBy_id: context.user?.id });
      return await newExperience.save();
    },
    updateExperience: async (_: any, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await ExperienceModel.findByIdAndUpdate(id, { ...args, updatedBy_id: context.user?.id }, { new: true });
    },
    deleteExperience: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await ExperienceModel.findByIdAndDelete(id);
    },

    // Project
    createProject: async (_: any, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const newProject = new ProjectModel({ ...args, createdBy_id: context.user?.id });
      return await newProject.save();
    },
    updateProject: async (_: any, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await ProjectModel.findByIdAndUpdate(id, { ...args, updatedBy_id: context.user?.id }, { new: true });
    },
    deleteProject: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await ProjectModel.findByIdAndDelete(id);
    },

    // Skill
    createSkill: async (_: any, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const newSkill = new SkillModel({ ...args, createdBy_id: context.user?.id });
      return await newSkill.save();
    },
    updateSkill: async (_: any, { id, ...args }: any, context: GraphQLContext) => {
      isAdmin(context);
      return await SkillModel.findByIdAndUpdate(id, { ...args, updatedBy_id: context.user?.id }, { new: true });
    },
    deleteSkill: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      isAdmin(context);
      return await SkillModel.findByIdAndDelete(id);
    },
  },

  // Relational Resolvers
  Profile: {
    createdBy: async (profile: any) => await UserModel.findById(profile.createdBy_id),
    updatedBy: async (profile: any) => await UserModel.findById(profile.updatedBy_id),
  },
  Experience: {
    createdBy: async (experience: any) => await UserModel.findById(experience.createdBy_id),
    updatedBy: async (experience: any) => await UserModel.findById(experience.updatedBy_id),
  },
  Project: {
    createdBy: async (project: any) => await UserModel.findById(project.createdBy_id),
    updatedBy: async (project: any) => await UserModel.findById(project.updatedBy_id),
    skills: async (project: any) => await ProjectSkillModel.find({ project_id: project._id }),
  },
  Skill: {
    createdBy: async (skill: any) => await UserModel.findById(skill.createdBy_id),
    updatedBy: async (skill: any) => await UserModel.findById(skill.updatedBy_id),
  },
  ProjectSkill: {
    project: async (projectSkill: any) => await ProjectModel.findById(projectSkill.project_id),
    skill: async (projectSkill: any) => await SkillModel.findById(projectSkill.skill_id),
  },
};
