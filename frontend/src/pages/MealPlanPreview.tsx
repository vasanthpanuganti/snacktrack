import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Refresh,
  Check,
  SwapHoriz,
  Timer,
  LocalFireDepartment,
  Restaurant,
  ArrowForward,
  Close,
} from '@mui/icons-material';

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  image: string;
  ingredients: string[];
}

// Mock meal data generator
const generateMeals = (preferences: any): Meal[] => {
  const mealOptions: Record<string, Meal[]> = {
    breakfast: [
      { id: 'b1', type: 'breakfast', name: 'Greek Yogurt Bowl', calories: 320, protein: 18, carbs: 42, fat: 8, prepTime: 5, image: '🥣', ingredients: ['Greek yogurt', 'Mixed berries', 'Granola', 'Honey'] },
      { id: 'b2', type: 'breakfast', name: 'Avocado Toast', calories: 380, protein: 12, carbs: 35, fat: 22, prepTime: 10, image: '🥑', ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Cherry tomatoes'] },
      { id: 'b3', type: 'breakfast', name: 'Protein Smoothie', calories: 290, protein: 25, carbs: 38, fat: 6, prepTime: 5, image: '🥤', ingredients: ['Protein powder', 'Banana', 'Almond milk', 'Spinach'] },
      { id: 'b4', type: 'breakfast', name: 'Oatmeal Power Bowl', calories: 350, protein: 14, carbs: 58, fat: 8, prepTime: 8, image: '🥣', ingredients: ['Oats', 'Almond butter', 'Banana', 'Chia seeds'] },
    ],
    lunch: [
      { id: 'l1', type: 'lunch', name: 'Grilled Chicken Salad', calories: 420, protein: 38, carbs: 22, fat: 20, prepTime: 15, image: '🥗', ingredients: ['Chicken breast', 'Mixed greens', 'Olive oil', 'Feta cheese'] },
      { id: 'l2', type: 'lunch', name: 'Quinoa Buddha Bowl', calories: 480, protein: 18, carbs: 62, fat: 18, prepTime: 20, image: '🥙', ingredients: ['Quinoa', 'Chickpeas', 'Roasted vegetables', 'Tahini'] },
      { id: 'l3', type: 'lunch', name: 'Turkey Wrap', calories: 390, protein: 28, carbs: 38, fat: 14, prepTime: 10, image: '🌯', ingredients: ['Whole wheat wrap', 'Turkey', 'Hummus', 'Vegetables'] },
      { id: 'l4', type: 'lunch', name: 'Salmon Poke Bowl', calories: 520, protein: 35, carbs: 48, fat: 22, prepTime: 15, image: '🍣', ingredients: ['Salmon', 'Sushi rice', 'Edamame', 'Avocado'] },
    ],
    dinner: [
      { id: 'd1', type: 'dinner', name: 'Baked Salmon', calories: 480, protein: 42, carbs: 18, fat: 26, prepTime: 25, image: '🐟', ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Olive oil'] },
      { id: 'd2', type: 'dinner', name: 'Chicken Stir Fry', calories: 420, protein: 35, carbs: 32, fat: 16, prepTime: 20, image: '🍗', ingredients: ['Chicken', 'Broccoli', 'Bell peppers', 'Brown rice'] },
      { id: 'd3', type: 'dinner', name: 'Lean Beef Tacos', calories: 510, protein: 32, carbs: 42, fat: 24, prepTime: 25, image: '🌮', ingredients: ['Lean ground beef', 'Corn tortillas', 'Salsa', 'Avocado'] },
      { id: 'd4', type: 'dinner', name: 'Vegetable Curry', calories: 440, protein: 14, carbs: 52, fat: 22, prepTime: 30, image: '🍛', ingredients: ['Chickpeas', 'Coconut milk', 'Mixed vegetables', 'Basmati rice'] },
    ],
    snack: [
      { id: 's1', type: 'snack', name: 'Protein Bar', calories: 180, protein: 15, carbs: 20, fat: 6, prepTime: 0, image: '🍫', ingredients: ['Protein bar'] },
      { id: 's2', type: 'snack', name: 'Apple & Almond Butter', calories: 200, protein: 4, carbs: 24, fat: 12, prepTime: 2, image: '🍎', ingredients: ['Apple', 'Almond butter'] },
      { id: 's3', type: 'snack', name: 'Greek Yogurt', calories: 150, protein: 12, carbs: 18, fat: 4, prepTime: 0, image: '🥛', ingredients: ['Greek yogurt', 'Berries'] },
      { id: 's4', type: 'snack', name: 'Mixed Nuts', calories: 170, protein: 5, carbs: 8, fat: 15, prepTime: 0, image: '🥜', ingredients: ['Mixed nuts'] },
    ],
  };

  return [
    mealOptions.breakfast[Math.floor(Math.random() * mealOptions.breakfast.length)],
    mealOptions.lunch[Math.floor(Math.random() * mealOptions.lunch.length)],
    mealOptions.dinner[Math.floor(Math.random() * mealOptions.dinner.length)],
    mealOptions.snack[Math.floor(Math.random() * mealOptions.snack.length)],
  ];
};

const getAlternatives = (currentMeal: Meal, allMeals: Meal[][]): Meal[] => {
  const alternatives = allMeals
    .flat()
    .filter(m => m.type === currentMeal.type && m.id !== currentMeal.id)
    .filter(m => Math.abs(m.calories - currentMeal.calories) < 100);
  return alternatives.slice(0, 3);
};

export default function MealPlanPreview() {
  const navigate = useNavigate();
  const { onboardingData, setMealPlan, setUserStartDate } = useStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [alternatives, setAlternatives] = useState<Meal[]>([]);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Calculate daily targets based on user data
  const calculateTargets = () => {
    const { age, weight, height, gender } = onboardingData.basicInfo;
    const { activityLevel } = onboardingData.lifestyle;
    const { goal } = onboardingData.goals;

    // BMR calculation (Mifflin-St Jeor)
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = gender === 'female' ? bmr - 161 : bmr + 5;

    // Activity multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

    // Adjust for goal
    let targetCalories = tdee;
    if (goal === 'weight_loss') targetCalories = tdee - 500;
    if (goal === 'muscle_gain') targetCalories = tdee + 300;

    return {
      calories: Math.round(targetCalories),
      protein: Math.round((targetCalories * 0.3) / 4), // 30% protein
      carbs: Math.round((targetCalories * 0.4) / 4), // 40% carbs
      fat: Math.round((targetCalories * 0.3) / 9), // 30% fat
    };
  };

  const targets = calculateTargets();

  useEffect(() => {
    // Simulate API call to generate meal plan
    setTimeout(() => {
      const generatedMeals = generateMeals(onboardingData);
      setMeals(generatedMeals);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSwapMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    // Generate alternatives with similar calories
    const allMealOptions = [
      generateMeals(onboardingData),
      generateMeals(onboardingData),
      generateMeals(onboardingData),
    ];
    setAlternatives(getAlternatives(meal, allMealOptions));
    setShowSwapModal(true);
  };

  const confirmSwap = (newMeal: Meal) => {
    setMeals(meals.map(m => m.id === selectedMeal?.id ? newMeal : m));
    setShowSwapModal(false);
    setSelectedMeal(null);
  };

  const handleRegenerateAll = () => {
    setIsLoading(true);
    setTimeout(() => {
      const generatedMeals = generateMeals(onboardingData);
      setMeals(generatedMeals);
      setIsLoading(false);
    }, 1000);
  };

  const handleConfirmPlan = () => {
    // Save meal plan to store
    setMealPlan({
      date: new Date().toISOString().split('T')[0],
      meals: meals,
      targets: targets,
    });
    setUserStartDate(new Date().toISOString());
    navigate('/dashboard');
  };

  const totalMacros = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <h2>Creating your personalized plan...</h2>
          <p>Analyzing your preferences and health goals</p>
        </motion.div>
        
        <style>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-black);
          }
          .loading-content {
            text-align: center;
          }
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: white;
            border-radius: 50%;
            margin: 0 auto 2rem;
          }
          .loading-content h2 {
            margin-bottom: 0.5rem;
          }
          .loading-content p {
            color: var(--color-gray-500);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="meal-plan-preview">
      <div className="container">
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-text">
            <h1>Your Personalized Plan</h1>
            <p>Review and customize your daily meal plan</p>
          </div>
          <button className="regenerate-btn" onClick={handleRegenerateAll}>
            <Refresh />
            <span>Regenerate All</span>
          </button>
        </motion.div>

        {/* Daily Targets */}
        <motion.div
          className="targets-card glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Daily Targets</h3>
          <div className="targets-grid">
            <div className="target">
              <LocalFireDepartment className="target-icon calories" />
              <div className="target-info">
                <span className="target-value">{targets.calories}</span>
                <span className="target-label">Calories</span>
              </div>
              <div className="target-progress">
                <div 
                  className="progress-fill calories"
                  style={{ width: `${Math.min((totalMacros.calories / targets.calories) * 100, 100)}%` }}
                />
              </div>
              <span className="target-current">{totalMacros.calories} / {targets.calories}</span>
            </div>
            <div className="target">
              <div className="target-info">
                <span className="target-value">{targets.protein}g</span>
                <span className="target-label">Protein</span>
              </div>
              <div className="target-progress">
                <div 
                  className="progress-fill protein"
                  style={{ width: `${Math.min((totalMacros.protein / targets.protein) * 100, 100)}%` }}
                />
              </div>
              <span className="target-current">{totalMacros.protein}g / {targets.protein}g</span>
            </div>
            <div className="target">
              <div className="target-info">
                <span className="target-value">{targets.carbs}g</span>
                <span className="target-label">Carbs</span>
              </div>
              <div className="target-progress">
                <div 
                  className="progress-fill carbs"
                  style={{ width: `${Math.min((totalMacros.carbs / targets.carbs) * 100, 100)}%` }}
                />
              </div>
              <span className="target-current">{totalMacros.carbs}g / {targets.carbs}g</span>
            </div>
            <div className="target">
              <div className="target-info">
                <span className="target-value">{targets.fat}g</span>
                <span className="target-label">Fat</span>
              </div>
              <div className="target-progress">
                <div 
                  className="progress-fill fat"
                  style={{ width: `${Math.min((totalMacros.fat / targets.fat) * 100, 100)}%` }}
                />
              </div>
              <span className="target-current">{totalMacros.fat}g / {targets.fat}g</span>
            </div>
          </div>
        </motion.div>

        {/* Meals */}
        <div className="meals-grid">
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              className="meal-card glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="meal-header">
                <span className="meal-type">{meal.type}</span>
                <button className="swap-btn" onClick={() => handleSwapMeal(meal)}>
                  <SwapHoriz />
                </button>
              </div>
              <div className="meal-image">{meal.image}</div>
              <h3>{meal.name}</h3>
              <div className="meal-meta">
                <span><LocalFireDepartment /> {meal.calories} kcal</span>
                <span><Timer /> {meal.prepTime} min</span>
              </div>
              <div className="meal-macros">
                <div className="macro">
                  <span className="macro-value">{meal.protein}g</span>
                  <span className="macro-label">Protein</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{meal.carbs}g</span>
                  <span className="macro-label">Carbs</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{meal.fat}g</span>
                  <span className="macro-label">Fat</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Confirm Button */}
        <motion.div
          className="confirm-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button className="confirm-btn" onClick={handleConfirmPlan}>
            <Check />
            <span>Confirm & Start My Journey</span>
            <ArrowForward />
          </button>
        </motion.div>
      </div>

      {/* Swap Modal */}
      <AnimatePresence>
        {showSwapModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSwapModal(false)}
          >
            <motion.div
              className="modal glass-strong"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Swap {selectedMeal?.type}</h3>
                <button className="close-btn" onClick={() => setShowSwapModal(false)}>
                  <Close />
                </button>
              </div>
              <p className="modal-subtitle">Choose an alternative with similar nutrition</p>
              <div className="alternatives-list">
                {alternatives.map(alt => (
                  <motion.button
                    key={alt.id}
                    className="alternative-card"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => confirmSwap(alt)}
                  >
                    <span className="alt-image">{alt.image}</span>
                    <div className="alt-info">
                      <span className="alt-name">{alt.name}</span>
                      <span className="alt-meta">{alt.calories} kcal • {alt.prepTime} min</span>
                    </div>
                    <ArrowForward className="alt-arrow" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .meal-plan-preview {
          min-height: 100vh;
          background: var(--color-black);
          padding: 2rem;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .header p {
          color: var(--color-gray-500);
        }

        .regenerate-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          color: var(--color-gray-400);
          font-size: 0.9rem;
        }

        .regenerate-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .targets-card {
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          margin-bottom: 2rem;
        }

        .targets-card h3 {
          font-size: 1rem;
          color: var(--color-gray-400);
          margin-bottom: 1rem;
        }

        .targets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .target {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .target-icon {
          font-size: 1.5rem !important;
        }

        .target-icon.calories {
          color: #FF6B35;
        }

        .target-info {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .target-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .target-label {
          color: var(--color-gray-500);
          font-size: 0.875rem;
        }

        .target-progress {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .progress-fill.calories { background: #FF6B35; }
        .progress-fill.protein { background: #3B82F6; }
        .progress-fill.carbs { background: #22C55E; }
        .progress-fill.fat { background: #F59E0B; }

        .target-current {
          font-size: 0.8rem;
          color: var(--color-gray-600);
        }

        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .meal-card {
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          text-align: center;
        }

        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .meal-type {
          text-transform: capitalize;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-gray-500);
          background: rgba(255,255,255,0.05);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .swap-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gray-500);
        }

        .swap-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .meal-image {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .meal-card h3 {
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
        }

        .meal-meta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: var(--color-gray-500);
        }

        .meal-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .meal-meta svg {
          font-size: 1rem !important;
        }

        .meal-macros {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .macro {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .macro-value {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .macro-label {
          font-size: 0.7rem;
          color: var(--color-gray-600);
        }

        .confirm-section {
          text-align: center;
          padding: 2rem 0;
        }

        .confirm-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          background: white;
          color: black;
          border-radius: var(--radius-full);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .confirm-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 40px rgba(255,255,255,0.2);
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
          margin-bottom: 0.5rem;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          text-transform: capitalize;
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

        .modal-subtitle {
          color: var(--color-gray-500);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .alternatives-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .alternative-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-lg);
          text-align: left;
          width: 100%;
        }

        .alternative-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
        }

        .alt-image {
          font-size: 2rem;
        }

        .alt-info {
          flex: 1;
        }

        .alt-name {
          display: block;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .alt-meta {
          font-size: 0.8rem;
          color: var(--color-gray-500);
        }

        .alt-arrow {
          color: var(--color-gray-600);
        }

        @media (max-width: 600px) {
          .header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .meals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

