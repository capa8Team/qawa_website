# Guía de la Tech Demo

Esta guía explica la arquitectura recomendada y pasos para integrar una demo técnica accesible desde los botones "Probar demo" y "Solicitar demo".

## Resumen y objetivo
- Ofrecer una demo interactiva que pueda abrirse rápidamente desde un modal/preview y también como una experiencia completa en `/demo`.
- Mantener la demo aislada (preferible en un `iframe`) para reducir riesgos y facilitar su desarrollo independiente.
- Permitir un modo guiado (tour) que pueda controlarse vía query params o fragmentos para compartir pasos concretos.

## Estructura recomendada
- `src/pages/demo.astro` — Página completa de la demo (experiencia guiada, documentación integrada).
- `src/pages/demo?embed=true` — Variante embebida que se carga en `iframe` para preview en modal.
- `src/components/DemoModal.astro` — Componente que abre el `iframe` y gestiona accesibilidad.
- `docs/demo-guide.md` — Esta guía.

## Flujo UX
1. Usuario hace clic en "Probar demo" → abre `DemoModal` con `iframe` apuntando a `/demo?embed=true` (preview rápido).
2. En el modal, botón "Ver demo completa" → navega a `/demo` (experiencia completa con tour y más contexto).
3. Si se solicita demo o se requiere gating, pedir un email en el modal antes de desbloquear funcionalidades adicionales.

## Implementación: pasos mínimos

1) Crear la ruta de demo completa

- `src/pages/demo.astro` (esqueleto):

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <main class="max-w-6xl mx-auto p-6">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold">Demo Técnica — Simulación</h1>
      <p class="text-slate-600">Modo: {Astro.url.searchParams.get('embed') === 'true' ? 'Embebido' : 'Completo'}</p>
    </header>

    <section>
      <!-- Aquí va la UI de la demo (client-only). -->
      <div id="demo-root"></div>
    </section>

  </main>
</Layout>
```

Nota: carga las partes interactivas como client-only (por ejemplo, con `client:idle` o un bundle separado) para evitar problemas en SSR.

2) Crear el `DemoModal` (componente embebido)

- `src/components/DemoModal.astro` (ejemplo simplificado):

```astro
---
const { open, src } = Astro.props;
---
<div id="demo-modal" role="dialog" aria-modal="true" class="fixed inset-0 z-50 flex items-center justify-center">
  <div class="absolute inset-0 bg-black/50" onclick={open(false)}></div>
  <div class="relative bg-white rounded-lg w-[90vw] max-w-5xl shadow-lg">
    <button aria-label="Cerrar" class="absolute top-3 right-3" onclick={open(false)}>×</button>
    <iframe src={src} title="Demo interactiva" class="w-full h-[70vh]" sandbox="allow-scripts allow-same-origin"></iframe>
  </div>
</div>
```

Recomendaciones: implementar focus-trap, manejo de `Esc` para cerrar y `aria-hidden` en el resto del documento cuando se abre.

3) Wiring en CTAs

- Botón que abre modal (preview):

```html
<button id="openDemoBtn">Probar demo</button>
<script>
document.getElementById('openDemoBtn').addEventListener('click', () => {
  showDemoModal('/demo?embed=true');
  // analytics
  window.dataLayer?.push({ event: 'demo_cta_click', type: 'modal' });
});
</script>
```

- Botón que lleva a la demo completa:

```html
<a href="/demo" class="btn">Ver demo completa</a>
```

4) Tour / guía paso a paso

- Implementa un estado por query param o fragment: `/demo#step=2` o `/demo?step=2`.
- Para librerías: considera `shepherd.js` o `intro.js` para tours accesibles.
- Guarda progreso en `localStorage` si quieres que el usuario reanude.

5) Accesibilidad

- Modal: focus trap, `aria-modal`, cerrar con `Esc`, botón con `aria-label` visible.
- Iframe: añade título `title="Demo interactiva"` y controla tamaño mínimo.
- Animaciones: respeta `prefers-reduced-motion`.

6) Seguridad y aislamiento

- Usa `iframe sandbox` con atributos mínimos (`allow-scripts allow-same-origin` si necesitas comunicación).
- Si usas `postMessage` para comunicación host↔iframe, valida el origen del mensaje.
- Sirve la demo como recurso estático o client-only para evitar ejecución de código server-side no deseado.

7) Telemetría y gating

- Emite eventos analytics en cada CTA (`demo_cta_click`), en inicio de tour (`demo_tour_start`) y en finalización (`demo_tour_complete`).
- Para gating: muestra un formulario simple en el modal que recoja `email` y guarda en un endpoint o CRM.

8) Ejemplo rápido: modal + iframe (JS)

```html
<!-- inserta en el layout o componente que contiene los CTAs -->
<button id="openDemo">Probar demo</button>
<div id="demoModalContainer"></div>

<script>
function showDemoModal(src) {
  const container = document.getElementById('demoModalContainer');
  container.innerHTML = `
    <div id="demoModal" role="dialog" aria-modal="true" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:60">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,.5)" onclick="closeDemoModal()"></div>
      <div style="background:#fff;width:90vw;max-width:1100px;border-radius:12px;overflow:hidden;">
        <button aria-label="Cerrar" onclick="closeDemoModal()" style="position:absolute;right:12px;top:12px">×</button>
        <iframe src="${src}" title="Demo interactiva" style="width:100%;height:70vh;border:0" sandbox="allow-scripts allow-same-origin"></iframe>
      </div>
    </div>
  `;
}
function closeDemoModal(){ document.getElementById('demoModalContainer').innerHTML=''; }
document.getElementById('openDemo').addEventListener('click', ()=> showDemoModal('/demo?embed=true'));
</script>
```

## Checklist rápida antes de lanzar
- [ ] Modal con focus trap y cierre por teclado
- [ ] Iframe sandboxed y `postMessage` validado
- [ ] Tour con pasos y URL compartible
- [ ] Eventos analytics para cada CTA
- [ ] Formularios de gating si aplica
- [ ] Pruebas de compatibilidad móvil

## Comandos para probar localmente

```bash
npm install
npm run dev
# Abrir http://localhost:3000/demo y probar el modal desde la home
```

---

Si quieres, puedo:
- Generar el esqueleto `src/pages/demo.astro` y `src/components/DemoModal.astro` ahora,
- O bien añadir el wiring en los botones existentes (`Probar demo`, `Solicitar demo`).

Indica qué prefieres y lo implemento.