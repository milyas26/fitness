# Fitness

Personal fitness tracking dashboard with AI-powered reports via Hermes Telegram Bot.

<img width="276" height="600" alt="image" src="https://github.com/user-attachments/assets/57380550-5067-4315-9010-558c104e31f9" />


## Architecture

```
User ↔ Telegram ↔ Hermes Bot (VPS)
                     │
                     ├── POST /api/hermes/ingest         (structured data)
                     ├── POST /api/hermes/conversation   (raw chat log)
                     ├── GET  /api/hermes/context/*       (report context)
                     └── POST /api/reports/*              (save generated reports)

Browser ↔ React Frontend ↔ Fastify Backend ↔ PostgreSQL
```

The frontend is a read-and-manual-entry dashboard. All primary input comes from conversations with Hermes Telegram Bot, which parses your fitness chat, extracts structured data, and pushes it via REST API.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts, TanStack Query, React Hook Form, Zod |
| Backend | Fastify, TypeScript, Prisma ORM, Zod |
| Database | PostgreSQL 16 |
| Shared | Zod schemas, shared types (pnpm workspace package) |
| AI | Hermes Agent (external, Telegram Bot on VPS) |

## Project Structure

```
fitness/
├── apps/
│   ├── backend/          # Fastify API server
│   │   └── src/modules/  # Feature modules (dashboard, nutrition, workout, recovery, body, supplements, reports, settings, hermes)
│   └── frontend/         # React SPA
│       └── src/features/ # Feature pages
├── packages/
│   └── shared/           # Zod schemas, types, constants (shared between frontend & backend)
├── docker/               # Docker compose & Dockerfiles
├── pnpm-workspace.yaml
└── README.md
```

Each backend module contains: `routes`, `service`, `repository`. Business logic stays in services.

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL 16 (or Docker)
- Hermes Telegram Bot (separate, on VPS)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment

```bash
cp .env.example apps/backend/.env
# Edit apps/backend/.env with your values
```

### 3. Start PostgreSQL (via Docker)

```bash
docker compose -f docker/docker-compose.yml up -d postgres
```

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Start development servers

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Endpoints

### Frontend Routes (user)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Today's dashboard data |
| GET | `/api/nutrition` | List food entries |
| POST | `/api/nutrition` | Add food entry |
| PATCH | `/api/nutrition/:id` | Update food entry |
| DELETE | `/api/nutrition/:id` | Delete food entry |
| GET | `/api/workout` | List workout sessions |
| POST | `/api/workout` | Create workout session |
| GET | `/api/recovery` | Get recovery log |
| POST | `/api/recovery` | Log recovery |
| GET | `/api/body` | Get body measurement |
| GET | `/api/body/trend` | Weight trend data |
| POST | `/api/body` | Record body measurement |
| GET | `/api/supplements` | Get supplement log |
| POST | `/api/supplements` | Log supplements |
| GET | `/api/reports/daily` | Daily reports |
| GET | `/api/reports/weekly` | Weekly reports |
| GET | `/api/reports/monthly` | Monthly reports |
| GET | `/api/settings` | Get settings |
| PUT | `/api/settings` | Update settings |

### Hermes Routes (requires API key)

All Hermes routes require header: `X-API-Key: <HERMES_API_KEY>`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/hermes/ingest` | Ingest structured data from conversation |
| POST | `/api/hermes/conversation` | Save raw conversation transcript |
| GET | `/api/hermes/context/daily` | Get daily context for report generation |
| GET | `/api/hermes/context/weekly` | Get weekly context |
| GET | `/api/hermes/context/monthly` | Get monthly context |

### Hermes Ingest Payload

```json
{
  "idempotency_key": "uuid-v4",
  "conversation_id": "uuid-optional",
  "date": "2026-07-05",
  "entities": {
    "nutrition": [
      {
        "food_name": "Chicken Rice",
        "quantity": 1,
        "calories": 800,
        "protein_g": 40,
        "carbs_g": 90,
        "fat_g": 30,
        "meal_time": "lunch"
      }
    ],
    "workout": {
      "split": "Push Day",
      "duration_minutes": 60,
      "exercises": [
        { "name": "Bench Press", "weight_kg": 80, "reps": 10, "sets": 3 }
      ]
    },
    "recovery": {
      "sleep_hours": 7.5,
      "energy_level": 7,
      "muscle_soreness": "moderate"
    },
    "body": {
      "morning_weight_kg": 75.2
    },
    "supplements": {
      "creatine": true,
      "whey_protein": true,
      "fish_oil": true,
      "vitamin_d": true
    }
  }
}
```

Partial payloads are valid. Hermes can send just nutrition, just workout, etc.

## Idempotency

Hermes must include a unique `idempotency_key` (UUID v4) in each ingest request. If the same key is sent again, the backend returns the existing ingest log without duplicating data.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `HERMES_API_KEY` | API key for Hermes endpoints | Required |
| `BACKEND_PORT` | Backend server port | `3000` |

## Production Deployment

```bash
# Build and run all services
docker compose -f docker/docker-compose.yml up -d --build

# Run migrations
docker compose -f docker/docker-compose.yml exec backend npx prisma migrate deploy
```

## Settings Setup

On first run, navigate to `/settings` in the frontend and configure your targets (calories, protein, carbs, fat, fiber, water, workout split, etc.). This creates the singleton Settings record that the dashboard uses for progress calculations.
