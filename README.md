## RESTful API Tribal Worldwide
- RESTful API para prueba técnica de Tribal Worldwide desarrollada con express y mongoDB Atlas
- Se utilizó passports google-oauth20 para la autenticación

## Requerimientos
* Node v14.17.3
* MongoDB Atlas

## Configuración inicial
Clonar el repositorio de la rama master e instalar las dependencias
```bash
git clone https://github.com/MiguelMazariegos/APITWW.git
```

```bash
npm install
```

## Iniciar la aplicación
Para iniciar la aplicación realizar lo siguiente
```bash
npm run start:dev
```
* Abrir http://localhost:3000/api/login y loguearse con google
* Para acceder al listado de shows de la api de TVMaze ir a /api/shows
* Para ver la información de un show específico ir a /api/shows/:id
* Para agregar un comentario ir al dashboard y hacer click en el boton rojo en la esquina inferior derecha
* Para ver los comentarios almacenados de un show especifico ir a /api/comentarios/:showId