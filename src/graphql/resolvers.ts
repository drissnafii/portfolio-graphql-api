
import { GraphQLContext } from './context.js';
import { UserModel } from '../models/User.js';
import { ProfileModel } from '../models/Profile.js';
import { ExperienceModel } from '../models/Experience.js';
import { ProjectModel } from '../models/Project.js';
import { SkillModel } from '../models/Skill.js';
import { ProjectSkillModel } from '../models/ProjectSkill.js';
import { GraphQLScalarType, GraphQLError, Kind } from 'graphql';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js'; // Importe notre nouvelle fonction
import { isAdmin } from '../guards/auth.guard.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;
const isDuplicateKeyError = (error: unknown): error is { code: number } =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: number }).code === DUPLICATE_KEY_ERROR_CODE;

type OrderDirection = 'asc' | 'desc';
type OrderByArg = Record<string, OrderDirection | null | undefined>;

const isOrderDirection = (value: unknown): value is OrderDirection =>
  value === 'asc' || value === 'desc';

const toComparableValue = (value: unknown): number | string => {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  return String(value ?? '');
};

const sortByFields = <T extends Record<string, unknown>>(
  items: T[] = [],
  orderBy?: OrderByArg
): T[] => {
  if (!orderBy) {
    return items;
  }

  const entries = Object.entries(orderBy).filter(([, dir]) => isOrderDirection(dir));
  if (entries.length === 0) {
    return items;
  }

  return [...items].sort((a, b) => {
    for (const [field, direction] of entries) {
      const dirMultiplier = direction === 'desc' ? -1 : 1;
      const aValue = a[field];
      const bValue = b[field];

      if (aValue === bValue) {
        continue;
      }

      if (aValue == null) {
        return -dirMultiplier;
      }

      if (bValue == null) {
        return dirMultiplier;
      }

      const comparableA = toComparableValue(aValue);
      const comparableB = toComparableValue(bValue);

      if (comparableA < comparableB) {
        return -dirMultiplier;
      }
      if (comparableA > comparableB) {
        return dirMultiplier;
      }
    }

    return 0;
  });
};

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description:
      'Date custom scalar type. Accepts a Unix timestamp in milliseconds or an ISO 8601 date string.',
    serialize(value) {
      if (value instanceof Date) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
      }
      throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
      if (typeof value === 'number' || typeof value === 'string') {
        const stringValue = typeof value === 'string' ? value.trim() : value;

        if (
          typeof stringValue === 'string' &&
          (stringValue === '' || /^\d+$/.test(stringValue))
        ) {
          throw new Error(
            'GraphQL Date Scalar parser expected a valid ISO 8601 date string, not a numeric string.'
          );
        }

        const parsedDate = new Date(stringValue);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
      throw new Error(
        'GraphQL Date Scalar parser expected a valid Unix timestamp (ms) or ISO 8601 date string.'
      );
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
        if (ast.kind === Kind.STRING) {
          const trimmed = ast.value.trim();
          if (trimmed === '' || /^\d+$/.test(trimmed)) {
            return null;
          }
        }

        const literalValue = ast.kind === Kind.INT ? parseInt(ast.value, 10) : ast.value;
        const parsedDate = new Date(literalValue);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
      // Invalid hard-coded value
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

    // Resolver for getPortfolio
    getPortfolio: async () => {
      // en lance toutes les requêtes à la base de données en même temps
      // Promise.all attend que toutes les promesses soient résolues
      const [profile, projects, skills, experiences] = await Promise.all([
        // On suppose qu'il n'y a qu'un seul profil (logique singleton)
        ProfileModel.findOne().lean(),
        // L'utilisation de .lean() est une optimisation Mongoose qui retourne des objets JavaScript simples,
        // ce qui est plus rapide car nous n'avons pas besoin des méthodes Mongoose ici.
        ProjectModel.find().sort({ startDate: -1 }).lean(),
        SkillModel.find().sort({ order: 1 }).lean(),
        ExperienceModel.find().sort({ startDate: -1 }).lean(),
      ]); 

      return { profile, projects, skills, experiences };
    }
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

    addSkillToProject: async (
      _: any,
      { projectId, skillId, usage_level }: { projectId: string; skillId: string; usage_level?: number },
      context: GraphQLContext
    ) => {
      isAdmin(context);

      const projectExists = await ProjectModel.exists({ _id: projectId });
      if (!projectExists) {
        throw new GraphQLError('Project not found.', {
          extensions: { code: 'PROJECT_NOT_FOUND' },
        });
      }

      const skillExists = await SkillModel.exists({ _id: skillId });
      if (!skillExists) {
        throw new GraphQLError('Skill not found.', {
          extensions: { code: 'SKILL_NOT_FOUND' },
        });
      }

      try {
        const payload = {
          project_id: projectId,
          skill_id: skillId,
          ...(usage_level !== undefined ? { usage_level } : {}),
        };

        return await ProjectSkillModel.create(payload);
      } catch (error: unknown) {
        if (isDuplicateKeyError(error)) {
          throw new GraphQLError('Skill already linked to this project.', {
            extensions: { code: 'PROJECT_SKILL_DUPLICATE' },
          });
        }

        throw error;
      }
    },

    // Skill
    createSkill: async (_: any, args: any, context: GraphQLContext) => {
      isAdmin(context);
      const existingSkill = await SkillModel.findOne({ name: args.name }).lean();
      if (existingSkill) {
        throw new GraphQLError('This skill already exists. Use updateSkill to modify it.', {
          extensions: {
            code: 'SKILL_ALREADY_EXISTS',
            skillId: existingSkill._id.toString(),
          },
        });
      }
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
  PortfolioPayload: {
    projects: (
      payload: { projects?: Record<string, unknown>[] },
      { orderBy }: { orderBy?: OrderByArg }
    ) => sortByFields(payload.projects ?? [], orderBy),
    skills: (
      payload: { skills?: Record<string, unknown>[] },
      { orderBy }: { orderBy?: OrderByArg }
    ) => sortByFields(payload.skills ?? [], orderBy),
  },
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
