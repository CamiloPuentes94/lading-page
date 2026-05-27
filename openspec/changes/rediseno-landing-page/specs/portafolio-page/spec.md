## ADDED Requirements

### Requirement: Página Portafolio con grid de proyectos
El sistema SHALL mostrar una galería de proyectos en `/portafolio`.

#### Scenario: Hero del portafolio
- **WHEN** el usuario carga `/portafolio`
- **THEN** se muestra el título "Nuestro Portafolio" y descripción

#### Scenario: Grid de proyectos
- **WHEN** el usuario ve la sección de proyectos
- **THEN** se muestran 6 cards de proyectos (contenido del prototipo como placeholder) en grid de 3 columnas en desktop

#### Scenario: Card de proyecto
- **WHEN** el usuario ve una card
- **THEN** muestra imagen, badge de categoría, nombre, descripción breve y tags de tecnologías

#### Scenario: Hover en card de proyecto
- **WHEN** el usuario pasa el cursor sobre una card
- **THEN** la imagen escala y aparece overlay con link "Ver Caso de Estudio"

### Requirement: Filtros de categoría (visual)
El sistema SHALL mostrar botones de filtro por categoría.

#### Scenario: Botones de filtro visibles
- **WHEN** el usuario ve la página de portafolio
- **THEN** se muestran los botones: Todos, Web, Sistemas, Consultoría

#### Scenario: Filtros sin funcionalidad JS
- **WHEN** el usuario hace clic en un filtro
- **THEN** el botón activo cambia visualmente pero los proyectos no se filtran (funcionalidad pendiente - TODO)
