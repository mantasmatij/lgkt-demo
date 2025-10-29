export const lt = {
  common: {
    language: 'Kalba',
    lithuanian: 'Lietuvių',
    english: 'Anglų',
  },
  home: {
    title: 'LGKT Forma - Įmonių ataskaitos',
    welcome: 'Sveiki atvykę',
  },
} as const;

export type LtDict = typeof lt;
