import { useEffect, useRef, useState } from 'react';
import { generateText } from '../services/openai';
import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';

type Props = {
	open: boolean;
	onClose: () => void;
	onAccept: (text: string) => void;
	seedPrompt: string;
};

export default function HelpMeWriteModal({ open, onClose, onAccept, seedPrompt }: Props) {
	const { locale } = useFormContextSafe();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [text, setText] = useState('');
	const controller = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!open) {
			setText('');
			setError(null);
			controller.current?.abort();
			controller.current = null;
		}
	}, [open]);

	async function handleGenerate() {
		setLoading(true);
		setError(null);
		const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
		if (!apiKey) {
			setError('Missing VITE_OPENAI_API_KEY');
			setLoading(false);
			return;
		}
		const c = new AbortController();
		controller.current = c;
		try {
			const suggestion = await generateText(
				apiKey,
				seedPrompt,
				c.signal,
			);
			setText(suggestion);
		} catch (e) {
			console.error(e);
			setError(t(locale, 'aiError'));
		} finally {
			setLoading(false);
		}
	}

	if (!open) return null;

	return (
		<div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg p-4 max-w-3xl w-full shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
				<div className="flex justify-between items-center">
					<h3 className="m-0">{t(locale, 'aiSuggestion')}</h3>
					<button onClick={onClose} aria-label={t(locale, 'cancel')} className="bg-transparent border-none text-xl leading-none cursor-pointer hover:opacity-70">
						×
					</button>
				</div>
				<div className="mt-3">
					{error && (
						<div className="bg-red-50 text-red-800 border border-red-200 p-2 rounded-md mb-2">
							{error}
						</div>
					)}
					<textarea
						aria-label="suggestion"
						value={text}
						onChange={e => setText(e.target.value)}
						rows={8}
						className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="..."
					/>
				</div>
				<div className="flex gap-2 mt-3">
					<button onClick={handleGenerate} disabled={loading} className="bg-gray-100 border border-gray-200 text-gray-900 px-3.5 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? '...' : t(locale, 'generate')}
					</button>
					<div className="flex-1" />
					<button onClick={() => onAccept(text)} disabled={!text} className="bg-blue-600 border-none text-white px-3.5 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						{t(locale, 'accept')}
					</button>
					<button onClick={onClose} className="bg-gray-100 border border-gray-200 text-gray-900 px-3.5 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
						{t(locale, 'discard')}
					</button>
				</div>
			</div>
		</div>
	);
}
