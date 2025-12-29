import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  LocalFireDepartment,
  Restaurant,
  FitnessCenter,
  Timer,
  TrendingUp,
  Add,
  Check,
  Refresh,
  Close,
  EmojiEvents,
  CalendarToday,
} from '@mui/icons-material';

// Mock quotes
const motivationalQuotes = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
];

interface WorkoutEntry {
  id: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  type: string;
}

const workoutTypes = [
  { name: 'Running', caloriesPerMin: 10, emoji: '🏃' },
  { name: 'Walking', caloriesPerMin: 4, emoji: '🚶' },
  { name: 'Cycling', caloriesPerMin: 8, emoji: '🚴' },
  { name: 'Swimming', caloriesPerMin: 9, emoji: '🏊' },
  { name: 'Weight Training', caloriesPerMin: 6, emoji: '🏋️' },
  { name: 'Yoga', caloriesPerMin: 3, emoji: '🧘' },
  { name: 'HIIT', caloriesPerMin: 12, emoji: '💪' },
  { name: 'Other', caloriesPerMin: 5, emoji: '🎯' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, currentMealPlan, userStartDate, loggedMeals, workouts, logMeal, logWorkout } = useStore();
  
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [showLogWorkoutModal, setShowLogWorkoutModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [workoutForm, setWorkoutForm] = useState({ type: '', duration: 30 });
  
  // Calculate day number
  const dayNumber = useMemo(() => {
    if (!userStartDate) return 1;
    const start = new Date(userStartDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [userStartDate]);

  // Get today's data
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = loggedMeals.filter(m => m.loggedAt?.startsWith(today));
  const todayWorkouts = workouts.filter(w => w.loggedAt?.startsWith(today));

  // Calculate totals
  const consumedCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const burnedCalories = todayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const netCalories = consumedCalories - burnedCalories;

  const targets = currentMealPlan?.targets || {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  };

  const consumedMacros = todayMeals.reduce(
    (acc, m) => ({
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fat: acc.fat + (m.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  // Random quote
  const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const handleLogMeal = (meal: any) => {
    logMeal(meal);
    setShowLogMealModal(false);
    setSelectedMeal(null);
  };

  const handleLogWorkout = () => {
    const workout = workoutTypes.find(w => w.name === workoutForm.type);
    if (!workout) return;
    
    logWorkout({
      id: `workout_${Date.now()}`,
      name: workout.name,
      duration: workoutForm.duration,
      caloriesBurned: Math.round(workout.caloriesPerMin * workoutForm.duration),
      type: workout.name,
    });
    setShowLogWorkoutModal(false);
    setWorkoutForm({ type: '', duration: 30 });
  };

  const handleRegenerateMealPlan = () => {
    navigate('/meal-plan-preview');
  };

  if (!user) {
    return (
      <div className="dashboard-empty">
        <h2>Welcome to SnackTrack</h2>
        <p>Complete your profile to get started</p>
        <button onClick={() => navigate('/onboarding')}>Get Started</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-left">
          <div className="day-badge">
            <CalendarToday />
            <span>Day {dayNumber}</span>
          </div>
          <h1>Good {getGreeting()}, {user.name?.split(' ')[0]}!</h1>
          <p className="quote">"{quote.text}" — {quote.author}</p>
        </div>
        <div className="header-right">
          <div className="streak-badge">
            <EmojiEvents />
            <span>{user.currentStreak || dayNumber} Day Streak</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Cards */}
      <div className="progress-grid">
        {/* Calories Card */}
        <motion.div
          className="progress-card calories-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <LocalFireDepartment className="icon" />
            <span>Calories</span>
          </div>
          <div className="calorie-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="ring-bg" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="ring-fill"
                style={{
                  strokeDashoffset: 283 - (283 * Math.min(netCalories / targets.calories, 1)),
                }}
              />
            </svg>
            <div className="ring-content">
              <span className="ring-value">{netCalories}</span>
              <span className="ring-label">/ {targets.calories}</span>
            </div>
          </div>
          <div className="calorie-breakdown">
            <div className="breakdown-item consumed">
              <span className="label">Consumed</span>
              <span className="value">+{consumedCalories}</span>
            </div>
            <div className="breakdown-item burned">
              <span className="label">Burned</span>
              <span className="value">-{burnedCalories}</span>
            </div>
          </div>
        </motion.div>

        {/* Macros Card */}
        <motion.div
          className="progress-card macros-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <Restaurant className="icon" />
            <span>Macros</span>
          </div>
          <div className="macros-list">
            {[
              { name: 'Protein', value: consumedMacros.protein, target: targets.protein, color: '#3B82F6' },
              { name: 'Carbs', value: consumedMacros.carbs, target: targets.carbs, color: '#22C55E' },
              { name: 'Fat', value: consumedMacros.fat, target: targets.fat, color: '#F59E0B' },
            ].map(macro => (
              <div key={macro.name} className="macro-row">
                <div className="macro-info">
                  <span className="macro-name">{macro.name}</span>
                  <span className="macro-value">{macro.value}g / {macro.target}g</span>
                </div>
                <div className="macro-bar">
                  <div
                    className="macro-fill"
                    style={{
                      width: `${Math.min((macro.value / macro.target) * 100, 100)}%`,
                      backgroundColor: macro.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Workouts Card */}
        <motion.div
          className="progress-card workouts-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <FitnessCenter className="icon" />
            <span>Today's Workouts</span>
          </div>
          {todayWorkouts.length > 0 ? (
            <div className="workouts-list">
              {todayWorkouts.map((workout: any, idx: number) => (
                <div key={idx} className="workout-item">
                  <span className="workout-emoji">
                    {workoutTypes.find(w => w.name === workout.type)?.emoji || '🎯'}
                  </span>
                  <div className="workout-info">
                    <span className="workout-name">{workout.name}</span>
                    <span className="workout-meta">{workout.duration} min</span>
                  </div>
                  <span className="workout-calories">-{workout.caloriesBurned} kcal</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FitnessCenter />
              <span>No workouts logged yet</span>
            </div>
          )}
          <button className="add-btn" onClick={() => setShowLogWorkoutModal(true)}>
            <Add />
            <span>Log Workout</span>
          </button>
        </motion.div>
      </div>

      {/* Today's Meal Plan */}
      <motion.div
        className="meal-plan-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="section-header">
          <h2>Today's Meal Plan</h2>
          <button className="regenerate-btn" onClick={handleRegenerateMealPlan}>
            <Refresh />
            <span>Regenerate</span>
          </button>
        </div>
        
        {currentMealPlan?.meals ? (
          <div className="meals-grid">
            {currentMealPlan.meals.map((meal: any) => {
              const isLogged = todayMeals.some(m => m.id === meal.id);
              return (
                <div key={meal.id} className={`meal-card glass ${isLogged ? 'logged' : ''}`}>
                  <div className="meal-type-badge">{meal.type}</div>
                  <div className="meal-image">{meal.image}</div>
                  <h3>{meal.name}</h3>
                  <div className="meal-stats">
                    <span><LocalFireDepartment /> {meal.calories} kcal</span>
                    <span><Timer /> {meal.prepTime} min</span>
                  </div>
                  {isLogged ? (
                    <div className="logged-badge">
                      <Check />
                      <span>Logged</span>
                    </div>
                  ) : (
                    <button
                      className="log-meal-btn"
                      onClick={() => {
                        setSelectedMeal(meal);
                        setShowLogMealModal(true);
                      }}
                    >
                      <Add />
                      <span>Log Meal</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-meal-plan glass">
            <Restaurant />
            <h3>No meal plan yet</h3>
            <p>Generate your personalized meal plan to get started</p>
            <button onClick={() => navigate('/meal-plan-preview')}>Generate Plan</button>
          </div>
        )}
      </motion.div>

      {/* Logged Meals Today */}
      {todayMeals.length > 0 && (
        <motion.div
          className="logged-meals-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2>Logged Today</h2>
          <div className="logged-meals-list">
            {todayMeals.map((meal: any, idx: number) => (
              <div key={idx} className="logged-meal-item glass">
                <span className="logged-meal-image">{meal.image || '🍽️'}</span>
                <div className="logged-meal-info">
                  <span className="logged-meal-name">{meal.name}</span>
                  <span className="logged-meal-time">
                    {new Date(meal.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className="logged-meal-calories">{meal.calories} kcal</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Log Meal Modal */}
      <AnimatePresence>
        {showLogMealModal && selectedMeal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogMealModal(false)}
          >
            <motion.div
              className="modal glass-strong"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Log Meal</h3>
                <button className="close-btn" onClick={() => setShowLogMealModal(false)}>
                  <Close />
                </button>
              </div>
              <div className="modal-content">
                <div className="meal-preview">
                  <span className="meal-image-lg">{selectedMeal.image}</span>
                  <h3>{selectedMeal.name}</h3>
                  <div className="meal-macros-preview">
                    <span>{selectedMeal.calories} kcal</span>
                    <span>P: {selectedMeal.protein}g</span>
                    <span>C: {selectedMeal.carbs}g</span>
                    <span>F: {selectedMeal.fat}g</span>
                  </div>
                </div>
                <button className="confirm-log-btn" onClick={() => handleLogMeal(selectedMeal)}>
                  <Check />
                  <span>Confirm & Log</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Workout Modal */}
      <AnimatePresence>
        {showLogWorkoutModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogWorkoutModal(false)}
          >
            <motion.div
              className="modal glass-strong"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Log Workout</h3>
                <button className="close-btn" onClick={() => setShowLogWorkoutModal(false)}>
                  <Close />
                </button>
              </div>
              <div className="modal-content">
                <div className="workout-types-grid">
                  {workoutTypes.map(workout => (
                    <button
                      key={workout.name}
                      className={`workout-type-btn ${workoutForm.type === workout.name ? 'selected' : ''}`}
                      onClick={() => setWorkoutForm({ ...workoutForm, type: workout.name })}
                    >
                      <span className="workout-type-emoji">{workout.emoji}</span>
                      <span>{workout.name}</span>
                    </button>
                  ))}
                </div>
                <div className="duration-input">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={workoutForm.duration}
                    onChange={e => setWorkoutForm({ ...workoutForm, duration: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={300}
                  />
                </div>
                {workoutForm.type && (
                  <div className="calorie-estimate">
                    Estimated burn: ~{Math.round((workoutTypes.find(w => w.name === workoutForm.type)?.caloriesPerMin || 5) * workoutForm.duration)} kcal
                  </div>
                )}
                <button
                  className="confirm-log-btn"
                  onClick={handleLogWorkout}
                  disabled={!workoutForm.type}
                >
                  <Check />
                  <span>Log Workout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .dashboard {
          min-height: 100vh;
          background: var(--color-black);
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .day-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          color: var(--color-gray-300);
          margin-bottom: 0.75rem;
        }

        .day-badge svg {
          font-size: 1rem !important;
        }

        .header-left h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .quote {
          color: var(--color-gray-500);
          font-style: italic;
          font-size: 0.9rem;
          max-width: 500px;
        }

        .streak-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: var(--radius-full);
          color: #F59E0B;
          font-weight: 500;
        }

        .progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .progress-card {
          padding: 1.5rem;
          border-radius: var(--radius-xl);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
          color: var(--color-gray-400);
        }

        .card-header .icon {
          font-size: 1.25rem !important;
        }

        /* Calories Card */
        .calorie-ring {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto 1.5rem;
        }

        .calorie-ring svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.1);
          stroke-width: 8;
        }

        .ring-fill {
          fill: none;
          stroke: #FF6B35;
          stroke-width: 8;
          stroke-dasharray: 283;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.5s ease;
        }

        .ring-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .ring-value {
          font-size: 2.5rem;
          font-weight: 700;
        }

        .ring-label {
          font-size: 0.875rem;
          color: var(--color-gray-500);
        }

        .calorie-breakdown {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .breakdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .breakdown-item .label {
          font-size: 0.8rem;
          color: var(--color-gray-600);
        }

        .breakdown-item .value {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .breakdown-item.consumed .value {
          color: #22C55E;
        }

        .breakdown-item.burned .value {
          color: #3B82F6;
        }

        /* Macros Card */
        .macros-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .macro-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .macro-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .macro-name {
          color: var(--color-gray-400);
        }

        .macro-value {
          font-weight: 500;
        }

        .macro-bar {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .macro-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        /* Workouts Card */
        .workouts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .workout-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-md);
        }

        .workout-emoji {
          font-size: 1.5rem;
        }

        .workout-info {
          flex: 1;
        }

        .workout-name {
          display: block;
          font-weight: 500;
        }

        .workout-meta {
          font-size: 0.8rem;
          color: var(--color-gray-600);
        }

        .workout-calories {
          color: #3B82F6;
          font-weight: 500;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
          color: var(--color-gray-600);
        }

        .empty-state svg {
          font-size: 2rem !important;
          opacity: 0.5;
        }

        .add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          color: var(--color-gray-400);
          font-size: 0.9rem;
        }

        .add-btn:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        /* Meal Plan Section */
        .meal-plan-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
        }

        .regenerate-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          color: var(--color-gray-500);
          font-size: 0.85rem;
        }

        .regenerate-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .meal-card {
          padding: 1.25rem;
          border-radius: var(--radius-xl);
          text-align: center;
          position: relative;
        }

        .meal-card.logged {
          opacity: 0.6;
        }

        .meal-type-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          background: rgba(255,255,255,0.1);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
          color: var(--color-gray-400);
        }

        .meal-image {
          font-size: 3rem;
          margin: 1rem 0;
        }

        .meal-card h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .meal-stats {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--color-gray-500);
          margin-bottom: 1rem;
        }

        .meal-stats span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .meal-stats svg {
          font-size: 1rem !important;
        }

        .log-meal-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.625rem;
          background: white;
          color: black;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .log-meal-btn:hover {
          transform: translateY(-2px);
        }

        .logged-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--color-success);
          font-size: 0.85rem;
        }

        .no-meal-plan {
          padding: 3rem;
          text-align: center;
          border-radius: var(--radius-xl);
        }

        .no-meal-plan svg {
          font-size: 3rem !important;
          color: var(--color-gray-600);
          margin-bottom: 1rem;
        }

        .no-meal-plan h3 {
          margin-bottom: 0.5rem;
        }

        .no-meal-plan p {
          color: var(--color-gray-500);
          margin-bottom: 1.5rem;
        }

        .no-meal-plan button {
          padding: 0.75rem 1.5rem;
          background: white;
          color: black;
          border-radius: var(--radius-full);
          font-weight: 500;
        }

        /* Logged Meals Section */
        .logged-meals-section h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .logged-meals-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .logged-meal-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-lg);
        }

        .logged-meal-image {
          font-size: 2rem;
        }

        .logged-meal-info {
          flex: 1;
        }

        .logged-meal-name {
          display: block;
          font-weight: 500;
        }

        .logged-meal-time {
          font-size: 0.8rem;
          color: var(--color-gray-600);
        }

        .logged-meal-calories {
          font-weight: 500;
          color: var(--color-gray-400);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 400px;
          padding: 1.5rem;
          border-radius: var(--radius-xl);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h3 {
          font-size: 1.25rem;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gray-500);
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .meal-preview {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .meal-image-lg {
          font-size: 4rem;
        }

        .meal-preview h3 {
          margin: 0.5rem 0;
        }

        .meal-macros-preview {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--color-gray-500);
        }

        .confirm-log-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: white;
          color: black;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .confirm-log-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .confirm-log-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Workout Modal */
        .workout-types-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .workout-type-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          color: var(--color-gray-500);
        }

        .workout-type-btn:hover {
          background: rgba(255,255,255,0.06);
        }

        .workout-type-btn.selected {
          background: rgba(255,255,255,0.1);
          border-color: white;
          color: white;
        }

        .workout-type-emoji {
          font-size: 1.5rem;
        }

        .duration-input {
          margin-bottom: 1rem;
        }

        .duration-input label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--color-gray-400);
        }

        .duration-input input {
          width: 100%;
        }

        .calorie-estimate {
          text-align: center;
          margin-bottom: 1.5rem;
          color: var(--color-success);
          font-size: 0.9rem;
        }

        .dashboard-empty {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }

        .dashboard-empty h2 {
          margin-bottom: 0.5rem;
        }

        .dashboard-empty p {
          color: var(--color-gray-500);
          margin-bottom: 1.5rem;
        }

        .dashboard-empty button {
          padding: 1rem 2rem;
          background: white;
          color: black;
          border-radius: var(--radius-full);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
          }

          .workout-types-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
