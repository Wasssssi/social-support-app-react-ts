import { t } from '../i18n';
import type { Locale } from '../types';

type StatusMessageProps = {
	type: 'success' | 'error';
	locale: Locale;
};

export default function StatusMessage({ type, locale }: StatusMessageProps) {
	const isSuccess = type === 'success';
	return (
		<div
			role={isSuccess ? 'status' : 'alert'}
			className={`mt-4 ${
				isSuccess
					? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-100'
					: 'bg-red-500/20 border border-red-400/30 text-red-100'
			} p-3 rounded-lg text-sm`}
		>
			{t(locale, isSuccess ? 'submitSuccess' : 'submitError')}
		</div>
	);
}

