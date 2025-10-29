import { describe, it, expect } from 'vitest';
import { isAuth, isAdmin } from '../src/guards/auth.guard.js';

describe('auth.guard', () => {
  it('isAuth throws UNAUTHENTICATED when no user', () => {
    expect(() => isAuth({ user: null } as any)).toThrowError(/connecté/i);
  });

  it('isAdmin throws FORBIDDEN when role is not admin', () => {
    expect(() => isAdmin({ user: { role: 'visitor' } } as any)).toThrowError(/permissions/i);
  });
});


