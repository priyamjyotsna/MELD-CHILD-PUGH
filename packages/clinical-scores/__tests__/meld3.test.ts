import { calculateMeld3 } from '../src/meld3';

describe('calculateMeld 3.0', () => {
  test('M3001 — reference case female: bili 3.5, cr 1.8, inr 1.5, na 131, alb 2.8', () => {
    const result = calculateMeld3({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
      albumin: 2.8,
      sex: 'female',
    });
    expect(result.score).toBe(27);
    expect(result.formula).toBe('MELD 3.0');
  });

  test('M3002 — same labs, male: female=27, male=26 (1.33pt sex adjustment)', () => {
    const female = calculateMeld3({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
      albumin: 2.8,
      sex: 'female',
    });
    const male = calculateMeld3({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
      albumin: 2.8,
      sex: 'male',
    });
    expect(female.score).toBe(27);
    expect(male.score).toBe(26);
    expect(female.score).toBeGreaterThan(male.score);
  });

  test('M3003 — minimum values female: score bounded at 6', () => {
    const result = calculateMeld3({
      bilirubin: 1.0,
      creatinine: 1.0,
      inr: 1.0,
      onDialysis: false,
      sodium: 137,
      albumin: 3.5,
      sex: 'female',
    });
    expect(result.score).toBeGreaterThanOrEqual(6);
  });

  test('M3004 — creatinine capped at 3.0 (not 4.0 like original MELD)', () => {
    const result = calculateMeld3({
      bilirubin: 1.0,
      creatinine: 4.0,
      inr: 1.0,
      onDialysis: false,
      sodium: 137,
      albumin: 3.5,
      sex: 'male',
    });
    expect(result.components[1].clampedValue).toBe(3.0);
  });

  test('M3005 — dialysis sets creatinine to 3.0', () => {
    const result = calculateMeld3({
      bilirubin: 1.0,
      creatinine: 1.0,
      inr: 1.0,
      onDialysis: true,
      sodium: 137,
      albumin: 3.5,
      sex: 'male',
    });
    expect(result.components[1].clampedValue).toBe(3.0);
    expect(result.components[1].clampNote).toContain('3.0');
  });

  test('M3006 — albumin clamped to 1.5 minimum', () => {
    const result = calculateMeld3({
      bilirubin: 1.0,
      creatinine: 1.0,
      inr: 1.0,
      onDialysis: false,
      sodium: 137,
      albumin: 1.0,
      sex: 'male',
    });
    expect(result.components[4].clampedValue).toBe(1.5);
  });

  test('M3007 — albumin clamped to 3.5 maximum', () => {
    const result = calculateMeld3({
      bilirubin: 1.0,
      creatinine: 1.0,
      inr: 1.0,
      onDialysis: false,
      sodium: 137,
      albumin: 4.5,
      sex: 'male',
    });
    expect(result.components[4].clampedValue).toBe(3.5);
  });

  test('M3008 — score bounded at 40 maximum', () => {
    const result = calculateMeld3({
      bilirubin: 50,
      creatinine: 3.0,
      inr: 10,
      onDialysis: false,
      sodium: 120,
      albumin: 1.5,
      sex: 'female',
    });
    expect(result.score).toBeLessThanOrEqual(40);
  });

  test('M3009 — female sex component included in components', () => {
    const result = calculateMeld3({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
      albumin: 2.8,
      sex: 'female',
    });
    const sexComp = result.components.find((c) => c.name.includes('Female'));
    expect(sexComp).toBeDefined();
  });

  test('M3010 — male sex does not include sex component', () => {
    const result = calculateMeld3({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
      albumin: 2.8,
      sex: 'male',
    });
    const sexComp = result.components.find((c) => c.name.includes('Female'));
    expect(sexComp).toBeUndefined();
  });

  test('M3011 — returns MELD 3.0 reference with correct DOI', () => {
    const result = calculateMeld3({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
      albumin: 2.8,
      sex: 'female',
    });
    expect(result.references[0].doi).toBe('10.1053/j.gastro.2021.08.050');
  });

  test('M3012 — clinical note mentions sex adjustment for female', () => {
    const result = calculateMeld3({
      bilirubin: 3.5,
      creatinine: 1.8,
      inr: 1.5,
      onDialysis: false,
      sodium: 131,
      albumin: 2.8,
      sex: 'female',
    });
    expect(result.clinicalContext.clinicalNote).toContain('sex adjustment');
  });
});
