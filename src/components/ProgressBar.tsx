import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';
import { steps } from '../data/locations';


export default function ProgressBar() {
	const { step, locale } = useFormContextSafe();
	const progress = Math.max(0, Math.min(1, (step - 1) / (steps.length - 1) || 0));

	return (
		<div className="relative px-3 pb-8">
			<div aria-hidden className="absolute top-[18px] left-3 right-3 h-1 bg-white/20 rounded-full overflow-hidden">
				<span
					className="block h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-500 rounded-full transition-transform duration-300 ease-out origin-left"
					style={{ transform: `scaleX(${progress})` }}
				/>
			</div>
			<ol aria-label="Progress" className="list-none flex justify-between p-0 m-0 relative z-[2]">
				{steps.map(({ id, label }) => {
					const active = id === step;
					const completed = id < step;
					return (
						<li key={id} className="flex flex-col items-center gap-2 w-[33%] text-center text-white/70">
							<div
								aria-current={active ? 'step' : undefined}
								className={`w-9 h-9 rounded-full grid place-items-center font-semibold text-base transition-all duration-200 ${
									completed || active
										? 'bg-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)]'
										: 'bg-white/15 text-white/70'
								}`}
							>
								{id}
							</div>
							<span className={`text-xs sm:text-sm font-medium max-w-[180px] ${active ? 'text-white' : 'text-white/70'}`}>
								{t(locale, label as any)}
							</span>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
