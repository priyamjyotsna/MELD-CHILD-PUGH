import {
  CITATION_INFO,
  GITHUB_REPOSITORY_URL,
  OSF_LIVERTRACKER_TOOL_REGISTRATIONS,
  PACKAGE_NAME,
  PACKAGE_VERSION,
} from '@livertracker/clinical-scores';

const API_VERSION = '1.0.0';

export function apiMeta() {
  const now = new Date().toISOString();
  return {
    apiVersion: API_VERSION,
    calculationEngine: `${PACKAGE_NAME}@${PACKAGE_VERSION}`,
    timestamp: now,
    disclaimer:
      'Educational and clinical decision support only. Not a substitute for professional judgment.',
    citation: {
      repository: GITHUB_REPOSITORY_URL,
      packageDoiPlaceholder: CITATION_INFO.doi,
      suggestedCitation: CITATION_INFO.suggestedCitation,
      osfRegistrations: [...OSF_LIVERTRACKER_TOOL_REGISTRATIONS],
    },
  } as const;
}

export function jsonOk<T extends Record<string, unknown>>(data: T) {
  return { meta: apiMeta(), ...data };
}

export function jsonErr(
  code: 'INVALID_INPUT' | 'MISSING_REQUIRED_FIELD' | 'INTERNAL_ERROR',
  message: string,
  details?: Record<string, unknown>,
) {
  return {
    meta: apiMeta(),
    error: { code, message, ...(details ? { details } : {}) },
  };
}
