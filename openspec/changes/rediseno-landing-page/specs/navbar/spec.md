## ADDED Requirements

### Requirement: Navbar fija con logo y navegación
El sistema SHALL renderizar una barra de navegación fija (sticky) en la parte superior de todas las páginas con logo, links de navegación y CTA.

#### Scenario: Logo visible en navbar
- **WHEN** el usuario carga cualquier página
- **THEN** se muestra `logo-iso.png` en el lado izquierdo de la navbar

#### Scenario: Links de navegación visibles en desktop
- **WHEN** el viewport es >= 768px (md)
- **THEN** se muestran los links: Servicios, Nosotros, Portafolio y el botón "Cotizar"

#### Scenario: Menú hamburguesa en mobile
- **WHEN** el viewport es < 768px
- **THEN** los links se ocultan y se muestra un ícono de menú hamburguesa

#### Scenario: Link activo destacado
- **WHEN** el usuario está en una página específica
- **THEN** el link correspondiente muestra un subrayado verde (secondary) permanente

#### Scenario: Efecto glass en navbar
- **WHEN** la navbar está visible
- **THEN** aplica backdrop-blur con fondo semitransparente (blanco en light, primary en dark)
