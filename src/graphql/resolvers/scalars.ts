import { GraphQLScalarType, Kind } from 'graphql';

export const dateScalar = new GraphQLScalarType({
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

      if (typeof stringValue === 'string' && (stringValue === '' || /^\d+$/.test(stringValue))) {
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
});

