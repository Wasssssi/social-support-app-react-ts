import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from 'react';
import type { ApplicationData, WizardStep, Locale } from '../types';
import { loadFromStorage, saveToStorage, storageKeys, clearStorage } from '../utils/storage';
import { initialData } from './data';


type FormContextValue = {
	data: ApplicationData;
	step: WizardStep;
	locale: Locale;
	isRtl: boolean;
	setStep: (s: WizardStep) => void;
	updateData: (next: Partial<ApplicationData>) => void;
	reset: () => void;
	setLocale: (l: Locale) => void;
};

const Ctx = createContext<FormContextValue | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
	const [data, setData] = useState<ApplicationData>(() =>
		loadFromStorage<ApplicationData>(storageKeys.app, initialData),
	);
	const [step, setStep] = useState<WizardStep>(1);
	const [locale, setLocaleState] = useState<Locale>(() =>
		loadFromStorage<Locale>(storageKeys.locale, 'en'),
	);

	const isRtl = locale === 'ar';

	useEffect(() => {
		saveToStorage(storageKeys.app, data);
	}, [data]);

	useEffect(() => {
		document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
		saveToStorage(storageKeys.locale, locale);
	}, [locale, isRtl]);

	function updateData(next: Partial<ApplicationData>) {
		setData(prev => ({ ...prev, ...next }));
	}

	function reset() {
		setData(initialData);
		setStep(1);
		clearStorage(storageKeys.app);
	}

	function setLocale(l: Locale) {
		setLocaleState(l);
	}

	const value = useMemo<FormContextValue>(
		() => ({ data, step, setStep, updateData, reset, locale, setLocale, isRtl }),
		[data, step, locale, isRtl],
	);

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFormContextSafe(): FormContextValue {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error('FormContext used outside provider');
	return ctx;
}


