import { useForm } from 'react-hook-form';
import { t } from '../../i18n';
import type { ApplicationData, Locale } from '../../types';
import FormField from '../FormField';
import FormButtons from '../FormButtons';
import { maritalOptions, employmentOptions, housingOptions, currencyOptions, GRID_CLASS } from '../../constants/formOptions';

type Step2Props = {
	data: ApplicationData;
	onChange: (d: Partial<ApplicationData>) => void;
	onBack: () => void;
	onNext: () => void;
	locale: Locale;
	isRtl: boolean;
};

export default function Step2({ data, onChange, onBack, onNext, locale, isRtl }: Step2Props) {
	const f = data.family;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: f, mode: 'onBlur' });

	function submit(values: typeof f) {
		onChange({
			family: {
				...values,
				dependents: values.dependents === '' ? '' : Number(values.dependents),
				monthlyIncome: values.monthlyIncome === '' ? '' : Number(values.monthlyIncome),
			},
		});
		onNext();
	}

	return (
		<section aria-labelledby="s2" dir={isRtl ? 'rtl' : 'ltr'}>
			<h3 id="s2" className="mt-0 text-base font-semibold text-white tracking-wide">
				{t(locale, 'step2')}
			</h3>
			<form onSubmit={handleSubmit(submit)} className="space-y-5">
				<div className={GRID_CLASS}>
					<FormField label={t(locale, 'maritalStatus')}>
						<select
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('maritalStatus', { required: t(locale, 'required') })}
						>
							<option value="" className="text-slate-900">{t(locale, 'maritalStatus')}</option>
							{maritalOptions.map(option => (
								<option key={option.value} value={option.value} className="text-slate-900">
									{t(locale, option.labelKey as any)}
								</option>
							))}
						</select>
						{errors.maritalStatus && <span className="text-red-300 text-xs mt-1">{errors.maritalStatus.message as string}</span>}
					</FormField>
					<FormField label={t(locale, 'dependents')} hint={t(locale, 'dependentsHint')}>
						<input
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							inputMode="numeric"
							{...register('dependents', { required: t(locale, 'required') })}
						/>
						{errors.dependents && <span className="text-red-300 text-xs mt-1">{errors.dependents.message as string}</span>}
					</FormField>
					<FormField label={t(locale, 'employmentStatus')}>
						<select
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('employmentStatus', { required: t(locale, 'required') })}
						>
							<option value="" className="text-slate-900">{t(locale, 'employmentStatus')}</option>
							{employmentOptions.map(option => (
								<option key={option.value} value={option.value} className="text-slate-900">
									{t(locale, option.labelKey as any)}
								</option>
							))}
						</select>
						{errors.employmentStatus && (
							<span className="text-red-300 text-xs mt-1">{errors.employmentStatus.message as string}</span>
						)}
					</FormField>
					<FormField label={t(locale, 'monthlyIncome')} hint={t(locale, 'monthlyIncomeHint')}>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
							<select
								className="w-full sm:w-36 border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
								{...register('currency', { required: t(locale, 'required') })}
							>
								<option value="" className="text-slate-900">
									{t(locale, 'currency')}
								</option>
								{currencyOptions.map(option => (
									<option key={option.value} value={option.value} className="text-slate-900">
										{t(locale, option.labelKey as any)}
									</option>
								))}
							</select>
							<input
								className="flex-1 border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
								inputMode="decimal"
								{...register('monthlyIncome', { required: t(locale, 'required') })}
							/>
						</div>
						{errors.currency && <span className="text-red-300 text-xs mt-1">{errors.currency.message as string}</span>}
						{errors.monthlyIncome && <span className="text-red-300 text-xs mt-1">{errors.monthlyIncome.message as string}</span>}
					</FormField>
				</div>
				<div className="max-w-md">
					<FormField label={t(locale, 'housingStatus')}>
						<select
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('housingStatus', { required: t(locale, 'required') })}
						>
							<option value="" className="text-slate-900">{t(locale, 'housingStatus')}</option>
							{housingOptions.map(option => (
								<option key={option.value} value={option.value} className="text-slate-900">
									{t(locale, option.labelKey as any)}
								</option>
							))}
						</select>
						{errors.housingStatus && <span className="text-red-300 text-xs mt-1">{errors.housingStatus.message as string}</span>}
					</FormField>
				</div>
				<div className="flex justify-between">
					<FormButtons onBack={onBack} locale={locale} />
					<button type="submit" className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors">
						{t(locale, 'next')}
					</button>
				</div>
			</form>
		</section>
	);
}

