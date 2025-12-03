import type { ApplicationData } from "../types";
import { DEFAULT_PHONE_COUNTRY_CODE } from "../constants/countries";
import { DEFAULT_CURRENCY } from "../constants/formOptions";

export const initialData: ApplicationData = {
	personal: {
		name: '',
		nationalId: { country: '', id: '' },
		dateOfBirth: '',
		gender: '',
		address: '',
		city: '',
		state: '',
		country: '',
		phone: { countryCode: DEFAULT_PHONE_COUNTRY_CODE, number: '' },
		email: '',
	},
	family: {
		maritalStatus: '',
		dependents: '',
		employmentStatus: '',
		monthlyIncome: '',
		currency: DEFAULT_CURRENCY,
		housingStatus: '',
	},
	situation: {
		currentFinancialSituation: '',
		employmentCircumstances: '',
		reasonForApplying: '',
	},
};