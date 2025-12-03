import type { ApplicationData } from '../types';
import { MOCK_API_DELAY_MS, MOCK_API_FAILURE_RATE } from '../constants/api';

export async function submitApplication(data: ApplicationData): Promise<{ ok: true }> {
	await new Promise(r => setTimeout(r, MOCK_API_DELAY_MS));
	if (Math.random() < MOCK_API_FAILURE_RATE) {
		throw new Error('Random failure');
	}
	console.log('Submitted application (mock):', data);
	return { ok: true };
}


