# DietFriend

DietFriend is a web application that crafts personalized diet plans by combining user goals,
health data, cultural context, and regional ingredient availability.

## Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React + Vite + Material UI
- **Database:** PostgreSQL (extensible to MongoDB for semi-structured data)
- **Third-Party APIs:** Spoonacular, OpenFoodFacts, Google Geocoding (integrations ready)

## Repository Structure
```
backend/   # FastAPI application code, services, and schemas
frontend/  # React single-page application
data/      # Sample datasets for experimentation
docs/      # Architecture and API documentation
tests/     # Backend and frontend test scaffolding
```

## Getting Started
### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 14+ (or MongoDB 6+ if opting for NoSQL storage)

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend Vite dev server proxies API requests to `http://localhost:8000`.

## Example API Routes
- `GET /api/v1/profiles/` – Retrieve demo profiles.
- `POST /api/v1/recommendations/meal-plan` – Generate a personalized meal plan for a profile.
- `GET /api/v1/recipes/regional?region=Southern%20Europe` – Fetch region-specific recipes.

## User Flow
1. New users register and input personal metrics, activity level, and dietary constraints.
2. The recommendation engine combines profile data with nutrition APIs to craft balanced meal plans.
3. Users explore dashboards featuring macro breakdowns, calorie insights, and regional recipe ideas.
4. Upcoming iterations introduce goal tracking, historical analytics, and ML-driven personalization.

## Testing
Run backend tests from the project root:
```bash
pytest tests/backend
```

Frontend testing can be enabled with Vitest or Jest; see `tests/frontend/README.md`.

## Contributing
1. Fork the repository and create a new branch.
2. Implement your feature or fix with tests.
3. Submit a pull request with a detailed summary of the change.
