# 🥗 SnackTrack

**Your Personal Diet Companion** - An intelligent, affordable, and inclusive diet planning platform that delivers personalized, health-aware meal plans and recipes.

![SnackTrack Banner](https://via.placeholder.com/1200x400/FF6B35/FFFFFF?text=SnackTrack+-+Your+Personal+Diet+Companion)

## ✨ Features

### 🎯 Core Features
- **Personalized Meal Plans** - AI-powered meal plans tailored to your goals, preferences, and health conditions
- **Smart Tracking** - Effortlessly track calories, macros, and progress with intuitive visual dashboards
- **Health-Aware Planning** - Recipes designed around your health conditions with clear benefit explanations
- **Budget-Friendly** - Set your budget and get affordable meal recommendations
- **Regional Cuisines** - Discover recipes from your region with locally available ingredients
- **Gamified Motivation** - Build streaks, earn achievements, and compete on leaderboards

### 📱 User Features
- Multi-step onboarding wizard for comprehensive profile setup
- Daily/weekly meal planning with swap functionality
- Recipe browser with filtering by cuisine, diet type, and health conditions
- Progress tracking with visual charts and statistics
- Water intake tracking
- Social leaderboards with friends
- Achievement system

### 🔧 Admin Features
- User management dashboard
- Recipe CRUD operations
- Tag management for cuisines, diets, health conditions, and allergens
- Platform analytics and reports

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SnackTrack
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
SnackTrack/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state management
│   │   ├── types/            # TypeScript type definitions
│   │   └── styles/           # Global CSS styles
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/routes/       # API endpoints
│   │   ├── models/           # Pydantic models
│   │   ├── services/         # Business logic
│   │   └── main.py           # FastAPI app entry
│   └── requirements.txt
│
├── data/                     # Sample data files
├── docs/                     # Documentation
└── tests/                    # Test files
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **MUI Icons** - Icon library
- **React Router** - Routing
- **date-fns** - Date utilities

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📊 API Endpoints

### Profiles
- `POST /api/v1/profiles` - Create user profile
- `GET /api/v1/profiles/{id}` - Get user profile
- `PUT /api/v1/profiles/{id}` - Update profile

### Recipes
- `GET /api/v1/recipes` - List recipes with filters
- `GET /api/v1/recipes/{id}` - Get recipe details
- `GET /api/v1/recipes/featured` - Get featured recipes
- `GET /api/v1/recipes/regional` - Get regional recipes

### Meal Plans
- `POST /api/v1/recommendations/meal-plan` - Generate meal plan
- `GET /api/v1/meals/daily/{date}` - Get daily log
- `POST /api/v1/meals/log` - Log a meal

### Progress
- `GET /api/v1/progress/summary` - Get progress summary
- `GET /api/v1/progress/weight-history` - Get weight history
- `GET /api/v1/progress/achievements` - Get achievements

### Leaderboard
- `GET /api/v1/leaderboard` - Get leaderboard
- `GET /api/v1/leaderboard/friends` - Get friends leaderboard

### Admin
- `GET /api/v1/admin/stats` - Get platform statistics
- `GET /api/v1/admin/users` - List users
- `GET /api/v1/admin/recipes` - Manage recipes

## 🎯 User Stories Implemented

### Onboarding & Profile
- ✅ Enter basic details (age, height, weight, fitness goals)
- ✅ Skip advanced inputs if unknown
- ✅ Customize diet preferences (vegetarian, vegan, etc.)
- ✅ Select restrictions and allergies
- ✅ Specify health conditions
- ✅ Set budget constraints
- ✅ Select region and preferred cuisines

### Meal Planning
- ✅ Daily and weekly meal plans
- ✅ Detailed recipes with nutrition info
- ✅ Replace recommended recipes with alternatives
- ✅ Region-aware recommendations

### Tracking
- ✅ Automatic calorie and macro tracking
- ✅ Manual food logging
- ✅ Weekly and monthly summaries
- ✅ Weight and progress tracking
- ✅ Visual charts and trends

### Motivation
- ✅ Daily motivational quotes
- ✅ Streaks and reminders
- ✅ Achievement system
- ✅ Leaderboards with friends

### Admin
- ✅ Manage foods and recipes
- ✅ Tag foods with allergies, health conditions, cuisines
- ✅ Monitor platform activity

## 🌟 Design Philosophy

SnackTrack features a distinctive, warm aesthetic that moves away from typical "AI slop":

- **Typography**: Playfair Display for headings, Outfit for body text
- **Color Palette**: Warm oranges (#FF6B35) with cool teals (#004E64) and fresh greens (#25A18E)
- **Animations**: Smooth, purposeful micro-interactions with Framer Motion
- **Layout**: Clean, card-based design with generous whitespace

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

---

Built with ❤️ for healthier eating
