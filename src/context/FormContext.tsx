import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from 'react';
import type { ApplicationData, WizardStep, Locale, PhoneValue } from '../types';
import { loadFromStorage, saveToStorage, storageKeys, clearStorage } from '../utils/storage';
import { initialData } from './data';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../constants/countries';
import { DEFAULT_LOCALE } from '../constants/formOptions';


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
	const [data, setData] = useState<ApplicationData>(() => hydrateData());
	const [step, setStep] = useState<WizardStep>(1);
	const [locale, setLocaleState] = useState<Locale>(() =>
		loadFromStorage<Locale>(storageKeys.locale, DEFAULT_LOCALE),
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
		setData(prev => ({
			...prev,
			...next,
			personal: next.personal
				? { ...prev.personal, ...next.personal, phone: normalizePhone(next.personal.phone ?? prev.personal.phone) }
				: prev.personal,
		}));
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

function hydrateData(): ApplicationData {
	const stored = loadFromStorage<ApplicationData>(storageKeys.app, initialData);
	return {
		...initialData,
		...stored,
		personal: {
			...initialData.personal,
			...(stored.personal ?? {}),
			phone: normalizePhone(stored.personal?.phone),
		},
		family: {
			...initialData.family,
			...(stored.family ?? {}),
		},
		situation: {
			...initialData.situation,
			...(stored.situation ?? {}),
		},
	};
}

function normalizePhone(phone?: PhoneValue | string): PhoneValue {
	if (!phone) return { countryCode: DEFAULT_PHONE_COUNTRY_CODE, number: '' };
	if (typeof phone === 'string') {
		const trimmed = phone.trim();
		const match = trimmed.match(/^(\+\d+)(.*)$/);
		return {
			countryCode: match ? match[1] : DEFAULT_PHONE_COUNTRY_CODE,
			number: match ? match[2].replace(/\D/g, '') : trimmed.replace(/\D/g, ''),
		};
	}
	return {
		countryCode: phone.countryCode || DEFAULT_PHONE_COUNTRY_CODE,
		number: phone.number || '',
	};
}

export function useFormContextSafe(): FormContextValue {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error('FormContext used outside provider');
	return ctx;
}


