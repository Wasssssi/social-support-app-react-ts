import { t } from '../../i18n';
import type { ApplicationData, Locale } from '../../types';

type ConfirmationStepProps = {
	data: ApplicationData;
	locale: Locale;
	onRestart: () => void;
};

export default function ConfirmationStep({ data, locale, onRestart }: ConfirmationStepProps) {
	return (
		<section aria-live="polite">
			<div className="text-center space-y-3">
				<p className="text-emerald-300 text-sm tracking-wide uppercase">{t(locale, 'submitSuccess')}</p>
				<h3 className="text-2xl font-semibold m-0">{t(locale, 'confirmationTitle')}</h3>
				<p className="text-white/80 max-w-2xl mx-auto">{t(locale, 'confirmationSubtitle')}</p>
			</div>
			<div className="mt-8 grid gap-6 md:grid-cols-3">
				<SummaryCard title={t(locale, 'summaryPersonal')}>
					<SummaryItem label={t(locale, 'name')} value={data.personal.name} />
					<SummaryItem 
						label={t(locale, 'nationalId')} 
						value={data.personal.nationalId?.id ? `${data.personal.nationalId.country} - ${data.personal.nationalId.id}` : ''} 
					/>
					<SummaryItem label={t(locale, 'dateOfBirth')} value={data.personal.dateOfBirth} />
					<SummaryItem label={t(locale, 'gender')} value={data.personal.gender} />
				</SummaryCard>
				<SummaryCard title={t(locale, 'summaryContact')}>
					<SummaryItem label={t(locale, 'country')} value={data.personal.country} />
					<SummaryItem label={t(locale, 'city')} value={data.personal.city} />
					<SummaryItem label={t(locale, 'phone')} value={`${data.personal.phone.countryCode} ${data.personal.phone.number}`} />
					<SummaryItem label={t(locale, 'email')} value={data.personal.email} />
				</SummaryCard>
				<SummaryCard title={t(locale, 'summaryFinancial')}>
					<SummaryItem label={t(locale, 'maritalStatus')} value={data.family.maritalStatus} />
					<SummaryItem label={t(locale, 'dependents')} value={String(data.family.dependents || '0')} />
					<SummaryItem
						label={t(locale, 'monthlyIncome')}
						value={
							data.family.monthlyIncome
								? `${data.family.currency} ${data.family.monthlyIncome}`
								: ''
						}
					/>
					<SummaryItem label={t(locale, 'housingStatus')} value={data.family.housingStatus} />
				</SummaryCard>
			</div>
			<div className="mt-8 flex justify-center">
				<button
					type="button"
					onClick={onRestart}
					className="inline-flex items-center rounded-full bg-white text-slate-900 px-6 py-2.5 text-sm font-semibold shadow-[0_12px_25px_rgba(15,23,42,0.25)] hover:bg-slate-100 transition-colors"
				>
					{t(locale, 'startNewApplication')}
				</button>
			</div>
		</section>
	);
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-5 space-y-3">
			<h4 className="text-sm font-semibold tracking-wide text-white uppercase m-0">{title}</h4>
			<div className="space-y-2 text-sm text-white/80">{children}</div>
		</div>
	);
}

function SummaryItem({ label, value }: { label: string; value?: string }) {
	return (
		<div className="flex justify-between gap-3">
			<span className="text-white/60">{label}</span>
			<span className="font-medium text-white">{value && value.trim().length > 0 ? value : '—'}</span>
		</div>
	);
}


