import { http } from './http';
import {
	OPENAI_API_URL,
	OPENAI_MODEL,
	OPENAI_TEMPERATURE,
	OPENAI_SYSTEM_MESSAGE,
	CONTENT_TYPE_JSON,
} from '../constants/api';

export async function generateText(
	apiKey: string,
	prompt: string,
	signal?: AbortSignal,
): Promise<string> {
	const res = await http.post(
		OPENAI_API_URL,
		{
			model: OPENAI_MODEL,
			messages: [
				{
					role: 'system',
					content: OPENAI_SYSTEM_MESSAGE,
				},
				{ role: 'user', content: prompt },
			],
			temperature: OPENAI_TEMPERATURE,
		},
		{
			signal,
			headers: {
				'Content-Type': CONTENT_TYPE_JSON,
				Authorization: `Bearer ${apiKey}`,
			},
		},
	);
	const text = (res.data as any)?.choices?.[0]?.message?.content?.trim();
	if (!text) throw new Error('Empty AI response');
	return text;
}


