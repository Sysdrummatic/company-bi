export const COUNTRY_CODE_MAP: Record<string, string> = {
  Poland: 'PL',
  Germany: 'DE',
  'United Kingdom': 'GB',
  'United States': 'US',
  France: 'FR',
  Netherlands: 'NL',
  Canada: 'CA',
  Australia: 'AU',
};

export const countryNameToCode = (countryName: string) => {
  return COUNTRY_CODE_MAP[countryName] || countryName;
};

export const countryCodeToName = (code: string) => {
  const match = Object.entries(COUNTRY_CODE_MAP).find(([, value]) => value === code);
  return match ? match[0] : code;
};
