const STORAGE_KEY = 'social_support_application_v1';
const LOCALE_KEY = 'social_support_locale';

export function loadFromStorage<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function saveToStorage<T>(key: string, value: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
	}
}

export function clearStorage(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {
	}
}

export const storageKeys = {
	app: STORAGE_KEY,
	locale: LOCALE_KEY,
};


