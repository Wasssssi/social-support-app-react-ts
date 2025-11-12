import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';
import type { ApplicationData } from '../types';
import ProgressBar from './ProgressBar';
import HelpMeWriteModal from './HelpMeWriteModal';
import { submitApplication } from '../services/mockApi';

export default function Wizard() {
	const { data, updateData, step, setStep, reset, locale, setLocale, isRtl } = useFormContextSafe();
	const [submitting, setSubmitting] = useState(false);
	const [status, setStatus] = useState<string | null>(null);

	async function onSubmit() {
		setSubmitting(true);
		setStatus(null);
		try {
			await submitApplication(data);
			setStatus('success');
			reset();
			// keep step 1 after reset
			setStep(1);
		} catch {
			setStatus('error');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="max-w-[960px] my-6 mx-auto px-8 py-10 bg-white rounded-[20px] shadow-[0_24px_48px_rgba(15,23,42,0.08)] border border-slate-200/25">
			<header className="flex items-center gap-3 mb-6">
				<h2 className="m-0 flex-1 text-slate-900">{t(locale, 'appTitle')}</h2>
				<label htmlFor="lang" className="text-sm text-slate-600">
					{t(locale, 'language')}
				</label>
				<select
					id="lang"
					aria-label={t(locale, 'language')}
					value={locale}
					onChange={e => setLocale(e.target.value as any)}
					className="rounded-lg border border-blue-200 px-2.5 py-2 bg-slate-50"
				>
					<option value="en">{t(locale, 'english')}</option>
					<option value="ar">{t(locale, 'arabic')}</option>
				</select>
			</header>
			<ProgressBar />
			<div className="mt-4">
				{step === 1 && (
					<Step1
						data={data}
						onChange={updateData}
						onNext={() => setStep(2)}
						locale={locale}
						isRtl={isRtl}
					/>
				)}
				{step === 2 && (
					<Step2
						data={data}
						onChange={updateData}
						onBack={() => setStep(1)}
						onNext={() => setStep(3)}
						locale={locale}
						isRtl={isRtl}
					/>
				)}
				{step === 3 && (
					<Step3
						data={data}
						onChange={updateData}
						onBack={() => setStep(2)}
						onSubmit={onSubmit}
						locale={locale}
						isRtl={isRtl}
						submitting={submitting}
					/>
				)}
			</div>
			{status === 'success' && (
				<div role="status" className="mt-3 bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-md">
					{t(locale, 'submitSuccess')}
				</div>
			)}
			{status === 'error' && (
				<div role="alert" className="mt-3 bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-md">
					{t(locale, 'submitError')}
				</div>
			)}
		</div>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-sm text-gray-700">{label}</span>
			{children}
		</label>
	);
}

function Row({ children }: { children: React.ReactNode }) {
	return <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">{children}</div>;
}

function Buttons({
	onBack,
	onNext,
	onSubmit,
	locale,
	submitting,
}: {
	onBack?: () => void;
	onNext?: () => void;
	onSubmit?: () => void;
	locale: string;
	submitting?: boolean;
}) {
	return (
		<div className="flex gap-2 mt-4">
			{onBack && (
				<button onClick={onBack} className="bg-white border border-blue-200 text-slate-800 px-[18px] py-2.5 rounded-full cursor-pointer hover:bg-slate-50 transition-colors">
					{t(locale as any, 'back')}
				</button>
			)}
			<div className="flex-1" />
			{onNext && (
				<button onClick={onNext} className="bg-blue-600 border border-blue-700 text-white px-[18px] py-2.5 rounded-full cursor-pointer shadow-[0_10px_18px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-colors">
					{t(locale as any, 'next')}
				</button>
			)}
			{onSubmit && (
				<button onClick={onSubmit} disabled={submitting} className="bg-blue-600 border border-blue-700 text-white px-[18px] py-2.5 rounded-full cursor-pointer shadow-[0_10px_18px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
					{submitting ? '...' : t(locale as any, 'submit')}
				</button>
			)}
		</div>
	);
}

function Step1({
	data,
	onChange,
	onNext,
	locale,
	isRtl,
}: {
	data: ApplicationData;
	onChange: (d: Partial<ApplicationData>) => void;
	onNext: () => void;
	locale: any;
	isRtl: boolean;
}) {
	const p = data.personal;
	const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: p });
	function submit(values: typeof p) {
		onChange({ personal: values });
		onNext();
	}
	return (
		<section aria-labelledby="s1">
			<h3 id="s1" className="mt-0">{t(locale, 'step1')}</h3>
			<div className="flex flex-col gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
				<form onSubmit={handleSubmit(submit)}>
				<Row>
					<Field label={t(locale, 'name')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('name', { required: true })} />
						{errors.name && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'nationalId')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('nationalId', { required: true })} />
						{errors.nationalId && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'dateOfBirth')}>
						<input type="date" className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('dateOfBirth', { required: true })} />
						{errors.dateOfBirth && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'gender')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('gender', { required: true })} />
						{errors.gender && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
				</Row>
				<Row>
					<Field label={t(locale, 'address')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('address', { required: true })} />
						{errors.address && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'city')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('city', { required: true })} />
						{errors.city && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'state')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('state', { required: true })} />
						{errors.state && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'country')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('country', { required: true })} />
						{errors.country && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
				</Row>
				<Row>
					<Field label={t(locale, 'phone')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('phone', { required: true })} />
						{errors.phone && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'email')}>
						<input type="email" className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('email', { required: true })} />
						{errors.email && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
				</Row>
				<Buttons onNext={undefined} locale={locale} />
				<div className="flex justify-end mt-4">
					<button type="submit" className="bg-blue-600 border border-blue-700 text-white px-[18px] py-2.5 rounded-full cursor-pointer shadow-[0_10px_18px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-colors">
						{t(locale as any, 'next')}
					</button>
				</div>
				</form>
			</div>
		</section>
	);
}

