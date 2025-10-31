export const COMPANY_TYPE_VALUES = [
  'LISTED',
  'STATE_OWNED',
  'LARGE',
] as const;

export type CompanyType = typeof COMPANY_TYPE_VALUES[number];

export const COMPANY_TYPE_LABEL_KEYS: Record<CompanyType, string> = {
  LISTED: 'company_type_option_listed',
  STATE_OWNED: 'company_type_option_state_owned',
  LARGE: 'company_type_option_large',
};

export const COMPANY_TYPE_FIELD_LABEL_KEY = 'company_type';

export function isCompanyType(value: string): value is CompanyType {
  return (COMPANY_TYPE_VALUES as readonly string[]).includes(value);
}

export function toCompanyType(value: string): CompanyType | null {
  return isCompanyType(value) ? (value as CompanyType) : null;
}
