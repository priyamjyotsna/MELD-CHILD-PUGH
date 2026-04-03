import type { ChildPughInput, LiverEnzymeInput, Meld3Input, MeldInput, MeldNaInput } from '@livertracker/clinical-scores';
import {
  calculateChildPugh,
  calculateMeld,
  calculateMeld3,
  calculateMeldNa,
  checkLiverEnzymes,
  interpretFibroScan,
} from '@livertracker/clinical-scores';

type JsonBody = Record<string, unknown>;

function asNum(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

function asBool(v: unknown): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined;
}

function asStrUnion<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

export function runUniversal(body: JsonBody) {
  const bilirubin = asNum(body.bilirubin);
  const creatinine = asNum(body.creatinine);
  const inr = asNum(body.inr);
  const onDialysis = asBool(body.onDialysis) ?? false;
  const sodium = asNum(body.sodium);
  const albumin = asNum(body.albumin);
  const sex = asStrUnion(body.sex, ['male', 'female'] as const);
  const ascites = asStrUnion(body.ascites, ['none', 'mild', 'moderate_severe'] as const);
  const encephalopathy = asStrUnion(body.encephalopathy, [
    'none',
    'grade_1_2',
    'grade_3_4',
  ] as const);

  const hasMeldMin =
    bilirubin !== undefined && creatinine !== undefined && inr !== undefined;

  const meld =
    hasMeldMin
      ? calculateMeld({ bilirubin: bilirubin!, creatinine: creatinine!, inr: inr!, onDialysis })
      : null;

  const meldNa =
    meld && sodium !== undefined
      ? calculateMeldNa({
          bilirubin: bilirubin!,
          creatinine: creatinine!,
          inr: inr!,
          onDialysis,
          sodium,
        })
      : null;

  const meld3 =
    hasMeldMin && sodium !== undefined && albumin !== undefined && sex !== undefined
      ? calculateMeld3({
          bilirubin: bilirubin!,
          creatinine: creatinine!,
          inr: inr!,
          onDialysis,
          sodium,
          albumin,
          sex,
        })
      : null;

  const childPugh =
    hasMeldMin &&
    albumin !== undefined &&
    ascites !== undefined &&
    encephalopathy !== undefined
      ? calculateChildPugh({
          bilirubin: bilirubin!,
          albumin: albumin!,
          inr: inr!,
          ascites,
          encephalopathy,
        })
      : null;

  const enzymePayload: LiverEnzymeInput = {};
  const alt = asNum(body.alt);
  const ast = asNum(body.ast);
  const ggt = asNum(body.ggt);
  const alp = asNum(body.alp);
  if (alt !== undefined) enzymePayload.alt = alt;
  if (ast !== undefined) enzymePayload.ast = ast;
  if (ggt !== undefined) enzymePayload.ggt = ggt;
  if (alp !== undefined) enzymePayload.alp = alp;
  const hasTransaminaseOrChole = alt !== undefined || ast !== undefined || ggt !== undefined || alp !== undefined;
  const bilirubinForEnzyme =
    hasTransaminaseOrChole || (bilirubin !== undefined && !hasMeldMin)
      ? bilirubin
      : undefined;
  if (bilirubinForEnzyme !== undefined) enzymePayload.bilirubin = bilirubinForEnzyme;

  let liverEnzymes = null;
  if (Object.keys(enzymePayload).length > 0) {
    try {
      liverEnzymes = checkLiverEnzymes(enzymePayload);
    } catch {
      liverEnzymes = null;
    }
  }

  const liverStiffness = asNum(body.liverStiffness);
  const capScore = asNum(body.capScore);
  let fibroScan = null;
  if (liverStiffness !== undefined) {
    try {
      fibroScan = interpretFibroScan({ liverStiffness, capScore });
    } catch {
      fibroScan = null;
    }
  }

  return {
    meld,
    meldNa,
    meld3,
    childPugh,
    liverEnzymes,
    fibroScan,
  };
}

export function parseMeldBody(body: JsonBody): MeldInput {
  const bilirubin = asNum(body.bilirubin);
  const creatinine = asNum(body.creatinine);
  const inr = asNum(body.inr);
  const onDialysis = asBool(body.onDialysis) ?? false;
  if (bilirubin === undefined || creatinine === undefined || inr === undefined) {
    throw new Error('MISSING_REQUIRED_FIELD');
  }
  return { bilirubin, creatinine, inr, onDialysis };
}

export function parseMeldNaBody(body: JsonBody): MeldNaInput {
  const base = parseMeldBody(body);
  const sodium = asNum(body.sodium);
  if (sodium === undefined) throw new Error('MISSING_REQUIRED_FIELD');
  return { ...base, sodium };
}

export function parseMeld3Body(body: JsonBody): Meld3Input {
  const base = parseMeldNaBody(body);
  const albumin = asNum(body.albumin);
  const sex = asStrUnion(body.sex, ['male', 'female'] as const);
  if (albumin === undefined || sex === undefined) throw new Error('MISSING_REQUIRED_FIELD');
  return { ...base, albumin, sex };
}

export function parseChildPughBody(body: JsonBody): ChildPughInput {
  const bilirubin = asNum(body.bilirubin);
  const albumin = asNum(body.albumin);
  const inr = asNum(body.inr);
  const ascites = asStrUnion(body.ascites, ['none', 'mild', 'moderate_severe'] as const);
  const encephalopathy = asStrUnion(body.encephalopathy, [
    'none',
    'grade_1_2',
    'grade_3_4',
  ] as const);
  if (
    bilirubin === undefined ||
    albumin === undefined ||
    inr === undefined ||
    ascites === undefined ||
    encephalopathy === undefined
  ) {
    throw new Error('MISSING_REQUIRED_FIELD');
  }
  return { bilirubin, albumin, inr, ascites, encephalopathy };
}

export function parseEnzymeBody(body: JsonBody): LiverEnzymeInput {
  const enzymePayload: LiverEnzymeInput = {};
  const alt = asNum(body.alt);
  const ast = asNum(body.ast);
  const ggt = asNum(body.ggt);
  const alp = asNum(body.alp);
  const bilirubin = asNum(body.bilirubin);
  if (alt !== undefined) enzymePayload.alt = alt;
  if (ast !== undefined) enzymePayload.ast = ast;
  if (ggt !== undefined) enzymePayload.ggt = ggt;
  if (alp !== undefined) enzymePayload.alp = alp;
  if (bilirubin !== undefined) enzymePayload.bilirubin = bilirubin;
  if (Object.keys(enzymePayload).length === 0) throw new Error('MISSING_REQUIRED_FIELD');
  return enzymePayload;
}

export function parseFibroScanBody(body: JsonBody) {
  const liverStiffness = asNum(body.liverStiffness);
  if (liverStiffness === undefined) throw new Error('MISSING_REQUIRED_FIELD');
  const capScore = asNum(body.capScore);
  return { liverStiffness, capScore };
}
