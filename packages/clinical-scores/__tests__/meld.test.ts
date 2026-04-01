import { calculateMeld } from '../src/meld';

describe('calculateMeld', () => {
  test('M001 — reference case: bili 1.2, cr 0.9→1.0 (clamped), inr 1.1', () => {
    const result = calculateMeld({ bilirubin: 1.2, creatinine: 0.9, inr: 1.1, onDialysis: false });
    expect(result.score).toBe(8);
    expect(result.formula).toBe('MELD');
  });

  test('M002 — formula verification: bili 3.5, cr 1.8, inr 1.5', () => {
    const result = calculateMeld({ bilirubin: 3.5, creatinine: 1.8, inr: 1.5, onDialysis: false });
    expect(result.score).toBe(21);
  });

  test('M003 — below-minimum clamping: all values below 1.0', () => {
    const result = calculateMeld({ bilirubin: 0.5, creatinine: 0.6, inr: 0.8, onDialysis: false });
    expect(result.score).toBe(6);
    expect(result.components[0].clampNote).toBeDefined();
  });

  test('M004 — dialysis patient: creatinine capped at 4.0', () => {
    const result = calculateMeld({ bilirubin: 2.0, creatinine: 4.5, inr: 2.0, onDialysis: true });
    expect(result.score).toBe(30);
    expect(result.components[1].clampedValue).toBe(4.0);
    expect(result.components[1].clampNote).toContain('dialysis');
  });

  test('M005 — creatinine above 4.0 clamped to 4.0', () => {
    const result = calculateMeld({ bilirubin: 1.0, creatinine: 5.0, inr: 1.0, onDialysis: false });
    expect(result.components[1].clampedValue).toBe(4.0);
  });

  test('M006 — score bounded at 6 minimum', () => {
    const result = calculateMeld({ bilirubin: 1.0, creatinine: 1.0, inr: 1.0, onDialysis: false });
    expect(result.score).toBeGreaterThanOrEqual(6);
  });

  test('M007 — score bounded at 40 maximum', () => {
    const result = calculateMeld({ bilirubin: 50, creatinine: 4.0, inr: 10, onDialysis: false });
    expect(result.score).toBeLessThanOrEqual(40);
  });

  test('M008 — returns ISO timestamp', () => {
    const result = calculateMeld({ bilirubin: 1.2, creatinine: 1.0, inr: 1.1, onDialysis: false });
    expect(new Date(result.calculatedAt).toISOString()).toBe(result.calculatedAt);
  });

  test('M009 — returns formula name MELD', () => {
    const result = calculateMeld({ bilirubin: 1.2, creatinine: 1.0, inr: 1.1, onDialysis: false });
    expect(result.formula).toBe('MELD');
  });

  test('M010 — returns references array', () => {
    const result = calculateMeld({ bilirubin: 1.2, creatinine: 1.0, inr: 1.1, onDialysis: false });
    expect(result.references.length).toBeGreaterThan(0);
    expect(result.references[0].doi).toBe('10.1053/jhep.2001.22172');
  });

  test('M011 — returns citation info', () => {
    const result = calculateMeld({ bilirubin: 1.2, creatinine: 1.0, inr: 1.1, onDialysis: false });
    expect(result.citationInfo.package).toBe('@livertracker/clinical-scores');
  });

  test('M012 — components sum contributions to ~1', () => {
    const result = calculateMeld({ bilirubin: 3.5, creatinine: 1.8, inr: 1.5, onDialysis: false });
    const total = result.components.reduce((sum, c) => sum + c.contribution, 0);
    expect(total).toBeCloseTo(1.0, 5);
  });

  test('M013 — severity label Minimal for score 6-9', () => {
    const result = calculateMeld({ bilirubin: 1.0, creatinine: 1.0, inr: 1.0, onDialysis: false });
    expect(result.clinicalContext.severityLabel).toBe('Minimal');
  });

  test('M014 — severity label Severe for score 21', () => {
    const result = calculateMeld({ bilirubin: 3.5, creatinine: 1.8, inr: 1.5, onDialysis: false });
    expect(result.score).toBe(21);
    expect(result.clinicalContext.severityLabel).toBe('Severe');
  });

  test('M015 — severity label Severe for score 20-29', () => {
    const result = calculateMeld({ bilirubin: 5.0, creatinine: 2.5, inr: 2.0, onDialysis: false });
    expect(result.score).toBe(29);
    expect(result.clinicalContext.severityLabel).toBe('Severe');
  });

  test('M016 — severity label Very Severe for score 30-40', () => {
    const result = calculateMeld({ bilirubin: 2.0, creatinine: 4.5, inr: 2.0, onDialysis: true });
    expect(result.score).toBeGreaterThanOrEqual(30);
    expect(result.clinicalContext.severityLabel).toBe('Very Severe');
  });

  test('M017 — bilirubin exactly 1.0 not clamped', () => {
    const result = calculateMeld({ bilirubin: 1.0, creatinine: 1.0, inr: 1.0, onDialysis: false });
    expect(result.components[0].clampNote).toBeUndefined();
  });

  test('M018 — INR clamped from below 1.0', () => {
    const result = calculateMeld({ bilirubin: 1.0, creatinine: 1.0, inr: 0.5, onDialysis: false });
    expect(result.components[2].clampedValue).toBe(1.0);
    expect(result.components[2].clampNote).toContain('0.5');
  });

  test('M019 — high severity case', () => {
    const result = calculateMeld({ bilirubin: 10, creatinine: 3.5, inr: 3.0, onDialysis: false });
    expect(result.score).toBeGreaterThanOrEqual(30);
  });

  test('M020 — clinical note contains score', () => {
    const result = calculateMeld({ bilirubin: 3.5, creatinine: 1.8, inr: 1.5, onDialysis: false });
    expect(result.clinicalContext.clinicalNote).toContain(String(result.score));
  });
});