function Step2({
	data,
	onChange,
	onBack,
	onNext,
	locale,
	isRtl,
}: {
	data: ApplicationData;
	onChange: (d: Partial<ApplicationData>) => void;
	onBack: () => void;
	onNext: () => void;
	locale: any;
	isRtl: boolean;
}) {
	const f = data.family;
	const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: f });
	function submit(values: typeof f) {
		onChange({ family: { ...values, dependents: values.dependents === '' ? '' : Number(values.dependents), monthlyIncome: values.monthlyIncome === '' ? '' : Number(values.monthlyIncome) } });
		onNext();
	}
	return (
		<section aria-labelledby="s2">
			<h3 id="s2" className="mt-0">{t(locale, 'step2')}</h3>
			<div className="flex flex-col gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
				<form onSubmit={handleSubmit(submit)}>
				<Row>
					<Field label={t(locale, 'maritalStatus')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('maritalStatus', { required: true })} />
						{errors.maritalStatus && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'dependents')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" inputMode="numeric" {...register('dependents', { required: true })} />
						{errors.dependents && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'employmentStatus')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('employmentStatus', { required: true })} />
						{errors.employmentStatus && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
					<Field label={t(locale, 'monthlyIncome')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" inputMode="decimal" {...register('monthlyIncome', { required: true })} />
						{errors.monthlyIncome && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
				</Row>
				<Row>
					<Field label={t(locale, 'housingStatus')}>
						<input className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('housingStatus', { required: true })} />
						{errors.housingStatus && <span className="text-red-700 text-xs">{t(locale, 'required')}</span>}
					</Field>
				</Row>
				<Buttons onBack={onBack} locale={locale} />
				<div className="flex justify-end mt-4">
					<button type="submit" className="bg-blue-600 border border-blue-700 text-white px-[18px] py-2.5 rounded-full cursor-pointer shadow-[0_10px_18px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-colors">
						{t(locale as any, 'next')}
					</button>
				</div>
				</form>
			</div>
		</section>
	);
}

