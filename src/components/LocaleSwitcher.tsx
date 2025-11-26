import { t } from '../i18n';
import type { Locale } from '../types';

type LocaleSwitcherProps = {
	current: Locale;
	onChange: (locale: Locale) => void;
};

const locales: Locale[] = ['en', 'ar'];

export default function LocaleSwitcher({ current, onChange }: LocaleSwitcherProps) {
	return (
		<div className="inline-flex items-center gap-2">
			<span className="text-sm text-white/70">{t(current, 'language')}</span>
			<div className="inline-flex rounded-full border border-white/20 bg-white/10 p-0.5">
				{locales.map(locale => {
					const active = locale === current;
					return (
						<button
							key={locale}
							type="button"
							onClick={() => onChange(locale)}
							className={`px-3 py-1 text-xs font-semibold tracking-wide rounded-full transition-all ${
								active
									? 'bg-white text-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.25)]'
									: 'text-white/70 hover:text-white'
							}`}
							aria-pressed={active}
						>
							{locale.toUpperCase()}
						</button>
					);
				})}
			</div>
		</div>
	);
}

