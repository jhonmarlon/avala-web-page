import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { heroContent } from "@/features/home/data/content";
import { fadeLeft, fadeUp, staggerContainer, subtleHover } from "@/lib/motion";
import background1 from "@/assets/background_1.png";
import heroImage from "@/assets/hero.png";

export function HeroSection() {
	const highlightedTitle = heroContent.title.replace(
		heroContent.highlightedText,
		`__${heroContent.highlightedText}__`,
	);

	const titleParts = highlightedTitle.split("__");

	return (
		<Section
			className="relative overflow-hidden pb-24 text-white lg:pb-28"
			containerClassName="pt-8 lg:pt-12"
			style={{
				backgroundImage: `linear-gradient(180deg, rgba(4, 11, 30, 0.82) 0%, rgba(5, 17, 44, 0.62) 100%), url(${background1})`,
				backgroundSize: "cover",
				backgroundPosition: "center top",
			}}
		>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_32%,rgba(43,179,255,0.18),transparent_34%)]"
				animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.04, 1] }}
				transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[46%] bg-[radial-gradient(circle_at_50%_50%,rgba(18,152,255,0.12),transparent_58%)] blur-2xl"
				animate={{ x: [0, -12, 0], opacity: [0.5, 0.75, 0.5] }}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
			/>

			<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10 xl:gap-14">
				<Reveal className="max-w-3xl space-y-7 lg:space-y-8">
					<div className="space-y-5">
						<h1 className="max-w-[17ch] text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-[4.15rem] lg:leading-[1.04] xl:text-[4.6rem]">
							{titleParts[0]}
							<span className="text-brand-400">{titleParts[1]}</span>
							{titleParts[2]}
						</h1>

						<p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
							{heroContent.description}
						</p>
					</div>

					<motion.div
						className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
					>
						<motion.div variants={fadeUp} {...subtleHover}>
							<Button
								to={heroContent.primaryCta.to}
								size="lg"
								className="sm:min-w-[13rem]"
							>
								{heroContent.primaryCta.label}
								<ArrowRight className="size-4" />
							</Button>
						</motion.div>

						<motion.div variants={fadeUp} {...subtleHover}>
							<Button
								to={heroContent.estimatorCta.to}
								variant="secondary"
								size="lg"
								className="sm:min-w-[15rem] border-brand-300/55 bg-[linear-gradient(180deg,rgba(18,152,255,0.25),rgba(37,85,255,0.18))] text-white shadow-[0_18px_40px_rgba(37,85,255,0.18)] hover:border-brand-300 hover:bg-[linear-gradient(180deg,rgba(18,152,255,0.32),rgba(37,85,255,0.24))] hover:text-white"
							>
								{heroContent.estimatorCta.label}
							</Button>
						</motion.div>
					</motion.div>
				</Reveal>

				<Reveal className="relative" variants={fadeLeft}>
					<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(43,179,255,0.3),transparent_55%)] blur-3xl" />

					<motion.div
						className="relative min-h-[23rem] sm:min-h-[29rem] lg:min-h-[34rem]"
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.25 }}
					>
						<motion.div
							variants={fadeUp}
							className="absolute left-1/2 top-1/2 w-full max-w-[42rem] -translate-x-1/2 -translate-y-1/2"
							animate={{ scale: [1, 1.018, 1], y: ["-50%", "-49.2%", "-50%"] }}
							transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
						>
							<img
								src={heroImage}
								alt="Visual de soluciones tecnológicas"
								className="mx-auto w-full object-contain drop-shadow-[0_25px_70px_rgba(18,152,255,0.3)] h-[85%] sm:h-[90%] lg:h-[100%]"
							/>
						</motion.div>
					</motion.div>
				</Reveal>
			</div>
		</Section>
	);
}
