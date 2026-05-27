## ADDED Requirements

### Requirement: Página Nosotros con historia
El sistema SHALL mostrar la historia y contexto de la empresa en `/nosotros`.

#### Scenario: Hero de nosotros
- **WHEN** el usuario carga `/nosotros`
- **THEN** se muestra el título "Nuestra Esencia Digital" con badge "Sobre Nosotros"

#### Scenario: Sección historia
- **WHEN** el usuario hace scroll
- **THEN** se muestra imagen con overlay + texto de historia de la empresa (contenido del prototipo)

### Requirement: Misión y Visión
El sistema SHALL mostrar dos cards con la misión y visión de la empresa.

#### Scenario: Cards misión y visión
- **WHEN** el usuario ve la sección
- **THEN** se muestran dos cards glass-panel: Misión (ícono rocket_launch, verde) y Visión (ícono visibility, azul)

### Requirement: Valores corporativos
El sistema SHALL mostrar 3 valores en cards.

#### Scenario: Cards de valores
- **WHEN** el usuario ve la sección
- **THEN** se muestran: Innovación Constante, Transparencia Total, Excelencia Técnica

### Requirement: Grid del equipo
El sistema SHALL mostrar 4 miembros del equipo en un grid con foto y cargo.

#### Scenario: Grid equipo visible
- **WHEN** el usuario ve la sección del equipo
- **THEN** se muestran 4 cards con foto en escala de grises, nombre y cargo (datos del prototipo como placeholder)

#### Scenario: Hover en card de equipo
- **WHEN** el usuario pasa el cursor sobre una card
- **THEN** la foto pasa de escala de grises a color y aparece un overlay con links
