import { useState, useRef, useEffect } from 'react';
import { useFormContextSafe } from '../context/FormContext';
import { t } from '../i18n';
import { MONTHS_EN, MONTHS_AR, DAYS_EN, DAYS_AR } from '../constants/calendar';

type DatePickerProps = {
	value: string;
	onChange: (value: string) => void;
	error?: string;
};

export default function DatePicker({ value, onChange, error }: DatePickerProps) {
	const { locale, isRtl } = useFormContextSafe();
	const [isOpen, setIsOpen] = useState(false);
	const [currentMonth, setCurrentMonth] = useState(() => {
		if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
			const [year, month] = value.split('-').map(Number);
			return { year, month: month - 1 };
		}
		const date = new Date();
		return { year: date.getFullYear(), month: date.getMonth() };
	});

	useEffect(() => {
		if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
			const [year, month] = value.split('-').map(Number);
			setCurrentMonth({ year, month: month - 1 });
		}
	}, [value]);
	const containerRef = useRef<HTMLDivElement>(null);

	const MONTHS = locale === 'ar' ? MONTHS_AR : MONTHS_EN;
	const DAYS = locale === 'ar' ? DAYS_AR : DAYS_EN;

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isOpen]);

	function formatDisplayDate(dateStr: string): string {
		if (!dateStr) return '';
		// Handle YYYY-MM-DD format directly
		if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
			return dateStr;
		}
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return '';
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function getDaysInMonth(year: number, month: number): number {
		return new Date(year, month + 1, 0).getDate();
	}

	function getFirstDayOfMonth(year: number, month: number): number {
		return new Date(year, month, 1).getDay();
	}

	function handleDateSelect(day: number) {
		const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		onChange(dateStr);
		setIsOpen(false);
	}

	function handlePrevMonth() {
		setCurrentMonth(prev => {
			if (prev.month === 0) {
				return { year: prev.year - 1, month: 11 };
			}
			return { year: prev.year, month: prev.month - 1 };
		});
	}

	function handleNextMonth() {
		setCurrentMonth(prev => {
			if (prev.month === 11) {
				return { year: prev.year + 1, month: 0 };
			}
			return { year: prev.year, month: prev.month + 1 };
		});
	}

	function handleToday() {
		const today = new Date();
		const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
		onChange(todayStr);
		setIsOpen(false);
	}

	const selectedDate = value ? new Date(value) : null;
	const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
	const firstDay = getFirstDayOfMonth(currentMonth.year, currentMonth.month);
	const days: (number | null)[] = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

	const today = new Date();
	const isToday = (day: number) =>
		currentMonth.year === today.getFullYear() &&
		currentMonth.month === today.getMonth() &&
		day === today.getDate();

	const isSelected = (day: number) =>
		selectedDate &&
		currentMonth.year === selectedDate.getFullYear() &&
		currentMonth.month === selectedDate.getMonth() &&
		day === selectedDate.getDate();

	return (
		<div ref={containerRef} className="relative" dir={isRtl ? 'rtl' : 'ltr'}>
			<div className="relative">
				<input
					type="text"
					readOnly
					value={formatDisplayDate(value)}
					onClick={() => setIsOpen(!isOpen)}
					placeholder={t(locale, 'dateOfBirth')}
					className="w-full border border-white/30 rounded-lg px-3 py-2.5 pr-10 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent cursor-pointer"
				/>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
					aria-label={t(locale, 'dateOfBirth')}
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</button>
			</div>
			{error && <span className="text-red-300 text-xs mt-1 block">{error}</span>}
			{isOpen && (
				<div className="absolute z-50 mt-2 bg-slate-800 border border-white/20 rounded-xl shadow-2xl p-4 w-[320px] max-w-[calc(100vw-2rem)] left-0 sm:left-auto right-0 sm:right-auto">
					<div className="flex items-center justify-between mb-4">
						<button
							type="button"
							onClick={handlePrevMonth}
							className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
							aria-label="Previous month"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</button>
						<div className="text-white font-semibold text-sm">
							{MONTHS[currentMonth.month]} {currentMonth.year}
						</div>
						<button
							type="button"
							onClick={handleNextMonth}
							className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
							aria-label="Next month"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>
					<div className="grid grid-cols-7 gap-1 mb-2">
						{DAYS.map(day => (
							<div key={day} className="text-center text-xs font-medium text-white/60 py-1.5">
								{day}
							</div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-1">
						{days.map((day, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => day && handleDateSelect(day)}
								disabled={!day}
								className={`
									h-9 rounded-lg text-sm font-medium transition-all
									${!day ? 'cursor-default' : 'cursor-pointer hover:bg-white/10'}
									${isToday(day!) ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : ''}
									${isSelected(day!) ? 'bg-emerald-500 text-white shadow-lg' : day ? 'text-white' : 'text-transparent'}
								`}
							>
								{day}
							</button>
						))}
					</div>
					<div className="mt-3 pt-3 border-t border-white/10">
						<button
							type="button"
							onClick={handleToday}
							className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-sm font-medium transition-colors"
						>
							{t(locale, 'today')}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

