export type ProjectType =
  | 'WEB_APP'
  | 'MOBILE_APP'
  | 'BUSINESS_PLATFORM'
  | 'AUTOMATION'
  | 'SYSTEM_INTEGRATION'
  | 'AI_SOLUTION'
  | 'ECOMMERCE'
  | 'CUSTOM'

export type PlatformType =
  | 'WEB_ONLY'
  | 'RESPONSIVE_WEB'
  | 'HYBRID_APP'
  | 'ANDROID_IOS'
  | 'BACKOFFICE_PLUS_CLIENT_APP'

export type ComplexityLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'MEDIUM_HIGH'
  | 'HIGH'
  | 'ENTERPRISE'

export type RecommendedApproach = 'MVP' | 'PROFESSIONAL' | 'ENTERPRISE'

export type EstimatorStepId =
  | 'project-type'
  | 'platform'
  | 'features'
  | 'operational-complexity'
  | 'business-context'
  | 'summary'
  | 'lead'

export type FeatureCategory = 'CORE' | 'BUSINESS' | 'INTEGRATION' | 'ADVANCED'

export type QuestionType = 'single-select' | 'multi-select' | 'textarea'

export interface ScoredOption<TValue extends string = string> {
  label: string
  value: TValue
  points: number
  description?: string
}

export interface FeatureOption extends ScoredOption {
  category: FeatureCategory
}

export interface BaseQuestion {
  id: string
  stepId: EstimatorStepId
  title: string
  description?: string
  type: QuestionType
  required?: boolean
}

export interface SingleSelectQuestion extends BaseQuestion {
  type: 'single-select'
  options: ScoredOption[]
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi-select'
  options: FeatureOption[]
  minSelections?: number
}

export interface TextareaQuestion extends BaseQuestion {
  type: 'textarea'
  placeholder?: string
  maxLength?: number
}

export type EstimatorQuestion =
  | SingleSelectQuestion
  | MultiSelectQuestion
  | TextareaQuestion

export interface EstimatorStep {
  id: EstimatorStepId
  title: string
  description?: string
  questions: EstimatorQuestion[]
}

export interface EstimatorAnswers {
  projectType?: ProjectType
  platform?: PlatformType
  features: string[]
  userComplexity?: string
  securityLevel?: string
  productLevel?: string
  budgetRange?: string
  urgency?: string
  projectDescription?: string
}

export interface EstimatorLead {
  fullName: string
  company?: string
  email: string
  phone?: string
}

export interface EstimateRange {
  min: number
  max: number
}

export interface EstimateResult {
  score: number
  complexity: ComplexityLevel
  estimatedHours: EstimateRange
  estimatedMonths: EstimateRange
  estimatedCostCop: EstimateRange
  recommendedApproach: RecommendedApproach
  detectedModules: string[]
  warnings: string[]
}

export interface EstimatorSubmission {
  answers: EstimatorAnswers
  lead?: EstimatorLead
  result: EstimateResult
  createdAt: string
  source: 'WEB_ESTIMATOR'
}
