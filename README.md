# GourmetOS - Sistema Integral de Gestión para Restaurantes

Sistema ERP y Punto de Venta (POS) para restaurantes con gestión de inventario, escandallo de recetas, monitoreo de cocina (KDS) y análisis de capital invertido vs. capital esperado.

---

## 🚀 Despliegue en Vercel

El proyecto ya incluye la configuración optimizada en `vercel.json` para despliegue instantáneo en Vercel.

### Opción A: Despliegue desde GitHub (Recomendado)
1. Sube este repositorio a tu cuenta de **GitHub**, **GitLab** o **Bitbucket**.
2. Ve a [vercel.com](https://vercel.com/) e inicia sesión.
3. Haz clic en **"Add New..."** > **"Project"**.
4. Selecciona tu repositorio de GourmetOS.
5. Vercel detectará automáticamente:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Haz clic en **"Deploy"** y en menos de 1 minuto tu aplicación estará en vivo con HTTPS gratuito.

---

### Opción B: Despliegue directo desde la terminal (Vercel CLI)
Si tienes Node.js instalado en tu equipo:
```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Desplegar directamente
vercel
```
Sigue las instrucciones en pantalla aceptando los valores predeterminados.

---

## 🛠️ Tecnologías Utilizadas
- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Iconografía vectorial sin emojis)
- **Persistencia LocalStorage** (Datos de restaurante seguros y listos para operar sin base de datos externa obligatoria)
