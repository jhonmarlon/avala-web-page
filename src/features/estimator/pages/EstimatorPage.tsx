import { useMemo, useRef, useState } from "react";
import {
	ArrowRight,
	CheckCircle2,
	CircleDollarSign,
	Clock3,
	Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionLabel } from "@/components/fx/SectionLabel";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { companyInfo } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProposalDetailsModal } from "@/features/estimator/components/ProposalDetailsModal";
import { estimatorStyles } from "@/features/estimator/components/estimator-styles";
import { estimatorSteps } from "@/features/estimator/data/catalog";
import { calculateEstimate } from "@/features/estimator/utils/calculateEstimate";
import { composePhone, DEFAULT_PHONE_COUNTRY, isValidNationalPhone, sanitizePhoneDigits, type PhoneCountryId } from "@/lib/phone";
import type {
	EstimateResult,
	EstimatorAnswers,
	EstimatorLead,
	EstimatorQuestion,
	FeatureCategory,
	MultiSelectQuestion,
	SingleSelectQuestion,
	TextareaQuestion,
} from "@/features/estimator/types/estimator.types";
import { submitForm } from "@/lib/forms";
import { fadeLeft, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const complexityLabels = {
	LOW: "Baja",
	MEDIUM: "Media",
	MEDIUM_HIGH: "Media-Alta",
	HIGH: "Alta",
	ENTERPRISE: "Empresarial",
} as const;

const approachLabels = {
	MVP: "MVP",
	PROFESSIONAL: "Profesional",
	ENTERPRISE: "Empresarial",
} as const;

const featureCategoryLabels: Record<FeatureCategory, string> = {
	CORE: "Base del producto",
	BUSINESS: "Operación de negocio",
	INTEGRATION: "Integraciones",
	ADVANCED: "Capacidades avanzadas",
};

const complexityDescriptions = {
	LOW: "Ideal para validar una necesidad puntual con alcance controlado.",
	MEDIUM:
		"Requiere varias piezas de negocio, pero sigue siendo manejable como primera versión.",
	MEDIUM_HIGH:
		"Ya implica módulos relevantes, integraciones y una arquitectura pensada para crecer.",
	HIGH: "Proyecto con alta coordinación técnica, múltiples módulos y operación estructurada.",
	ENTERPRISE:
		"Solución crítica con exigencias elevadas de escalabilidad, seguridad e integración.",
} as const;

const initialAnswers: EstimatorAnswers = {
	features: [],
};

const initialLead: Omit<EstimatorLead, "phone"> = {
	fullName: "",
	company: "",
	email: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatCop(value: number) {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(value);
}

// Respuestas y estimación en texto legible, para el correo que recibe ventas@
function describeEstimate(
	answers: EstimatorAnswers,
	result: EstimateResult | null,
): Array<[string, string]> {
	const rows: Array<[string, string]> = [];

	for (const step of estimatorSteps) {
		for (const question of step.questions) {
			let value: string;
			if (question.type === "multi-select") {
				value = (question as MultiSelectQuestion).options
					.filter((option) => answers.features.includes(option.value))
					.map((option) => option.label)
					.join(", ");
			} else if (question.type === "single-select") {
				const selected = answers[question.id as keyof EstimatorAnswers];
				value =
					(question as SingleSelectQuestion).options.find(
						(option) => option.value === selected,
					)?.label ?? "";
			} else {
				value = String(answers[question.id as keyof EstimatorAnswers] ?? "");
			}
			if (value.trim()) rows.push([question.title, value.trim()]);
		}
	}

	if (result) {
		rows.push(
			["Complejidad", complexityLabels[result.complexity]],
			["Enfoque recomendado", approachLabels[result.recommendedApproach]],
			[
				"Duración estimada",
				`${result.estimatedMonths.min}–${result.estimatedMonths.max} meses (${result.estimatedHours.min}–${result.estimatedHours.max} h)`,
			],
			[
				"Inversión estimada",
				`${formatCop(result.estimatedCostCop.min)} – ${formatCop(result.estimatedCostCop.max)}`,
			],
		);
		if (result.detectedModules.length > 0)
			rows.push(["Módulos detectados", result.detectedModules.join(", ")]);
		if (result.warnings.length > 0)
			rows.push(["Advertencias", result.warnings.join(" · ")]);
	}

	return rows;
}

function validateLead(lead: EstimatorLead, nationalDigits: string) {
	return {
		fullName:
			lead.fullName.trim().length < 3
				? "Ingresa un nombre válido de al menos 3 caracteres."
				: "",
		company:
			lead.company &&
			lead.company.trim().length > 0 &&
			lead.company.trim().length < 2
				? "Ingresa un nombre de empresa válido."
				: "",
		email: !emailRegex.test(lead.email.trim())
			? "Ingresa un correo electrónico válido."
			: "",
		phone:
			!isValidNationalPhone(nationalDigits)
				? "Ingresa un número de teléfono válido."
				: "",
	};
}

export function EstimatorPage() {
	const shouldReduceMotion = useReducedMotion();
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [answers, setAnswers] = useState<EstimatorAnswers>(initialAnswers);
	const [leadFields, setLead] = useState(initialLead);
	const [phoneCountry, setPhoneCountry] = useState<PhoneCountryId>(DEFAULT_PHONE_COUNTRY);
	const [phoneDigits, setPhoneDigits] = useState("");
	const lead: EstimatorLead = useMemo(() => ({
		...leadFields,
		phone: composePhone(phoneCountry, phoneDigits),
	}), [leadFields, phoneCountry, phoneDigits]);
	const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);
	const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
	const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
	const [leadTouched, setLeadTouched] = useState(false);
	const [leadSubmitError, setLeadSubmitError] = useState<string | null>(null);
	const [honeypot, setHoneypot] = useState("");
	// Cada cierre del modal invalida el envío en curso para no pisar el estado
	const submissionIdRef = useRef(0);
	// Momento de apertura del modal: la API rechaza envíos instantáneos (bots)
	const leadStartedAtRef = useRef(0);
	const resetAfterCloseRef = useRef(false);

	const hasCoreProjectData =
		Boolean(answers.projectType) && Boolean(answers.platform);
	const hasFeatureSelection = answers.features.length > 0;
	const hasMinimumData = hasCoreProjectData && hasFeatureSelection;
	const result = useMemo(
		() => (hasMinimumData ? calculateEstimate(answers) : null),
		[answers, hasMinimumData],
	);
	const currentStep = estimatorSteps[currentStepIndex];
	const isLastStep = currentStepIndex === estimatorSteps.length - 1;
	const stepProgress = ((currentStepIndex + 1) / estimatorSteps.length) * 100;
	const leadErrors = useMemo(() => validateLead(lead, phoneDigits), [lead, phoneDigits]);
	const isLeadValid =
		!leadErrors.fullName &&
		!leadErrors.company &&
		!leadErrors.email &&
		!leadErrors.phone;
	const canShowLeadForm = isLastStep && canAdvance();

	function setSingleValue(questionId: string, value: string) {
		setAnswers((current) => ({
			...current,
			[questionId]: value,
		}));
	}

	function toggleFeature(value: string) {
		setAnswers((current) => ({
			...current,
			features: current.features.includes(value)
				? current.features.filter((item) => item !== value)
				: [...current.features, value],
		}));
	}

	function setTextValue(questionId: string, value: string) {
		setAnswers((current) => ({
			...current,
			[questionId]: value,
		}));
	}

	function canAdvance() {
		return currentStep.questions.every((question) => {
			if (!question.required) return true;

			if (question.type === "single-select") {
				const value = answers[question.id as keyof EstimatorAnswers];
				return Boolean(value);
			}

			if (question.type === "multi-select") {
				return (
					answers.features.length >=
					((question as MultiSelectQuestion).minSelections ?? 1)
				);
			}

			if (question.type === "textarea") {
				return true;
			}

			return true;
		});
	}

	function handleNext() {
		if (!canAdvance() || isLastStep) return;
		setCurrentStepIndex((current) => current + 1);
	}

	function handleBack() {
		if (currentStepIndex === 0) return;
		setCurrentStepIndex((current) => current - 1);
	}

	function handleContinueToLead() {
		leadStartedAtRef.current = Date.now();
		setLeadSubmitError(null);
		setIsProposalModalOpen(true);
	}

	function resetEstimator() {
		setCurrentStepIndex(0);
		setAnswers(initialAnswers);
		setLead(initialLead);
		setPhoneCountry(DEFAULT_PHONE_COUNTRY);
		setPhoneDigits("");
		setIsLeadSubmitted(false);
		setIsLeadSubmitting(false);
		setLeadTouched(false);
	}

	function handleProposalModalClose() {
		submissionIdRef.current += 1;
		setIsLeadSubmitting(false);
		resetAfterCloseRef.current = isLeadSubmitted;
		setIsProposalModalOpen(false);
	}

	function handleProposalModalExitComplete() {
		if (!resetAfterCloseRef.current) return;
		resetAfterCloseRef.current = false;
		resetEstimator();
	}

	function handleLeadChange(field: keyof EstimatorLead, value: string) {
		if (field === "phone") setPhoneDigits(sanitizePhoneDigits(value));
		else setLead((current) => ({ ...current, [field]: value }));
		setIsLeadSubmitted(false);
		setIsLeadSubmitting(false);
	}

	async function handleLeadSubmit() {
		setLeadTouched(true);
		if (!isLeadValid || isLeadSubmitting) return;

		const submissionId = ++submissionIdRef.current;
		setIsLeadSubmitting(true);
		setLeadSubmitError(null);
		const response = await submitForm(
			"/api/lead",
			{ ...lead, details: describeEstimate(answers, result) },
			{ startedAt: leadStartedAtRef.current, honeypot },
		);
		if (submissionId !== submissionIdRef.current) return;

		setIsLeadSubmitting(false);
		if (response.ok) setIsLeadSubmitted(true);
		else setLeadSubmitError(response.error);
	}

	function renderQuestion(question: EstimatorQuestion) {
		if (question.type === "single-select") {
			const typedQuestion = question as SingleSelectQuestion;
			const selected = answers[question.id as keyof EstimatorAnswers];

			return (
				<div className="grid gap-3 md:grid-cols-2" key={question.id}>
					{typedQuestion.options.map((option) => {
						const isSelected = selected === option.value;

						return (
							<button
								key={option.value}
								type="button"
								onClick={() => setSingleValue(question.id, option.value)}
								aria-pressed={isSelected}
								className={cn(
									estimatorStyles.option,
									isSelected ? estimatorStyles.optionSelected : estimatorStyles.optionIdle,
								)}
							>
								<div className="space-y-2">
									<p className="font-display text-lg font-semibold text-avala-paper">
										{option.label}
									</p>
									{option.description ? (
										<p className="text-base leading-6 text-avala-mute">
											{option.description}
										</p>
									) : null}
								</div>
							</button>
						);
					})}
				</div>
			);
		}

		if (question.type === "multi-select") {
			const typedQuestion = question as MultiSelectQuestion;
			const groupedOptions = typedQuestion.options.reduce<
				Record<FeatureCategory, MultiSelectQuestion["options"]>
			>(
				(accumulator, option) => {
					accumulator[option.category].push(option);
					return accumulator;
				},
				{
					CORE: [],
					BUSINESS: [],
					INTEGRATION: [],
					ADVANCED: [],
				},
			);

			return (
				<div className="space-y-5" key={question.id}>
					{(
						Object.entries(groupedOptions) as Array<
							[FeatureCategory, MultiSelectQuestion["options"]]
						>
					).map(([category, options]) => {
						if (options.length === 0) return null;

						return (
							<div key={category} className="space-y-3">
								<span className={estimatorStyles.label}>
									{featureCategoryLabels[category]}
								</span>

								<div className="grid gap-3 md:grid-cols-2">
									{options.map((option) => {
										const isSelected = answers.features.includes(option.value);

										return (
											<button
												key={option.value}
												type="button"
												onClick={() => toggleFeature(option.value)}
												aria-pressed={isSelected}
												className={cn(
													estimatorStyles.option,
													isSelected ? estimatorStyles.optionSelected : estimatorStyles.optionIdle,
												)}
											>
												<div className="flex items-start justify-between gap-3">
													<div className="space-y-2">
														<p className="font-display text-lg font-semibold text-avala-paper">
															{option.label}
														</p>
													</div>
													<span
														className={cn(
															"flex size-6 shrink-0 items-center justify-center border",
															isSelected
																? "border-avala-neon bg-[var(--color-avala-neon)] text-avala-ink"
																: "border-avala-paper/30",
														)}
													>
														{isSelected ? (
															<CheckCircle2 className="size-4" />
														) : null}
													</span>
												</div>
											</button>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			);
		}

		const typedQuestion = question as TextareaQuestion;

		return (
			<textarea
				key={question.id}
				aria-labelledby={`${question.id}-label`}
				value={answers.projectDescription ?? ""}
				onChange={(event) => setTextValue(question.id, event.target.value)}
				placeholder={typedQuestion.placeholder}
				maxLength={typedQuestion.maxLength}
				rows={6}
				className={estimatorStyles.input}
			/>
		);
	}

	return (
		<>
			<Section withSpacing={false} className="bg-avala-ink py-8 text-avala-paper lg:py-10">
				<SectionLabel index="(E)" label="Estimador" meta={companyInfo.hours} />
				<div className="space-y-4 pt-8 lg:pt-12">
					<h1 className="display-tight max-w-[20ch] text-title-page text-avala-paper">
						<SplitReveal text="Configura tu proyecto" stagger={0.018} play />{" "}
						<SplitReveal text="y recibe una estimación inicial" stagger={0.018} delay={0.25} play className="text-avala-neon" />
					</h1>
					<Reveal variants={fadeUp}>
						<p className="max-w-3xl text-base leading-7 text-avala-mute sm:text-lg">
							Responde algunas preguntas y obtén una visión preliminar de alcance, complejidad, tiempo e inversión para tu solución de software, automatización o integración.
						</p>
					</Reveal>

					<Reveal variants={fadeUp}>
						<div className="inline-flex items-center gap-3 border-l-2 border-avala-neon pl-3 text-base text-avala-paper">
							<span className="font-mono text-avala-neon">
								{currentStepIndex + 1}
							</span>
							<span>Paso actual: {currentStep.title}</span>
						</div>
					</Reveal>

					<Reveal variants={fadeUp}>
						<div className="inline-flex items-center gap-3 text-base text-avala-mute">
							<span className="text-avala-neon">
								<Sparkles className="size-4" />
							</span>
							<span>
								Estimación preliminar guiada por módulos, complejidad y alcance
								real.
							</span>
						</div>
					</Reveal>
				</div>
			</Section>

			<Section
				withSpacing={false}
				className="bg-avala-ink pb-10 text-avala-paper lg:pb-16"
			>
				<div className="grid items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
					<div className={cn(estimatorStyles.panel, "min-w-0 p-4 sm:p-6")}>
							<div className="space-y-6">
								<div className="space-y-4">
									<div className="h-px overflow-hidden bg-avala-paper/20">
										<div
											className="h-full bg-[var(--color-avala-neon)] transition-[width] duration-300 motion-reduce:transition-none"
											style={{ width: `${stepProgress}%` }}
										/>
									</div>

									<div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
										{estimatorSteps.map((step, index) => (
											<motion.div
												key={step.id}
												title={step.title}
												initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true, amount: 0.1 }}
												transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.07, ease: "easeOut" }}
												className={cn(
													"border px-3 py-2",
													index === currentStepIndex
														? "border-avala-neon bg-avala-neon/10 text-avala-paper"
														: index < currentStepIndex
															? "border-avala-paper/25 text-avala-paper"
															: "border-avala-paper/10 text-avala-mute",
												)}
											>
												<div className="flex items-start gap-3">
													<span
														className={cn(
															"flex size-8 shrink-0 items-center justify-center font-mono text-xs",
															index <= currentStepIndex
																? "text-avala-neon"
																: "text-avala-mute",
														)}
													>
														{index + 1}
													</span>

													<div className="min-w-0 flex-1">
														<p className="font-mono text-xs uppercase tracking-[0.14em] opacity-75">
															Paso {index + 1}
														</p>
														<p className="mt-1 font-display text-base leading-5 font-semibold break-words whitespace-normal">
															{step.title}
														</p>
													</div>
												</div>
											</motion.div>
										))}
									</div>
								</div>

								<div className="space-y-3">
									<h2 className="display-tight text-3xl leading-tight text-avala-paper sm:text-4xl">
										{currentStep.title}
									</h2>
									{currentStep.description ? (
										<p className="max-w-2xl text-base leading-7 text-avala-mute">
											{currentStep.description}
										</p>
									) : null}
								</div>

								<div className="space-y-6">
									{currentStep.questions.map((question) => (
										<div className="space-y-3" key={question.id}>
											<div className="space-y-1">
												<p id={`${question.id}-label`} className="font-display text-lg font-semibold text-avala-paper">
													{question.title}
												</p>
												{question.description ? (
													<p className="text-base leading-6 text-avala-mute">
														{question.description}
													</p>
												) : null}
											</div>
											{renderQuestion(question)}
										</div>
									))}
								</div>

								<div className="flex flex-col gap-3 border-t border-avala-paper/15 pt-4 sm:flex-row sm:justify-between">
									<Button
										type="button"
										variant="neonSecondary"
										onClick={handleBack}
										disabled={currentStepIndex === 0}
									>
										Volver
									</Button>

									{canShowLeadForm ? (
										<Button
											type="button"
											variant="neon"
											onClick={handleContinueToLead}
											disabled={!canAdvance()}
										>
											Continuar con mis datos
											<ArrowRight className="size-4" />
										</Button>
									) : (
										<Button type="button" variant="neon" onClick={handleNext} disabled={!canAdvance()}>
											Siguiente paso
											<ArrowRight className="size-4" />
										</Button>
									)}
								</div>
							</div>
					</div>

					<Reveal variants={fadeLeft} className="min-w-0 xl:sticky xl:top-24">
						<div>
							<div className={estimatorStyles.panel}>
								<div className="border-b border-avala-paper/15 p-4 sm:p-6">
									<div className="space-y-2">
										<p className={estimatorStyles.label}>
											Estimación preliminar
										</p>
										<h3 className="display-tight text-3xl leading-tight text-avala-paper">
											Tu proyecto ya tiene una primera lectura comercial.
										</h3>
									</div>
								</div>

								<div className="space-y-4 p-4 sm:p-6">
									{hasMinimumData && result ? (
										<>
											<div className="grid gap-3 sm:grid-cols-2">
												<div className={estimatorStyles.metric}>
													<p className={estimatorStyles.label}>
														Complejidad
													</p>
													<p className="display-tight mt-2 text-2xl text-avala-paper">
														{complexityLabels[result.complexity]}
													</p>
													<p className="mt-2 text-base leading-6 text-avala-mute">
														{complexityDescriptions[result.complexity]}
													</p>
												</div>
												<div className={estimatorStyles.metric}>
													<p className={estimatorStyles.label}>
														Enfoque recomendado
													</p>
													<p className="display-tight mt-2 text-2xl text-avala-paper">
														{approachLabels[result.recommendedApproach]}
													</p>
													<p className="mt-2 text-base leading-6 text-avala-mute">
														{result.recommendedApproach === "MVP"
															? "Recomendado para validar hipótesis, lanzar rápido y aprender con una primera versión."
															: result.recommendedApproach === "PROFESSIONAL"
																? "Pensado para una operación real con una base sólida, medible y escalable."
																: "Enfoque orientado a una operación madura con exigencias altas de integración y gobierno."}
													</p>
												</div>
											</div>

											<div className={cn(estimatorStyles.metric, "space-y-3")}>
												<div className="flex items-center gap-2 text-avala-paper">
													<Clock3 className="size-4 text-avala-neon" />
													<p className={estimatorStyles.label}>
														Tiempo estimado
													</p>
												</div>
												<p className="text-base text-avala-mute">
													Entre
												</p>
												<p className="display-tight tabular text-2xl text-avala-paper">
													{result.estimatedMonths.min} y{" "}
													{result.estimatedMonths.max} meses
												</p>
												<p className="text-base leading-6 text-avala-mute">
													Aproximadamente entre {result.estimatedHours.min} y{" "}
													{result.estimatedHours.max} horas de trabajo.
												</p>
											</div>

											<div className="space-y-3 border border-avala-neon/50 bg-avala-neon/5 p-4">
												<div className="flex items-center gap-2 text-avala-paper">
													<CircleDollarSign className="size-4 text-avala-neon" />
													<p className={estimatorStyles.label}>
														Inversión estimada
													</p>
												</div>
												<p className="text-base text-avala-mute">
													Entre
												</p>
												<p className="display-tight tabular text-3xl leading-tight text-avala-neon [overflow-wrap:anywhere]">
													{formatCop(result.estimatedCostCop.min)} y{" "}
													{formatCop(result.estimatedCostCop.max)}
												</p>
												<p className="text-base leading-6 text-avala-mute">
													Esta cifra es una referencia preliminar basada en el
													alcance, complejidad y funcionalidades seleccionadas.
												</p>
												<div className="border-t border-avala-paper/15 pt-3 text-base leading-6 text-avala-mute">
													Esta estimación no constituye una cotización
													definitiva. Un especialista de Avala Group revisará tu
													caso para entregarte una propuesta técnica y económica
													personalizada.
												</div>
											</div>

											<div className="space-y-3">
												<p className="font-display text-lg font-semibold text-avala-paper">
													Módulos detectados
												</p>
												<div className="flex flex-wrap gap-2">
													{result.detectedModules.length > 0 ? (
														result.detectedModules.map((module) => (
															<span
																key={module}
																className="border border-avala-paper/20 px-3 py-2 text-base text-avala-paper"
															>
																{module}
															</span>
														))
													) : (
														<span className="text-base text-avala-mute">
															Selecciona funcionalidades para ver los módulos
															detectados.
														</span>
													)}
												</div>
											</div>

											<div className={estimatorStyles.metric}>
												<div className="space-y-2">
													<p className={estimatorStyles.label}>
														¿Qué sigue?
													</p>
													<p className="text-base leading-6 text-avala-mute">
														Si esta estimación se acerca a lo que necesitás,
														dejanos tus datos y te ayudamos a convertirla en una
														propuesta real, alineada con tu operación y tus
														objetivos.
													</p>
												</div>
											</div>

											{result.warnings.length > 0 ? (
												<div className="space-y-2 border border-amber-300/35 bg-amber-300/5 p-4 text-base leading-6 text-amber-200">
													{result.warnings.map((warning) => (
														<p key={warning}>{warning}</p>
													))}
												</div>
											) : null}
										</>
									) : (
										<div className="space-y-4 border border-dashed border-avala-paper/25 p-4 text-center sm:p-6">
											<div className="mx-auto flex size-10 items-center justify-center text-avala-neon">
												<Sparkles className="size-5" />
											</div>
											<div className="space-y-2">
												<p className="display-tight text-2xl text-avala-paper">
													Completá la configuración para ver tu estimación
												</p>
												<p className="text-base leading-6 text-avala-mute">
													Selecciona al menos el tipo de proyecto, la plataforma
													y una funcionalidad principal para desbloquear la
													complejidad, el tiempo y la inversión estimada.
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</Section>

			<AnimatePresence onExitComplete={handleProposalModalExitComplete}>
				{isProposalModalOpen && canShowLeadForm ? (
					<ProposalDetailsModal
						lead={lead}
						phoneCountry={phoneCountry}
						phoneDigits={phoneDigits}
						onPhoneCountryChange={setPhoneCountry}
						leadErrors={leadErrors}
						leadTouched={leadTouched}
						isLeadValid={isLeadValid}
						isLeadSubmitted={isLeadSubmitted}
						isLeadSubmitting={isLeadSubmitting}
						submitError={leadSubmitError}
						honeypot={honeypot}
						onHoneypotChange={setHoneypot}
						onClose={handleProposalModalClose}
						onLeadChange={handleLeadChange}
						onLeadBlur={() => setLeadTouched(true)}
						onSubmit={handleLeadSubmit}
					/>
				) : null}
			</AnimatePresence>
		</>
	);
}
