# node_project
# Specialy - Backend

Backend para la aplicación Specialy, una plataforma de reservas para espacios en establecimientos de ocio como bares y restaurantes. Encargado de gestionar la búsqueda de lugares, la visualización detallada de establecimientos y mesas, la gestión de reservas, el procesamiento de pagos con un modelo de comisión, y la administración de reseñas y calificaciones.

## Tecnologías Utilizadas

* **Lenguaje:** TypeScript
* **Framework:** Node.js con Express
* **Base de Datos:** MySQL
* **ORM:** Prisma
* **Contenerización:** Docker y Docker Compose
* **Linting:** ESLint

## Funcionalidades Clave

Basado en los objetivos del proyecto, las principales funcionalidades implementadas o gestionadas por el backend incluyen:

* **Búsqueda y Exploración:** Permitir la búsqueda de establecimientos mediante filtros (categoría, ubicación, tipo de evento) y proporcionar datos para la visualización en un mapa interactivo.
* **Gestión de Establecimientos y Espacios:** Almacenar y servir información detallada de cada lugar (imágenes, ubicación, precios, características) y la disponibilidad de sus mesas o espacios específicos.
* **Sistema de Reservas:** Gestionar el proceso de reserva, validar disponibilidad y confirmar la selección de mesas o espacios por parte del usuario.
* **Procesamiento de Pagos:** Integrar un sistema para completar transacciones de reserva dentro de la plataforma, aplicando el modelo de negocio basado en comisiones por reserva confirmada.
* **Sistema de Reseñas y Calificaciones:** Recopilar, almacenar y servir las valoraciones y comentarios de los usuarios sobre los establecimientos para ayudar a la toma de decisiones.

## Funcionalidades Futuras

Se tienen planeadas las siguientes expansiones para la plataforma:

* **Sección de Eventos:** Soporte para información y reserva de espacios/entradas para eventos específicos en los establecimientos (música en vivo, stand up, etc.). La visualización de eventos podrá incluir filtrado por fecha y tipo mediante un calendario.
* **Filtrado de Eventos Gratuitos:** Inclusión de eventos sin costo ni comisión, como ferias o espectáculos gratuitos, para ampliar la difusión y ofrecer valor a los usuarios sin costo.

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas antes de empezar:

