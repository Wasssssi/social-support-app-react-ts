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
		phone: '',
		email: '',
	},
	family: {
		maritalStatus: '',
		dependents: '',
		employmentStatus: '',
		monthlyIncome: '',
		housingStatus: '',
	},
	situation: {
		currentFinancialSituation: '',
		employmentCircumstances: '',
		reasonForApplying: '',
	},
};