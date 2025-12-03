import type { ApplicationData, Locale } from '../types';
import { AI_PROMPT_BASE_EN, AI_PROMPT_BASE_AR, DEFAULT_FALLBACK_VALUE } from '../constants/prompts';

export function makePrompt(locale: Locale, data: ApplicationData): string {
	const base = locale === 'ar' ? AI_PROMPT_BASE_AR : AI_PROMPT_BASE_EN;
	
	const personal = `${data.personal.name || DEFAULT_FALLBACK_VALUE}, ${data.personal.city || DEFAULT_FALLBACK_VALUE}, ${data.personal.country || DEFAULT_FALLBACK_VALUE}`;
	
	const financial = `marital=${data.family.maritalStatus || DEFAULT_FALLBACK_VALUE}, dependents=${data.family.dependents || '0'}, employment=${data.family.employmentStatus || DEFAULT_FALLBACK_VALUE}, income=${data.family.monthlyIncome || '0'} ${data.family.currency || ''}, housing=${data.family.housingStatus || DEFAULT_FALLBACK_VALUE}`;
	
	return `${base}
Personal: ${personal}.
Family/Financial: ${financial}.
Needs: mention hardship and specific assistance requested in a respectful tone.`;
}

