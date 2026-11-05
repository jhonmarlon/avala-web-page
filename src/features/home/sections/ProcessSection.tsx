import { SectionLabel } from '@/components/fx/SectionLabel'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { NumberedStepSequence } from '@/components/ui/NumberedStepSequence'
import { processIntro, processSteps } from '@/features/home/data/content'
import { SequenceIllustration } from '@/components/icons/SequenceIllustration'

const methodScenes = ['discover', 'design', 'build', 'launch', 'optimize'] as const

export function ProcessSection() {
  return (
    <NumberedStepSequence
      id="home-process"
      steps={processSteps.map((step, i) => {
        const scene = methodScenes[i]
        return { ...step, label: `Etapa ${String(i + 1).padStart(2, '0')}`, illustration: scene ? <SequenceIllustration kind={scene} /> : undefined }
      })}
      header={<SectionLabel index="(04)" label="Proceso" meta="Metodología" />}
      intro={
        <div className="flex shrink-0 flex-col justify-between gap-6 py-6 lg:w-[min(42vw,36rem)] lg:pr-8">
          <p className="display-tight text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-avala-paper">
            {processIntro.title}.
            <span className="block text-avala-paper/35">Cinco etapas, cero improvisación.</span>
          </p>
          <p className="hud-label hidden lg:block">Desplazá para recorrer →</p>
        </div>
      }
      footer={<SectionContinue targetId="home-cases" />}
    />
  )
}
