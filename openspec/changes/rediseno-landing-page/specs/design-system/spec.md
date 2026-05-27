## MODIFIED Requirements

### Requirement: Tokens de color en @theme
El sistema SHALL definir los colores de marca como variables CSS en el bloque `@theme` de Tailwind CSS 4.

#### Scenario: Colores primarios accesibles con clases Tailwind
- **WHEN** se usa la clase `bg-primary` o `text-secondary`
- **THEN** aplica los colores `#14244E` y `#009B60` respectivamente

#### Scenario: Dark mode con clase .dark
- **WHEN** el elemento `<html>` tiene la clase `dark`
- **THEN** los tokens semánticos (background, foreground, card, muted) cambian a sus valores oscuros

## ADDED Requirements

### Requirement: Fuente Montserrat para display
El sistema SHALL usar Montserrat como fuente para headings (font-display).

#### Scenario: Headings con Montserrat
- **WHEN** un elemento tiene la clase `font-display`
- **THEN** renderiza con la fuente Montserrat cargada desde Google Fonts

#### Scenario: Fuente cargada en el head
- **WHEN** cualquier página carga
- **THEN** el `<head>` incluye el link a Google Fonts con Montserrat pesos 400, 500, 600, 700, 800

### Requirement: Utilities glass-panel y glass-nav
El sistema SHALL proveer utilities de glassmorphism con sintaxis Tailwind 4.

#### Scenario: Utility glass-panel disponible
- **WHEN** se aplica la clase `glass-panel`
- **THEN** el elemento tiene backdrop-blur, fondo semitransparente y borde blanco translúcido

#### Scenario: Utility glass-nav disponible
- **WHEN** se aplica la clase `glass-nav`
- **THEN** el elemento tiene backdrop-blur con fondo blanco/80 en light y primary/80 en dark

#### Scenario: Utility text-gradient disponible
- **WHEN** se aplica la clase `text-gradient`
- **THEN** el texto muestra gradiente de primary a secondary (light) o blanco a secondary (dark)
