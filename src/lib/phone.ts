export const phoneCountries = [
	{ id: "AR", name: "Argentina", dial: "54" },
	{ id: "BZ", name: "Belice", dial: "501" },
	{ id: "BO", name: "Bolivia", dial: "591" },
	{ id: "BR", name: "Brasil", dial: "55" },
	{ id: "CL", name: "Chile", dial: "56" },
	{ id: "CO", name: "Colombia", dial: "57" },
	{ id: "CR", name: "Costa Rica", dial: "506" },
	{ id: "CU", name: "Cuba", dial: "53" },
	{ id: "EC", name: "Ecuador", dial: "593" },
	{ id: "SV", name: "El Salvador", dial: "503" },
	{ id: "US", name: "Estados Unidos", dial: "1" },
	{ id: "GT", name: "Guatemala", dial: "502" },
	{ id: "HT", name: "Haití", dial: "509" },
	{ id: "HN", name: "Honduras", dial: "504" },
	{ id: "MX", name: "México", dial: "52" },
	{ id: "NI", name: "Nicaragua", dial: "505" },
	{ id: "PA", name: "Panamá", dial: "507" },
	{ id: "PY", name: "Paraguay", dial: "595" },
	{ id: "PE", name: "Perú", dial: "51" },
	{ id: "PR", name: "Puerto Rico", dial: "1" },
	{ id: "DO", name: "República Dominicana", dial: "1" },
	{ id: "UY", name: "Uruguay", dial: "598" },
	{ id: "VE", name: "Venezuela", dial: "58" },
	{ id: "ES", name: "España", dial: "34" },
] as const;

// Keep the catalog order and ISO identity, including regions sharing +1.
export function searchPhoneCountries(query: string) {
	const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	const term = normalize(query.trim());
	return phoneCountries.filter(({ id, name, dial }) =>
		normalize(name).includes(term) || id.toLowerCase().includes(term) || `+${dial}`.includes(term),
	);
}

export type PhoneCountryId = (typeof phoneCountries)[number]["id"];
export const DEFAULT_PHONE_COUNTRY: PhoneCountryId = "CO";
// Reserve '+' and the longest regional prefix within the API's 40-character cap.
// A common limit keeps the entire national draft intact when switching countries.
export const MAX_NATIONAL_DIGITS = 40 - 1 - 3;

export function sanitizePhoneDigits(value: string): string {
	return value.replace(/[^0-9]/g, "").slice(0, MAX_NATIONAL_DIGITS);
}

export function composePhone(country: PhoneCountryId, nationalDigits: string): string {
	const digits = sanitizePhoneDigits(nationalDigits);
	if (!digits) return "";
	const selected = phoneCountries.find(({ id }) => id === country)!;
	return `+${selected.dial}${digits}`;
}

export function isValidNationalPhone(digits: string): boolean {
	return digits === "" || (/^[0-9]{7,}$/.test(digits) && digits.length <= MAX_NATIONAL_DIGITS);
}
