import { describe, it, expect } from 'vitest';
import { CoachFormSchema, getMockCoachForm } from './schemas';

/**
 * CoachFormSchema — Zod validation for admin CRUD.
 */

describe('CoachFormSchema', () => {
  it('valid input passes', () => {
    const result = CoachFormSchema.safeParse(getMockCoachForm());
    expect(result.success).toBe(true);
  });

  it('slug too short fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      slug: 'a',
    });
    expect(result.success).toBe(false);
  });

  it('slug with uppercase fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      slug: 'Marcus-Steel',
    });
    expect(result.success).toBe(false);
  });

  it('slug with spaces fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      slug: 'marcus steel',
    });
    expect(result.success).toBe(false);
  });

  it('slug with special chars fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      slug: 'marcus_steel!',
    });
    expect(result.success).toBe(false);
  });

  it('name too short fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      name: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('bio too short fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      bio: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('title empty fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('certifications array default is empty', () => {
    const parsed = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      certifications: undefined,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.certifications).toEqual([]);
    }
  });

  it('published default is false', () => {
    const parsed = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      published: undefined,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.published).toBe(false);
    }
  });

  it('yearsExp 0 passes', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      yearsExp: 0,
    });
    expect(result.success).toBe(true);
  });

  it('yearsExp negative fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      yearsExp: -1,
    });
    expect(result.success).toBe(false);
  });

  it('yearsExp over 80 fails', () => {
    const result = CoachFormSchema.safeParse({
      ...getMockCoachForm(),
      yearsExp: 81,
    });
    expect(result.success).toBe(false);
  });
});
