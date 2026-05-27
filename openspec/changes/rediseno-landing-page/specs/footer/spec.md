## ADDED Requirements

### Requirement: Footer con datos reales de contacto
El sistema SHALL renderizar un footer con datos reales de la empresa en todas las páginas.

#### Scenario: Datos de contacto correctos
- **WHEN** el usuario ve el footer
- **THEN** se muestra: email `camandrefcatory@gmail.com`, teléfono `+57 313 421 2476`, ciudad `Chía, Colombia`

#### Scenario: Sin iconos de redes sociales
- **WHEN** el footer se renderiza
- **THEN** NO se muestran iconos de LinkedIn, Instagram ni X (la empresa no tiene redes sociales activas)

### Requirement: Footer con columnas de navegación
El sistema SHALL mostrar columnas de links en el footer: Servicios, Compañía y Contacto.

#### Scenario: Links de navegación en footer
- **WHEN** el usuario ve el footer
- **THEN** se muestran las columnas Servicios y Compañía con sus links respectivos

#### Scenario: Copyright actualizado
- **WHEN** el footer se renderiza
- **THEN** muestra "© 2026 Camandre Factory. Todos los derechos reservados."
