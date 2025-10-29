import { describe, it, expect } from 'vitest';
import { resolvers } from '../src/graphql/resolvers.js';
import { Kind } from 'graphql';

describe('Date scalar', () => {
  it('serialize throws on non-Date', () => {
    expect(() => (resolvers as any).Date.serialize('not a date')).toThrow();
  });
  it('parseValue throws on non-number', () => {
    expect(() => (resolvers as any).Date.parseValue('123')).toThrow();
  });
  it('parseLiteral returns null on non-int literal', () => {
    const res = (resolvers as any).Date.parseLiteral({ kind: Kind.STRING, value: 'x' } as any);
    expect(res).toBeNull();
  });
  it('parseLiteral parses INT literal', () => {
    const res = (resolvers as any).Date.parseLiteral({ kind: Kind.INT, value: '1700000000000' } as any);
    expect(res instanceof Date).toBe(true);
  });
});


