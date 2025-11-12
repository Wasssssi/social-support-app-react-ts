import type { ApplicationData } from '../types';

export async function submitApplication(data: ApplicationData): Promise<{ ok: true }> {
	await new Promise(r => setTimeout(r, 600));
	if (Math.random() < 0.05) {
		throw new Error('Random failure');
	}
	console.log('Submitted application (mock):', data);
	return { ok: true };
}


