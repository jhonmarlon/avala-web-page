import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView'
import { termsOfUse } from '@/features/legal/data/documents'

export function TermsPage() {
  return <LegalDocumentView document={termsOfUse} related={{ to: '/privacidad', label: 'Política de privacidad' }} />
}
