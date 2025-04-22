# node_project
# Specialy - Backend

Backend para la aplicación Specialy, una plataforma de reservas para espacios en establecimientos de ocio como bares y restaurantes. Encargado de gestionar la búsqueda de lugares, la visualización detallada de establecimientos y mesas, la gestión de reservas, el procesamiento de pagos con un modelo de comisión, y la administración de reseñas y calificaciones. [cite: 3, 4, 5, 6, 14, 15, 16, 21, 22]

## Tecnologías Utilizadas

* **Lenguaje:** TypeScript
* **Framework:** Node.js con Express
* **Base de Datos:** MySQL
* **ORM:** Prisma
* **Contenerización:** Docker y Docker Compose
* **Linting:** ESLint

## Funcionalidades Clave

Basado en los objetivos del proyecto, las principales funcionalidades implementadas o gestionadas por el backend incluyen:

* **Búsqueda y Exploración:** Permitir la búsqueda de establecimientos mediante filtros (categoría, ubicación, tipo de evento) y proporcionar datos para la visualización en un mapa interactivo. [cite: 10, 11]
* **Gestión de Establecimientos y Espacios:** Almacenar y servir información detallada de cada lugar (imágenes, ubicación, precios, características) y la disponibilidad de sus mesas o espacios específicos. [cite: 5, 12, 13]
* **Sistema de Reservas:** Gestionar el proceso de reserva, validar disponibilidad y confirmar la selección de mesas o espacios por parte del usuario. [cite: 4, 13]
* **Procesamiento de Pagos:** Integrar un sistema para completar transacciones de reserva dentro de la plataforma, aplicando el modelo de negocio basado en comisiones por reserva confirmada. [cite: 6, 15, 16]
* **Sistema de Reseñas y Calificaciones:** Recopilar, almacenar y servir las valoraciones y comentarios de los usuarios sobre los establecimientos para ayudar a la toma de decisiones. [cite: 5, 14, 22]

## Funcionalidades Futuras

Se tienen planeadas las siguientes expansiones para la plataforma:

* **Sección de Eventos:** Soporte para información y reserva de espacios/entradas para eventos específicos en los establecimientos (música en vivo, stand up, etc.). [cite: 18] La visualización de eventos podrá incluir filtrado por fecha y tipo mediante un calendario. [cite: 17]
* **Filtrado de Eventos Gratuitos:** Inclusión de eventos sin costo ni comisión, como ferias o espectáculos gratuitos, para ampliar la difusión y ofrecer valor a los usuarios sin costo. [cite: 19, 20]

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas antes de empezar:

