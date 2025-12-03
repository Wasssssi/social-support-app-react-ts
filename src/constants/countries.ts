export const COMMON_COUNTRIES = [
	'United Arab Emirates',
	'Saudi Arabia',
	'United States',
	'United Kingdom',
	'India',
	'Pakistan',
	'Bangladesh',
	'Egypt',
	'Jordan',
	'Kuwait',
	'Qatar',
	'Oman',
	'Bahrain',
	'Lebanon',
	'Syria',
	'Yemen',
	'Iraq',
	'Iran',
	'Turkey',
	'Canada',
	'Australia',
	'France',
	'Germany',
	'Italy',
	'Spain',
	'Other',
] as const;

export type PhoneOption = {
	code: string;
	label: string;
	prefix: string;
};

export const PHONE_COUNTRY_OPTIONS: PhoneOption[] = [
	{ code: 'ae', label: 'United Arab Emirates (+971)', prefix: '+971' },
	{ code: 'sa', label: 'Saudi Arabia (+966)', prefix: '+966' },
	{ code: 'us', label: 'United States (+1)', prefix: '+1' },
	{ code: 'uk', label: 'United Kingdom (+44)', prefix: '+44' },
	{ code: 'in', label: 'India (+91)', prefix: '+91' },
] as const;

export const DEFAULT_PHONE_COUNTRY_CODE = '+971';

