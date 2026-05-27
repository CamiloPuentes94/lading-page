## ADDED Requirements

### Requirement: Hero section con layout split
El sistema SHALL mostrar una sección hero con texto a la izquierda e imagen de código a la derecha (en desktop).

#### Scenario: Hero visible al cargar
- **WHEN** el usuario carga la página principal `/`
- **THEN** se muestra el headline "Soluciones de software a medida para empresas del futuro", descripción, y dos CTAs: "Inicia tu Proyecto" y "Ver Proyectos"

#### Scenario: CTAs del hero
- **WHEN** el usuario hace clic en "Inicia tu Proyecto" o "Ver Proyectos"
- **THEN** el href es `#` (sin funcionalidad por ahora)

#### Scenario: Badge "Innovación Digital"
- **WHEN** el hero se renderiza
- **THEN** se muestra un badge verde con punto animado y texto "Innovación Digital"

### Requirement: Sección de servicios con 3 cards
El sistema SHALL mostrar una sección "Soluciones TI Integrales" con 3 cards de servicios.

#### Scenario: Cards de servicios visibles
- **WHEN** el usuario hace scroll a la sección de servicios
- **THEN** se muestran 3 cards: Desarrollo Web Moderno, Sistemas a Medida, Consultoría TI

#### Scenario: Hover en cards de servicios
- **WHEN** el usuario pasa el cursor sobre una card
- **THEN** el ícono escala y la card eleva su sombra

### Requirement: Sección "Por qué elegirnos"
El sistema SHALL mostrar 4 features y texto justificando la propuesta de valor.

#### Scenario: Features visibles
- **WHEN** el usuario hace scroll a la sección
- **THEN** se muestran: Rendimiento, Seguridad, Cloud Native, Responsive

### Requirement: Sección CTA de conversión
El sistema SHALL mostrar una sección de fondo azul primary con CTA para contactar.

#### Scenario: CTA section visible
- **WHEN** el usuario hace scroll al final de la homepage
- **THEN** se muestra "¿Listo para Digitalizar tu Negocio?" con botones "Agendar Llamada" y "Ver Casos de Éxito" (href="#")
