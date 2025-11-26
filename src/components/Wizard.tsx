import { useState } from 'react';
import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';
import ProgressBar from './ProgressBar';
import StatusMessage from './StatusMessage';
import LocaleSwitcher from './LocaleSwitcher';
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
		<div className="w-full max-w-5xl mx-auto px-4 sm:px-12 py-10 bg-slate-900/60 text-white rounded-none sm:rounded-3xl border border-white/10 shadow-[0_35px_80px_rgba(0,0,0,0.55)] backdrop-blur">
			<header className="flex flex-wrap items-center gap-3 mb-6">
				<h2 className="m-0 flex-1 text-white text-2xl font-semibold tracking-tight">{t(locale, 'appTitle')}</h2>
				<LocaleSwitcher current={locale} onChange={next => setLocale(next)} />
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
