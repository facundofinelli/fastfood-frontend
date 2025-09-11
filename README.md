# FastFood - React + TypeScript + Vite

Este proyecto es una aplicación de ejemplo de FastFood, hecha con React, TypeScript y Vite. Incluye:

- Navbar y Footer siempre visibles
- Listado de productos con cards
- Carrito de compras
- Pantalla de login con toggle de contraseña visible
- SPA usando React Router

## Instalación

1. Clonar el repositorio:
git clone https://github.com/facundofinelli/fastfood-frontend.git

2. Crear un .env en la raiz del proyecto y agregar por ejemplo
VITE_API_URL=http://localhost:3000/api
que el valor sea la ruta levantada por el backend, luego el ApiService se encarga de realizar cada petición.

3. Instalar dependencias:
npm install

4. Levantar la app:
npm run dev