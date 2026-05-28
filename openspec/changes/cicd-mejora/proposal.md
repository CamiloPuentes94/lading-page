# Proposal: CI/CD reproducible para landing-page

## Intent

El deploy actual depende de un `~/apps/landing-page/deploy.sh` que vive solo en el servidor y NO está versionado. No existe un docker-compose de producción en el repo. Resultado: el deploy no es reproducible, no se puede auditar ni recuperar si el servidor se pierde, y cambios de infraestructura (Traefik, env, red) son invisibles en git. Replicamos el patrón ya probado de sistema-pos para que el deploy sea declarativo y reproducible desde el repo.

## Scope

### In Scope
- CREAR `deploy/docker-compose.yml`: servicio prod con imagen `jcpsandoval/camandre-landing:latest`, puerto `4321`, labels Traefik para `camandrefactory.com` + `www`, red externa `red_infraestructura`, `env_file: .env`, `restart: unless-stopped`.
- MODIFICAR `.github/workflows/docker-ci-cd.yml`: dividir en 2 jobs (`build-and-push`, `deploy`); quitar QEMU; SCP del compose al servidor; SSH `docker compose pull && up -d`.

### Out of Scope
- Cambios en el Dockerfile o el build de la app Astro.
- Gestión de DNS, certificados TLS o configuración del propio Traefik (ya existente).
- Crear los pasos manuales del servidor (dir + `.env`) — se documentan, no se automatizan.
- Cambios en variables de entorno de la aplicación más allá de `RESEND_API_KEY` / `RESEND_AUDIENCE_ID`.

## Capabilities

### New Capabilities
- `prod-deploy`: compose de producción versionado + pipeline de 2 jobs que construye, publica y despliega de forma reproducible.

### Modified Capabilities
- None.

## Approach

1. **`deploy/docker-compose.yml`** (nuevo): servicio `landing` que consume la imagen publicada y expone `4321` vía labels Traefik. Un único router con regla `Host(\`camandrefactory.com\`) || Host(\`www.camandrefactory.com\`)`, `entrypoints=websecure`, `tls.certresolver=letsencrypt`. Se une a `red_infraestructura` (`external: true`), lee `env_file: .env` y usa `restart: unless-stopped`. Espeja exactamente el patrón de sistema-pos.
2. **Workflow en 2 jobs**:
   - `build-and-push`: checkout → Buildx → login Docker Hub → build/push `linux/amd64` (sin QEMU). Push solo fuera de PR.
   - `deploy` (needs build-and-push, solo en push a main): SCP de `deploy/docker-compose.yml` a `/opt/camandrefactory/landing-page` con `strip_components: 1` (appleboy/scp-action) → SSH `cd /opt/camandrefactory/landing-page && docker compose pull && docker compose up -d` (appleboy/ssh-action).
   - El branch `development` queda build-only (sin job de deploy).
3. Secrets reutilizados: `DOCKER_USERNAME`, `DOCKER_TOKEN`, `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`.

## Pasos manuales en el servidor (una sola vez, fuera del repo)
- `mkdir -p /opt/camandrefactory/landing-page`
- Crear `/opt/camandrefactory/landing-page/.env` con `RESEND_API_KEY=...` y `RESEND_AUDIENCE_ID=...`
- Verificar que la red `red_infraestructura` existe (`docker network ls`).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `deploy/docker-compose.yml` | New | Compose de producción versionado |
| `.github/workflows/docker-ci-cd.yml` | Modified | 2 jobs, sin QEMU, SCP + SSH deploy |
| Servidor `/opt/camandrefactory/landing-page` | New | Dir destino + `.env` (manual) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `.env` ausente en el servidor en el primer deploy | Med | Documentar paso manual previo; `up -d` falla rápido y es seguro reintentar |
| Red `red_infraestructura` inexistente | Low | Verificación manual previa; `external: true` falla con mensaje claro |
| Labels Traefik mal formados rompen el routing | Med | Espejar exactamente el patrón validado de sistema-pos |
| `deploy.sh` viejo persiste en el server | Low | El nuevo job no lo invoca; queda inerte (eliminar tras migrar) |
| Nombre del secret SSH ambiguo (`SSH_PRIVATE_KEY` vs `SERVER_SSH_KEY` de sistema-pos) | Med | Confirmar en repo settings; usar el existente `SSH_PRIVATE_KEY` |

## Rollback Plan

Revertir el commit del workflow restaura el job único anterior. El `deploy.sh` previo sigue en el servidor, por lo que un deploy manual con el flujo viejo sigue siendo posible mientras se migra. El compose nuevo es aditivo: borrar `deploy/docker-compose.yml` no afecta la imagen ya publicada.

## Dependencies
- Traefik corriendo en el servidor con la red `red_infraestructura`.
- Secrets de GitHub ya configurados (todos existen).

## Success Criteria
- [ ] Push a `main` construye y publica `jcpsandoval/camandre-landing:latest` sin QEMU.
- [ ] El job `deploy` copia el compose y levanta el servicio vía SSH sin depender de `deploy.sh`.
- [ ] `camandrefactory.com` y `www` responden vía Traefik tras el deploy.
- [ ] Todo el estado de infraestructura del deploy vive en el repo.
