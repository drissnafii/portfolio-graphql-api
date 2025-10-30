import { describe, it, expect } from 'vitest';
import { resolvers } from '../src/graphql/resolvers.js';
import { Kind } from 'graphql';

describe('Date scalar', () => {
  it('serialize throws on non-Date', () => {
    expect(() => (resolvers as any).Date.serialize('not a date')).toThrow();
  });
  it('parseValue accepts timestamp number', () => {
    const result = (resolvers as any).Date.parseValue(1_700_000_000_000);
    expect(result instanceof Date).toBe(true);
  });
  it('parseValue accepts ISO string', () => {
    const result = (resolvers as any).Date.parseValue('2023-10-30T12:34:56.000Z');
    expect(result instanceof Date).toBe(true);
  });
  it('parseValue throws on invalid value', () => {
    expect(() => (resolvers as any).Date.parseValue('invalid date string')).toThrow();
  });
  it('parseLiteral returns null on invalid literal', () => {
    const res = (resolvers as any).Date.parseLiteral({ kind: Kind.STRING, value: 'not-a-date' } as any);
    expect(res).toBeNull();
  });
  it('parseLiteral parses INT literal', () => {
    const res = (resolvers as any).Date.parseLiteral({ kind: Kind.INT, value: '1700000000000' } as any);
    expect(res instanceof Date).toBe(true);
  });
  it('parseLiteral parses STRING literal', () => {
    const res = (resolvers as any).Date.parseLiteral({
      kind: Kind.STRING,
      value: '2023-10-30T12:34:56.000Z',
    } as any);
    expect(res instanceof Date).toBe(true);
  });
});

