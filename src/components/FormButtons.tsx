import { t } from '../i18n';
import type { Locale } from '../types';

type FormButtonsProps = {
	onBack?: () => void;
	onNext?: () => void;
	onSubmit?: () => void;
	locale: Locale;
	submitting?: boolean;
};

export default function FormButtons({ onBack, onNext, onSubmit, locale, submitting }: FormButtonsProps) {
	return (
		<div className="flex flex-wrap gap-3 mt-5">
			{onBack && (
				<button
					type="button"
					onClick={onBack}
					className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
				>
					{t(locale, 'back')}
				</button>
			)}
			<div className="flex-1" />
			{onNext && (
				<button
					type="button"
					onClick={onNext}
					className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors"
				>
					{t(locale, 'next')}
				</button>
			)}
			{onSubmit && (
				<button
					type="button"
					onClick={onSubmit}
					disabled={submitting}
					className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors disabled:opacity-50"
				>
					{submitting ? '...' : t(locale, 'submit')}
				</button>
			)}
		</div>
	);
}

