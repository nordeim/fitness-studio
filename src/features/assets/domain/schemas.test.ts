import { describe, it, expect } from 'vitest';
import {
  AssetGenerationRequestSchema,
  generatePlaceholderSvg,
  buildDefaultPrompt,
  type AssetType,
} from './schemas';

/**
 * Asset generation domain schemas — Zod validation + helpers.
 */

describe('AssetGenerationRequestSchema', () => {
  const validRequest = {
    type: 'coach_portrait' as const,
    entitySlug: 'marcus-steel',
  };

  it('valid request passes', () => {
    const result = AssetGenerationRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('all 4 asset types are valid', () => {
    const types: AssetType[] = ['coach_portrait', 'program_hero', 'story_before', 'story_after'];
    for (const type of types) {
      const result = AssetGenerationRequestSchema.safeParse({ ...validRequest, type });
      expect(result.success).toBe(true);
    }
  });

  it('invalid type fails', () => {
    const result = AssetGenerationRequestSchema.safeParse({
      ...validRequest,
      type: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('missing entitySlug fails', () => {
    const result = AssetGenerationRequestSchema.safeParse({ type: 'coach_portrait' });
    expect(result.success).toBe(false);
  });

  it('empty entitySlug fails', () => {
    const result = AssetGenerationRequestSchema.safeParse({
      type: 'coach_portrait',
      entitySlug: '',
    });
    expect(result.success).toBe(false);
  });

  it('entitySlug too long fails', () => {
    const result = AssetGenerationRequestSchema.safeParse({
      type: 'coach_portrait',
      entitySlug: 'a'.repeat(81),
    });
    expect(result.success).toBe(false);
  });

  it('promptOverride optional', () => {
    const result = AssetGenerationRequestSchema.safeParse({
      ...validRequest,
      promptOverride: '',
    });
    expect(result.success).toBe(true);
  });

  it('promptOverride too long fails', () => {
    const result = AssetGenerationRequestSchema.safeParse({
      ...validRequest,
      promptOverride: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe('buildDefaultPrompt', () => {
  it('coach_portrait prompt includes coach + slug', () => {
    const prompt = buildDefaultPrompt('coach_portrait', 'marcus-steel');
    expect(prompt).toContain('portrait');
    expect(prompt).toContain('marcus steel');
    expect(prompt).toContain('coach');
  });

  it('program_hero prompt includes training scene + slug', () => {
    const prompt = buildDefaultPrompt('program_hero', 'conjugate-max-effort');
    expect(prompt).toContain('training scene');
    expect(prompt).toContain('conjugate max effort');
  });

  it('story_before prompt includes before photo', () => {
    const prompt = buildDefaultPrompt('story_before', 'david-k');
    expect(prompt).toContain('before');
    expect(prompt).toContain('david k');
  });

  it('story_after prompt includes after photo', () => {
    const prompt = buildDefaultPrompt('story_after', 'david-k');
    expect(prompt).toContain('after');
    expect(prompt).toContain('transformed');
  });
});

describe('generatePlaceholderSvg', () => {
  it('returns valid SVG string', () => {
    const svg = generatePlaceholderSvg('coach_portrait', 'marcus-steel');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('includes entity slug (uppercased, hyphens to spaces)', () => {
    const svg = generatePlaceholderSvg('coach_portrait', 'marcus-steel');
    expect(svg).toContain('MARCUS STEEL');
  });

  it('includes asset type label', () => {
    const svg = generatePlaceholderSvg('program_hero', 'test');
    expect(svg).toContain('PROGRAM HERO');
  });

  it('uses brand colors (black bg + accent orange + silver text)', () => {
    const svg = generatePlaceholderSvg('coach_portrait', 'test');
    expect(svg).toContain('#0a0a0a'); // bg
    expect(svg).toContain('#FF5400'); // accent
    expect(svg).toContain('#C8C8C8'); // silver
  });

  it('coach_portrait is taller (3:4 aspect)', () => {
    const svg = generatePlaceholderSvg('coach_portrait', 'test');
    // Portrait: 800 × 1067
    expect(svg).toContain('width="800"');
    expect(svg).toContain('height="1067"');
  });

  it('program_hero is wider (4:3 aspect)', () => {
    const svg = generatePlaceholderSvg('program_hero', 'test');
    // Landscape: 800 × 600
    expect(svg).toContain('width="800"');
    expect(svg).toContain('height="600"');
  });

  it('includes IRONFORGE branding', () => {
    const svg = generatePlaceholderSvg('coach_portrait', 'test');
    expect(svg).toContain('IRONFORGE');
    expect(svg).toContain('PLACEHOLDER');
  });
});
