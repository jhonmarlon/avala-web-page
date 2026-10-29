import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView'
import { privacyPolicy } from '@/features/legal/data/documents'

export function PrivacyPage() {
  return <LegalDocumentView document={privacyPolicy} related={{ to: '/terminos', label: 'Términos y condiciones' }} />
}
