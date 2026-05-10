# Mapa Turístico — San Pedro del Pinatar

Aplicación web SPA con mapa interactivo centrado en San Pedro del Pinatar. Incluye modo visitante (público) y modo admin (autenticado via Supabase).

## Tecnologías

- Vite + React 18 + TypeScript
- Tailwind CSS
- Leaflet + react-leaflet (OpenStreetMap, sin API key)
- Supabase (PostgreSQL + Auth + Storage + RLS)
- Zustand, react-hook-form, zod, lucide-react

## Setup local

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar variables de entorno

```powershell
copy .env.example .env
```

Editar `.env` con los valores de tu proyecto Supabase:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_PATH=panel-x7k2-pinatar
```

> **`VITE_ADMIN_PATH`**: elige una cadena difícil de adivinar (ej. `panel-` + 6-8 chars aleatorios).  
> La seguridad real viene de Supabase Auth + RLS — el path secreto solo evita el descubrimiento casual.

### 3. Configurar Supabase

En el SQL Editor de tu proyecto Supabase ejecuta **en orden**:

1. **Tablas y extensiones** — sección 4.1 del documento de especificación
2. **RLS policies** — sección 4.2
3. **Storage bucket** — sección 4.3

Después:
- Authentication → Users → **Add user** (manual) → crear el usuario admin de Carlos.
- Authentication → Providers → Email → **deshabilitar signups** públicos.
- Verificar que el bucket `point-photos` existe y es público.

### 4. Arrancar en local

```powershell
npm run dev
```

Abrir `http://localhost:5173`.

- **Visitante:** `http://localhost:5173/`
- **Login admin:** `http://localhost:5173/{VITE_ADMIN_PATH}/login`

## Despliegue en Netlify

1. Subir el repo a GitHub.
2. Netlify → "Add new site" → importar desde GitHub.
3. Build command: `npm run build` | Publish directory: `dist`.
4. Site settings → Environment variables → añadir las 3 variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PATH`).
5. Deploy.

El `netlify.toml` ya incluye el redirect SPA necesario para que las rutas funcionen al recargar.

## Estructura

```
src/
├── components/
│   ├── admin/       # PhotoUploader, ImportExportPanel, AdminToolbar
│   ├── auth/        # LoginForm
│   ├── map/         # MapView, PointMarker, AlertMarker, ZonePolygon, DrawControl, LayerToggle
│   ├── modals/      # PointDetailModal, PointFormModal, CategoryFormModal, AlertFormModal, ZoneFormModal
│   ├── sidebar/     # Sidebar, CategoryItem, SubcategoryItem, PointItem
│   └── ui/          # Button, Input, Select, ColorPicker, Modal, PhotoGallery
├── hooks/           # useAuth, useCategories, usePoints, useAlerts, useZones
├── lib/             # supabase, constants, navigation, storage, jsonBackup
├── pages/           # VisitorPage, AdminPage, LoginPage, NotFoundPage
├── store/           # uiStore (Zustand)
└── types/           # Category, Point, Alert, Zone
```
