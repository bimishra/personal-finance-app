// Configuration for category duplicate semantic detection
// Expose tweakable thresholds & synonym dictionary so future UI/settings can edit them

export interface DuplicateDetectionConfig {
  fuseScoreThreshold: number; // max acceptable Fuse score
  minMatchCharLength: number;
  levenshtein: {
    shortMaxDistance: number; // length <=4
    mediumMaxDistance: number; // length 5-7
    longMaxDistance: number; // length >=8
  };
  distance: number; // Fuse distance option
}

export type SynonymMap = Record<string, string>;

export const synonyms: SynonymMap = {
  // Finance related examples
  utilities: 'utility',
  utility: 'utility',
  bills: 'bill',
  automobile: 'auto',
  car: 'auto',
  auto: 'auto',
  groceries: 'grocery',
  grocery: 'grocery',
  housing: 'rent',
  rent: 'rent',
  transport: 'transport',
  transportation: 'transport',
  dining: 'restaurant',
  restaurants: 'restaurant',
  restaurant: 'restaurant',
  medical: 'health',
  healthcare: 'health',
  health: 'health'
};

export const duplicateDetectionConfig: DuplicateDetectionConfig = {
  fuseScoreThreshold: 0.5,
  minMatchCharLength: 2,
  distance: 100,
  levenshtein: {
    shortMaxDistance: 1,
    mediumMaxDistance: 2,
    longMaxDistance: 3
  }
};

// Utility to canonicalize with plural heuristics + synonyms
export function canonicalizeName(raw: string, synonymMap: SynonymMap = synonyms): string {
  let s = raw.toLowerCase().trim();
  s = s.replace(/[^a-z0-9\s]/g, '');
  s = s.replace(/\s+/g, ' ');
  if (s.endsWith('ies') && s.length > 3) {
    s = s.slice(0, -3) + 'y';
  } else if (s.endsWith('ves') && s.length > 3) {
    s = s.slice(0, -3) + 'f';
  } else if (s.endsWith('es') && s.length > 2) {
    s = s.slice(0, -2);
  } else if (s.endsWith('s') && s.length > 1) {
    s = s.slice(0, -1);
  }
  // Apply synonym mapping token-wise
  const tokens = s.split(' ').map(t => synonymMap[t] || t);
  return tokens.join(' ');
}
