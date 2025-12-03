export const AI_PROMPT_BASE_EN = 'Write a brief, clear paragraph for a social support application:';

export const AI_PROMPT_BASE_AR = 'اكتب فقرة مختصرة وواضحة تصف حالتي لطلب الدعم الاجتماعي:';

export const AI_PROMPT_TEMPLATE = (base: string, personal: string, financial: string) =>
	`${base}
Personal: ${personal}.
Family/Financial: ${financial}.
Needs: mention hardship and specific assistance requested in a respectful tone.`;

export const DEFAULT_FALLBACK_VALUE = 'N/A';

