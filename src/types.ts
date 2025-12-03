export type PhoneValue = {
	countryCode: string;
	number: string;
};

export type NationalIdValue = {
	country: string;
	id: string;
};

export type PersonalInfo = {
	name: string;
	nationalId: NationalIdValue;
	dateOfBirth: string;
	gender: string; //
	address: string;
	city: string;
	state: string;
	country: string;
	phone: PhoneValue;
	email: string;
};

export type FamilyFinancialInfo = {
	maritalStatus: string;
	dependents: number | '';
	employmentStatus: string;
	monthlyIncome: number | '';
	currency: string;
	housingStatus: string;
};

export type SituationDescriptions = {
	currentFinancialSituation: string;
	employmentCircumstances: string;
	reasonForApplying: string;
};

export type ApplicationData = {
	personal: PersonalInfo;
	family: FamilyFinancialInfo;
	situation: SituationDescriptions;
};

export type WizardStep = 1 | 2 | 3;

export type Locale = 'en' | 'ar';


