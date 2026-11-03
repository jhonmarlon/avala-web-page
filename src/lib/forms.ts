// Envío de formularios a la API (server/), que los reenvía por correo.
// Cada formulario manda un honeypot (`website`) y el tiempo que tardó el usuario en completarlo:
// la API descarta en silencio los envíos de bots.

export const HONEYPOT_FIELD = 'website'

export type SubmitResult = { ok: true } | { ok: false; error: string }

export async function submitForm(
  path: '/api/contact' | '/api/lead',
  payload: Record<string, unknown>,
  meta: { startedAt: number; honeypot: string },
): Promise<SubmitResult> {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        [HONEYPOT_FIELD]: meta.honeypot,
        elapsedMs: Date.now() - meta.startedAt,
      }),
    })
    if (response.ok) return { ok: true }
    if (response.status === 429) return { ok: false, error: 'Recibimos varios envíos seguidos. Esperá unos minutos e intentá de nuevo.' }
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    return { ok: false, error: data?.error ?? 'No pudimos enviar el mensaje.' }
  } catch {
    return { ok: false, error: 'No hay conexión con el servidor.' }
  }
}
