# DietFriend Architecture Overview

DietFriend is a modular platform for personalized dietary recommendations. The solution is designed
as a service-oriented web application with the following key layers:

## Backend (FastAPI)
- **API Layer** – FastAPI serves versioned REST endpoints for profile management, recommendation
  requests, and regional recipe discovery.
- **Services Layer** – Encapsulates the recommendation engine that combines rule-based logic with
  placeholders for future ML models.
- **Data Layer** – Prepared for a PostgreSQL database via an ORM integration. Async clients are used
  for future integration with Spoonacular, OpenFoodFacts, and geolocation APIs.

## Frontend (React + Vite)
- **Pages** – High-level layout components orchestrating the UI.
- **Components** – Reusable widgets such as forms, charts, and dashboards.
- **Styles** – Global styling via CSS with Material UI for component theming.

## Data
Sample datasets illustrate expected payloads, enabling rapid onboarding of recommendation logic and
analytics experiments.

## DevOps Considerations
- Containerization-ready with separate backend/frontend directories.
- Environment variables managed through a `.env` file.
- Testing scaffold provided for backend routes and future frontend unit tests.
