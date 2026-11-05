import type { ReactElement } from 'react'

export type SceneMaterials = { surface: string; accent: string; edge: string }
export type SceneRenderer = (materials: SceneMaterials) => ReactElement
