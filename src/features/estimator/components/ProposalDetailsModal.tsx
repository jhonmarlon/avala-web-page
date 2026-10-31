import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/ui/Honeypot";
import { estimatorStyles } from "@/features/estimator/components/estimator-styles";
import { PhoneField } from "@/components/ui/phone/PhoneField";
import type { PhoneCountryId } from "@/lib/phone";
import { cn } from "@/lib/utils";
import { companyInfo } from "@/config/site";
import type { EstimatorLead } from "@/features/estimator/types/estimator.types";

interface LeadErrors {
	fullName: string;
	company: string;
	email: string;
	phone: string;
}

interface ProposalDetailsModalProps {
	lead: EstimatorLead;
	phoneCountry: PhoneCountryId;
	phoneDigits: string;
	onPhoneCountryChange: (country: PhoneCountryId) => void;
	leadErrors: LeadErrors;
	leadTouched: boolean;
	isLeadValid: boolean;
	isLeadSubmitted: boolean;
	isLeadSubmitting: boolean;
	submitError: string | null;
	honeypot: string;
	onHoneypotChange: (value: string) => void;
	onClose: () => void;
	onLeadChange: (field: keyof EstimatorLead, value: string) => void;
	onLeadBlur: () => void;
	onSubmit: () => void;
}

