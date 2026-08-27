import { useEffect, useMemo, useRef, useState } from "react";
import {
	ArrowRight,
	CheckCircle2,
	CircleDollarSign,
	Clock3,
	Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import background2 from "@/assets/background_2.png";
import backgroundProjectsPrice from "@/assets/background_projects_price.png";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProposalDetailsModal } from "@/features/estimator/components/ProposalDetailsModal";
import { estimatorSteps } from "@/features/estimator/data/catalog";
import { calculateEstimate } from "@/features/estimator/utils/calculateEstimate";
import type {
	EstimatorAnswers,
	EstimatorLead,
	EstimatorQuestion,
	FeatureCategory,
	MultiSelectQuestion,
	SingleSelectQuestion,
	TextareaQuestion,
} from "@/features/estimator/types/estimator.types";
import { fadeLeft, fadeUp, subtleHoverOnly } from "@/lib/motion";
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

const initialLead: EstimatorLead = {
	fullName: "",
	company: "",
	email: "",
	phone: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9\s-()]{7,}$/;

function formatCop(value: number) {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(value);
}

function validateLead(lead: EstimatorLead) {
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
			lead.phone &&
			lead.phone.trim().length > 0 &&
			!phoneRegex.test(lead.phone.trim())
				? "Ingresa un número de teléfono válido."
				: "",
	};
}

