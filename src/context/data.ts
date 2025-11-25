import type { ApplicationData } from "../types";

export const initialData: ApplicationData = {
	personal: {
		name: '',
		nationalId: '',
		dateOfBirth: '',
		gender: '',
		address: '',
		city: '',
		state: '',
		country: '',
		phone: { countryCode: '+971', number: '' },
		email: '',
	},
	family: {
		maritalStatus: '',
		dependents: '',
		employmentStatus: '',
		monthlyIncome: '',
		currency: 'AED',
		housingStatus: '',
	},
	situation: {
		currentFinancialSituation: '',
		employmentCircumstances: '',
		reasonForApplying: '',
	},
};