* [Node.js](https://nodejs.org/) (Se recomienda la versión LTS)
* [NPM](https://www.npmjs.com/) (Viene con Node.js) o [Yarn](https://yarnpkg.com/)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/install/) (Generalmente viene incluido con Docker Desktop)

## Configuración Inicial

Estos pasos son necesarios la primera vez que clonas el proyecto o si necesitas reinstalar dependencias o reconfigurar el entorno base.

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/nazabe/node_project.git](https://github.com/nazabe/node_project.git)
    cd specialy-backend # O el nombre de la carpeta del proyecto
    ```

2.  **Instalar Dependencias del Proyecto:**
    ```bash
    npm install
    # o si usas yarn:
    # yarn install
    ```
    *(Nota: Este paso instala las dependencias en tu máquina local, necesarias para ejecutar comandos como `npx prisma` o `npm run dev`).*

3.  **Configurar Variables de Entorno:**
    * Crea un archivo `.env` en la raíz del proyecto. Puedes copiar la estructura del archivo `.env.example` (si existe) o usar la siguiente estructura:
        ```dotenv
        # Variables de conexión a la Base de Datos (ajusta según tu configuración de Docker/MySQL)
        # Esta URL se usa para comandos de Prisma ejecutados localmente
        DATABASE_URL="mysql://root:rootpassword@localhost:3306/specialy_db"

        # Puerto en el que correrá la aplicación Express en modo desarrollo local
        PORT=3000
        ```
    * **Importante:** El valor de `DATABASE_URL` debe coincidir con la configuración de tu servicio MySQL en `docker-compose.yml` si planeas ejecutar comandos Prisma localmente contra la base de datos en Docker. Asegúrate de que el archivo `.env` esté listado en tu `.gitignore`.

## Modos de Ejecución

El proyecto puede ser ejecutado de dos maneras principales: completamente containerizada usando Docker Compose, o en modo desarrollo local utilizando Node.js localmente pero con la base de datos en Docker.

### 1. Ejecución Containerizada con Docker Compose

Este modo construye una imagen Docker de tu aplicación y la ejecuta en un contenedor, junto con la base de datos. Es útil para simular un entorno de producción o para asegurar que la aplicación se ejecuta correctamente dentro de Docker. Requiere tener Docker y Docker Compose instalados y funcionando correctamente.

* Asegúrate de que Docker Desktop esté corriendo.
* Detén cualquier instancia previa de tus contenedores o cualquier otro servicio que use el puerto 3000 o 3306.

* **Construir la imagen de la aplicación y levantar ambos servicios (aplicación y base de datos):**
    Ejecuta este comando desde la raíz del proyecto. Docker Compose leerá el `docker-compose.yml`, construirá la imagen `app` (ejecutando el `Dockerfile` que incluye la instalación de dependencias, la generación del cliente Prisma y la compilación del código) y luego iniciará los contenedores `mysql` y `app` en segundo plano.
    ```bash
    docker-compose up --build -d
    ```
    * `--build`: Fuerza la reconstrucción de la imagen `app`, esencial después de cambios en el código o el `Dockerfile`.
    * `-d`: Ejecuta los contenedores en segundo plano.

* **Posibles Errores durante `docker-compose up --build -d`:**
    * **`permission denied` al conectar al socket de Docker (en Linux):** Tu usuario no tiene permisos para comunicarse con el daemon de Docker. **Solución:** Ejecuta el comando con `sudo` (`sudo docker-compose up --build -d`) o agrega tu usuario al grupo `docker` y reinicia tu sesión (`sudo usermod -aG docker $USER`).
    * **`no such file or directory` para `Dockerfile`:** El archivo `Dockerfile` no se encontró en la ubicación esperada (generalmente la raíz del proyecto) o hay un error tipográfico en el nombre (recuerda que en Linux/WSL es sensible a mayúsculas/minúsculas, debe ser `Dockerfile`). **Solución:** Verifica la ubicación y el nombre del archivo `Dockerfile`.
    * **`Could not find Prisma Schema` durante el build (`RUN npx prisma generate`):** El archivo `schema.prisma` no estaba presente en el directorio de trabajo del contenedor cuando se ejecutó `prisma generate`. **Solución:** Asegúrate de que la línea `COPY . .` en tu `Dockerfile` esté ubicada *antes* de la línea `RUN npx prisma generate`.
    * **`address already in use` en el puerto 3306 o 3000:** Otro proceso en tu máquina local ya está usando ese puerto. **Solución:** Identifica y detén el proceso que está ocupando el puerto (usando `netstat -ano | findstr :<puerto>` en Windows o `sudo lsof -i :<puerto>` en Linux/WSL, y luego finaliza el proceso por su PID).
    * **Problemas de integración con WSL en Docker Desktop (en Windows):** Errores relacionados con la "Plataforma de máquina virtual" o la comunicación con tu distribución de WSL. **Solución:** Asegúrate de que la característica "Plataforma de máquina virtual" esté habilitada en Windows (usa `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart` en PowerShell como administrador) y que la virtualización esté habilitada en el BIOS/UEFI de tu PC. Intenta reiniciar la integración de WSL en Docker Desktop o `wsl --shutdown`.

* **Verificar que los contenedores estén corriendo:**
    Después de ejecutar `docker-compose up --build -d`, verifica el estado de los servicios:
    ```bash
    docker-compose ps
    ```
    Tanto `specialy_mysql_db` como `specialy_app` deberían aparecer con estado `Up`. Si `specialy_app` no está `Up` o no aparece, revisa sus logs inmediatamente (`docker logs specialy_app` - puede que necesites `sudo` dependiendo de tu sistema y configuración) para ver el error de inicio.

* **Aplicar Migraciones de Base de Datos (Importante después de levantar los contenedores por primera vez o si hay cambios no aplicados):**
    Aunque el contenedor `app` esté corriendo, las migraciones de Prisma deben ejecutarse *dentro* de él para configurar la base de datos.
    ```bash
    sudo docker exec specialy_app npx prisma migrate dev --name init
    ```
    *(Si no usas `sudo`, ejecuta solo `docker exec specialy_app npx prisma migrate dev --name init`. Si da error de permisos o "command not found", revisa la configuración de tu entorno Docker/WSL en Windows para permitir la ejecución de comandos sin sudo).*
    * **Posible Error:** Si el contenedor `specialy_app` no está en estado `running` cuando ejecutas `docker exec`, obtendrás un error indicando que el contenedor no está listo o no existe. **Solución:** Asegúrate de que `docker-compose ps` muestre `specialy_app` como `Up` antes de intentar `docker exec`. Revisa los logs del contenedor si no está arrancando.

* **Acceder a la Aplicación:**
    Una vez que `specialy_app` esté `Up` y hayas ejecutado las migraciones, la aplicación estará escuchando en el puerto 3000 del contenedor, mapeado al puerto 3000 de tu máquina local.
    Abre tu navegador o usa `curl` y ve a:
    ```
    http://localhost:3000
    ```
    Deberías ver el mensaje de la ruta base.

### 2. Ejecución en Modo Desarrollo Local

Este modo es ideal para el desarrollo activo. La aplicación Node.js/TypeScript corre directamente en tu máquina local, permitiendo reinicios rápidos, mientras se conecta a la base de datos que corre en un contenedor Docker. Requiere tener Node.js (con NPM/Yarn) y Docker instalados.

* Asegúrate de haber completado los pasos 1, 2 y 3 de la **Configuración Inicial** (clonar repo, instalar dependencias locales, configurar `.env`).

* **Asegúrate de que solo el servicio de base de datos esté corriendo en Docker:**
    ```bash
    docker-compose up -d mysql
    ```
    Verifica con `docker-compose ps` que `specialy_mysql_db` esté `Up`. Si hay otros contenedores de este proyecto corriendo (`specialy_app`), deténlos con `docker-compose down` antes de continuar.

* **Aplicar Migraciones de Base de Datos localmente:**
    Con la base de datos corriendo en Docker, aplica las migraciones usando Prisma desde tu terminal local. Este comando lee tu `schema.prisma` y se conecta a la base de datos usando la `DATABASE_URL` de tu archivo `.env`.
    ```bash
    npx prisma migrate dev --name init # O un nombre descriptivo
    ```
    * **Posible Error:** **`npx : No se puede cargar el archivo ... porque la ejecución de scripts está deshabilitada en este sistema` (en PowerShell):** La política de ejecución de scripts de PowerShell impide que `npx` (o scripts que use) se ejecute. **Solución:** Abre **PowerShell NORMAL** (no como administrador) y ejecuta `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`. Confirma el cambio ('S') e intenta el comando `npx` de nuevo en esa misma ventana.
    * **Posible Error:** **`Environment variable not found: DATABASE_URL` durante el comando `npx prisma`:** Prisma no encontró la variable `DATABASE_URL` en tu entorno local. **Solución:** Asegúrate de que el archivo `.env` esté en la raíz de tu proyecto, que contenga la línea `DATABASE_URL="..."` (sin comentar `#`), y que no tenga errores tipográficos o espacios extra. Guarda el archivo `.env`.

* **Generar Cliente Prisma localmente:**
    Después de las migraciones o cambios en `schema.prisma`, genera el cliente de Prisma localmente para que tu código TypeScript lo use.
    ```bash
    npx prisma generate
    ```
    * **Posible Error:** El mismo error de ejecución de scripts de PowerShell o de `DATABASE_URL` si no se resolvieron en el paso anterior.

* **Iniciar la Aplicación en modo Desarrollo Local:**
    Con la base de datos en Docker lista y el cliente de Prisma generado localmente, inicia el servidor de la aplicación:
    ```bash
    npm run dev
    # o si usas yarn:
    # yarn dev
    ```
    Este comando usa `ts-node-dev` para ejecutar tu código `src/app.ts`. Verás los logs de tu aplicación en la terminal.

* **Acceder a la Aplicación:**
    Una vez que la terminal muestre que el servidor Express está escuchando (en `http://localhost:3000`), ábrelo en tu navegador o usa `curl`:
    ```
    http://localhost:3000
    ```
    Verás el mensaje de la ruta base. Los cambios en tus archivos `src/` reiniciarán automáticamente el servidor.

## Comandos de Ejecución

Estos son los scripts principales definidos en `package.json` y comandos de Docker útiles. Consulta la sección **Modos de Ejecución** para saber cómo y cuándo utilizarlos dentro del contexto de cada modo.

* `npm run dev` / `yarn dev`: Inicia la aplicación en modo desarrollo local con auto-reinicio.
* `npm run build` / `yarn build`: Compila el código TypeScript a JavaScript (`dist/`).
* `npm run start` / `yarn start`: Ejecuta la aplicación compilada (`dist/app.js`).
* `npm run lint` / `yarn lint`: Ejecuta ESLint (verificación de estilo).
* `npm run lint:fix` / `yarn lint:fix`: Ejecuta ESLint e intenta corregir.
* `npx prisma migrate dev --name <nombre>`: Aplica nuevas migraciones de base de datos.
* `npx prisma generate`: Genera el cliente de Prisma.
* `docker-compose up -d [servicio]`: Levanta servicios en segundo plano.
* `docker-compose up --build -d`: Construye/reconstruye imágenes y levanta servicios.
* `docker-compose down`: Detiene y elimina contenedores/redes.
* `docker-compose ps`: Lista contenedores y su estado.
* `docker-compose logs [-f] [servicio/contenedor]`: Ver logs.
* `docker exec <nombre_contenedor> <comando>`: Ejecuta un comando dentro de un contenedor.

## Estructura de Carpetas

```text
/
├── dist/                 # Código JavaScript compilado (generado por npm run build)
├── node_modules/         # Dependencias del proyecto (generado por npm install)
├── prisma/               # Configuración y migraciones de Prisma
│   └── schema.prisma     # Esquema de la base de datos
├── src/                  # Código fuente TypeScript
│   └── generated/
│   └── app.ts            # Punto de entrada principal de la aplicación (u otro nombre como server.ts, index.ts)
├── .env                  # Variables de entorno locales (¡No subir a Git!)
├── .env.example          # Ejemplo de variables de entorno (Subir a Git)
├── .gitignore            # Archivos y carpetas ignorados por Git
├── docker-compose.yml    # Definición de servicios Docker (App, DB, etc.)
├── Dockerfile            # Instrucciones para construir la imagen Docker de la app
├── eslint.config.mjs     # Configuración de ESLint
├── LICENSE               # Licencia del proyecto
├── package-lock.json     # Registro exacto de versiones de dependencias (npm)
├── package.json          # Metadatos, dependencias y scripts del proyecto
├── README.md             # Este archivo
└── tsconfig.json         # Configuración del compilador TypeScript
```

## Autores

* Aaron Timoteo Galarza
* Aguirre Nazareno
* Mario Gabriel Duprat

## Notas Adicionales
Documentación de API: Considerar usar herramientas como Swagger o Postman para documentar los endpoints de la API.
Estilo de Código: El proyecto está configurado con ESLint (eslint.config.mjs). Por favor, ejecuta npm run lint o yarn lint regularmente para mantener la consistencia del código.

## Enlaces Adicionales:

* Google Docs con info del proyecto - [https://docs.google.com/document/d/1YVWtF3KCPYccfuq2M-2y5SeVrim6y_uv_ut7lqkuEMI/edit?usp=drivesdk]
* GitHub del repo (Ideas) - [https://github.com/AxelMaidana/GrupoDeProgramacion/blob/main/Ideas%20-%20Axel.md]
* Diagrama de flujo de la app (Miro) - [https://miro.com/welcomeonboard/emFhYXJDQkRkYnJxQXlDL01GN3ljZDM5clZ5cGtZUU1wOXcxY3pva0luN1cyZFlseVVqOGpOQ1B6cEJtZDJDSUNwUHYxK0Qrc3M5QVNnTDJTZ0FzWjFHT2d3MnhRbHZNTjkwS2I3bnNPSGJIUjdTOVllaTQwaWdwcE55VlY5b1V0R2lncW1vRmFBVnlLcVJzTmdFdlNRPT0hdjE=?share_link_id=51605837250]

Citas Sacadas del Google Docs como Fuente
Las citas a lo largo de este documento (``) hacen referencia a la información extraída del documento "Proyecto_ Plataforma de Reservas para Espacios de Ocio.pdf" que sirvió como base para describir las funcionalidades y objetivos del proyecto.