export function EstimatorPage() {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [answers, setAnswers] = useState<EstimatorAnswers>(initialAnswers);
	const [lead, setLead] = useState<EstimatorLead>(initialLead);
	const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);
	const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
	const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
	const [leadTouched, setLeadTouched] = useState(false);
	const submissionTimerRef = useRef<number | null>(null);
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
	const leadErrors = useMemo(() => validateLead(lead), [lead]);
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
		setIsProposalModalOpen(true);
	}

	function resetEstimator() {
		setCurrentStepIndex(0);
		setAnswers(initialAnswers);
		setLead(initialLead);
		setIsLeadSubmitted(false);
		setIsLeadSubmitting(false);
		setLeadTouched(false);
	}

	function handleProposalModalClose() {
		if (submissionTimerRef.current !== null) {
			window.clearTimeout(submissionTimerRef.current);
			submissionTimerRef.current = null;
		}
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
		setLead((current) => ({ ...current, [field]: value }));
		setIsLeadSubmitted(false);
		setIsLeadSubmitting(false);
	}

	function handleLeadSubmit() {
		setLeadTouched(true);
		if (!isLeadValid || isLeadSubmitting) return;

		setIsLeadSubmitting(true);
		submissionTimerRef.current = window.setTimeout(() => {
			submissionTimerRef.current = null;
			setIsLeadSubmitting(false);
			setIsLeadSubmitted(true);
		}, 700);
	}

	useEffect(() => {
		return () => {
			if (submissionTimerRef.current !== null) {
				window.clearTimeout(submissionTimerRef.current);
			}
		};
	}, []);

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
								className={cn(
									"rounded-[1.4rem] border p-5 text-left transition-all duration-200 hover:-translate-y-0.5",
									isSelected
										? "border-brand-500 bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] shadow-[0_18px_40px_rgba(43,179,255,0.14)]"
										: "border-[#dfe8f6] bg-white hover:border-brand-300",
								)}
							>
								<div className="space-y-2">
									<p className="text-base font-semibold text-[#0d1730]">
										{option.label}
									</p>
									{option.description ? (
										<p className="text-sm leading-6 text-muted-foreground">
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
								<span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-700">
									{featureCategoryLabels[category]}
								</span>

								<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
									{options.map((option) => {
										const isSelected = answers.features.includes(option.value);

										return (
											<button
												key={option.value}
												type="button"
												onClick={() => toggleFeature(option.value)}
												className={cn(
													"rounded-[1.35rem] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
													isSelected
														? "border-brand-500 bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] shadow-[0_18px_40px_rgba(43,179,255,0.14)]"
														: "border-[#dfe8f6] bg-white hover:border-brand-300",
												)}
											>
												<div className="flex items-start justify-between gap-3">
													<div className="space-y-2">
														<p className="text-base font-semibold text-[#0d1730]">
															{option.label}
														</p>
													</div>
													<span
														className={cn(
															"flex size-6 items-center justify-center rounded-full border",
															isSelected
																? "border-brand-500 bg-brand-500 text-white"
																: "border-[#d5e1f2]",
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
				value={answers.projectDescription ?? ""}
				onChange={(event) => setTextValue(question.id, event.target.value)}
				placeholder={typedQuestion.placeholder}
				maxLength={typedQuestion.maxLength}
				rows={6}
				className="w-full rounded-[1.4rem] border border-[#dfe8f6] bg-white px-4 py-4 text-sm text-[#0d1730] outline-none transition-colors focus:border-brand-400"
			/>
		);
	}

	return (
		<>
			<Section
				className="relative overflow-hidden pb-18 text-white lg:pb-20"
				style={{
					backgroundImage: `linear-gradient(180deg, rgba(4, 11, 30, 0.82) 0%, rgba(5, 17, 44, 0.7) 100%), url(${backgroundProjectsPrice})`,
					backgroundSize: "cover",
					backgroundPosition: "center top",
				}}
			>
				<motion.div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 left-[-12%] -z-10 w-[56%] bg-[radial-gradient(circle_at_center,rgba(43,179,255,0.12),transparent_58%)] blur-2xl"
					animate={{ x: [0, 16, 0], opacity: [0.42, 0.7, 0.42] }}
					transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-[48%] -z-10 h-28 bg-[linear-gradient(90deg,transparent_0%,rgba(43,179,255,0.16)_48%,transparent_100%)] blur-2xl"
					animate={{ x: ["-8%", "8%", "-8%"], opacity: [0.22, 0.4, 0.22] }}
					transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
				/>

				<div className="max-w-4xl space-y-5 pt-8 lg:pt-12">
					<Heading
						title="Configura tu proyecto y recibe una estimación inicial"
						description="Responde algunas preguntas y obtén una visión preliminar de alcance, complejidad, tiempo e inversión para tu solución de software, automatización o integración."
						className="[&_h2]:text-[2.3rem] [&_h2]:leading-[1.08] [&_h2]:text-white [&_p]:max-w-3xl [&_p]:text-slate-300"
					/>

					<Reveal variants={fadeUp}>
						<div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur-sm">
							<span className="flex size-8 items-center justify-center rounded-full bg-brand-500/18 font-semibold text-brand-100">
								{currentStepIndex + 1}
							</span>
							<span>Paso actual: {currentStep.title}</span>
						</div>
					</Reveal>

					<Reveal variants={fadeUp}>
						<div className="inline-flex items-center gap-3 rounded-[1.2rem] border border-brand-400/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-3 text-sm text-slate-200 shadow-[0_16px_40px_rgba(5,17,44,0.22)] backdrop-blur-sm">
							<span className="flex size-9 items-center justify-center rounded-full bg-brand-500/20 text-brand-100">
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
				className="relative z-20 -mt-10 pb-16 lg:-mt-12 lg:pb-20"
			>
				<div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
					<Card className="rounded-[1.9rem] border-[#d8e4f4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_24px_60px_rgba(8,20,39,0.12)] lg:p-8">
							<div className="space-y-8">
								<div className="space-y-4">
									<div className="h-2 overflow-hidden rounded-full bg-[#dfe8f6]">
										<div
											className="h-full rounded-full bg-[linear-gradient(90deg,#1298ff_0%,#6d5cff_100%)] transition-all duration-300"
											style={{ width: `${stepProgress}%` }}
										/>
									</div>

									<motion.div
										className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.6, ease: "easeOut" }}
									>
										{estimatorSteps.map((step, index) => (
											<div
												key={step.id}
												title={step.title}
												className={cn(
													"min-h-[5rem] rounded-[1.25rem] border px-4 py-3 transition-all duration-200",
													index === currentStepIndex
														? "border-brand-500 bg-[linear-gradient(180deg,#1298ff_0%,#2555ff_100%)] text-white shadow-[0_18px_38px_rgba(37,85,255,0.22)]"
														: index < currentStepIndex
															? "border-brand-200 bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] text-brand-700 shadow-[0_12px_28px_rgba(43,179,255,0.08)]"
															: "border-[#dbe5f2] bg-white text-slate-500",
												)}
											>
												<div className="flex items-start gap-3">
													<span
														className={cn(
															"flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
															index === currentStepIndex
																? "bg-white/18 text-white"
																: index < currentStepIndex
																	? "bg-brand-100 text-brand-700"
																	: "bg-slate-100 text-slate-500",
														)}
													>
														{index + 1}
													</span>

													<div className="min-w-0 flex-1">
														<p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] opacity-75">
															Paso {index + 1}
														</p>
														<p className="mt-1 text-[0.92rem] leading-5 font-semibold break-words whitespace-normal">
															{step.title}
														</p>
													</div>
												</div>
											</div>
										))}
									</motion.div>
								</div>

								<div className="space-y-3">
									<h2 className="text-[2rem] font-bold leading-[1.1] text-[#0d1730]">
										{currentStep.title}
									</h2>
									{currentStep.description ? (
										<p className="max-w-2xl text-sm leading-7 text-muted-foreground">
											{currentStep.description}
										</p>
									) : null}
								</div>

								<div className="space-y-6">
									{currentStep.questions.map((question) => (
										<div className="space-y-3" key={question.id}>
											<div className="space-y-1">
												<p className="text-base font-semibold text-[#0d1730]">
													{question.title}
												</p>
												{question.description ? (
													<p className="text-sm leading-6 text-muted-foreground">
														{question.description}
													</p>
												) : null}
											</div>
											{renderQuestion(question)}
										</div>
									))}
								</div>

								<div className="flex flex-col gap-3 border-t border-[#dfe8f6] pt-6 sm:flex-row sm:justify-between">
									<Button
										variant="ghost"
										className="justify-start"
										onClick={handleBack}
										disabled={currentStepIndex === 0}
									>
										Volver
									</Button>

									{canShowLeadForm ? (
										<Button
											onClick={handleContinueToLead}
											disabled={!canAdvance()}
										>
											Continuar con mis datos
											<ArrowRight className="size-4" />
										</Button>
									) : (
										<Button onClick={handleNext} disabled={!canAdvance()}>
											Siguiente paso
											<ArrowRight className="size-4" />
										</Button>
									)}
								</div>
							</div>
					</Card>

					<Reveal variants={fadeLeft} className="space-y-6 xl:sticky xl:top-24">
						<motion.div {...subtleHoverOnly}>
							<Card className="overflow-hidden rounded-[1.9rem] border-[#d8e4f4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-0 shadow-[0_24px_60px_rgba(8,20,39,0.12)]">
								<div
									className="border-b border-white/10 px-6 py-6 text-white lg:px-8"
									style={{
										backgroundImage: `linear-gradient(180deg, rgba(4, 11, 30, 0.84) 0%, rgba(5, 17, 44, 0.78) 100%), url(${background2})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								>
									<div className="space-y-2">
										<p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-100">
											Estimación preliminar
										</p>
										<h3 className="text-[1.8rem] font-bold leading-[1.1] text-white">
											Tu proyecto ya tiene una primera lectura comercial.
										</h3>
									</div>
								</div>

								<div className="space-y-6 p-6 lg:p-8">
									{hasMinimumData && result ? (
										<>
											<div className="grid gap-4 sm:grid-cols-2">
												<div className="rounded-[1.35rem] border border-[#dfe8f6] bg-white p-4 shadow-[0_12px_30px_rgba(8,20,39,0.04)]">
													<p className="text-xs uppercase tracking-[0.16em] text-slate-500">
														Complejidad
													</p>
													<p className="mt-2 text-lg font-semibold text-[#0d1730]">
														{complexityLabels[result.complexity]}
													</p>
													<p className="mt-2 text-sm leading-6 text-muted-foreground">
														{complexityDescriptions[result.complexity]}
													</p>
												</div>
												<div className="rounded-[1.35rem] border border-[#dfe8f6] bg-white p-4 shadow-[0_12px_30px_rgba(8,20,39,0.04)]">
													<p className="text-xs uppercase tracking-[0.16em] text-slate-500">
														Enfoque recomendado
													</p>
													<p className="mt-2 text-lg font-semibold text-[#0d1730]">
														{approachLabels[result.recommendedApproach]}
													</p>
													<p className="mt-2 text-sm leading-6 text-muted-foreground">
														{result.recommendedApproach === "MVP"
															? "Recomendado para validar hipótesis, lanzar rápido y aprender con una primera versión."
															: result.recommendedApproach === "PROFESSIONAL"
																? "Pensado para una operación real con una base sólida, medible y escalable."
																: "Enfoque orientado a una operación madura con exigencias altas de integración y gobierno."}
													</p>
												</div>
											</div>

											<div className="space-y-3 rounded-[1.5rem] border border-[#dfe8f6] bg-white p-5 shadow-[0_12px_30px_rgba(8,20,39,0.04)]">
												<div className="flex items-center gap-2 text-[#0d1730]">
													<Clock3 className="size-4 text-brand-500" />
													<p className="text-xs uppercase tracking-[0.16em] text-slate-500">
														Tiempo estimado
													</p>
												</div>
												<p className="text-sm font-medium text-brand-700">
													Entre
												</p>
												<p className="text-lg font-semibold text-[#0d1730]">
													{result.estimatedMonths.min} y{" "}
													{result.estimatedMonths.max} meses
												</p>
												<p className="text-sm leading-6 text-muted-foreground">
													Aproximadamente entre {result.estimatedHours.min} y{" "}
													{result.estimatedHours.max} horas de trabajo.
												</p>
											</div>

											<div className="space-y-3 rounded-[1.5rem] border border-brand-200 bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] p-5 shadow-[0_16px_35px_rgba(43,179,255,0.1)]">
												<div className="flex items-center gap-2 text-[#0d1730]">
													<CircleDollarSign className="size-4 text-brand-500" />
													<p className="text-xs uppercase tracking-[0.16em] text-brand-700">
														Inversión estimada
													</p>
												</div>
												<p className="text-sm font-medium text-brand-700">
													Entre
												</p>
												<p className="text-[1.9rem] font-extrabold leading-none text-[#0d1730]">
													{formatCop(result.estimatedCostCop.min)} y{" "}
													{formatCop(result.estimatedCostCop.max)}
												</p>
												<p className="text-sm leading-6 text-muted-foreground">
													Esta cifra es una referencia preliminar basada en el
													alcance, complejidad y funcionalidades seleccionadas.
												</p>
												<div className="rounded-[1rem] border border-brand-100 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-600">
													Esta estimación no constituye una cotización
													definitiva. Un especialista de Avala Group revisará tu
													caso para entregarte una propuesta técnica y económica
													personalizada.
												</div>
											</div>

											<div className="space-y-3">
												<p className="text-sm font-semibold text-[#0d1730]">
													Módulos detectados
												</p>
												<div className="flex flex-wrap gap-2">
													{result.detectedModules.length > 0 ? (
														result.detectedModules.map((module) => (
															<span
																key={module}
																className="rounded-full border border-[#dbe5f2] bg-white px-3 py-2 text-xs font-medium text-slate-600"
															>
																{module}
															</span>
														))
													) : (
														<span className="text-sm text-muted-foreground">
															Selecciona funcionalidades para ver los módulos
															detectados.
														</span>
													)}
												</div>
											</div>

											<div className="rounded-[1.4rem] border border-[#dfe8f6] bg-white p-5 shadow-[0_12px_30px_rgba(8,20,39,0.04)]">
												<div className="space-y-2">
													<p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
														¿Qué sigue?
													</p>
													<p className="text-sm leading-6 text-slate-600">
														Si esta estimación se acerca a lo que necesitás,
														dejanos tus datos y te ayudamos a convertirla en una
														propuesta real, alineada con tu operación y tus
														objetivos.
													</p>
												</div>
											</div>

											{result.warnings.length > 0 ? (
												<div className="space-y-2 rounded-[1.3rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
													{result.warnings.map((warning) => (
														<p key={warning}>{warning}</p>
													))}
												</div>
											) : null}
										</>
									) : (
										<div className="space-y-4 rounded-[1.5rem] border border-dashed border-[#cfe0f6] bg-[linear-gradient(180deg,#fbfdff_0%,#f5f9ff_100%)] p-6 text-center shadow-[0_12px_30px_rgba(8,20,39,0.04)]">
											<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
												<Sparkles className="size-5" />
											</div>
											<div className="space-y-2">
												<p className="text-lg font-semibold text-[#0d1730]">
													Completá la configuración para ver tu estimación
												</p>
												<p className="text-sm leading-6 text-muted-foreground">
													Selecciona al menos el tipo de proyecto, la plataforma
													y una funcionalidad principal para desbloquear la
													complejidad, el tiempo y la inversión estimada.
												</p>
											</div>
										</div>
									)}
								</div>
							</Card>
						</motion.div>
					</Reveal>
				</div>
			</Section>

			<AnimatePresence onExitComplete={handleProposalModalExitComplete}>
				{isProposalModalOpen && canShowLeadForm ? (
					<ProposalDetailsModal
						lead={lead}
						leadErrors={leadErrors}
						leadTouched={leadTouched}
						isLeadValid={isLeadValid}
						isLeadSubmitted={isLeadSubmitted}
						isLeadSubmitting={isLeadSubmitting}
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
