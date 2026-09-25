# Alejandro Puerto Technology - Next.js MVP v0.4

Versión enfocada a conversión y operativa comercial.

## Incluye

- Home y páginas comerciales.
- Responsive design.
- Formulario de contacto con Route Handler server-side.
- Project Health Check con puntuación 0-100, clasificación y áreas prioritarias.
- Captación cualificada desde el Health Check.
- Persistencia en Supabase mediante `SUPABASE_SECRET_KEY` solo en servidor.
- Página de gracias diferenciada para contacto y Health Check.
- Tracking de `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, landing page, referrer y CTA.
- Pipeline comercial preparado con estados: `new`, `contacted`, `qualified`, `proposal`, `won`, `lost`.
- Notificación opcional por email al entrar un lead nuevo mediante Resend.
- Campo `notified_at` para saber si se envió la notificación.
- Honeypot básico anti-bot.
- Esquema SQL versionado para evolución segura de `leads`.

## Requisitos

- Node.js 22 o superior.
- npm.
- Proyecto Supabase.
- Vercel recomendado para despliegue.
- Cuenta Resend opcional si quieres notificaciones por email.

## Ejecución local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno obligatorias

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxx
```

`SUPABASE_SECRET_KEY` debe permanecer únicamente en servidor.

## Variables opcionales para notificaciones

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
LEAD_NOTIFICATION_TO=you@example.com
LEAD_NOTIFICATION_FROM=Alejandro Puerto Technology <leads@yourdomain.com>
```

Si estas tres variables no existen, el lead se guarda normalmente y simplemente no se envía email.

## Actualización de Supabase desde v0.3

1. Entra en Supabase > SQL Editor.
2. Abre `supabase/schema.sql` de esta versión.
3. Ejecuta el script completo.
4. Verifica en `Table Editor > leads` los nuevos campos:
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_content`
   - `utm_term`
   - `landing_page`
   - `referrer`
   - `cta`
   - `notified_at`

## Flujo de captación v0.4

### Contacto general

`Formulario -> /api/leads -> Supabase -> notificación opcional -> /gracias`

### Project Health Check

`10 respuestas -> diagnóstico -> solicitud de revisión -> /api/leads -> Supabase -> notificación opcional -> /gracias`

El flujo del Health Check añade `health_score`, `health_band` y el detalle del diagnóstico en `metadata.project_health_check`.

## Pipeline comercial

Cada lead entra como `new`. Los estados previstos son:

- `new`
- `contacted`
- `qualified`
- `proposal`
- `won`
- `lost`

En esta versión el cambio de estado se realiza desde Supabase Table Editor. Una futura versión podrá incorporar panel comercial propio.

## Tracking UTM

Puedes probarlo entrando con una URL como:

```text
/contacto?utm_source=linkedin&utm_medium=social&utm_campaign=lanzamiento
```

Tras enviar el formulario, revisa la fila en Supabase y confirma que esos valores quedan guardados.

## Despliegue en Vercel

1. Sube esta versión a GitHub.
2. En Vercel comprueba `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SECRET_KEY`.
3. Si activas email, añade también las tres variables de Resend.
4. Haz Redeploy.
5. Prueba contacto general y Project Health Check.
6. Comprueba que el lead aparece en Supabase y que redirige a `/gracias`.

## Validación técnica pendiente en este entorno

No se pudo completar `npm install` por timeout de red del entorno de generación, por lo que `npm run build` no se ha ejecutado aquí. Debe ejecutarse en local o durante el build de Vercel antes de considerar la versión validada para producción.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Panel comercial privado (v0.4 activa)

La ruta `/admin` permite acceder a un panel privado con leads, prioridad comercial, estado y conversión de los últimos 30 días.

Añade en Vercel dos variables **Secret**:

- `ADMIN_DASHBOARD_PASSWORD`: contraseña que usarás para entrar.
- `ADMIN_DASHBOARD_SECRET`: cadena aleatoria larga para firmar la sesión (idealmente 32+ bytes aleatorios).

Después ejecuta de nuevo `supabase/schema.sql` para crear `analytics_events` y añadir `lead_score`, `lead_priority` y `status_updated_at`.

El scoring es orientativo para priorización comercial interna. No sustituye la revisión humana del lead.

### Cambios incorporados en la v0.4 activa
- Redirección estable a `/gracias` tras envío correcto.
- Analítica propia en `analytics_events` (page views, formularios, Health Check y conversiones).
- Persistencia de atribución UTM durante la sesión.
- Lead scoring interno 0-100 y prioridad low/medium/high.
- Panel privado `/admin/leads` con métricas, leads y actualización de estado.
- Sesión admin firmada mediante cookie HttpOnly.
