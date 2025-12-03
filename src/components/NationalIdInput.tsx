import { useMemo } from 'react';
import { t } from '../i18n';
import { useFormContextSafe } from '../context/FormContext';
import { locations } from '../data/locations';
import { COMMON_COUNTRIES } from '../constants/countries';

export type NationalIdValue = {
	country: string;
	id: string;
};

type Props = {
	value: NationalIdValue;
	onChange: (value: NationalIdValue) => void;
	error?: string;
};

export default function NationalIdInput({ value, onChange, error }: Props) {
	const { locale } = useFormContextSafe();
	
	const countryOptions = useMemo(() => {
		const locationCountries = locations.map(loc => loc.name);
		const allCountries = [...new Set([...COMMON_COUNTRIES, ...locationCountries])];
		return allCountries.sort();
	}, []);

	function handleCountryChange(country: string) {
		onChange({ country, id: value.id });
	}

	function handleIdChange(id: string) {
		onChange({ ...value, id });
	}

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex gap-2">
				<select
					className="w-48 sm:w-56 border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
					value={value.country || ''}
					onChange={e => handleCountryChange(e.target.value)}
					aria-label={t(locale, 'nationalIdCountry')}
				>
					<option value="" className="text-slate-900">{t(locale, 'selectCountry')}</option>
					{countryOptions.map(country => (
						<option key={country} value={country} className="text-slate-900">
							{country}
						</option>
					))}
				</select>
				<input
					className="flex-1 border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
					value={value.id || ''}
					onChange={e => handleIdChange(e.target.value)}
					placeholder={t(locale, 'nationalIdPlaceholder')}
					aria-label={t(locale, 'nationalId')}
				/>
			</div>
			{error && <span className="text-red-300 text-xs mt-1">{error}</span>}
		</div>
	);
}

