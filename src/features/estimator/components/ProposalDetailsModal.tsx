import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EstimatorLead } from "@/features/estimator/types/estimator.types";

interface LeadErrors {
	fullName: string;
	company: string;
	email: string;
	phone: string;
}

interface ProposalDetailsModalProps {
	lead: EstimatorLead;
	leadErrors: LeadErrors;
	leadTouched: boolean;
	isLeadValid: boolean;
	isLeadSubmitted: boolean;
	isLeadSubmitting: boolean;
	onClose: () => void;
	onLeadChange: (field: keyof EstimatorLead, value: string) => void;
	onLeadBlur: () => void;
	onSubmit: () => void;
}

export function ProposalDetailsModal({
	lead,
	leadErrors,
	leadTouched,
	isLeadValid,
	isLeadSubmitted,
	isLeadSubmitting,
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
				'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
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

	function renderFieldError(error: string) {
		if (!error) return null;
		return <p className="text-xs leading-5 text-red-600">{error}</p>;
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
			className="fixed inset-0 z-50 flex items-center justify-center bg-[#030814]/75 p-4 backdrop-blur-sm sm:p-6"
		>
			<motion.div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="proposal-details-title"
				aria-describedby="proposal-details-description"
				initial={{
					opacity: 0,
					y: shouldReduceMotion ? 0 : 18,
					scale: shouldReduceMotion ? 1 : 0.985,
				}}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{
					opacity: 0,
					y: shouldReduceMotion ? 0 : 12,
					scale: shouldReduceMotion ? 1 : 0.99,
				}}
				transition={{
					duration: shouldReduceMotion ? 0.01 : 0.4,
					ease: [0.22, 1, 0.36, 1],
				}}
				className="flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-[1.9rem] border border-[#d8e4f4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_30px_90px_rgba(3,8,20,0.3)]"
			>
				<header className="relative shrink-0 overflow-hidden border-b border-brand-200/70 bg-[linear-gradient(135deg,#071226_0%,#102d58_58%,#1298ff_150%)] px-6 py-6 text-white sm:px-8">
					<div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-brand-400/20 blur-3xl" />
					<div className="relative flex items-start justify-between gap-5">
						<div className="space-y-2">
							<p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-100">
								Recibir propuesta detallada
							</p>
							<h2
								id="proposal-details-title"
								className="text-[1.8rem] font-bold leading-[1.1] text-white"
							>
								{isLeadSubmitted
									? "Solicitud preparada"
									: "Cuéntanos cómo podemos contactarte"}
							</h2>
							<p
								id="proposal-details-description"
								className="max-w-2xl text-base leading-7 text-slate-200"
							>
								{isLeadSubmitted
									? "Tus datos están listos para el siguiente paso."
									: "Esta propuesta se basa en la configuración que realizaste en el estimador. Déjanos tus datos y te contactamos para convertirla en una propuesta técnica y económica personalizada."}
							</p>
						</div>
						<button
							ref={closeButtonRef}
							type="button"
							onClick={onClose}
							aria-label="Cerrar formulario de propuesta"
							className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:border-brand-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
						>
							<X className="size-5" />
						</button>
					</div>
				</header>

				{isLeadSubmitted ? (
					<section
						className="flex min-h-[18rem] flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-8"
						aria-live="polite"
					>
						<div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
							<CheckCircle2 className="size-9" aria-hidden="true" />
						</div>
						<h3 className="mt-5 text-2xl font-bold text-[#0d1730]">
							¡Todo listo!
						</h3>
						<p className="mt-3 max-w-lg text-base leading-7 text-slate-600">
							Esta funcionalidad todavía está en desarrollo. Tus datos se
							prepararon solo en este navegador y aún no se enviaron ni se
							almacenaron en nuestros servidores.
						</p>
					</section>
				) : (
					<div
						className="min-h-0 overflow-y-auto px-6 py-6 sm:px-8"
						aria-busy={isLeadSubmitting}
					>
						{isLeadSubmitting ? (
							<div
								className="flex min-h-[18rem] flex-col items-center justify-center text-center"
								role="status"
								aria-live="polite"
							>
								<LoaderCircle
									className="size-10 animate-spin text-brand-600 motion-reduce:animate-none"
									aria-hidden="true"
								/>
								<p className="mt-5 text-lg font-semibold text-[#0d1730]">
									Preparando tu solicitud…
								</p>
								<p className="mt-2 text-sm text-slate-500">
									Estamos organizando los datos de tu estimación en este
									navegador.
								</p>
							</div>
						) : (
							<div className="grid gap-4 sm:grid-cols-2">
								{[
									["fullName", "Nombre completo", "Ej. Ana González", "name"],
									["company", "Empresa", "Ej. Avala Group", "organization"],
									[
										"email",
										"Correo electrónico",
										"Ej. nombre@empresa.com",
										"email",
									],
									["phone", "Teléfono", "Ej. +57 300 000 0000", "tel"],
								].map(([field, label, placeholder, autoComplete]) => (
									<label
										key={field}
										className={`block space-y-2 ${field === "fullName" || field === "company" ? "sm:col-span-1" : "sm:col-span-2"}`}
									>
										<span className="text-sm font-medium text-[#0d1730]">
											{label}
										</span>
										<input
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
											className="w-full rounded-[1rem] border border-[#dfe8f6] bg-white px-4 py-3 text-sm text-[#0d1730] outline-none transition-all focus:border-brand-400 focus:shadow-[0_0_0_4px_rgba(18,152,255,0.08)] disabled:cursor-not-allowed disabled:bg-slate-50"
										/>
										{leadTouched
											? renderFieldError(leadErrors[field as keyof LeadErrors])
											: null}
									</label>
								))}
							</div>
						)}
					</div>
				)}

				<footer className="shrink-0 border-t border-[#dfe8f6] bg-white/80 px-6 py-5 sm:px-8">
					{isLeadSubmitted ? (
						<Button fullWidth onClick={onClose}>
							Cerrar
						</Button>
					) : (
						<>
							<p className="text-xs leading-5 text-slate-500">
								Funcionalidad en desarrollo: el envío de datos todavía no está
								habilitado.
							</p>
							<div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
								<Button
									variant="ghost"
									onClick={onClose}
									disabled={isLeadSubmitting}
								>
									Volver al estimador
								</Button>
								<Button
									disabled={
										isLeadSubmitting ||
										!lead.fullName ||
										!lead.email ||
										!isLeadValid
									}
									onClick={onSubmit}
								>
									{isLeadSubmitting
										? "Preparando…"
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