* [Node.js](https://nodejs.org/) (Se recomienda la versión LTS)
* [NPM](https://www.npmjs.com/) (Viene con Node.js) o [Yarn](https://yarnpkg.com/)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/install/) (Generalmente viene incluido con Docker Desktop)

## Configuración Inicial

1.  **Clonar el Repositorio:**
    ```bash
    git clone <https://github.com/nazabe/node_project.git>
    cd specialy-backend # O el nombre de la carpeta del proyecto
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    # o si usas yarn:
    # yarn install
    ```

3.  **Configurar Variables de Entorno:**
    * Crea un archivo `.env` en la raíz del proyecto (se crea automaticamente a la hora de clonar el repo).
    usa la siguiente estructura:
        ```dotenv
        # Variables de conexión a la Base de Datos (ajusta según tu configuración de Docker/MySQL)
        DATABASE_URL="mysql://root:rootpassword@localhost:3306/specialy_db"

        # Puerto en el que correrá la aplicación Express
        PORT=3000
        ```
    * **Importante:** El valor de `DATABASE_URL` asume que tu contenedor MySQL expone el puerto `3306` al `localhost` de tu máquina. Verifica la sección `ports` de tu servicio MySQL en `docker-compose.yml`. Las credenciales (`root`, `rootpassword`) y el nombre de la base de datos (`specialy_db`) deben coincidir con las definidas en las variables de entorno del servicio MySQL en tu `docker-compose.yml`.
    * Asegúrate de que el archivo `.env` esté listado en tu `.gitignore` para no subir secretos al repositorio.

4.  **Levantar Servicios con Docker Compose:**
    * Asegúrate de que Docker Desktop esté corriendo.
    * Desde la raíz del proyecto, ejecuta:
        ```bash
        docker-compose up -d
        ```
    * Este comando construirá (si es necesario) y levantará los contenedores definidos en `docker-compose.yml` (incluyendo la base de datos MySQL) en segundo plano (`-d`).

5.  **Aplicar Migraciones de Base de Datos:**
    * La primera vez, y cada vez que haya cambios en `prisma/schema.prisma`, ejecuta la migración para actualizar la estructura de la base de datos:
        ```bash
        npx prisma migrate dev --name init # La primera vez puedes usar --name init o un nombre descriptivo
        ```
    * Esto creará o actualizará las tablas en la base de datos definida en `DATABASE_URL`.

6.  **Generar Cliente Prisma:**
    * Después de cualquier cambio en `prisma/schema.prisma` (o después de `migrate dev`), es bueno regenerar el Cliente Prisma:
        ```bash
        npx prisma generate
        ```

## Comandos de Ejecución

* **Iniciar en modo Desarrollo (con reinicio automático):**
    ```bash
    npm run dev
    # o
    # yarn dev
    ```
    * Usa `ts-node-dev` para ejecutar el código TypeScript directamente y reiniciar el servidor al detectar cambios. Ideal para desarrollar.

* **Construir para Producción:**
    ```bash
    npm run build
    # o
    # yarn build
    ```
    * Compila el código TypeScript (`src/`) a JavaScript en la carpeta `dist/`.

* **Iniciar en modo Producción:**
    ```bash
    npm run start
    # o
    # yarn start
    ```
    * Ejecuta la aplicación compilada desde `dist/app.js`. Requiere haber ejecutado `npm run build` antes.

* **Ejecutar Linting (verificar estilo de código):**
    ```bash
    npm run lint
    # o
    # yarn lint
    ```

* **Ejecutar Linting y tratar de arreglar errores:**
    ```bash
    npm run lint:fix
    # o
    # yarn lint:fix
    ```

* **Manejar Contenedores Docker:**
    * Levantar servicios en segundo plano: `docker-compose up -d`
    * Detener servicios: `docker-compose down`
    * Ver logs: `docker-compose logs -f [nombre_del_servicio]` (ej: `docker-compose logs -f mysql_db`)

## Estructura de Carpetas

<pre> ```text / ├── dist/ # Código JavaScript compilado (generado por npm run build) ├── node_modules/ # Dependencias del proyecto (generado por npm install) ├── prisma/ # Configuración y migraciones de Prisma │ └── schema.prisma # Esquema de la base de datos ├── src/ # Código fuente TypeScript │ └── app.ts # Punto de entrada principal de la aplicación (u otro nombre como server.ts, index.ts) │ # --- Agrega aquí otras subcarpetas importantes (ej: /controllers, /routes, /services, /models, etc.) --- ├── .env # Variables de entorno locales (¡No subir a Git!) ├── .env.example # Ejemplo de variables de entorno (Subir a Git) ├── .gitignore # Archivos y carpetas ignorados por Git ├── docker-compose.yml # Definición de servicios Docker (App, DB, etc.) ├── Dockerfile # Instrucciones para construir la imagen Docker de la app (si aplica) ├── eslint.config.mjs # Configuración de ESLint ├── LICENSE # Licencia del proyecto ├── package-lock.json # Registro exacto de versiones de dependencias (npm) ├── package.json # Metadatos, dependencias y scripts del proyecto ├── README.md # Este archivo └── tsconfig.json # Configuración del compilador TypeScript ``` </pre>

## Autores

* Aaron Timoteo Galarza
* Aguirre Nazareno
* Mario Gabriel Duprat

## Notas Adicionales

* **Documentación de API:** Considerar usar herramientas como [Swagger](https://swagger.io/) o [Postman](https://www.postman.com/) para documentar los endpoints de la API.
* **Estilo de Código:** El proyecto está configurado con ESLint (`eslint.config.mjs`). Por favor, ejecuta `npm run lint` o `yarn lint` regularmente para mantener la consistencia del código.
* **Enlaces Adicional:** - Google Docs con info del proyecto -[https://docs.google.com/document/d/1YVWtF3KCPYccfuq2M-2y5SeVrim6y_uv_ut7lqkuEMI/edit?usp=drivesdk]
- GitHub del repo-[https://github.com/AxelMaidana/GrupoDeProgramacion/blob/main/Ideas%20-%20Axel.md]
- Diagrama de flujo de la app -[https://miro.com/welcomeonboard/emFhYXJDQkRkYnJxQXlDL01GN3ljZDM5clZ5cGtZUU1wOXcxY3pva0luN1cyZFlseVVqOGpOQ1B6cEJtZDJDSUNwUHYxK0Qrc3M5QVNnTDJTZ0FzWjFHT2d3MnhRbHZNTjkwS2I3bnNPSGJIUjdTOVllaTQwaWdwcE55VlY5b1V0R2lncW1vRmFBVnlLcVJzTmdFdlNRPT0hdjE=?share_link_id=51605837250]
* **Citas Sacas del Google Docs como Funte**
