# Build a Personal Fitness Web Application

## Overview

Build a full-stack web application called **Fitness**.

This application is designed for **personal use only**. It will help me track my gym progress and bulking journey.

The application itself **does not use AI directly**.

Instead, an external **Hermes Agent** running on my VPS will periodically fetch data from the backend, analyze it with LLMs, generate reports, and save the results back into the application.

There is only **one user**, so authentication, authorization, and user management are **not required**.

---

# Goals

The application should become my personal fitness dashboard.

It should help me answer questions like:

* Did I reach my calorie target today?
* Did I eat enough protein?
* How much workout volume did I do?
* Is my weight increasing as expected?
* Am I recovering well?
* What should I improve tomorrow?

---

# Tech Stack

Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* TanStack Query
* React Hook Form
* Zod
* shadcn/ui
* Recharts

Backend

* Fastify
* TypeScript
* Prisma ORM
* PostgreSQL
* Zod Validation

---

# Project Structure

Frontend

```text
src/

    app/

    components/

    layouts/

    hooks/

    lib/

    services/

    types/

    features/

        dashboard/

        nutrition/

        workout/

        recovery/

        body/

        supplements/

        reports/

        settings/
```

Backend

```text
src/

    modules/

        dashboard/

        nutrition/

        workout/

        recovery/

        body/

        supplements/

        reports/

        settings/

    prisma/

    plugins/

    middleware/

    utils/
```

Each backend module should contain:

* routes
* service
* repository
* schema
* dto

Use a clean feature-based architecture.

Business logic must not exist inside routes.

---

# No Authentication

Do not implement:

* Login
* Register
* JWT
* Sessions
* Users
* Roles
* Permissions

Assume there is only one owner of this application.

---

# Main Features

## Dashboard

The dashboard should display today's progress.

Cards

* Calories
* Protein
* Carbs
* Fat
* Fiber
* Water
* Workout Status
* Sleep
* Morning Weight
* Bulking Score

Charts

* Weight Trend (7 / 30 / 90 days)
* Calories Trend
* Protein Trend
* Workout Volume Trend

---

## Nutrition

Allow manual food logging.

Fields

* Food Name
* Quantity
* Calories
* Protein
* Carbs
* Fat
* Fiber
* Meal Time
* Notes (optional)

Automatically calculate

* Total Calories
* Total Protein
* Total Carbs
* Total Fat
* Remaining Calories
* Remaining Protein
* Remaining Carbs
* Remaining Fat

---

## Workout

Create workout sessions.

Workout Session

* Date
* Workout Split
* Duration
* Notes

Exercises

* Exercise Name
* Weight
* Repetitions
* Sets

Automatically calculate

* Total Workout Volume
* Total Exercises
* Total Sets

---

## Body Metrics

Track

* Morning Weight

Optional

* Waist Circumference

Display weight history.

---

## Recovery

Track

* Sleep Duration
* Energy Level (1-10)
* Muscle Soreness
* Notes

---

## Supplements

Track daily supplement intake.

Checkboxes

* Creatine
* Whey Protein
* Fish Oil
* Vitamin D

Allow adding future supplements easily.

---

## Settings

There is only one Settings record.

Fields

Personal Information

* Height
* Current Weight
* Goal Weight

Daily Targets

* Calories
* Protein
* Carbs
* Fat
* Fiber
* Water

Training

* Current Split
* Workout Days Per Week

---

# Reports

Store AI-generated reports.

Daily Report

* Markdown
* Nutrition Score
* Workout Score
* Recovery Score
* Bulking Score

Weekly Report

* Markdown

Monthly Report

* Markdown

The application only stores and displays reports.

Hermes Agent generates them.

---

# Hermes Integration

The backend should expose REST endpoints for Hermes.

Examples

GET /api/dashboard/context

GET /api/reports/daily/context

GET /api/reports/weekly/context

GET /api/reports/monthly/context

POST /api/reports/daily

POST /api/reports/weekly

POST /api/reports/monthly

Hermes workflow

1. Fetch application data.
2. Analyze nutrition, workouts, recovery, and body metrics.
3. Generate Markdown reports.
4. Save reports back into the database.

The web application must never call any LLM directly.

---

# Database

Design a normalized Prisma schema.

Tables

Settings

NutritionEntry

WorkoutSession

WorkoutExercise

RecoveryLog

BodyMeasurement

SupplementLog

DailyReport

WeeklyReport

MonthlyReport

Use proper relationships and indexes.

---

# Dashboard Calculations

Automatically calculate

Nutrition

Current vs Target

* Calories
* Protein
* Carbs
* Fat
* Fiber
* Water

Workout

* Total Exercises
* Total Sets
* Total Volume

Recovery

* Sleep Hours

Body

* Morning Weight
* Weekly Weight Gain

Display progress bars where appropriate.

---

# UI

Modern minimal interface.

Desktop-first.

Responsive.

Dark mode.

Use cards.

Use charts.

Use loading skeletons.

Keep the UI clean and focused.

---

# Validation

Use Zod.

Frontend and backend should share validation logic where possible.

---

# State Management

TanStack Query

React Hook Form

No Redux.

---

# API Response Format

Always return

```json
{
    "success": true,
    "message": "",
    "data": {}
}
```

---

# Code Quality

Strict TypeScript.

No `any`.

Reusable components.

Reusable hooks.

Feature-first organization.

Repository pattern.

SOLID principles.

Consistent naming.

Avoid duplicated logic.

Write maintainable production-ready code.

---

# Future Extensibility

Design the architecture so new features can be added later without major refactoring.

Examples

* Barcode Scanner
* AI Food Recognition
* Exercise Library
* Meal Planner
* Smart Notifications
* Smart Recommendations
* Health Device Integration

Do not implement these features yet.

Only keep the architecture extensible.

---

# Deliverables

Generate the project incrementally.

1. Folder structure
2. Prisma schema
3. Fastify setup
4. API modules
5. React setup
6. Shared components
7. Dashboard
8. Nutrition module
9. Workout module
10. Recovery module
11. Reports module
12. Settings module
13. Docker configuration
14. Environment variables
15. README

At every step, explain the architectural decisions before generating code.

The final result should be clean, scalable, and production-ready.
