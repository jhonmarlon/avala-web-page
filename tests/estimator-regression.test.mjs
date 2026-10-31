import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateEstimate } from '../src/features/estimator/utils/calculateEstimate.ts'

const fixtures = [
  {
    name: 'missing selections retain ordered warnings',
    answers: { features: [] },
    expected: {
      score: 0, complexity: 'LOW', estimatedHours: { min: 80, max: 100 },
      estimatedMonths: { min: 1, max: 1 }, estimatedCostCop: { min: 6000000, max: 7280000 },
      recommendedApproach: 'MVP', detectedModules: [],
      warnings: ['No se seleccionó tipo de proyecto.', 'No se seleccionó plataforma.', 'No se seleccionaron funcionalidades.'],
    },
  },
  {
    name: 'early estimate retains all metrics and module labels',
    answers: { projectType: 'WEB_APP', platform: 'RESPONSIVE_WEB', features: ['AUTH'] },
    expected: {
      score: 28, complexity: 'MEDIUM', estimatedHours: { min: 169, max: 210 },
      estimatedMonths: { min: 2, max: 3 }, estimatedCostCop: { min: 12004211, max: 14564211 },
      recommendedApproach: 'MVP', detectedModules: ['Registro / login'], warnings: [],
    },
  },
  {
    name: 'complete enterprise configuration retains metrics and catalog module order',
    answers: {
      projectType: 'BUSINESS_PLATFORM', platform: 'BACKOFFICE_PLUS_CLIENT_APP',
      features: ['AUTH', 'PAYMENTS', 'CRM_ERP', 'RAG', 'MULTI_TENANT'],
      userComplexity: 'ORGANIZATIONS', securityLevel: 'ENTERPRISE_SECURITY',
      productLevel: 'ENTERPRISE', budgetRange: 'GT_40M', urgency: 'READY_TO_SCOPE',
      projectDescription: 'Una plataforma empresarial',
    },
    expected: {
      score: 144, complexity: 'ENTERPRISE', estimatedHours: { min: 719, max: 889 },
      estimatedMonths: { min: 6, max: 9 }, estimatedCostCop: { min: 51587665, max: 64387665 },
      recommendedApproach: 'ENTERPRISE',
      detectedModules: ['Registro / login', 'Pagos online', 'CRM / ERP', 'RAG / documentos inteligentes', 'Multiempresa'],
      warnings: [],
    },
  },
]

for (const { name, answers, expected } of fixtures) {
  test(`estimator preservation: ${name}`, () => {
    const before = structuredClone(answers)
    assert.deepEqual(calculateEstimate(answers), expected)
    assert.deepEqual(answers, before)
  })
}