function Step3({
	data,
	onChange,
	onBack,
	onSubmit,
	locale,
	isRtl,
	submitting,
}: {
	data: ApplicationData;
	onChange: (d: Partial<ApplicationData>) => void;
	onBack: () => void;
	onSubmit: () => void;
	locale: any;
	isRtl: boolean;
	submitting?: boolean;
}) {
	const s = data.situation;
	const { register, handleSubmit, reset, setValue } = useForm({ defaultValues: s });
	const [modalOpen, setModalOpen] = useState<null | 'financial' | 'employment' | 'reason'>(null);

	useEffect(() => {
		reset(s);
	}, [s, reset]);

	function handleAccept(field: keyof typeof s, text: string) {
		setValue(field, text, { shouldDirty: true });
		onChange({ situation: { ...s, [field]: text } });
		setModalOpen(null);
	}

	return (
		<section aria-labelledby="s3">
			<h3 id="s3" className="mt-0">{t(locale, 'step3')}</h3>
			<form
				onSubmit={handleSubmit(values => {
					onChange({ situation: values as any });
					onSubmit();
				})}
			>
				<div className="flex flex-col gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
					<Field label={t(locale, 'currentFinancialSituation')}>
						<textarea rows={4} className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 min-h-[96px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('currentFinancialSituation', { required: true })} defaultValue={s.currentFinancialSituation} />
						<button type="button" className="bg-transparent border-none text-blue-600 underline cursor-pointer self-start mt-1.5 hover:text-blue-700" onClick={() => setModalOpen('financial')}>
							{t(locale, 'helpMeWrite')}
						</button>
					</Field>
					<Field label={t(locale, 'employmentCircumstances')}>
						<textarea rows={4} className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 min-h-[96px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('employmentCircumstances', { required: true })} defaultValue={s.employmentCircumstances} />
						<button type="button" className="bg-transparent border-none text-blue-600 underline cursor-pointer self-start mt-1.5 hover:text-blue-700" onClick={() => setModalOpen('employment')}>
							{t(locale, 'helpMeWrite')}
						</button>
					</Field>
					<Field label={t(locale, 'reasonForApplying')}>
						<textarea rows={4} className="border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 text-slate-900 min-h-[96px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register('reasonForApplying', { required: true })} defaultValue={s.reasonForApplying} />
						<button type="button" className="bg-transparent border-none text-blue-600 underline cursor-pointer self-start mt-1.5 hover:text-blue-700" onClick={() => setModalOpen('reason')}>
							{t(locale, 'helpMeWrite')}
						</button>
					</Field>
				</div>
				<Buttons onBack={onBack} locale={locale} />
				<div className="flex justify-end mt-4">
					<button type="submit" disabled={submitting} className="bg-blue-600 border border-blue-700 text-white px-[18px] py-2.5 rounded-full cursor-pointer shadow-[0_10px_18px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						{submitting ? '...' : t(locale as any, 'submit')}
					</button>
				</div>
			</form>
			<HelpMeWriteModal
				open={modalOpen !== null}
				onClose={() => setModalOpen(null)}
				onAccept={(text) =>
					handleAccept(
						modalOpen === 'financial'
							? 'currentFinancialSituation'
							: modalOpen === 'employment'
							? 'employmentCircumstances'
							: 'reasonForApplying',
						text,
					)
				}
				seedPrompt={makePrompt(locale, data)}
			/>
		</section>
	);
}

function makePrompt(locale: 'en' | 'ar', data: ApplicationData): string {
	const base =
		locale === 'ar'
			? 'اكتب فقرة مختصرة وواضحة تصف حالتي لطلب الدعم الاجتماعي:'
			: 'Write a brief, clear paragraph for a social support application:';
	return `${base}
Personal: ${data.personal.name}, ${data.personal.city}, ${data.personal.country}.
Family/Financial: marital=${data.family.maritalStatus}, dependents=${data.family.dependents}, employment=${data.family.employmentStatus}, income=${data.family.monthlyIncome}, housing=${data.family.housingStatus}.
Needs: mention hardship and specific assistance requested in a respectful tone.`;
}
