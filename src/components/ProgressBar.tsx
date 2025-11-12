import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';

const steps = [
	{ id: 1, label: 'step1' },
	{ id: 2, label: 'step2' },
	{ id: 3, label: 'step3' },
];

export default function ProgressBar() {
	const { step, locale } = useFormContextSafe();
	const percent = ((step - 1) / (steps.length - 1)) * 100;

	return (
		<div className="relative px-3 pb-8">
			<div aria-hidden className="absolute top-[18px] left-3 right-3 h-1 bg-gradient-to-r from-slate-200 to-slate-200 rounded-full z-0" />
			<div
				aria-hidden
				className="absolute top-[18px] left-3 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-240 ease-in-out z-[1]"
				style={{ width: `${percent}%` }}
			/>
			<ol aria-label="Progress" className="list-none flex justify-between p-0 m-0 relative z-[2]">
				{steps.map(({ id, label }) => {
					const active = id === step;
					const completed = id < step;
					return (
						<li key={id} className="flex flex-col items-center gap-2 w-[33%] text-center text-slate-600">
							<div
								aria-current={active ? 'step' : undefined}
								className={`w-9 h-9 rounded-full grid place-items-center font-semibold text-base transition-all duration-200 ${
									completed || active
										? 'bg-blue-600 text-white'
										: 'bg-slate-200 text-slate-500'
								} ${active ? 'shadow-[0_8px_18px_rgba(37,99,235,0.35)]' : ''}`}
							>
								{id}
							</div>
							<span className="text-sm font-medium max-w-[180px]">{t(locale, label as any)}</span>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
