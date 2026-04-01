import { checkLiverEnzymes } from '../src/liverEnzymes';

describe('checkLiverEnzymes', () => {
  test('LE001 — all normal values', () => {
    const result = checkLiverEnzymes({ alt: 32, ast: 28, ggt: 45, alp: 85, bilirubin: 0.8 });
    expect(result.overallStatus).toBe('normal');
    expect(result.injuryPattern).toBe('normal');
    expect(result.enzymes).toHaveLength(5);
  });

  test('LE002 — mixed pattern by R ratio: ALT elevated, ALP normal range, R=2.68', () => {
    const result = checkLiverEnzymes({ alt: 85, ast: 62, ggt: 120, alp: 95, bilirubin: 1.8 });
    expect(result.overallStatus).toBe('elevated');
    expect(result.injuryPattern).toBe('mixed'); // R=2.68, between 2-5 = mixed
    expect(result.astAltRatio).toBeCloseTo(0.73, 1);
  });

  test('LE003 — cholestatic pattern: ALP/GGT elevated, ALT normal', () => {
    const result = checkLiverEnzymes({ alt: 25, ast: 20, ggt: 180, alp: 280 });
    expect(result.injuryPattern).toBe('cholestatic');
  });

  test('LE004 — mixed pattern: R=4.5 (between 2-5), highly elevated labs', () => {
    const result = checkLiverEnzymes({ alt: 150, ast: 200, ggt: 90, alp: 100, bilirubin: 3.5 });
    expect(result.overallStatus).toBe('significantly_elevated');
    expect(result.injuryPattern).toBe('mixed'); // R=4.5, between 2-5 = mixed
  });

  test('LE005 — minimal data (single enzyme)', () => {
    const result = checkLiverEnzymes({ bilirubin: 0.5 });
    expect(result.overallStatus).toBe('normal');
    expect(result.enzymes).toHaveLength(1);
    expect(result.injuryPattern).toBe('insufficient_data');
  });

  test('LE006 — cholestatic by R ratio: R=1.8, ALP dominates', () => {
    const result = checkLiverEnzymes({ alt: 300, ast: 250, ggt: 350, alp: 500, bilirubin: 8.0 });
    expect(result.overallStatus).toBe('significantly_elevated');
    expect(result.injuryPattern).toBe('cholestatic'); // R=1.8 < 2 = cholestatic
    expect(result.rRatio).toBeCloseTo(1.8, 1);
  });

  test('LE007 — AST/ALT ratio > 2 suggests alcoholic hepatitis', () => {
    const result = checkLiverEnzymes({ alt: 80, ast: 200 });
    expect(result.astAltRatio).toBe(2.5);
    expect(result.astAltRatioInterpretation).toContain('alcoholic');
  });

  test('LE008 — AST/ALT ratio < 1 suggests NAFLD', () => {
    const result = checkLiverEnzymes({ alt: 60, ast: 40 });
    expect(result.astAltRatio).toBeCloseTo(0.67, 1);
    expect(result.astAltRatioInterpretation).toContain('non-alcoholic');
  });

  test('LE009 — only GGT provided', () => {
    const result = checkLiverEnzymes({ ggt: 45 });
    expect(result.overallStatus).toBe('normal');
    expect(result.enzymes).toHaveLength(1);
    expect(result.enzymes[0].name).toBe('GGT');
  });

  test('LE010 — borderline values', () => {
    const result = checkLiverEnzymes({ alt: 55, ast: 45 });
    expect(result.enzymes[0].status).toBe('borderline');
    expect(result.enzymes[1].status).toBe('borderline');
    expect(result.overallStatus).toBe('borderline');
  });

  test('LE011 — throws on empty input', () => {
    expect(() => checkLiverEnzymes({})).toThrow('At least one enzyme');
  });

  test('LE012 — R ratio calculated when ALT and ALP provided', () => {
    const result = checkLiverEnzymes({ alt: 200, ast: 150, alp: 100, ggt: 80 });
    expect(result.rRatio).toBeDefined();
    expect(result.rRatio).toBeGreaterThan(0);
  });

  test('LE013 — returns references', () => {
    const result = checkLiverEnzymes({ alt: 32 });
    expect(result.references.length).toBeGreaterThan(0);
    expect(result.references[0].doi).toBe('10.1038/ajg.2016.517');
  });

  test('LE014 — returns citation info', () => {
    const result = checkLiverEnzymes({ alt: 32 });
    expect(result.citationInfo.package).toBe('@livertracker/clinical-scores');
  });

  test('LE015 — bilirubin exactly 1.0 is normal', () => {
    const result = checkLiverEnzymes({ bilirubin: 1.0 });
    expect(result.enzymes[0].status).toBe('normal');
  });

  test('LE016 — bilirubin 1.1 is borderline', () => {
    const result = checkLiverEnzymes({ bilirubin: 1.1 });
    expect(result.enzymes[0].status).toBe('borderline');
  });

  test('LE017 — bilirubin 2.1 is elevated', () => {
    const result = checkLiverEnzymes({ bilirubin: 2.1 });
    expect(result.enzymes[0].status).toBe('elevated');
  });

  test('LE018 — bilirubin > 5.0 is significantly elevated', () => {
    const result = checkLiverEnzymes({ bilirubin: 5.5 });
    expect(result.enzymes[0].status).toBe('significantly_elevated');
  });

  test('LE019 — ALT exactly at ULN (40) is normal', () => {
    const result = checkLiverEnzymes({ alt: 40 });
    expect(result.enzymes[0].status).toBe('normal');
  });

  test('LE020 — ALT at 41 is borderline', () => {
    const result = checkLiverEnzymes({ alt: 41 });
    expect(result.enzymes[0].status).toBe('borderline');
  });

  test('LE021 — recommendations included for elevated', () => {
    const result = checkLiverEnzymes({ alt: 85, ast: 62 });
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  test('LE022 — clinical summary mentions elevated enzyme names', () => {
    const result = checkLiverEnzymes({ alt: 85, ggt: 45 });
    expect(result.clinicalSummary).toContain('ALT');
  });

  test('LE023 — normal enzymes get simple summary', () => {
    const result = checkLiverEnzymes({ alt: 20, ast: 25 });
    expect(result.clinicalSummary).toContain('normal');
  });

  test('LE024 — ALP borderline (121-240)', () => {
    const result = checkLiverEnzymes({ alp: 150 });
    expect(result.enzymes[0].status).toBe('borderline');
  });

  test('LE025 — GGT significantly elevated (> 250)', () => {
    const result = checkLiverEnzymes({ ggt: 300 });
    expect(result.enzymes[0].status).toBe('significantly_elevated');
  });
});
