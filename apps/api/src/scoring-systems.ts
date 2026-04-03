import { GITHUB_REPOSITORY_URL } from '@livertracker/clinical-scores';

const base = { baseUrl: `${GITHUB_REPOSITORY_URL}/blob/main/docs/FORMULAS.md` };

export const scoringSystemsPayload = {
  systems: [
    {
      id: 'meld',
      name: 'MELD',
      endpoint: 'POST /api/v1/meld',
      description: 'Model for End-Stage Liver Disease (original)',
      requiredFields: ['bilirubin', 'creatinine', 'inr'],
      optionalFields: ['onDialysis'],
      references: base,
    },
    {
      id: 'meld-na',
      name: 'MELD-Na',
      endpoint: 'POST /api/v1/meld-na',
      description: 'MELD with serum sodium',
      requiredFields: ['bilirubin', 'creatinine', 'inr', 'sodium'],
      optionalFields: ['onDialysis'],
      references: base,
    },
    {
      id: 'meld3',
      name: 'MELD 3.0',
      endpoint: 'POST /api/v1/meld3',
      description: 'OPTN MELD 3.0 (albumin, sex)',
      requiredFields: ['bilirubin', 'creatinine', 'inr', 'sodium', 'albumin', 'sex'],
      optionalFields: ['onDialysis'],
      references: base,
    },
    {
      id: 'child-pugh',
      name: 'Child-Pugh',
      endpoint: 'POST /api/v1/child-pugh',
      description: 'Cirrhosis classification (A/B/C)',
      requiredFields: ['bilirubin', 'albumin', 'inr', 'ascites', 'encephalopathy'],
      optionalFields: [],
      references: base,
    },
    {
      id: 'liver-enzymes',
      name: 'Liver enzyme checker',
      endpoint: 'POST /api/v1/liver-enzymes',
      description: 'ALT, AST, GGT, ALP, bilirubin interpretation',
      requiredFields: [],
      optionalFields: ['alt', 'ast', 'ggt', 'alp', 'bilirubin'],
      note: 'At least one analyte required.',
      references: base,
    },
    {
      id: 'fibroscan',
      name: 'FibroScan interpreter',
      endpoint: 'POST /api/v1/fibroscan',
      description: 'Liver stiffness (kPa) and optional CAP (dB/m)',
      requiredFields: ['liverStiffness'],
      optionalFields: ['capScore'],
      references: base,
    },
    {
      id: 'calculate',
      name: 'Universal calculate',
      endpoint: 'POST /api/v1/calculate',
      description: 'Returns every applicable result for the fields provided.',
      references: base,
    },
  ],
} as const;
