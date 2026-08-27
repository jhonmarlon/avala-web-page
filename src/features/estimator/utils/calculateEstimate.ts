import { estimatorSteps } from '@/features/estimator/data/catalog'
import { scoreRanges } from '@/features/estimator/data/ranges'
import type {
  EstimatorAnswers,
  EstimateResult,
  MultiSelectQuestion,
  SingleSelectQuestion,
} from '@/features/estimator/types/estimator.types'

function interpolateRange(
  score: number,
  scoreMin: number,
  scoreMax: number,
  valueMin: number,
  valueMax: number,
  windowRatio = 0.35,
) {
  if (scoreMax <= scoreMin) {
    return { min: valueMin, max: valueMax }
  }

  const progress = Math.max(0, Math.min(1, (score - scoreMin) / (scoreMax - scoreMin)))
  const totalSpan = valueMax - valueMin
  const windowSize = Math.max(totalSpan * windowRatio, totalSpan * 0.22)
  const rangeStart = valueMin + (totalSpan - windowSize) * progress

  return {
    min: Math.round(rangeStart),
    max: Math.round(rangeStart + windowSize),
  }
}

export function calculateEstimate(answers: EstimatorAnswers): EstimateResult {
  let baseScore = 0
  let featureScore = 0
  const detectedModules: string[] = []
  const warnings: string[] = []

  for (const step of estimatorSteps) {
    for (const question of step.questions) {
      if (question.id === 'projectType' && answers.projectType && question.type === 'single-select') {
        const selected = (question as SingleSelectQuestion).options.find(
          (option) => option.value === answers.projectType,
        )

        if (selected) baseScore += selected.points
      }

      if (question.id === 'platform' && answers.platform && question.type === 'single-select') {
        const selected = (question as SingleSelectQuestion).options.find(
          (option) => option.value === answers.platform,
        )

        if (selected) baseScore += selected.points
      }

      if (question.id === 'userComplexity' && answers.userComplexity && question.type === 'single-select') {
        const selected = (question as SingleSelectQuestion).options.find(
          (option) => option.value === answers.userComplexity,
        )

        if (selected) baseScore += selected.points
      }

      if (question.id === 'securityLevel' && answers.securityLevel && question.type === 'single-select') {
        const selected = (question as SingleSelectQuestion).options.find(
          (option) => option.value === answers.securityLevel,
        )

        if (selected) baseScore += selected.points
      }

      if (question.id === 'productLevel' && answers.productLevel && question.type === 'single-select') {
        const selected = (question as SingleSelectQuestion).options.find(
          (option) => option.value === answers.productLevel,
        )

        if (selected) baseScore += selected.points
      }

      if (question.id === 'urgency' && answers.urgency && question.type === 'single-select') {
        const selected = (question as SingleSelectQuestion).options.find(
          (option) => option.value === answers.urgency,
        )

        if (selected) baseScore += selected.points
      }

      if (question.id === 'features' && question.type === 'multi-select') {
        const selectedFeatures = (question as MultiSelectQuestion).options.filter((option) =>
          answers.features.includes(option.value),
        )

        for (const feature of selectedFeatures) {
          featureScore += feature.points
          detectedModules.push(feature.label)
        }
      }
    }
  }

  const featureSelectionBonus = Math.max(0, answers.features.length - 1) * 1.5
  const weightedFeatureScore = Math.round(featureScore * 1.35 + featureSelectionBonus)
  const score = baseScore + weightedFeatureScore

  if (!answers.projectType) warnings.push('No se seleccionó tipo de proyecto.')
  if (!answers.platform) warnings.push('No se seleccionó plataforma.')
  if (answers.features.length === 0) warnings.push('No se seleccionaron funcionalidades.')

  const range = scoreRanges.find((item) => score >= item.scoreMin && score <= item.scoreMax)

  if (!range) {
    throw new Error('No se encontró un rango válido para la estimación.')
  }

  return {
    score,
    complexity: range.complexity,
    estimatedHours: interpolateRange(
      score,
      range.scoreMin,
      range.scoreMax,
      range.hours.min,
      range.hours.max,
      0.34,
    ),
    estimatedMonths: interpolateRange(
      score,
      range.scoreMin,
      range.scoreMax,
      range.months.min,
      range.months.max,
      0.45,
    ),
    estimatedCostCop: interpolateRange(
      score,
      range.scoreMin,
      range.scoreMax,
      range.costCop.min,
      range.costCop.max,
      0.32,
    ),
    recommendedApproach: range.recommendedApproach,
    detectedModules,
    warnings,
  }
}
