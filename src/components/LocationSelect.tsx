import { useMemo } from 'react';
import { locations } from '../data/locations';
import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';

type Props = {
	country: string;
	state: string;
	city: string;
	onChange: (value: { country: string; state: string; city: string }) => void;
	errors?: { country?: string; state?: string; city?: string };
};

export default function LocationSelect({ country, state, city, onChange, errors }: Props) {
	const { locale } = useFormContextSafe();

	const selectedCountry = useMemo(
		() => locations.find(loc => loc.name === country) ?? locations[0],
		[country],
	);

	const selectedState = useMemo(
		() => selectedCountry.states.find(st => st.name === state) ?? selectedCountry.states[0],
		[selectedCountry, state],
	);

	function handleCountryChange(nextCountry: string) {
		const countryObj = locations.find(loc => loc.name === nextCountry) ?? locations[0];
		const defaultState = countryObj.states[0];
		onChange({
			country: countryObj.name,
			state: defaultState?.name ?? '',
			city: defaultState?.cities[0] ?? '',
		});
	}

	function handleStateChange(nextState: string) {
		const stateObj = selectedCountry.states.find(st => st.name === nextState) ?? selectedCountry.states[0];
		onChange({
			country: selectedCountry.name,
			state: stateObj?.name ?? '',
			city: stateObj?.cities[0] ?? '',
		});
	}

	function handleCityChange(nextCity: string) {
		onChange({
			country: selectedCountry.name,
			state: selectedState.name,
			city: nextCity,
		});
	}

	return (
		<div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-semibold tracking-tight text-white">{t(locale, 'country')}</span>
				<select
					className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
					value={country || selectedCountry.name}
					onChange={e => handleCountryChange(e.target.value)}
					aria-label={t(locale, 'country')}
				>
					{locations.map(loc => (
						<option key={loc.name} value={loc.name} className="text-slate-900">
							{loc.name}
						</option>
					))}
				</select>
				{errors?.country && <span className="text-red-300 text-xs mt-1">{errors.country}</span>}
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-semibold tracking-tight text-white">{t(locale, 'state')}</span>
				<select
					className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
					value={state || selectedState.name}
					onChange={e => handleStateChange(e.target.value)}
					aria-label={t(locale, 'state')}
				>
					{selectedCountry.states.map(st => (
						<option key={st.name} value={st.name} className="text-slate-900">
							{st.name}
						</option>
					))}
				</select>
				{errors?.state && <span className="text-red-300 text-xs mt-1">{errors.state}</span>}
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-semibold tracking-tight text-white">{t(locale, 'city')}</span>
				<select
					className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
					value={city || selectedState.cities[0]}
					onChange={e => handleCityChange(e.target.value)}
					aria-label={t(locale, 'city')}
				>
					{selectedState.cities.map(cityName => (
						<option key={cityName} value={cityName} className="text-slate-900">
							{cityName}
						</option>
					))}
				</select>
				{errors?.city && <span className="text-red-300 text-xs mt-1">{errors.city}</span>}
			</div>
		</div>
	);
}


