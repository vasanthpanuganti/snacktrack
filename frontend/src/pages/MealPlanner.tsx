import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Refresh,
  CheckCircle,
  AccessTime,
  LocalFireDepartment,
  Restaurant,
} from '@mui/icons-material';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

// Sample meal data
const sampleMeals = {
  breakfast: [
    { id: 'b1', name: 'Overnight Oats with Berries', calories: 320, time: 5, image: '🥣' },
    { id: 'b2', name: 'Avocado Toast with Eggs', calories: 380, time: 15, image: '🥑' },
    { id: 'b3', name: 'Greek Yogurt Parfait', calories: 280, time: 5, image: '🥛' },
    { id: 'b4', name: 'Smoothie Bowl', calories: 340, time: 10, image: '🍓' },
  ],
  lunch: [
    { id: 'l1', name: 'Grilled Chicken Salad', calories: 420, time: 20, image: '🥗' },
    { id: 'l2', name: 'Quinoa Buddha Bowl', calories: 450, time: 25, image: '🍲' },
    { id: 'l3', name: 'Turkey Wrap', calories: 380, time: 10, image: '🌯' },
    { id: 'l4', name: 'Lentil Soup', calories: 320, time: 30, image: '🥣' },
  ],
  dinner: [
    { id: 'd1', name: 'Salmon with Vegetables', calories: 520, time: 30, image: '🐟' },
    { id: 'd2', name: 'Chicken Stir Fry', calories: 480, time: 25, image: '🍳' },
    { id: 'd3', name: 'Vegetable Curry', calories: 420, time: 35, image: '🍛' },
    { id: 'd4', name: 'Grilled Steak with Salad', calories: 550, time: 25, image: '🥩' },
  ],
  snack: [
    { id: 's1', name: 'Mixed Nuts', calories: 180, time: 0, image: '🥜' },
    { id: 's2', name: 'Apple with Peanut Butter', calories: 200, time: 2, image: '🍎' },
    { id: 's3', name: 'Protein Bar', calories: 220, time: 0, image: '🍫' },
    { id: 's4', name: 'Hummus with Veggies', calories: 160, time: 5, image: '🥕' },
  ],
};

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface DayMeal {
  type: MealType;
  meal: (typeof sampleMeals.breakfast)[0] | null;
  completed: boolean;
}

