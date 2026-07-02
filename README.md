# BIO CWT — Laravel + React CMS

BIO CWT is a full-stack assessment project for a woodworking company website.

Laravel serves both the REST API and the compiled React single-page application, while PostgreSQL stores website content, administrator session data, and contact messages.

The production app is deployed as a single Render web service with a Supabase-hosted PostgreSQL database. Authentication is handled by Laravel using JWT access tokens and rotating HTTP-only refresh cookies.

Check Credits for more information.

---

## Quick Links

* **Live App:** https://wps-exercise.onrender.com
* **Admin Login:** https://wps-exercise.onrender.com/login
* **Admin Dashboard:** https://wps-exercise.onrender.com/admin
* **Swagger API Documentation:** https://wps-exercise.onrender.com/api/documentation
* **OpenAPI JSON:** https://wps-exercise.onrender.com/docs

---

## Test Admin Credentials

```txt
Local Defaults:
Email: test@example.com
Password: [password]
```

---

## Features

* Responsive public website built with React and TypeScript
* Protected administrator dashboard and CMS
* Manage homepage sections, services, products/wood types, and images
* Upload, reorder, publish/unpublish, and delete product images
* Select product galleries for the public “Our Work” section
* Public contact form with rate limiting and admin inbox
* JWT authentication with short-lived access tokens
* Rotating HTTP-only refresh tokens
* One active administrator session/browser tab at a time
* Swagger/OpenAPI documentation for API routes
* PostgreSQL migrations and repeatable seeders

---

## Technology Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Backend         | Laravel 12, PHP 8.2                          |
| Frontend        | React 19, TypeScript, React Router           |
| Styling / Build | Tailwind CSS, Vite                           |
| API Client      | Axios                                        |
| Database        | PostgreSQL                                   |
| Production DB   | Supabase PostgreSQL                          |
| Auth            | JWT access tokens + rotating refresh cookies |
| API Docs        | L5-Swagger / OpenAPI                         |
| Deployment      | Docker, Apache, Render                       |

---

## Architecture Overview

Laravel is the only web server. It serves the React single-page application from:

```txt
resources/views/app.blade.php
```

React is built from:

```txt
resources/js/main.tsx
```

Browser routes such as `/`, `/login`, and `/admin` are handled by React Router through Laravel’s fallback route.

API requests are sent to `/api`, so the frontend and backend share one origin in production.

### Backend Responsibilities

* `routes/api.php` defines public, authentication, and protected CMS endpoints
* Controllers handle API actions
* Form Requests validate write operations
* Eloquent models persist CMS content in PostgreSQL
* Services handle authentication, media, refresh tokens, and public content updates
* Swagger/OpenAPI files document the API

### Frontend Responsibilities

* React Router handles public and admin pages
* `AuthProvider` manages login state and session restoration
* Access tokens are stored in memory
* Refresh tokens are stored as HTTP-only cookies
* Admin routes are protected from unauthenticated access

---

## Repository Structure

```txt
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   ├── Middleware/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   ├── OpenApi/
│   └── Services/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── js/
│   └── views/app.blade.php
├── routes/
│   ├── api.php
│   └── web.php
├── storage/app/public/
├── Dockerfile
└── docker-start.sh
```

---

## Local Setup

All commands should be run from the `backend` directory.

### 1. Clone the Repository or Download Source Code

```bash
git clone https://github.com/adhamwh/WPS-Exercise.git
cd WPS-Exercise/backend
```

### 2. Install Dependencies

```bash
composer install
npm install
```

### 3. Create `.env`

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Generate App Secrets

```bash
php artisan key:generate
php artisan jwt:secret
```

### 5. Configure PostgreSQL

Example local database configuration:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=wps_exercise
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 6. Configure Admin Credentials

```env
ADMIN_NAME="Site Administrator"
ADMIN_EMAIL=test@example.com 
ADMIN_PASSWORD=password
# Local values / Configure properly if going for deployment.
```

### 7. Run Migrations and Seeders

```bash
php artisan migrate --seed
```

This creates the database schema, initial homepage content, services, products, and admin account.

### 8. Create Storage Link

```bash
php artisan storage:link
```

### 9. Generate Swagger Documentation

```bash
php artisan l5-swagger:generate
```

### 10. Start the App

#### Terminal 1: Laravel.

```bash
php artisan serve
```

#### Terminal 2: React.

```bash
npm run dev
```

Open:

```txt
http://127.0.0.1:8000
```

---

## Environment Variables

Important variables:

