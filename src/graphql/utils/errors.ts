const DUPLICATE_KEY_ERROR_CODE = 11000;

type DuplicateKeyError = {
  code?: number;
};

export const isDuplicateKeyError = (error: unknown): error is DuplicateKeyError =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as DuplicateKeyError).code === DUPLICATE_KEY_ERROR_CODE;

