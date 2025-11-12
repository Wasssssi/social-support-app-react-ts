export type PersonalInfo = {
	name: string;
	nationalId: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	city: string;
	state: string;
	country: string;
	phone: string;
	email: string;
};

export type FamilyFinancialInfo = {
	maritalStatus: string;
	dependents: number | '';
	employmentStatus: string;
	monthlyIncome: number | '';
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