export function ProposalDetailsModal({
	lead,
	phoneCountry,
	phoneDigits,
	onPhoneCountryChange,
	leadErrors,
	leadTouched,
	isLeadValid,
	isLeadSubmitted,
	isLeadSubmitting,
	submitError,
	honeypot,
	onHoneypotChange,
	onClose,
	onLeadChange,
	onLeadBlur,
	onSubmit,
}: ProposalDetailsModalProps) {
	const dialogRef = useRef<HTMLDivElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);
	const shouldReduceMotion = useReducedMotion();
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		const previousActiveElement = document.activeElement as HTMLElement | null;
		const previousOverflow = document.body.style.overflow;
		const previousPaddingRight = document.body.style.paddingRight;
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;

		if (scrollbarWidth > 0) {
			const currentPaddingRight =
				Number.parseFloat(
					window.getComputedStyle(document.body).paddingRight,
				) || 0;
			document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
		}
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				onCloseRef.current();
				return;
			}

			if (event.key !== "Tab" || !dialogRef.current) return;

			const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
				'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (!firstElement || !lastElement) return;
			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
			document.body.style.paddingRight = previousPaddingRight;
			previousActiveElement?.focus();
		};
	}, []);

	function renderFieldError(error: string, id: string) {
		if (!error) return null;
		return <p id={id} className={estimatorStyles.error}>{error}</p>;
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{
				duration: shouldReduceMotion ? 0.01 : 0.28,
				ease: "easeOut",
			}}
			className="fixed inset-0 z-50 flex items-center justify-center bg-avala-ink/90 p-4 sm:p-6"
		>
			<motion.div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="proposal-details-title"
				aria-describedby="proposal-details-description"
				initial={{
					opacity: 0,
					y: shouldReduceMotion ? 0 : 28,
					scale: shouldReduceMotion ? 1 : 0.97,
				}}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{
					opacity: 0,
					y: shouldReduceMotion ? 0 : 16,
					scale: shouldReduceMotion ? 1 : 0.985,
				}}
				transition={{
					duration: shouldReduceMotion ? 0.01 : 0.45,
					ease: [0.22, 1, 0.36, 1],
				}}
				className={cn(
					estimatorStyles.panel,
					"flex max-h-[min(760px,calc(100dvh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-none",
				)}
			>
				<header className="shrink-0 border-b border-avala-paper/15 px-4 py-4 sm:px-6">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-2">
							<p className={cn(estimatorStyles.label, "text-avala-neon")}>
								Recibir propuesta detallada
							</p>
							<h2
								id="proposal-details-title"
								className="font-display text-2xl font-semibold leading-tight text-avala-paper sm:text-3xl"
							>
								{isLeadSubmitted
									? "Solicitud enviada"
									: "Cuéntanos cómo podemos contactarte"}
							</h2>
							<p
								id="proposal-details-description"
								className="max-w-2xl text-sm leading-6 text-avala-mute sm:text-base"
							>
								{isLeadSubmitted
									? "Recibimos tu estimación y tus datos."
									: "Esta propuesta se basa en la configuración que realizaste en el estimador. Déjanos tus datos y te contactamos para convertirla en una propuesta técnica y económica personalizada."}
							</p>
						</div>
						<Button
							ref={closeButtonRef}
							type="button"
							onClick={onClose}
							aria-label="Cerrar formulario de propuesta"
							variant="neonSecondary"
							size="icon"
							className="flex transition-colors duration-150"
						>
							<X className="size-5" />
						</Button>
					</div>
				</header>

				{isLeadSubmitted ? (
					<section
						className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 py-8 text-center sm:px-6"
						data-lenis-prevent
						aria-live="polite"
					>
						<div className="flex size-16 shrink-0 items-center justify-center border border-avala-neon/50 text-avala-neon">
							<CheckCircle2 className="size-9" aria-hidden="true" />
						</div>
						<h3 className="mt-5 font-display text-2xl font-semibold text-avala-paper">
							¡Todo listo!
						</h3>
						<p className="mt-3 max-w-lg text-base leading-7 text-avala-mute">
							Nuestro equipo comercial revisará tu proyecto y te contactará en
							menos de 24 h hábiles con una propuesta personalizada.
						</p>
					</section>
				) : (
					<div
						className="min-h-0 overflow-y-auto px-4 py-5 sm:px-6"
						data-lenis-prevent
						aria-busy={isLeadSubmitting}
					>
						{isLeadSubmitting ? (
							<div
								className="flex min-h-[18rem] flex-col items-center justify-center text-center"
								role="status"
								aria-live="polite"
							>
								<LoaderCircle
									className="size-10 animate-spin text-avala-neon motion-reduce:animate-none"
									aria-hidden="true"
								/>
								<p className="mt-5 font-display text-lg font-semibold text-avala-paper">
									Enviando tu solicitud…
								</p>
								<p className="mt-2 text-sm text-avala-mute">
									Estamos enviando tu estimación a nuestro equipo comercial.
								</p>
							</div>
						) : (
							<div className="relative grid gap-4 sm:grid-cols-2">
								<Honeypot value={honeypot} onChange={onHoneypotChange} />
								{[
									["fullName", "Nombre completo", "Ej. Ana González", "name"],
									["company", "Empresa", "Ej. Avala Group", "organization"],
									[
										"email",
										"Correo electrónico",
										"Ej. nombre@empresa.com",
										"email",
									],
								].map(([field, label, placeholder, autoComplete]) => (
									<label
										key={field}
										className={`block space-y-2 ${field === "fullName" || field === "company" ? "sm:col-span-1" : "sm:col-span-2"}`}
									>
										<span className={estimatorStyles.label}>
											{label}
										</span>
										<input
											type={field === "email" ? "text" : undefined}
											inputMode={field === "email" ? "email" : undefined}
											value={lead[field as keyof EstimatorLead] ?? ""}
											onChange={(event) =>
												onLeadChange(
													field as keyof EstimatorLead,
													event.target.value,
												)
											}
											onBlur={onLeadBlur}
											placeholder={placeholder}
											autoComplete={autoComplete}
											disabled={isLeadSubmitting}
											aria-invalid={leadTouched && Boolean(leadErrors[field as keyof LeadErrors])}
											aria-describedby={
												leadTouched && leadErrors[field as keyof LeadErrors]
													? `proposal-${field}-error`
													: undefined
											}
											className={cn(
												estimatorStyles.input,
												"min-h-11",
												leadTouched && leadErrors[field as keyof LeadErrors]
													? estimatorStyles.inputError
													: undefined,
											)}
										/>
										{leadTouched
											? renderFieldError(leadErrors[field as keyof LeadErrors], `proposal-${field}-error`)
											: null}
									</label>
								))}
								<PhoneField
									country={phoneCountry}
									nationalDigits={phoneDigits}
									onCountryChange={onPhoneCountryChange}
									onDigitsChange={(digits) => onLeadChange("phone", digits)}
									onBlur={onLeadBlur}
									disabled={isLeadSubmitting}
									error={leadTouched ? leadErrors.phone : ""}
								/>
							</div>
						)}
					</div>
				)}

				<footer className="shrink-0 border-t border-avala-paper/15 bg-avala-ink px-4 py-4 sm:px-6">
					{isLeadSubmitted ? (
						<Button type="button" fullWidth variant="neon" onClick={onClose}>
							Cerrar
						</Button>
					) : (
						<>
							{submitError ? (
								<p role="alert" className={estimatorStyles.error}>
									{submitError} También puedes escribirnos a{" "}
									<a
										href={`mailto:${companyInfo.email}`}
										className="font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avala-neon"
									>
										{companyInfo.email}
									</a>
									.
								</p>
							) : (
								<p className="text-sm leading-5 text-avala-mute">
									Al enviar autorizas el tratamiento de tus datos para preparar
									tu propuesta, según nuestra{" "}
									<a
										href="/privacidad"
										target="_blank"
										rel="noopener"
										className="underline underline-offset-2 hover:text-avala-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avala-neon"
									>
										política de privacidad
									</a>
									.
								</p>
							)}
							<div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
								<Button
									type="button"
									variant="neonSecondary"
									onClick={onClose}
									disabled={isLeadSubmitting}
								>
									Volver al estimador
								</Button>
								<Button
									type="button"
									variant="neon"
									disabled={
										isLeadSubmitting ||
										!lead.fullName ||
										!lead.email ||
										!isLeadValid
									}
									onClick={onSubmit}
								>
									{isLeadSubmitting
										? "Enviando…"
										: "Quiero una propuesta personalizada"}
								</Button>
							</div>
						</>
					)}
				</footer>
			</motion.div>
		</motion.div>
	);
}
