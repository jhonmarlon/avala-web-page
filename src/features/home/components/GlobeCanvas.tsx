import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import cloudsUrl from '@/assets/earth/earth_clouds_1024.png'
import dayUrl from '@/assets/earth/earth_atmos_2048.jpg'
import lightsUrl from '@/assets/earth/earth_lights_2048.png'
import normalUrl from '@/assets/earth/earth_normal_2048.jpg'
import specularUrl from '@/assets/earth/earth_specular_2048.jpg'
import { prefersReducedMotion } from '@/lib/smooth-scroll'
import { cn } from '@/lib/utils'

type City = { name: string; lat: number; lon: number }

const origin: City = { name: 'MEDELLÍN', lat: 6.2442, lon: -75.5812 }

const cities: City[] = [
  { name: 'BOGOTÁ', lat: 4.711, lon: -74.0721 },
  { name: 'MIAMI', lat: 25.7617, lon: -80.1918 },
  { name: 'CDMX', lat: 19.4326, lon: -99.1332 },
  { name: 'NEW YORK', lat: 40.7128, lon: -74.006 },
  { name: 'MADRID', lat: 40.4168, lon: -3.7038 },
  { name: 'LIMA', lat: -12.0464, lon: -77.0428 },
  { name: 'SANTIAGO', lat: -33.4489, lon: -70.6693 },
  { name: 'SÃO PAULO', lat: -23.5505, lon: -46.6333 },
]

const DEG = Math.PI / 180
const NEON = 0x2fb8ff
const CYAN = 0x3fd0ff
const VIOLET = 0x7b5cff

// Misma convención que el mapeo UV de SphereGeometry (textura equirectangular)
function toVec(lat: number, lon: number, radius = 1) {
  const phi = (lon + 180) * DEG
  const theta = (90 - lat) * DEG
  return new THREE.Vector3(
    -Math.sin(theta) * Math.cos(phi) * radius,
    Math.cos(theta) * radius,
    Math.sin(theta) * Math.sin(phi) * radius,
  )
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return [canvas, canvas.getContext('2d')!] as const
}

