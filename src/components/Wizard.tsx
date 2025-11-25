import { useState } from 'react';
import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';
import type { Locale } from '../types';
import ProgressBar from './ProgressBar';
import StatusMessage from './StatusMessage';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import ConfirmationStep from './steps/ConfirmationStep';
import { submitApplication } from '../services/mockApi';

export default function Wizard() {
	const { data, updateData, step, setStep, reset, locale, setLocale } = useFormContextSafe();
	const [submitting, setSubmitting] = useState(false);
	const [status, setStatus] = useState<'success' | 'error' | null>(null);
	const [showConfirmation, setShowConfirmation] = useState(false);

	async function handleSubmit() {
		setSubmitting(true);
		setStatus(null);
		try {
			await submitApplication(data);
			setShowConfirmation(true);
		} catch {
			setStatus('error');
		} finally {
			setSubmitting(false);
		}
	}

	function handleRestart() {
		reset();
		setStatus(null);
		setShowConfirmation(false);
		setStep(1);
	}

	return (
		<div className="w-full max-w-5xl mx-auto px-8 sm:px-12 py-10 bg-slate-900/60 text-white rounded-3xl border border-white/10 shadow-[0_35px_80px_rgba(0,0,0,0.55)] backdrop-blur">
			<header className="flex flex-wrap items-center gap-3 mb-6">
				<h2 className="m-0 flex-1 text-white text-2xl font-semibold tracking-tight">{t(locale, 'appTitle')}</h2>
				<label htmlFor="lang" className="text-sm text-white/80">
					{t(locale, 'language')}
				</label>
				<select
					id="lang"
					aria-label={t(locale, 'language')}
					value={locale}
					onChange={e => setLocale(e.target.value as Locale)}
					className="rounded-md border border-white/30 bg-white/10 text-white text-sm px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
				>
					<option value="en">{t(locale, 'english')}</option>
					<option value="ar">{t(locale, 'arabic')}</option>
				</select>
			</header>
			<ProgressBar />
			<div className="mt-3 space-y-4">
				{showConfirmation ? (
					<ConfirmationStep data={data} locale={locale} onRestart={handleRestart} />
				) : (
					<>
						{step === 1 && (
							<Step1 data={data} onChange={updateData} onNext={() => setStep(2)} locale={locale} isRtl={locale === 'ar'} />
						)}
						{step === 2 && (
							<Step2
								data={data}
								onChange={updateData}
								onBack={() => setStep(1)}
								onNext={() => setStep(3)}
								locale={locale}
								isRtl={locale === 'ar'}
							/>
						)}
						{step === 3 && (
							<Step3
								data={data}
								onChange={updateData}
								onBack={() => setStep(2)}
								onSubmit={handleSubmit}
								locale={locale}
								isRtl={locale === 'ar'}
								submitting={submitting}
							/>
						)}
					</>
				)}
			</div>
			{status === 'error' && <StatusMessage type="error" locale={locale} />}
		</div>
	);
}
