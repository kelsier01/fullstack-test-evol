Prueba Técnica Evol - ToDo App (NestJS + React)

Esta es una aplicación FullStack de lista de tareas (ToDo) construida con NestJS (Backend), React (Frontend), PostgreSQL (Base de Datos) y Sequelize (ORM). Todo el entorno de desarrollo está dockerizado para facilitar su ejecución.

Características

Backend: API RESTful con NestJS, Sequelize y PostgreSQL.

Frontend: Aplicación de una sola página (SPA) con React, Vite y shadcn/ui.

Funcionalidad CRUD: Creación, Lectura, Actualización y Eliminación (suave) de tareas.

Relaciones N:M: Las tareas pueden tener múltiples tags, y los tags pueden crearse "sobre la marcha" desde el formulario.

Entorno Dockerizado: Configuración completa de docker-compose para desarrollo con hot-reloading.

Seeding: La base de datos se puebla con datos iniciales si está vacía.

1. Instrucciones de Instalación y Ejecución

Este proyecto está diseñado para ejecutarse con Docker. No es necesario instalar Node.js o PostgreSQL localmente.

Prerrequisitos

Docker Desktop instalado y en ejecución.

Un editor de código (ej. VS Code).

Git.

Pasos para Ejecutar (Desarrollo)

Clonar el Repositorio:

git clone [URL-DE-TU-REPOSITORIO]
cd [NOMBRE-DEL-REPOSITORIO]


Crear el archivo de variables de entorno:
Crea un archivo llamado .env en la raíz del proyecto. Copia y pega el siguiente contenido:

# --- Configuración de PostgreSQL ---
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=prueba_bd

# --- Configuración del Backend (NestJS) ---
# NestJS usará 'db' como host porque está dentro de la red de Docker
DB_DIALECT=postgres
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_DATABASE=prueba_bd

# --- Configuración del Frontend (React) ---
# React (en el navegador) necesita la URL pública
VITE_API_URL=http://localhost:3000


Levantar los contenedores:
Este comando construirá (la primera vez) e iniciará los contenedores del frontend, backend y la base de datos.

docker compose up --build


Acceder a la Aplicación:
Una vez que los contenedores estén en ejecución, podrás acceder a:

Frontend (React): http://localhost:5173

Backend (NestJS): http://localhost:3000

Base de Datos (PostgreSQL): localhost:5432 (visible para clientes como PGAdmin o DBeaver).

Comandos Adicionales

Detener los contenedores (en segundo plano):

docker compose down


Detener y eliminar los volúmenes (borrar la DB):

docker compose down -v


2. Variables de Entorno Necesarias

El único archivo que se necesita es el .env en la raíz del proyecto (detallado en el paso 2 de la instalación). Contiene:

Variable

Descripción

Ejemplo

POSTGRES_USER

Usuario para la base de datos PostgreSQL.

myuser

POSTGRES_PASSWORD

Contraseña para la base de datos PostgreSQL.

mypassword

POSTGRES_DB

Nombre de la base de datos a crear.

mi_api_db

DB_HOST

(Para NestJS) El alias de red de Docker del servicio de DB.

db

DB_PORT

(Para NestJS) El puerto interno de la DB.

5432

DB_USERNAME

(Para NestJS) Usuario para la conexión de Sequelize.

myuser

DB_PASSWORD

(Para NestJS) Contraseña para la conexión de Sequelize.

mypassword

DB_DATABASE

(Para NestJS) Nombre de la DB a la que se conecta.

prueba_bd

VITE_API_URL

(Para React) La URL pública del backend.

http://localhost:3000

3. Estructura del Proyecto

El repositorio está organizado en dos carpetas principales: frontend y backend.

/
├── .env                # Variables de entorno (NO SUBIR A GIT si tuviera secretos)
├── docker-compose.yml  # Orquestador de Docker para desarrollo
│
├── backend/            # Proyecto NestJS
│   ├── Dockerfile      # Define la imagen de producción del backend
│   ├── src/
│   │   ├── main.ts     # Punto de entrada (habilita CORS, ValidationPipes)
│   │   ├── app.module.ts # Módulo raíz (importa SeedModule)
│   │   ├── database/   # Configuración de Sequelize (DatabaseModule)
│   │   ├── seed/       # Lógica de sembrado (SeedService)
│   │   ├── task/       # Módulo de Tareas (Controller, Service, Entity, DTOs)
│   │   └── tags/       # Módulo de Tags (Controller, Service, Entity, DTOs)
│   └── package.json
│
└── frontend/           # Proyecto React + Vite
    ├── Dockerfile      # Define la imagen de producción del frontend
    ├── src/
    │   ├── main.tsx    # Punto de entrada (Renderiza BrowserRouter)
    │   ├── App.tsx     # Define las rutas (React Router)
    │   ├── layout/     # Contiene el MainLayout (Sidebar + Outlet)
    │   ├── pages/
    │   │   └── ToDoPage.tsx # Lógica principal (carga datos, modales, tabla)
    │   ├── components/
    │   │   ├── task-form.tsx # Formulario de Creación/Edición (Formik + Yup)
    │   │   └── ui/         # Componentes de shadcn/ui
    │   ├── services/
    │   │   ├── task.service.ts # Peticiones Axios para Tareas
    │   │   └── tag.service.ts  # Peticiones Axios para Tags
    │   ├── interface/
    │   │   └── interfaces.ts # Tipos de Task y Tag
    │   ├── schemas/
    │   │   └── schemas.ts  # Esquema de validación Yup
    │   └── vite.config.ts  # Configuración de Vite (alias '@')
    └── package.json