function glowTexture() {
  const [canvas, ctx] = makeCanvas(64, 64)
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

// Halo atmosférico detrás del planeta (en unidades del radio terrestre)
function haloTexture() {
  const [canvas, ctx] = makeCanvas(512, 512)
  const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  g.addColorStop(0, 'rgba(47,184,255,0)')
  g.addColorStop(0.62, 'rgba(47,184,255,0.55)')
  g.addColorStop(0.7, 'rgba(63,160,255,0.28)')
  g.addColorStop(0.84, 'rgba(123,92,255,0.08)')
  g.addColorStop(1, 'rgba(123,92,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 512)
  return new THREE.CanvasTexture(canvas)
}

const rimShader = {
  uniforms: { color: { value: new THREE.Color(NEON) } },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
      gl_FragColor = vec4(color * f * 1.3, f);
    }
  `,
}

function arcPoints(target: City) {
  const a = toVec(origin.lat, origin.lon)
  const b = toVec(target.lat, target.lon)
  const dist = a.angleTo(b)
  const lift = 0.05 + dist * 0.2
  const q = new THREE.Quaternion()
  const full = new THREE.Quaternion().setFromUnitVectors(a, b)
  return Array.from({ length: 81 }, (_, i) => {
    const t = i / 80
    q.identity().slerp(full, t)
    return a.clone().applyQuaternion(q).multiplyScalar(1 + Math.sin(Math.PI * t) * lift)
  })
}

export function GlobeCanvas({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const labelsEl = labelsRef.current
    if (!wrap || !canvas || !labelsEl) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const reduced = prefersReducedMotion()
    const disposables: { dispose: () => void }[] = [renderer]
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item)
      return item
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)

    scene.add(new THREE.HemisphereLight(0x9cc4ff, 0x0a1030, 1.1))
    const sun = new THREE.DirectionalLight(0xffffff, 2.6)
    sun.position.set(-4, 2.5, 5)
    scene.add(sun)
    const rimLight = new THREE.DirectionalLight(0x7b5cff, 1.2)
    rimLight.position.set(5, -1, -2)
    scene.add(rimLight)

    const halo = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: track(haloTexture()), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })),
    )
    halo.scale.setScalar(1.6 / 0.62)
    scene.add(halo)

    const globe = new THREE.Group()
    scene.add(globe)

    // Texturas satelitales (three.js examples / NASA): se cargan aparte para no bloquear el primer frame
    let alive = true
    const loader = new THREE.TextureLoader()
    const load = (url: string, color = false) => {
      const texture = track(
        loader.load(url, () => {
          if (alive) render(performance.now())
        }),
      )
      if (color) texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      return texture
    }

    const sunDirection = new THREE.Vector3(-4, 2.5, 5).normalize()
    const earthMaterial = track(
      new THREE.MeshPhongMaterial({
        map: load(dayUrl, true),
        specularMap: load(specularUrl),
        normalMap: load(normalUrl),
        normalScale: new THREE.Vector2(0.9, 0.9),
        specular: new THREE.Color(0x4a78b0),
        shininess: 18,
        emissiveMap: load(lightsUrl, true),
        emissive: new THREE.Color(0xffc87a),
        emissiveIntensity: 1.6,
      }),
    )
    // Las luces de ciudades solo aparecen en el lado nocturno
    earthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.sunDirection = { value: sunDirection }
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform vec3 sunDirection;\nvoid main() {')
        .replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\ntotalEmissiveRadiance *= smoothstep(0.15, -0.25, dot(normal, sunDirection));',
        )
    }
    globe.add(new THREE.Mesh(track(new THREE.SphereGeometry(1, 96, 96)), earthMaterial))

    const clouds = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.01, 64, 64)),
      track(new THREE.MeshLambertMaterial({ map: load(cloudsUrl, true), transparent: true, opacity: 0.8, depthWrite: false })),
    )
    globe.add(clouds)

    const rim = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.004, 64, 64)),
      track(new THREE.ShaderMaterial({ ...rimShader, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })),
    )
    scene.add(rim)

    // Arcos de datos desde Medellín
    const glow = track(glowTexture())
    const sprite = (hex: number, size: number) => {
      const s = new THREE.Sprite(
        track(new THREE.SpriteMaterial({ map: glow, color: hex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })),
      )
      s.scale.setScalar(size)
      return s
    }

    // Tubos en vez de líneas: WebGL ignora linewidth y una línea de 1px se pierde sobre el planeta
    const SEGMENTS = 80
    const RADIAL = 6
    const arcs = cities.map((city, index) => {
      const points = arcPoints(city)
      const curve = new THREE.CatmullRomCurve3(points)
      globe.add(
        new THREE.Mesh(
          track(new THREE.TubeGeometry(curve, SEGMENTS, 0.0035, RADIAL)),
          track(new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.75 })),
        ),
      )
      const trail = new THREE.Mesh(
        track(new THREE.TubeGeometry(curve, SEGMENTS, 0.0065, RADIAL)),
        track(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })),
      )
      globe.add(trail)
      const head = sprite(CYAN, 0.08)
      globe.add(head)
      const end = sprite(NEON, 0.07)
      end.position.copy(points[points.length - 1])
      globe.add(end)
      return { city, points, trail, head, offset: index / cities.length, speed: 0.12 + (index % 3) * 0.035 }
    })

    // HQ: anillo con pulso orientado a la superficie
    const hqNormal = toVec(origin.lat, origin.lon)
    const ringGeometry = track(new THREE.RingGeometry(0.016, 0.019, 48))
    const makeRing = () => {
      const mesh = new THREE.Mesh(
        ringGeometry,
        track(new THREE.MeshBasicMaterial({ color: NEON, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })),
      )
      mesh.position.copy(hqNormal).multiplyScalar(1.004)
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), hqNormal)
      globe.add(mesh)
      return mesh
    }
    makeRing()
    const pulseRing = makeRing()
    const hqGlow = sprite(NEON, 0.09)
    hqGlow.position.copy(hqNormal).multiplyScalar(1.01)
    globe.add(hqGlow)

    // Etiquetas HTML proyectadas desde 3D
    const labelItems = [
      { text: `${origin.name} · HQ`, at: hqNormal.clone().multiplyScalar(1.01), hq: true },
      ...arcs.map((arc) => ({ text: arc.city.name, at: arc.points[arc.points.length - 1], hq: false })),
    ].map((item) => {
      const el = document.createElement('span')
      el.textContent = item.text
      el.className = cn(
        'absolute left-0 top-0 whitespace-nowrap font-mono tracking-[0.12em] will-change-transform',
        item.hq ? 'text-[10px] font-semibold text-avala-neon' : 'text-[10px] text-avala-paper/80',
      )
      el.style.textShadow = '0 0 8px rgba(3,8,20,0.9)'
      labelsEl.appendChild(el)
      return { ...item, el }
    })

    // Rotación: centrada en Medellín con deriva suave + arrastre con inercia
    const baseRot = -Math.atan2(hqNormal.x, hqNormal.z) - 0.18
    const baseTilt = 0.32
    const drag = { active: false, lastX: 0, lastY: 0, offRot: 0, offTilt: 0, velRot: 0 }
    let width = 0
    let height = 0

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      // El planeta ocupa ~80% del lado menor
      const fit = 1 / (0.8 * Math.tan((camera.fov / 2) * DEG))
      camera.position.set(0, 0, camera.aspect < 1 ? fit / camera.aspect : fit)
      camera.updateProjectionMatrix()
    }

    const projected = new THREE.Vector3()
    const toCamera = new THREE.Vector3()

    const render = (time: number) => {
      const t = time / 1000
      if (!drag.active) {
        drag.offRot += drag.velRot
        drag.velRot *= 0.94
        drag.offRot *= 0.985
        drag.offTilt *= 0.97
      }
      globe.rotation.set(baseTilt + drag.offTilt, baseRot + Math.sin(t * 0.12) * 0.35 + drag.offRot, 0)
      clouds.rotation.y = reduced ? 0 : t * 0.012

      for (const arc of arcs) {
        const head = reduced ? 1 : (t * arc.speed + arc.offset) % 1
        const index = Math.floor(head * (arc.points.length - 1))
        // Cada segmento del tubo son RADIAL * 6 índices
        const length = 14
        const from = Math.max(0, index - length)
        arc.trail.geometry.setDrawRange(from * RADIAL * 6, (index - from) * RADIAL * 6)
        arc.head.position.copy(arc.points[index])
      }

      const pulse = reduced ? 0 : (t * 0.6) % 1
      pulseRing.scale.setScalar(1 + pulse * 4)
      ;(pulseRing.material as THREE.MeshBasicMaterial).opacity = 1 - pulse

      globe.updateMatrixWorld()
      for (const label of labelItems) {
        projected.copy(label.at).applyMatrix4(globe.matrixWorld)
        toCamera.copy(camera.position).sub(projected).normalize()
        const facing = projected.clone().normalize().dot(toCamera)
        projected.project(camera)
        const x = (projected.x * 0.5 + 0.5) * width
        const y = (-projected.y * 0.5 + 0.5) * height
        label.el.style.transform = `translate(${x + 10}px, ${y - (label.hq ? 16 : 6)}px)`
        label.el.style.opacity = String(Math.max(0, Math.min(1, (facing - 0.15) * 4)))
      }

      renderer.render(scene, camera)
    }

    let frame = 0
    let running = false
    const loop = (time: number) => {
      render(time)
      if (running) frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const onDown = (event: PointerEvent) => {
      drag.active = true
      drag.lastX = event.clientX
      drag.lastY = event.clientY
      canvas.setPointerCapture(event.pointerId)
    }
    const onMove = (event: PointerEvent) => {
      if (!drag.active) return
      const dx = event.clientX - drag.lastX
      const dy = event.clientY - drag.lastY
      drag.lastX = event.clientX
      drag.lastY = event.clientY
      drag.velRot = dx * 0.006
      drag.offRot += dx * 0.006
      drag.offTilt = Math.max(-0.6, Math.min(0.6, drag.offTilt + dy * 0.004))
      if (reduced) render(performance.now())
    }
    const onUp = () => {
      drag.active = false
    }

    resize()
    render(performance.now())

    const resizeObserver = new ResizeObserver(() => {
      resize()
      render(performance.now())
    })
    resizeObserver.observe(wrap)

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    visibility.observe(wrap)

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    return () => {
      alive = false
      stop()
      resizeObserver.disconnect()
      visibility.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      labelsEl.replaceChildren()
      for (const item of disposables) item.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} className={cn('relative', className)} data-cursor="Arrastrar">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div ref={labelsRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  )
}
