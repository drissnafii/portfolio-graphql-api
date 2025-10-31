type OrderDirection = 'asc' | 'desc';

export type OrderByArg = Record<string, OrderDirection | null | undefined>;

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

export const sortByFields = <T extends Record<string, unknown>>(
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

