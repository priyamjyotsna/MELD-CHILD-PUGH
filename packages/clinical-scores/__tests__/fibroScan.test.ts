import { interpretFibroScan } from '../src/fibroScan';

describe('interpretFibroScan', () => {
  // ── Fibrosis staging ──

  test('FS001 — F0: stiffness 3.5 kPa, no CAP', () => {
    const result = interpretFibroScan({ liverStiffness: 3.5 });
    expect(result.fibrosis.stage).toBe('F0');
    expect(result.fibrosis.stageLabel).toContain('No Fibrosis');
    expect(result.steatosis).toBeUndefined();
  });

  test('FS002 — F1: stiffness 6.2 kPa, CAP 250', () => {
    const result = interpretFibroScan({ liverStiffness: 6.2, capScore: 250 });
    expect(result.fibrosis.stage).toBe('F1');
    expect(result.steatosis?.grade).toBe('S1');
  });

  test('FS003 — F2: stiffness 8.5 kPa, CAP 285', () => {
    const result = interpretFibroScan({ liverStiffness: 8.5, capScore: 285 });
    expect(result.fibrosis.stage).toBe('F2');
    expect(result.steatosis?.grade).toBe('S2');
  });

  test('FS004 — F3: stiffness 12.5 kPa, CAP 310', () => {
    const result = interpretFibroScan({ liverStiffness: 12.5, capScore: 310 });
    expect(result.fibrosis.stage).toBe('F3');
    expect(result.steatosis?.grade).toBe('S3');
  });

  test('FS005 — F4: stiffness 18.0 kPa, CAP 220', () => {
    const result = interpretFibroScan({ liverStiffness: 18.0, capScore: 220 });
    expect(result.fibrosis.stage).toBe('F4');
    expect(result.steatosis?.grade).toBe('S0');
  });

  test('FS006 — F0 with fatty liver: stiffness 4.8 kPa, CAP 295', () => {
    const result = interpretFibroScan({ liverStiffness: 4.8, capScore: 295 });
    expect(result.fibrosis.stage).toBe('F0');
    expect(result.steatosis?.grade).toBe('S3');
  });

  // ── Boundary tests ──

  test('FS007 — exactly at F0/F1 boundary (5.0 kPa) = F1', () => {
    const result = interpretFibroScan({ liverStiffness: 5.0 });
    expect(result.fibrosis.stage).toBe('F1');
  });

  test('FS008 — just below F1/F2 boundary (6.9 kPa) = F1', () => {
    const result = interpretFibroScan({ liverStiffness: 6.9 });
    expect(result.fibrosis.stage).toBe('F1');
  });

  test('FS009 — at F1/F2 boundary (7.0 kPa) = F2', () => {
    const result = interpretFibroScan({ liverStiffness: 7.0 });
    expect(result.fibrosis.stage).toBe('F2');
  });

  test('FS010 — at F2/F3 boundary (9.5 kPa) = F3', () => {
    const result = interpretFibroScan({ liverStiffness: 9.5 });
    expect(result.fibrosis.stage).toBe('F3');
  });

  test('FS011 — at F3/F4 boundary (14.0 kPa) = F4', () => {
    const result = interpretFibroScan({ liverStiffness: 14.0 });
    expect(result.fibrosis.stage).toBe('F4');
  });

  test('FS012 — very high stiffness (75 kPa) = F4', () => {
    const result = interpretFibroScan({ liverStiffness: 75 });
    expect(result.fibrosis.stage).toBe('F4');
  });

  test('FS013 — very low stiffness (2.5 kPa) = F0', () => {
    const result = interpretFibroScan({ liverStiffness: 2.5 });
    expect(result.fibrosis.stage).toBe('F0');
  });

  // ── Steatosis grading ──

  test('FS014 — S0: CAP 200', () => {
    const result = interpretFibroScan({ liverStiffness: 3, capScore: 200 });
    expect(result.steatosis?.grade).toBe('S0');
    expect(result.steatosis?.estimatedFatPercentage).toBe('< 5%');
  });

  test('FS015 — S1: CAP 250', () => {
    const result = interpretFibroScan({ liverStiffness: 3, capScore: 250 });
    expect(result.steatosis?.grade).toBe('S1');
    expect(result.steatosis?.estimatedFatPercentage).toBe('5–33%');
  });

  test('FS016 — S2: CAP 275', () => {
    const result = interpretFibroScan({ liverStiffness: 3, capScore: 275 });
    expect(result.steatosis?.grade).toBe('S2');
  });

  test('FS017 — S3: CAP 310', () => {
    const result = interpretFibroScan({ liverStiffness: 3, capScore: 310 });
    expect(result.steatosis?.grade).toBe('S3');
  });

  test('FS018 — CAP boundary: exactly 238 = S1', () => {
    const result = interpretFibroScan({ liverStiffness: 3, capScore: 238 });
    expect(result.steatosis?.grade).toBe('S1');
  });

  // ── Result structure ──

  test('FS019 — allStages has 5 entries with correct active flag', () => {
    const result = interpretFibroScan({ liverStiffness: 8.5 });
    expect(result.fibrosis.allStages).toHaveLength(5);
    const active = result.fibrosis.allStages.filter((s) => s.isActive);
    expect(active).toHaveLength(1);
    expect(active[0].stage).toBe('F2');
  });

  test('FS020 — returns recommendations', () => {
    const result = interpretFibroScan({ liverStiffness: 12.5 });
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  test('FS021 — returns references', () => {
    const result = interpretFibroScan({ liverStiffness: 3.5 });
    expect(result.references.length).toBeGreaterThan(0);
    expect(result.references[0].doi).toBe('10.1016/j.jhep.2008.02.008');
  });

  test('FS022 — overall summary mentions kPa value', () => {
    const result = interpretFibroScan({ liverStiffness: 8.5, capScore: 285 });
    expect(result.overallSummary).toContain('8.5');
    expect(result.overallSummary).toContain('285');
  });

  test('FS023 — F4 recommendations mention transplant/MELD', () => {
    const result = interpretFibroScan({ liverStiffness: 20 });
    const mentionsMeld = result.recommendations.some((r) => r.toLowerCase().includes('meld'));
    expect(mentionsMeld).toBe(true);
  });

  test('FS024 — stiffness color matches stage', () => {
    const result = interpretFibroScan({ liverStiffness: 12.5 });
    expect(result.fibrosis.stiffnessColor).toBe('#F97316'); // F3 = orange
  });
});
