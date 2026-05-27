## ADDED Requirements

### Requirement: Página Servicios con secciones detalladas
El sistema SHALL mostrar 3 servicios con layout alternado imagen/texto en `/servicios`.

#### Scenario: Hero de servicios
- **WHEN** el usuario carga `/servicios`
- **THEN** se muestra el título "Nuestros Servicios" con badge "Excelencia Técnica"

#### Scenario: Sección Desarrollo Web
- **WHEN** el usuario ve la primera sección
- **THEN** se muestra imagen de código a la izquierda y descripción con 3 bullets a la derecha

#### Scenario: Sección Sistemas a Medida
- **WHEN** el usuario ve la segunda sección
- **THEN** se muestra descripción con bullets a la izquierda e imagen de dashboard a la derecha

#### Scenario: Sección Consultoría TI
- **WHEN** el usuario ve la tercera sección
- **THEN** se muestra imagen animada a la izquierda y descripción con bullets a la derecha

### Requirement: Proceso de ingeniería en 4 pasos
El sistema SHALL mostrar el proceso de trabajo en 4 cards numeradas.

#### Scenario: Cards del proceso
- **WHEN** el usuario ve la sección del proceso
- **THEN** se muestran 4 cards: 01 Descubrimiento, 02 Diseño UX/UI, 03 Desarrollo, 04 Lanzamiento
