import { calculateMeldNa } from '../src/meldNa';

describe('calculateMeldNa', () => {
  test('MN001 — reference case: bili 3.5, cr 1.8, inr 1.5, na 131', () => {
    const result = calculateMeldNa({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
    });
    expect(result.score).toBe(25);
    expect(result.formula).toBe('MELD-Na');
  });

  test('MN002 — sodium above cap (137): clamped, sodium diff = 0', () => {
    const result = calculateMeldNa({
      bilirubin: 1.2,
      creatinine: 0.9,
      inr: 1.1,
      onDialysis: false,
      sodium: 140,
    });
    expect(result.score).toBe(8);
    expect(result.components[3].clampedValue).toBe(137);
    expect(result.components[3].clampNote).toContain('137');
  });

  test('MN003 — sodium below floor (125): clamped to 125', () => {
    const result = calculateMeldNa({
      bilirubin: 5.0,
      creatinine: 2.5,
      inr: 2.0,
      onDialysis: false,
      sodium: 120,
    });
    expect(result.components[3].clampedValue).toBe(125);
    expect(result.components[3].clampNote).toContain('120');
  });

  test('MN004 — sodium exactly at 137 boundary: no adjustment', () => {
    const result = calculateMeldNa({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 137,
    });
    expect(result.components[3].clampedValue).toBe(137);
    expect(result.components[3].clampNote).toBeUndefined();
  });

  test('MN005 — sodium exactly at 125 boundary: no further clamping', () => {
    const result = calculateMeldNa({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 125,
    });
    expect(result.components[3].clampedValue).toBe(125);
  });

  test('MN006 — MELD-Na higher than MELD when sodium is low', () => {
    const { calculateMeld } = require('../src/meld');
    const meld = calculateMeld({ bilirubin: 3.5, creatinine: 1.8, inr: 1.5, onDialysis: false });
    const meldNa = calculateMeldNa({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 125,
    });
    expect(meldNa.score).toBeGreaterThan(meld.score);
  });

  test('MN007 — score bounded at 40 maximum', () => {
    const result = calculateMeldNa({
      bilirubin: 50,
      creatinine: 4.0,
      inr: 10,
      onDialysis: false,
      sodium: 120,
    });
    expect(result.score).toBeLessThanOrEqual(40);
  });

  test('MN008 — score bounded at 6 minimum', () => {
    const result = calculateMeldNa({
      bilirubin: 1.0,
      creatinine: 1.0,
      inr: 1.0,
      onDialysis: false,
      sodium: 137,
    });
    expect(result.score).toBeGreaterThanOrEqual(6);
  });

  test('MN009 — returns 4 components (bili, cr, inr, sodium)', () => {
    const result = calculateMeldNa({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
    });
    expect(result.components).toHaveLength(4);
  });

  test('MN010 — returns MELD-Na references', () => {
    const result = calculateMeldNa({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
    });
    expect(result.references[0].doi).toBe('10.1056/NEJMoa0801209');
  });

  test('MN011 — dialysis sets creatinine to 4.0', () => {
    const result = calculateMeldNa({
      bilirubin: 2.0,
      creatinine: 1.0,
      inr: 1.5,
      onDialysis: true,
      sodium: 131,
    });
    expect(result.components[1].clampedValue).toBe(4.0);
  });

  test('MN012 — sodium at/above 137 produces same score as MELD', () => {
    const { calculateMeld } = require('../src/meld');
    const meld = calculateMeld({ bilirubin: 1.2, creatinine: 1.0, inr: 1.1, onDialysis: false });
    const meldNa = calculateMeldNa({
      bilirubin: 1.2,
      creatinine: 1.0,
      inr: 1.1,
      onDialysis: false,
      sodium: 138, // clamped to 137, diff = 0
    });
    // sodium diff = 0 → MELD-Na = MELD
    expect(meldNa.score).toBe(meld.score);
  });
});
