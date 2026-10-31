import type { ReactNode } from "react";
import { estimatorStyles } from "@/features/estimator/components/estimator-styles";
import { CountryCodeSelect } from "@/features/estimator/components/CountryCodeSelect";
import {
	MAX_NATIONAL_DIGITS,
	sanitizePhoneDigits,
	type PhoneCountryId,
} from "@/features/estimator/utils/phone";
import { cn } from "@/lib/utils";

interface PhoneFieldProps {
	id?: string;
	name?: string;
	label?: ReactNode;
	errorId?: string;
	errorRole?: "alert";
	className?: string;
	country: PhoneCountryId;
	nationalDigits: string;
	disabled: boolean;
	error: string;
	onCountryChange: (country: PhoneCountryId) => void;
	onDigitsChange: (digits: string) => void;
	onBlur: () => void;
}

export function PhoneField({
	country, nationalDigits, disabled, error, onCountryChange, onDigitsChange, onBlur,
	id = "proposal-phone", name, label = "Teléfono", errorId = `${id}-error`, errorRole,
	className = "space-y-2 sm:col-span-2",
}: PhoneFieldProps) {
	return (
		<div className={className}>
			<CountryCodeSelect id={`${id}-country`} country={country} disabled={disabled} onCountryChange={onCountryChange} onBlur={onBlur}>
				<div className="min-w-0 space-y-2">
					<label htmlFor={id} className={estimatorStyles.label}>
						{label}
					</label>
					<input
						id={id}
						name={name}
						type="tel"
						inputMode="numeric"
						pattern="[0-9]*"
						autoComplete="tel-national"
						value={nationalDigits}
						onChange={(event) => onDigitsChange(sanitizePhoneDigits(event.target.value))}
						onBlur={onBlur}
						placeholder="Ej. 3000000000"
						maxLength={MAX_NATIONAL_DIGITS}
						disabled={disabled}
						aria-invalid={Boolean(error)}
						aria-describedby={error ? errorId : undefined}
						className={cn(estimatorStyles.input, "min-h-11", error ? estimatorStyles.inputError : undefined)}
					/>
				</div>
			</CountryCodeSelect>
			{error ? <p id={errorId} role={errorRole} className={estimatorStyles.error}>{error}</p> : null}
		</div>
	);
}
