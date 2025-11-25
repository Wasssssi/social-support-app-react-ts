import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useFormContextSafe } from '../../context/FormContext';
import { t } from '../../i18n';
import type { ApplicationData, Locale, PhoneValue } from '../../types';
import FormField from '../FormField';
import PhoneInput from '../PhoneInput';
import LocationSelect from '../LocationSelect';
import { genderOptions, GRID_CLASS } from '../../constants/formOptions';

type Step1Props = {
	data: ApplicationData;
	onChange: (d: Partial<ApplicationData>) => void;
	onNext: () => void;
	locale: Locale;
	isRtl: boolean;
};

export default function Step1({ data, onChange, onNext, locale, isRtl }: Step1Props) {
	const p = data.personal;
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		setValue,
		watch,
		trigger,
	} = useForm({ mode: 'onBlur', defaultValues: p });

	useEffect(() => {
		register('country', { required: t(locale, 'required') });
		register('state', { required: t(locale, 'required') });
		register('city', { required: t(locale, 'required') });
	}, [register, locale]);

	const [countryValue = p.country, stateValue = p.state, cityValue = p.city] = watch(['country', 'state', 'city']);

	function submit(values: typeof p) {
		onChange({ personal: values });
		onNext();
	}

	function handleLocationChange(next: { country: string; state: string; city: string }) {
		setValue('country', next.country, { shouldValidate: true });
		setValue('state', next.state, { shouldValidate: true });
		setValue('city', next.city, { shouldValidate: true });
		trigger(['country', 'state', 'city']);
	}

	return (
		<section aria-labelledby="s1" dir={isRtl ? 'rtl' : 'ltr'}>
			<h3 id="s1" className="mt-0 text-base font-semibold text-white tracking-wide">
				{t(locale, 'step1')}
			</h3>
			<form onSubmit={handleSubmit(submit)} className="space-y-5">
				<div className={GRID_CLASS}>
					<FormField label={t(locale, 'name')}>
						<input
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('name', { required: t(locale, 'required') })}
						/>
						{errors.name && <span className="text-red-300 text-xs mt-1">{errors.name.message as string}</span>}
					</FormField>
					<FormField label={t(locale, 'nationalId')}>
						<input
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('nationalId', { required: t(locale, 'required') })}
						/>
						{errors.nationalId && <span className="text-red-300 text-xs mt-1">{errors.nationalId.message as string}</span>}
					</FormField>
					<FormField label={t(locale, 'dateOfBirth')}>
						<input
							type="date"
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('dateOfBirth', { required: t(locale, 'required') })}
						/>
						{errors.dateOfBirth && <span className="text-red-300 text-xs mt-1">{errors.dateOfBirth.message as string}</span>}
					</FormField>
					<FormField label={t(locale, 'gender')}>
						<select
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('gender', { required: t(locale, 'required') })}
						>
							<option value="" className="text-slate-900">{t(locale, 'gender')}</option>
							{genderOptions.map(option => (
								<option key={option.value} value={option.value} className="text-slate-900">
									{t(locale, option.labelKey as any)}
								</option>
							))}
						</select>
						{errors.gender && <span className="text-red-300 text-xs mt-1">{errors.gender.message as string}</span>}
					</FormField>
				</div>

				<FormField label={t(locale, 'address')}>
					<textarea
						className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
						rows={2}
						{...register('address', { required: t(locale, 'required') })}
					/>
					{errors.address && <span className="text-red-300 text-xs mt-1">{errors.address.message as string}</span>}
				</FormField>

				<LocationSelect
					country={countryValue}
					state={stateValue}
					city={cityValue}
					onChange={handleLocationChange}
					errors={{
						country: errors.country?.message as string | undefined,
						state: errors.state?.message as string | undefined,
						city: errors.city?.message as string | undefined,
					}}
				/>
				<input type="hidden" {...register('country')} value={countryValue} readOnly />
				<input type="hidden" {...register('state')} value={stateValue} readOnly />
				<input type="hidden" {...register('city')} value={cityValue} readOnly />

				<div className={GRID_CLASS}>
					<FormField label={t(locale, 'phone')}>
						<Controller
							control={control}
							name="phone"
							rules={{
								validate: (value: PhoneValue) =>
									(value?.number?.length ?? 0) >= 6 || t(locale, 'phoneInvalid'),
							}}
							render={({ field, fieldState }) => (
								<PhoneInput value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
							)}
						/>
					</FormField>
					<FormField label={t(locale, 'email')}>
						<input
							type="email"
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('email', {
								required: t(locale, 'required'),
								pattern: { value: /^\S+@\S+\.\S+$/, message: t(locale, 'required') },
							})}
						/>
						{errors.email && <span className="text-red-300 text-xs mt-1">{errors.email.message as string}</span>}
					</FormField>
				</div>

				<div className="flex justify-end">
					<button type="submit" className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors">
						{t(locale, 'next')}
					</button>
				</div>
			</form>
		</section>
	);
}

