# Despachos PATRIA

App web de la quesera de Búfalos & Lácteos PATRIA para todo el proceso de despachos: recibir y montar pedidos, programarlos, alistarlos, organizar rutas, despachar, confirmar entregas, registrar novedades y hacer remisiones.

- **Datos y usuarios:** Supabase (base de datos Postgres, inicio de sesión y tiempo real).
- **Publicación:** GitHub Pages.
- **Ingreso:** cada persona entra con su correo y su contraseña. Lo que ve y lo que puede hacer depende de su rol.

| Rol | Puede |
|---|---|
| Administrador | Todo, incluidos los ajustes, el catálogo y los usuarios |
| Despachos | Crear y editar pedidos, programar rutas, hacer remisiones |
| Conductor / Bodega | Ver rutas, alistamiento y novedades; alistar, marcar "salió a ruta", confirmar entregas y reportar novedades |

Los permisos los aplica la **base de datos** (reglas RLS), no solo la pantalla. Por ejemplo, un conductor no puede borrar ni crear pedidos aunque intente hacerlo por fuera de la app.

---

## Instalación paso a paso (una sola vez)

### 1. Crear el proyecto en Supabase
1. Entra a [supabase.com](https://supabase.com), inicia sesión y crea un proyecto nuevo (**New project**).
   - Nombre: `despachos-patria`
   - Región: **South America (São Paulo)**, la más cercana a Colombia.
   - Guarda en un lugar seguro la contraseña de la base de datos.
2. Espera a que el proyecto termine de crearse (1 a 2 minutos).

### 2. Crear las tablas y las reglas de seguridad
1. En Supabase abre **SQL Editor → New query**.
2. Pega todo el contenido de `supabase/schema.sql` y presiona **Run**.
3. Abre otra consulta nueva, pega el archivo `datos_iniciales.sql` (te lo entregaron aparte, **no está en GitHub** porque tiene datos de clientes) y presiona **Run**. Así pasan los pedidos, rutas, puntos de entrega, remisiones y el catálogo que ya tenías.

### 3. Configurar el inicio de sesión
1. **Authentication → Sign In / Providers → Email**: déjalo activado y **desactiva "Allow new users to sign up"**. Así nadie puede crearse una cuenta por su cuenta; solo la administradora crea usuarios.
2. **Authentication → URL Configuration**: en **Site URL** pon la dirección de la app en GitHub Pages (paso 6), por ejemplo `https://tu-usuario.github.io/despachos-patria/`. Agrega esa misma dirección en **Redirect URLs**. Esto hace que funcione el link de "Olvidé mi contraseña".

### 4. Crear tu usuario de administradora
1. **Authentication → Users → Add user → Create new user**: escribe tu correo y una contraseña, y marca **Auto Confirm User**.
2. En **SQL Editor** ejecuta esto, cambiando el correo por el tuyo:

```sql
insert into public.perfiles (user_id, nombre, email, rol)
select id, 'Ana Escobar', email, 'admin'
from auth.users where email = 'TU-CORREO@gmail.com';
```

### 5. Publicar las funciones del servidor
Se usan para crear usuarios y cambiar contraseñas de forma segura, y para la lectura de órdenes con IA, que es opcional.

1. **Edge Functions → Deploy a new function → Via Editor**.
2. Crea una función llamada exactamente `admin-usuarios`, pega el contenido de `supabase/functions/admin-usuarios/index.ts` y presiona **Deploy**.
3. *(Opcional, para "Leer con Claude")* Crea otra función llamada `leer-pedido` con el contenido de `supabase/functions/leer-pedido/index.ts`. Luego, en **Edge Functions → Secrets**, agrega `ANTHROPIC_API_KEY` con tu llave de [console.anthropic.com](https://console.anthropic.com). Por último, en `config.js` cambia `LECTURA_IA` a `true`.

### 6. Publicar la app en GitHub Pages
1. En [github.com](https://github.com) crea un repositorio nuevo llamado `despachos-patria`.
2. **Add file → Upload files**: sube `index.html`, `config.js`, `.nojekyll`, `README.md` y la carpeta `supabase`. **No subas `datos_iniciales.sql`.**
3. Edita `config.js` en GitHub: pega la **Project URL** y la llave **anon / publishable** que encuentras en Supabase → **Project Settings → API**.
4. **Settings → Pages → Build and deployment**: en Source elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
5. En 1 o 2 minutos la app queda en `https://tu-usuario.github.io/despachos-patria/`.

> GitHub Pages gratis exige que el repositorio sea **público**. El código queda visible, pero los datos no: viven en Supabase protegidos por las reglas de seguridad, y la llave anon está hecha para ir en el navegador. Si prefieres el repositorio privado, necesitas GitHub Pro o publicar con Netlify o Vercel, que sí permiten repositorio privado gratis.

### 7. Crear los usuarios del equipo
Entra a la app con tu correo. Luego ve a **Ajustes → Gestionar usuarios → Agregar usuario** y escribe el nombre, el correo, el rol y una contraseña inicial. Compártele a cada persona el link, su correo y su contraseña. Cada quien puede cambiar su contraseña en **Mi cuenta**.

---

## Uso diario
- **En el celular:** abre el link y usa "Agregar a pantalla de inicio" para que quede como una app.
- **Tiempo real:** lo que registra un conductor aparece al instante en el computador de despachos.
- **Si alguien sale del equipo:** en Gestionar usuarios toca **Desactivar**. Pierde el acceso de inmediato, aunque tenga la sesión abierta.
- **Copias de seguridad:** Supabase → Database → Backups. Desde la app también puedes descargar todos los pedidos en CSV (Ajustes → Datos).

## Archivos
- `index.html`: la app completa.
- `config.js`: conexión con Supabase (URL y llave pública).
- `supabase/schema.sql`: tablas, reglas de seguridad por rol y tiempo real.
- `supabase/functions/admin-usuarios`: crear usuarios, cambiar contraseñas y eliminar cuentas (solo administradores).
- `supabase/functions/leer-pedido`: lectura de órdenes con IA (opcional).
