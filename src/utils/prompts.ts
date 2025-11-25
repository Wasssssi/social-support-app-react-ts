import type { ApplicationData, Locale } from '../types';

export function makePrompt(locale: Locale, data: ApplicationData): string {
	const base =
		locale === 'ar'
			? 'اكتب فقرة مختصرة وواضحة تصف حالتي لطلب الدعم الاجتماعي:'
			: 'Write a brief, clear paragraph for a social support application:';
	return `${base}
Personal: ${data.personal.name || 'N/A'}, ${data.personal.city || 'N/A'}, ${data.personal.country || 'N/A'}.
Family/Financial: marital=${data.family.maritalStatus || 'N/A'}, dependents=${data.family.dependents || '0'}, employment=${data.family.employmentStatus || 'N/A'}, income=${data.family.monthlyIncome || '0'} ${data.family.currency || ''}, housing=${data.family.housingStatus || 'N/A'}.
Needs: mention hardship and specific assistance requested in a respectful tone.`;
}

