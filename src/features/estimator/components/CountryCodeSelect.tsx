import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { formStyles } from "@/components/ui/form-styles";
import { DEFAULT_PHONE_COUNTRY, phoneCountries, searchPhoneCountries, type PhoneCountryId } from "@/features/estimator/utils/phone";
import { cn } from "@/lib/utils";

interface CountryCodeSelectProps {
	id?: string;
	country: PhoneCountryId;
	disabled: boolean;
	onCountryChange: (country: PhoneCountryId) => void;
	onBlur: () => void;
	children: ReactNode;
}

// The panel stays below the entire row in the dialog's own scroll region.
export function CountryCodeSelect({ id: triggerId = "proposal-phone-country", country, disabled, onCountryChange, onBlur, children }: CountryCodeSelectProps) {
	const listId = `${triggerId}-list`;
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [active, setActive] = useState<PhoneCountryId>(country);
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const selected = phoneCountries.find(({ id }) => id === country)
		?? phoneCountries.find(({ id }) => id === DEFAULT_PHONE_COUNTRY)!;
	const results = searchPhoneCountries(query);
	const activeId = results.find(({ id }) => id === active)?.id ?? results[0]?.id;
	if (disabled && open) setOpen(false);

	useEffect(() => {
		if (!open || disabled) return;
		searchRef.current?.focus();
		function outside(event: PointerEvent) {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		}
		document.addEventListener("pointerdown", outside);
		return () => document.removeEventListener("pointerdown", outside);
	}, [open, disabled]);

	useEffect(() => {
		if (open) listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
	}, [open, activeId]);

	function close(restoreFocus = false) {
		setOpen(false);
		setQuery("");
		if (restoreFocus) triggerRef.current?.focus();
	}
	function show() {
		if (disabled) return;
		setQuery("");
		setActive(selected.id);
		setOpen(true);
	}
	function choose(id: PhoneCountryId) {
		if (disabled) return;
		onCountryChange(id);
		close(true);
	}
	function navigate(event: KeyboardEvent<HTMLInputElement>) {
		const index = results.findIndex(({ id }) => id === activeId);
		let next: number;
		switch (event.key) {
			case "ArrowDown": next = Math.min(index + 1, results.length - 1); break;
			case "ArrowUp": next = Math.max(index - 1, 0); break;
			case "Home": next = 0; break;
			case "End": next = results.length - 1; break;
			case "Enter":
				event.preventDefault();
				if (activeId) choose(activeId);
				return;
			default: return;
		}
		event.preventDefault();
		if (results[next]) setActive(results[next].id);
	}

	return (
		<div ref={rootRef} className="space-y-2" onBlur={(event) => {
			if (!event.relatedTarget || (event.relatedTarget !== triggerRef.current && event.relatedTarget !== searchRef.current)) {
				close();
				if ((event.target as EventTarget) === triggerRef.current || (event.target as EventTarget) === searchRef.current) onBlur();
			}
		}} onKeyDown={(event) => {
			if (open && event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation(); // The ancestor dialog also handles Escape.
				close(true);
			}
		}}>
			<div className="grid grid-cols-[7rem_minmax(0,1fr)] items-end gap-3 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
				<div className="space-y-2">
					<label htmlFor={triggerId} className={formStyles.label}>Código de país</label>
					<button ref={triggerRef} id={triggerId} type="button" disabled={disabled}
						aria-label={`Código de país: ${selected.name} (+${selected.dial})`}
						aria-haspopup="listbox" aria-expanded={open} aria-controls={listId}
						onClick={() => open ? close() : show()}
						onKeyDown={(event) => {
							if (event.key === "ArrowDown" || event.key === "ArrowUp") {
								event.preventDefault();
								show();
							}
						}}
						className={cn(formStyles.input, "flex min-h-11 items-center justify-between gap-1 px-2 sm:px-3")}>
						<span className="whitespace-nowrap">{selected.id} +{selected.dial}</span>
						<span aria-hidden="true" className="text-avala-neon">⌄</span>
					</button>
				</div>
				{children}
			</div>
			{open && !disabled ? (
				<div className="flex max-h-56 flex-col border border-avala-paper/25 bg-avala-ink p-2 text-avala-paper">
					<label htmlFor={`${triggerId}-search`} className={formStyles.label}>Buscar país o código</label>
					<input ref={searchRef} id={`${triggerId}-search`} type="text" role="combobox"
						value={query} autoComplete="off" aria-autocomplete="list" aria-expanded="true"
						aria-controls={listId} aria-activedescendant={activeId ? `${listId}-${activeId}` : undefined}
						placeholder="País, ISO o +57" className={cn(formStyles.input, "mt-2 min-h-11 shrink-0")}
						onKeyDown={navigate} onChange={(event) => {
							setQuery(event.target.value);
							setActive(searchPhoneCountries(event.target.value)[0]?.id ?? selected.id);
						}} />
					<div ref={listRef} id={listId} role="listbox" aria-label="Códigos de país"
						data-lenis-prevent className={cn(formStyles.countryList, "mt-2 min-h-0")}>
						{results.map(({ id, name, dial }) => (
							<div key={id} id={`${listId}-${id}`} role="option" aria-selected={country === id}
								data-active={activeId === id} onPointerDown={(event) => event.preventDefault()}
								onClick={() => choose(id)}
								className={cn("flex min-h-11 cursor-pointer items-center justify-between gap-3 border px-3 py-2 text-sm hover:border-avala-neon",
									activeId === id ? "border-avala-neon bg-avala-neon/10" : "border-transparent",
									country === id ? "font-semibold text-avala-neon" : "text-avala-paper")}>
								<span>{name} <span className="text-avala-mute">{id}</span></span>
								<span>+{dial}</span>
							</div>
						))}
					</div>
					{results.length === 0 ? <p role="status" className="p-3 text-sm">No se encontraron países.</p> : null}
				</div>
			) : null}
		</div>
	);
}
