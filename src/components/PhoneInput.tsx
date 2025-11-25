import { useMemo } from 'react';
import { t } from '../i18n';
import { useFormContextSafe } from '../context/FormContext';

type PhoneOption = {
	code: string;
	label: string;
	prefix: string;
};

const DEFAULT_PHONE_OPTIONS: PhoneOption[] = [
	{ code: 'ae', label: 'United Arab Emirates (+971)', prefix: '+971' },
	{ code: 'sa', label: 'Saudi Arabia (+966)', prefix: '+966' },
	{ code: 'us', label: 'United States (+1)', prefix: '+1' },
	{ code: 'uk', label: 'United Kingdom (+44)', prefix: '+44' },
	{ code: 'in', label: 'India (+91)', prefix: '+91' },
];

export type PhoneValue = {
	countryCode: string;
	number: string;
};

type Props = {
	value: PhoneValue;
	onChange: (value: PhoneValue) => void;
	error?: string;
};

export default function PhoneInput({ value, onChange, error }: Props) {
	const { locale } = useFormContextSafe();
	const options = useMemo(() => DEFAULT_PHONE_OPTIONS, []);

	function handleCountryChange(prefix: string) {
		const selected = options.find(opt => opt.prefix === prefix) ?? options[0];
		onChange({ countryCode: selected.prefix, number: value.number });
	}

	function handleNumberChange(num: string) {
		onChange({ ...value, number: num });
	}

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex gap-2">
				<select
					className="w-44 border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
					value={value.countryCode}
					onChange={e => handleCountryChange(e.target.value)}
					aria-label={t(locale, 'phoneCountry')}
				>
					{options.map(opt => (
						<option key={opt.code} value={opt.prefix} className="text-slate-900">
							{opt.label}
						</option>
					))}
				</select>
				<input
					className="flex-1 border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
					value={value.number}
					onChange={e => handleNumberChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))}
					placeholder={t(locale, 'phonePlaceholder')}
					aria-label={t(locale, 'phone')}
				/>
			</div>
			{error && <span className="text-red-300 text-xs mt-1">{error}</span>}
		</div>
	);
}


