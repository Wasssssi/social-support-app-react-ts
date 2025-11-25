import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { t } from '../../i18n';
import type { ApplicationData, Locale } from '../../types';
import FormField from '../FormField';
import FormButtons from '../FormButtons';
import HelpMeWriteModal from '../HelpMeWriteModal';
import { makePrompt } from '../../utils/prompts';

type Step3Props = {
	data: ApplicationData;
	onChange: (d: Partial<ApplicationData>) => void;
	onBack: () => void;
	onSubmit: () => void;
	locale: Locale;
	isRtl: boolean;
	submitting?: boolean;
};

export default function Step3({ data, onChange, onBack, onSubmit, locale, isRtl, submitting }: Step3Props) {
	const s = data.situation;
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		getValues,
		trigger,
	} = useForm({ defaultValues: s, mode: 'onBlur' });
	const [modalOpen, setModalOpen] = useState<null | 'financial' | 'employment' | 'reason'>(null);

	useEffect(() => {
		reset(s);
	}, [s, reset]);

	function handleAccept(field: keyof typeof s, text: string) {
		const clean = text.trim();
		setValue(field, clean, { shouldDirty: true, shouldValidate: true });
		trigger(field);
		const next = { ...getValues(), [field]: clean };
		onChange({ situation: next });
		setModalOpen(null);
	}

	const getFieldName = (): keyof typeof s => {
		if (modalOpen === 'financial') return 'currentFinancialSituation';
		if (modalOpen === 'employment') return 'employmentCircumstances';
		return 'reasonForApplying';
	};

	return (
		<section aria-labelledby="s3" dir={isRtl ? 'rtl' : 'ltr'}>
			<h3 id="s3" className="mt-0 text-base font-semibold text-white tracking-wide">
				{t(locale, 'step3')}
			</h3>
			<form
				onSubmit={handleSubmit(values => {
					onChange({ situation: values as any });
					onSubmit();
				})}
				className="space-y-5"
			>
				<div className="flex flex-col gap-4">
					<FormField label={t(locale, 'currentFinancialSituation')}>
						<textarea
							rows={4}
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 min-h-[96px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('currentFinancialSituation', { required: t(locale, 'required') })}
						/>
						{errors.currentFinancialSituation && (
							<span className="text-red-300 text-xs mt-1">{errors.currentFinancialSituation.message as string}</span>
						)}
						<button
							type="button"
							className="bg-transparent border-none text-emerald-400 underline text-xs font-medium cursor-pointer self-start mt-1 hover:text-emerald-300"
							onClick={() => setModalOpen('financial')}
						>
							{t(locale, 'helpMeWrite')}
						</button>
					</FormField>
					<FormField label={t(locale, 'employmentCircumstances')}>
						<textarea
							rows={4}
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 min-h-[96px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('employmentCircumstances', { required: t(locale, 'required') })}
						/>
						{errors.employmentCircumstances && (
							<span className="text-red-300 text-xs mt-1">{errors.employmentCircumstances.message as string}</span>
						)}
						<button
							type="button"
							className="bg-transparent border-none text-emerald-400 underline text-xs font-medium cursor-pointer self-start mt-1 hover:text-emerald-300"
							onClick={() => setModalOpen('employment')}
						>
							{t(locale, 'helpMeWrite')}
						</button>
					</FormField>
					<FormField label={t(locale, 'reasonForApplying')}>
						<textarea
							rows={4}
							className="border border-white/30 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 min-h-[96px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
							{...register('reasonForApplying', { required: t(locale, 'required') })}
						/>
						{errors.reasonForApplying && (
							<span className="text-red-300 text-xs mt-1">{errors.reasonForApplying.message as string}</span>
						)}
						<button
							type="button"
							className="bg-transparent border-none text-emerald-400 underline text-xs font-medium cursor-pointer self-start mt-1 hover:text-emerald-300"
							onClick={() => setModalOpen('reason')}
						>
							{t(locale, 'helpMeWrite')}
						</button>
					</FormField>
				</div>
				<FormButtons onBack={onBack} locale={locale} />
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={submitting}
						className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors disabled:opacity-50"
					>
						{submitting ? '...' : t(locale, 'submit')}
					</button>
				</div>
			</form>
			<HelpMeWriteModal
				open={modalOpen !== null}
				onClose={() => setModalOpen(null)}
				onAccept={(text) => handleAccept(getFieldName(), text)}
				seedPrompt={makePrompt(locale, data)}
			/>
		</section>
	);
}

