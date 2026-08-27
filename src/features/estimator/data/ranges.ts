import type {
  ComplexityLevel,
  EstimateRange,
  RecommendedApproach,
} from '@/features/estimator/types/estimator.types'

export interface ScoreRangeConfig {
  complexity: ComplexityLevel
  scoreMin: number
  scoreMax: number
  hours: EstimateRange
  months: EstimateRange
  costCop: EstimateRange
  recommendedApproach: RecommendedApproach
}

export const scoreRanges: ScoreRangeConfig[] = [
  {
    complexity: 'LOW',
    scoreMin: 0,
    scoreMax: 20,
    hours: { min: 80, max: 140 },
    months: { min: 1, max: 2 },
    costCop: { min: 6000000, max: 10000000 },
    recommendedApproach: 'MVP',
  },
  {
    complexity: 'MEDIUM',
    scoreMin: 21,
    scoreMax: 40,
    hours: { min: 140, max: 260 },
    months: { min: 2, max: 3 },
    costCop: { min: 10000000, max: 18000000 },
    recommendedApproach: 'MVP',
  },
  {
    complexity: 'MEDIUM_HIGH',
    scoreMin: 41,
    scoreMax: 65,
    hours: { min: 260, max: 420 },
    months: { min: 3, max: 5 },
    costCop: { min: 18000000, max: 30000000 },
    recommendedApproach: 'PROFESSIONAL',
  },
  {
    complexity: 'HIGH',
    scoreMin: 66,
    scoreMax: 90,
    hours: { min: 420, max: 700 },
    months: { min: 4, max: 6 },
    costCop: { min: 30000000, max: 50000000 },
    recommendedApproach: 'PROFESSIONAL',
  },
  {
    complexity: 'ENTERPRISE',
    scoreMin: 91,
    scoreMax: 999,
    hours: { min: 700, max: 1200 },
    months: { min: 6, max: 12 },
    costCop: { min: 50000000, max: 90000000 },
    recommendedApproach: 'ENTERPRISE',
  },
]
