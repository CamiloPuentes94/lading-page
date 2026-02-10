# AI Context & Architecture Guidelines
> Este archivo define las reglas maestras para el desarrollo en este proyecto. 
> Cualquier código generado debe adherirse estrictamente a estas directrices.

## 1. Tech Stack & Versions
- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS 4.x (Vite plugin)
- **Language**: TypeScript (Strict mode)
- **Package Manager**: npm/pnpm

## 2. Project Structure (Astro Standard)
```
src/
├── assets/        # Imágenes optimizadas y assets procesados
├── components/    # Componentes UI reutilizables (.astro, .tsx)
├── layouts/       # Wrappers de páginas (<html>, <body>)
├── pages/         # Rutas basadas en archivos (File-system routing)
└── styles/        # CSS global y definiciones de temas
```

## 3. Architecture Rules

### A. Astro Patterns
1.  **Default to Server Components**: Los archivos `.astro` se renderizan en el servidor (SSG/SSR) por defecto. No envían JS al cliente.
2.  **Islands Architecture**: Usa directivas `client:*` (ej: `client:load`, `client:visible`) SOLO cuando se necesite interactividad en el cliente.
3.  **Assets**:
    - Usa `src/assets/` e importa imágenes en componentes Astro (`import img from '../assets/img.png'`) para optimización automática.
    - Usa `public/` solo para archivos que no requieren procesamiento (robots.txt, favicon).

### B. Styling (Tailwind 4 System & Patterns)
1.  **CSS-First Configuration**:
    - Usa `src/styles/global.css` como la fuente de verdad.
    - Sintaxis obligatoria: `@import "tailwindcss";` (no usar `@tailwind base/components/utilities`).
    - Configura el tema dentro de bloques `@theme`.

2.  **Semantic Tokens (OKLCH)**:
    - Define colores semánticos (`--color-primary`, `--color-background`) usando el espacio de color OKLCH para mejor percepción.
    - Ejemplo de configuración en CSS:
      ```css
      @import "tailwindcss";

      @theme {
        --color-background: oklch(100% 0 0);
        --color-foreground: oklch(14.5% 0.025 264);
        --color-primary: oklch(45% 0.2 260); /* Ejemplo */
        
        /* Animaciones nativas (reemplaza tailwindcss-animate) */
        --animate-fade-in: fade-in 0.2s ease-out;
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      }
      ```

3.  **Dark Mode Strategy**:
    - Usa la variante nativa CSS: `@custom-variant dark (&:where(.dark, .dark *));`.
    - Sobrescribe variables dentro de `.dark { --color-background: ... }`.

4.  **No `var()` in className**:
    - ❌ MAL: `class="text-[var(--color-primary)]"`
    - ✅ BIEN: `class="text-primary"`

5.  **Conditional Classes**: Usa `cn()` (clsx + tailwind-merge).

### C. Component Patterns (if React/Preact used)
1.  **React 19 Ready**: Si creas componentes React, NO uses `forwardRef`. Pasa `ref` como prop normal.
2.  **CVA (Class Variance Authority)**: Para componentes con múltiples variantes (botones, cards), usa `cva` para gestionar clases de forma segura.

## 4. Development Workflow
- **Linting**: Respetar reglas de ESLint/Prettier configuradas.
- **Commits**: Seguir Conventional Commits (feat, fix, docs, style, refactor).

## 5. Critical Instructions for AI
- **NO** sugerir configuración de Tailwind antigua (`module.exports = { theme: ... }`).
- **NO** crear componentes React/Vue/Svelte innecesarios si se puede resolver con Astro + HTML/CSS estático.
- **VERIFICAR** siempre la existencia de carpetas antes de sugerir rutas de importación.
