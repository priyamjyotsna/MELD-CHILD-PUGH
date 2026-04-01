import type { Meld3Input, ChildPughInput, AllScoresResult } from './types';
import { calculateMeld } from './meld';
import { calculateMeldNa } from './meldNa';
import { calculateMeld3 } from './meld3';
import { calculateChildPugh } from './childPugh';

type CombinedInput = Partial<Meld3Input & ChildPughInput>;

export function calculateAllScores(input: CombinedInput): AllScoresResult {
  const { bilirubin, creatinine, inr, onDialysis, sodium, albumin, sex, ascites, encephalopathy } =
    input;

  const hasMeldBase =
    bilirubin !== undefined &&
    creatinine !== undefined &&
    inr !== undefined &&
    onDialysis !== undefined;

  const hasSodium = sodium !== undefined;
  const hasAlbuminAndSex = albumin !== undefined && sex !== undefined;
  const hasChildPughClinical = ascites !== undefined && encephalopathy !== undefined;

  const meld = hasMeldBase
    ? calculateMeld({ bilirubin: bilirubin!, creatinine: creatinine!, inr: inr!, onDialysis: onDialysis! })
    : calculateMeld({ bilirubin: 1, creatinine: 1, inr: 1, onDialysis: false });

  const meldNa =
    hasMeldBase && hasSodium
      ? calculateMeldNa({
          bilirubin: bilirubin!,
          creatinine: creatinine!,
          inr: inr!,
          onDialysis: onDialysis!,
          sodium: sodium!,
        })
      : null;

  const meld3 =
    hasMeldBase && hasSodium && hasAlbuminAndSex
      ? calculateMeld3({
          bilirubin: bilirubin!,
          creatinine: creatinine!,
          inr: inr!,
          onDialysis: onDialysis!,
          sodium: sodium!,
          albumin: albumin!,
          sex: sex!,
        })
      : null;

  const childPugh =
    bilirubin !== undefined &&
    albumin !== undefined &&
    inr !== undefined &&
    hasChildPughClinical
      ? calculateChildPugh({
          bilirubin: bilirubin!,
          albumin: albumin!,
          inr: inr!,
          ascites: ascites!,
          encephalopathy: encephalopathy!,
        })
      : null;

  return { meld, meldNa, meld3, childPugh, liverEnzymes: null, fibroScan: null };
}
