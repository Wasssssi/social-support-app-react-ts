export const genderOptions = [
	{ value: 'male', labelKey: 'genderMale' },
	{ value: 'female', labelKey: 'genderFemale' },
] as const;

export const maritalOptions = [
	{ value: 'single', labelKey: 'maritalSingle' },
	{ value: 'married', labelKey: 'maritalMarried' },
	{ value: 'other', labelKey: 'maritalOther' },
] as const;

export const employmentOptions = [
	{ value: 'full_time', labelKey: 'employmentEmployed' },
	{ value: 'part_time', labelKey: 'employmentPartTime' },
	{ value: 'unemployed', labelKey: 'employmentUnemployed' },
] as const;

export const housingOptions = [
	{ value: 'own', labelKey: 'housingOwn' },
	{ value: 'rent', labelKey: 'housingRent' },
	{ value: 'family', labelKey: 'housingFamily' },
] as const;

export const currencyOptions = [
	{ value: 'AED', labelKey: 'currencyAED' },
	{ value: 'SAR', labelKey: 'currencySAR' },
	{ value: 'USD', labelKey: 'currencyUSD' },
] as const;

export const GRID_CLASS = 'grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2';

// Default values
export const DEFAULT_CURRENCY = 'AED';
export const DEFAULT_LOCALE: 'en' | 'ar' = 'en';