```env
APP_NAME="BIO CWT"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

VITE_API_URL=/api
FRONTEND_URLS=http://127.0.0.1:8000,http://localhost:5173

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=wps_exercise
DB_USERNAME=postgres
DB_PASSWORD=

JWT_SECRET=
JWT_TTL=15
JWT_BLACKLIST_ENABLED=true

AUTH_REFRESH_TOKEN_TTL_DAYS=7
AUTH_REFRESH_COOKIE_NAME=refresh_token
AUTH_REFRESH_COOKIE_PATH=/api/auth
AUTH_REFRESH_COOKIE_DOMAIN=null
AUTH_REFRESH_COOKIE_SECURE=false
AUTH_REFRESH_COOKIE_SAME_SITE=lax

ADMIN_NAME="Site Administrator"
ADMIN_EMAIL=test@example.com
ADMIN_PASSWORD=password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
```

For production, use:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://wps-exercise.onrender.com
AUTH_REFRESH_COOKIE_SECURE=true
```

---

## Database Setup

The project uses PostgreSQL - 15 Total tables in Supabase.

Main tables include:

| Table               | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `users`             | Admin account and auth session version     |
| `refresh_tokens`    | Rotating hashed refresh tokens             |
| `homepage_sections` | Hero, about, contact, and homepage content |
| `services`          | Public services                            |
| `products`          | Wood types/products                        |
| `product_images`    | Product gallery images                     |
| `contact_messages`  | Public contact form submissions            |
| `sessions`          | Laravel database sessions                  |
| `cache`             | Laravel cache storage                      |

### Supabase Production Setup

For Supabase production setup, use the Session Pooler connection values in Render:

```env
DB_CONNECTION=pgsql
DB_HOST=aws-1-eu-central-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.PROJECT_REF
DB_PASSWORD=your_supabase_password
```

Do not manually create tables in Supabase. Laravel migrations create the schema:

```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## API Documentation

Swagger UI is available at:

```txt
/api/documentation
```

OpenAPI JSON is available at:

```txt
/docs
```

To regenerate documentation locally:

```bash
php artisan l5-swagger:generate
```

Protected routes require a Bearer token.

To test protected endpoints in Swagger:

1. Call `POST /api/auth/login`
2. Copy the returned `access_token`
3. Click **Authorize** in Swagger UI
4. Paste the token into the `bearerAuth` field

---

## Authentication Flow

1. Admin logs in using email and password
2. Laravel validates the credentials
3. A short-lived JWT access token is returned
4. A refresh token is stored as an HTTP-only cookie
5. Axios stores the access token in memory
6. When the access token expires, the frontend calls `/api/auth/refresh`
7. Refresh tokens rotate after use
8. Logging in again invalidates the previous admin session
9. Logout revokes tokens and clears the refresh cookie

---

## File Uploads

CMS images are stored on Laravel’s public disk:

```txt
storage/app/public
```

They are exposed publicly through:

```txt
public/storage
```

Create the storage link locally with:

```bash
php artisan storage:link
```

On Render, uploaded files are stored on the service filesystem. Without a persistent disk, uploaded files may be lost after a restart or redeploy.

For long-term production use, attach persistent storage or use external storage such as Supabase Storage, S3, or Cloudinary.

---

## Deployment

The project is deployed as a Docker web service on Render.

### Render Setup

| Setting        | Value                              |
| -------------- | ---------------------------------- |
| Runtime        | Docker                             |
| Branch         | `Code-Cleaning`                    |
| Root Directory | `backend`                          |
| Region         | Frankfurt                          |
| Database       | Supabase PostgreSQL Session Pooler |

The Dockerfile installs PHP dependencies, Node dependencies, builds the React/Vite frontend, configures Apache to serve Laravel’s public folder, and starts the app using `docker-start.sh`.

On startup, `docker-start.sh` runs:

```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link || true
apache2-foreground
```

The seeder is currently enabled so a fresh deployment receives initial CMS data and an admin account.

After the initial deployment, the seed command can be removed if CMS edits should never be reset.

---

## Troubleshooting

### Supabase Connection Fails

Use the Supabase Session Pooler host instead of the direct database host.

---

### Login Credentials Do Not Work on Production

Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in Render and that the seeder has run.

---

### Uploaded Images Return 404

Run:

```bash
php artisan storage:link
```

On Render, make sure this command exists in `docker-start.sh`.

---

### Uploaded Images Disappear After Redeploy

Render’s default filesystem is ephemeral.

Use a persistent disk or external storage for long-term uploaded files.

---

### Swagger Page Is Missing

Run:

```bash
php artisan l5-swagger:generate
```

---

## Security Notes

* Store secrets only in Render environment variables.
* Access tokens are kept in memory, not local storage.

---

## Credits & Information

This repository was developed as a technical assessment project for Pixel38.

Design rights belong to Pixel38.

AI Tools Used: Cursor + Codex / GPT-5.5.

Development Time: Approx. 5-7 hours.