export default function MealPlanner() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Generate week days
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));
  
  // Mock meal plan for selected date
  const [dayPlan, setDayPlan] = useState<DayMeal[]>([
    { type: 'breakfast', meal: sampleMeals.breakfast[1], completed: true },
    { type: 'lunch', meal: sampleMeals.lunch[0], completed: true },
    { type: 'snack', meal: sampleMeals.snack[1], completed: false },
    { type: 'dinner', meal: sampleMeals.dinner[0], completed: false },
  ]);

  const totalCalories = dayPlan.reduce((sum, d) => sum + (d.meal?.calories || 0), 0);
  const targetCalories = user?.dailyCalorieTarget || 2000;
  const completedMeals = dayPlan.filter((d) => d.completed).length;

  const handlePrevWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const toggleMealComplete = (index: number) => {
    const newPlan = [...dayPlan];
    newPlan[index].completed = !newPlan[index].completed;
    setDayPlan(newPlan);
  };

  const regenerateMeal = (index: number) => {
    const newPlan = [...dayPlan];
    const type = newPlan[index].type;
    const meals = sampleMeals[type];
    const currentMeal = newPlan[index].meal;
    const otherMeals = meals.filter((m) => m.id !== currentMeal?.id);
    newPlan[index].meal = otherMeals[Math.floor(Math.random() * otherMeals.length)];
    setDayPlan(newPlan);
  };

  return (
    <motion.div
      className="meal-planner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header">
        <div>
          <h1>Meal Planner</h1>
          <p>Your personalized meal plan for the week</p>
        </div>
        <button className="generate-btn">
          <Refresh />
          <span>Regenerate Week</span>
        </button>
      </header>

      {/* Week Navigation */}
      <div className="week-nav">
        <button className="nav-arrow" onClick={handlePrevWeek}>
          <ChevronLeft />
        </button>
        <div className="week-days">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            return (
              <button
                key={day.toISOString()}
                className={`day-btn ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <span className="day-name">{format(day, 'EEE')}</span>
                <span className="day-num">{format(day, 'd')}</span>
              </button>
            );
          })}
        </div>
        <button className="nav-arrow" onClick={handleNextWeek}>
          <ChevronRight />
        </button>
      </div>

      {/* Day Summary */}
      <div className="day-summary">
        <div className="summary-date">
          <h2>{format(selectedDate, 'EEEE, MMMM d')}</h2>
        </div>
        <div className="summary-stats">
          <div className="stat">
            <LocalFireDepartment className="stat-icon calories" />
            <div className="stat-info">
              <span className="stat-value">{totalCalories}</span>
              <span className="stat-label">/ {targetCalories} kcal</span>
            </div>
          </div>
          <div className="stat">
            <Restaurant className="stat-icon meals" />
            <div className="stat-info">
              <span className="stat-value">{completedMeals}</span>
              <span className="stat-label">/ {dayPlan.length} meals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="meals-grid">
        {dayPlan.map((item, index) => (
          <motion.div
            key={item.type}
            className={`meal-card ${item.completed ? 'completed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="meal-header">
              <span className="meal-type">{item.type}</span>
              <div className="meal-actions">
                <button
                  className="action-btn"
                  onClick={() => regenerateMeal(index)}
                  title="Get different meal"
                >
                  <Refresh />
                </button>
                <button
                  className={`action-btn check ${item.completed ? 'active' : ''}`}
                  onClick={() => toggleMealComplete(index)}
                  title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle />
                </button>
              </div>
            </div>
            
            {item.meal ? (
              <div className="meal-content" onClick={() => navigate(`/recipes/${item.meal?.id}`)}>
                <div className="meal-image">{item.meal.image}</div>
                <div className="meal-info">
                  <h3>{item.meal.name}</h3>
                  <div className="meal-meta">
                    <span className="meta-item">
                      <LocalFireDepartment />
                      {item.meal.calories} kcal
                    </span>
                    <span className="meta-item">
                      <AccessTime />
                      {item.meal.time} min
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="meal-empty">
                <button className="add-meal-btn">
                  <Add />
                  <span>Add Meal</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Shopping List Preview */}
      <div className="shopping-preview">
        <h3>Ingredients for Today</h3>
        <div className="ingredients-list">
          {['Salmon fillet', 'Avocado', 'Eggs', 'Mixed greens', 'Olive oil', 'Lemon', 'Cherry tomatoes', 'Greek yogurt'].map((ing) => (
            <span key={ing} className="ingredient-tag">{ing}</span>
          ))}
        </div>
        <button className="view-list-btn">View Full Shopping List</button>
      </div>

      <style>{`
        .meal-planner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: #666;
        }

        .generate-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .generate-btn:hover {
          background: var(--color-primary-dark);
          transform: translateY(-2px);
        }

        .week-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: white;
          padding: 1rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
        }

        .nav-arrow {
          width: 40px;
          height: 40px;
          border: none;
          background: #f5f5f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-arrow:hover {
          background: #eee;
        }

        .week-days {
          flex: 1;
          display: flex;
          justify-content: space-around;
          gap: 0.5rem;
        }

        .day-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
          min-width: 60px;
        }

        .day-btn:hover {
          background: #f5f5f5;
        }

        .day-btn.selected {
          background: var(--color-primary);
          color: white;
        }

        .day-btn.today:not(.selected) {
          border-color: var(--color-primary);
        }

        .day-name {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .day-num {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .day-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .summary-date h2 {
          font-size: 1.25rem;
        }

        .summary-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-icon {
          padding: 0.5rem;
          border-radius: 50%;
        }

        .stat-icon.calories {
          background: rgba(255, 107, 53, 0.15);
          color: var(--color-primary);
        }

        .stat-icon.meals {
          background: rgba(37, 161, 142, 0.15);
          color: var(--color-accent);
        }

        .stat-info {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: #888;
        }

        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .meal-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          box-shadow: var(--shadow-card);
          transition: all 0.2s;
        }

        .meal-card:hover {
          box-shadow: var(--shadow-lg);
        }

        .meal-card.completed {
          opacity: 0.7;
        }

        .meal-card.completed .meal-image {
          filter: grayscale(0.5);
        }

        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .meal-type {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-primary);
          background: rgba(255, 107, 53, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .meal-actions {
          display: flex;
          gap: 0.25rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #999;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f5f5f5;
          color: var(--color-secondary);
        }

        .action-btn.check.active {
          color: var(--color-success);
        }

        .meal-content {
          display: flex;
          gap: 1rem;
          cursor: pointer;
        }

        .meal-image {
          font-size: 3rem;
          width: 70px;
          height: 70px;
          background: #f8f8f8;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .meal-info {
          flex: 1;
        }

        .meal-info h3 {
          font-size: 1rem;
          font-family: var(--font-body);
          margin-bottom: 0.5rem;
        }

        .meal-meta {
          display: flex;
          gap: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: #666;
        }

        .meta-item svg {
          font-size: 1rem;
          color: #999;
        }

        .meal-empty {
          display: flex;
          justify-content: center;
          padding: 1rem;
        }

        .add-meal-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f5f5f5;
          border: 2px dashed #ddd;
          border-radius: var(--radius-md);
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-meal-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(255, 107, 53, 0.05);
        }

        .shopping-preview {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .shopping-preview h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .ingredients-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .ingredient-tag {
          padding: 0.375rem 0.75rem;
          background: #f5f5f5;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          color: #555;
        }

        .view-list-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: 500;
          cursor: pointer;
        }

        .view-list-btn:hover {
          text-decoration: underline;
        }
      `}</style>
    </motion.div>
  );
}


