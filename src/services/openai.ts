import { http } from './http';

export async function generateText(
	apiKey: string,
	prompt: string,
	signal?: AbortSignal,
): Promise<string> {
	const res = await http.post(
		'https://api.openai.com/v1/chat/completions',
		{
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You help citizens write brief, clear descriptions for a government social support application.',
				},
				{ role: 'user', content: prompt },
			],
			temperature: 0.7,
		},
		{
			signal,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		},
	);
	const text = (res.data as any)?.choices?.[0]?.message?.content?.trim();
	if (!text) throw new Error('Empty AI response');
	return text;
}


