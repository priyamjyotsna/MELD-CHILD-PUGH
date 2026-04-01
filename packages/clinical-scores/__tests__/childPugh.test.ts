import { calculateChildPugh } from '../src/childPugh';

describe('calculateChildPugh', () => {
  test('CP001 — all 1-point values: score 5, Class A', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    expect(result.score).toBe(5);
    expect(result.classification).toBe('A');
    expect(result.classificationLabel).toContain('Compensated');
  });

  test('CP002 — all 2-point values: score 10, Class C', () => {
    const result = calculateChildPugh({
      bilirubin: 2.5,
      albumin: 3.0,
      inr: 2.0,
      ascites: 'mild',
      encephalopathy: 'grade_1_2',
    });
    expect(result.score).toBe(10);
    expect(result.classification).toBe('C');
  });

  test('CP003 — all 3-point values: score 15, Class C', () => {
    const result = calculateChildPugh({
      bilirubin: 4.0,
      albumin: 2.5,
      inr: 2.5,
      ascites: 'moderate_severe',
      encephalopathy: 'grade_3_4',
    });
    expect(result.score).toBe(15);
    expect(result.classification).toBe('C');
  });

  test('CP004 — Class A boundary: score 6', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'grade_1_2',
    });
    expect(result.score).toBe(6);
    expect(result.classification).toBe('A');
  });

  test('CP005 — Class B lower boundary: score 7', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'mild',
      encephalopathy: 'grade_1_2',
    });
    expect(result.score).toBe(7);
    expect(result.classification).toBe('B');
  });

  test('CP006 — Class B: bili=2.5(2), alb=3.0(2), inr=1.2(1), ascites=mild(2), enceph=none(1) = 8', () => {
    const result = calculateChildPugh({
      bilirubin: 2.5,
      albumin: 3.0,
      inr: 1.2,
      ascites: 'mild',
      encephalopathy: 'none',
    });
    expect(result.score).toBe(8);
    expect(result.classification).toBe('B');
  });

  test('CP007 — Class C lower boundary: score 10', () => {
    const result = calculateChildPugh({
      bilirubin: 2.5,
      albumin: 3.0,
      inr: 2.0,
      ascites: 'mild',
      encephalopathy: 'grade_1_2',
    });
    expect(result.score).toBe(10);
    expect(result.classification).toBe('C');
  });

  test('CP008 — bilirubin exactly 2.0: 2 points', () => {
    const result = calculateChildPugh({
      bilirubin: 2.0,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const biliComp = result.components.find((c) => c.name === 'Serum Bilirubin')!;
    expect(biliComp.points).toBe(2);
  });

  test('CP009 — bilirubin exactly 3.0: 2 points', () => {
    const result = calculateChildPugh({
      bilirubin: 3.0,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const biliComp = result.components.find((c) => c.name === 'Serum Bilirubin')!;
    expect(biliComp.points).toBe(2);
  });

  test('CP010 — bilirubin above 3.0: 3 points', () => {
    const result = calculateChildPugh({
      bilirubin: 3.1,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const biliComp = result.components.find((c) => c.name === 'Serum Bilirubin')!;
    expect(biliComp.points).toBe(3);
  });

  test('CP011 — albumin exactly 3.5: 2 points (boundary is strict >, so 3.5 is NOT > 3.5)', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.5,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const albComp = result.components.find((c) => c.name === 'Serum Albumin')!;
    expect(albComp.points).toBe(2);
  });

  test('CP011b — albumin above 3.5 (e.g. 3.6): 1 point', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.6,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const albComp = result.components.find((c) => c.name === 'Serum Albumin')!;
    expect(albComp.points).toBe(1);
  });

  test('CP012 — albumin below 2.8: 3 points', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 2.7,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const albComp = result.components.find((c) => c.name === 'Serum Albumin')!;
    expect(albComp.points).toBe(3);
  });

  test('CP013 — INR exactly 1.7: 2 points', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.7,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const inrComp = result.components.find((c) => c.name === 'INR')!;
    expect(inrComp.points).toBe(2);
  });

  test('CP014 — INR above 2.3: 3 points', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 2.4,
      ascites: 'none',
      encephalopathy: 'none',
    });
    const inrComp = result.components.find((c) => c.name === 'INR')!;
    expect(inrComp.points).toBe(3);
  });

  test('CP015 — returns 5 components', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    expect(result.components).toHaveLength(5);
  });

  test('CP016 — returns Child-Pugh references', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    expect(result.references[0].doi).toBe('10.1002/bjs.1800600817');
  });

  test('CP017 — Class A has 1-year survival ~100%', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    expect(result.clinicalContext.oneYearSurvival).toBe('~100%');
  });

  test('CP018 — Class C has 1-year survival ~45%', () => {
    const result = calculateChildPugh({
      bilirubin: 4.0,
      albumin: 2.5,
      inr: 2.5,
      ascites: 'moderate_severe',
      encephalopathy: 'grade_3_4',
    });
    expect(result.clinicalContext.oneYearSurvival).toBe('~45%');
  });

  test('CP019 — returns citation info', () => {
    const result = calculateChildPugh({
      bilirubin: 1.5,
      albumin: 3.8,
      inr: 1.2,
      ascites: 'none',
      encephalopathy: 'none',
    });
    expect(result.citationInfo.package).toBe('@livertracker/clinical-scores');
  });

  test('CP020 — clinical note contains score and class', () => {
    const result = calculateChildPugh({
      bilirubin: 2.5,
      albumin: 3.0,
      inr: 2.0,
      ascites: 'mild',
      encephalopathy: 'grade_1_2',
    });
    expect(result.clinicalContext.clinicalNote).toContain(String(result.score));
  });
});
