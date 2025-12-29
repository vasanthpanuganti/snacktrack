import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBack,
  AccessTime,
  LocalFireDepartment,
  Restaurant,
  Favorite,
  FavoriteBorder,
  Star,
  Add,
  Remove,
  CheckCircle,
  Info,
} from '@mui/icons-material';

// Sample detailed recipe
const sampleRecipe = {
  id: '1',
  name: 'Mediterranean Quinoa Bowl',
  image: '🥗',
  cuisine: 'Mediterranean',
  mealType: 'Lunch',
  calories: 420,
  prepTime: 15,
  cookTime: 20,
  servings: 2,
  rating: 4.8,
  reviews: 124,
  description: 'A vibrant, nutritious bowl featuring fluffy quinoa, fresh Mediterranean vegetables, creamy feta cheese, and a zesty lemon herb dressing. Perfect for a healthy lunch that keeps you energized all afternoon.',
  macros: {
    protein: 18,
    carbs: 52,
    fat: 16,
    fiber: 8,
  },
  ingredients: [
    { name: 'Quinoa', amount: 1, unit: 'cup', calories: 220 },
    { name: 'Cherry tomatoes', amount: 1, unit: 'cup', calories: 27 },
    { name: 'Cucumber', amount: 1, unit: 'medium', calories: 16 },
    { name: 'Red onion', amount: 0.5, unit: 'small', calories: 8 },
    { name: 'Kalamata olives', amount: 0.25, unit: 'cup', calories: 39 },
    { name: 'Feta cheese', amount: 0.5, unit: 'cup', calories: 99 },
    { name: 'Extra virgin olive oil', amount: 2, unit: 'tbsp', calories: 239 },
    { name: 'Lemon juice', amount: 2, unit: 'tbsp', calories: 6 },
    { name: 'Fresh parsley', amount: 0.25, unit: 'cup', calories: 4 },
    { name: 'Dried oregano', amount: 1, unit: 'tsp', calories: 3 },
    { name: 'Salt and pepper', amount: 1, unit: 'to taste', calories: 0 },
  ],
  instructions: [
    'Rinse quinoa under cold water. Combine with 2 cups of water in a saucepan, bring to a boil, then reduce heat and simmer for 15 minutes until water is absorbed.',
    'While quinoa cooks, dice the cucumber, halve the cherry tomatoes, and thinly slice the red onion.',
    'In a small bowl, whisk together olive oil, lemon juice, dried oregano, salt, and pepper to make the dressing.',
    'Once quinoa is cooked, fluff with a fork and let it cool for 5 minutes.',
    'In a large bowl, combine the quinoa with tomatoes, cucumber, red onion, and olives.',
    'Drizzle the dressing over the bowl and toss to combine.',
    'Top with crumbled feta cheese and fresh parsley.',
    'Serve immediately or refrigerate for up to 3 days.',
  ],
  healthBenefits: [
    'High in plant-based protein from quinoa',
    'Rich in antioxidants from colorful vegetables',
    'Healthy fats from olive oil support heart health',
    'Good source of fiber for digestive health',
  ],
  suitableFor: ['Diabetes', 'Heart Health', 'Weight Management'],
  notSuitableFor: ['Lactose Intolerance (can omit feta)'],
  tags: ['High Protein', 'Vegetarian', 'Gluten-Free', 'Meal Prep Friendly'],
  costPerServing: 4.50,
};

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [servings, setServings] = useState(sampleRecipe.servings);
  const [isFavorite, setIsFavorite] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const recipe = sampleRecipe; // In real app, fetch by id
  const servingMultiplier = servings / recipe.servings;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((s) => s !== index) : [...prev, index]
    );
  };

  const adjustedMacros = {
    protein: Math.round(recipe.macros.protein * servingMultiplier),
    carbs: Math.round(recipe.macros.carbs * servingMultiplier),
    fat: Math.round(recipe.macros.fat * servingMultiplier),
    fiber: Math.round(recipe.macros.fiber * servingMultiplier),
  };

  return (
    <motion.div
      className="recipe-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowBack />
        <span>Back to Recipes</span>
      </button>

      {/* Hero Section */}
      <div className="recipe-hero">
        <div className="hero-image">
          <span className="image-emoji">{recipe.image}</span>
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div className="cuisine-badge">{recipe.cuisine}</div>
            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </button>
          </div>
          <h1>{recipe.name}</h1>
          <p className="recipe-description">{recipe.description}</p>
          
          <div className="recipe-stats">
            <div className="stat">
              <LocalFireDepartment className="stat-icon" />
              <div>
                <span className="stat-value">{Math.round(recipe.calories * servingMultiplier)}</span>
                <span className="stat-label">kcal</span>
              </div>
            </div>
            <div className="stat">
              <AccessTime className="stat-icon" />
              <div>
                <span className="stat-value">{recipe.prepTime + recipe.cookTime}</span>
                <span className="stat-label">min</span>
              </div>
            </div>
            <div className="stat">
              <Restaurant className="stat-icon" />
              <div>
                <span className="stat-value">{servings}</span>
                <span className="stat-label">servings</span>
              </div>
            </div>
            <div className="stat">
              <Star className="stat-icon rating" />
              <div>
                <span className="stat-value">{recipe.rating}</span>
                <span className="stat-label">({recipe.reviews})</span>
              </div>
            </div>
          </div>

          <div className="tags-row">
            {recipe.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="recipe-body">
        {/* Nutrition Card */}
        <div className="nutrition-card">
          <h3>Nutrition per serving</h3>
          <div className="macro-grid">
            <div className="macro-item">
              <span className="macro-value">{adjustedMacros.protein}g</span>
              <span className="macro-label">Protein</span>
              <div className="macro-bar protein" style={{ width: `${(adjustedMacros.protein / 50) * 100}%` }} />
            </div>
            <div className="macro-item">
              <span className="macro-value">{adjustedMacros.carbs}g</span>
              <span className="macro-label">Carbs</span>
              <div className="macro-bar carbs" style={{ width: `${(adjustedMacros.carbs / 100) * 100}%` }} />
            </div>
            <div className="macro-item">
              <span className="macro-value">{adjustedMacros.fat}g</span>
              <span className="macro-label">Fat</span>
              <div className="macro-bar fat" style={{ width: `${(adjustedMacros.fat / 40) * 100}%` }} />
            </div>
            <div className="macro-item">
              <span className="macro-value">{adjustedMacros.fiber}g</span>
              <span className="macro-label">Fiber</span>
              <div className="macro-bar fiber" style={{ width: `${(adjustedMacros.fiber / 25) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Health Benefits */}
        <div className="benefits-card">
          <h3>Health Benefits</h3>
          <ul className="benefits-list">
            {recipe.healthBenefits.map((benefit, i) => (
              <li key={i}>
                <CheckCircle className="benefit-icon" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          {recipe.suitableFor.length > 0 && (
            <div className="suitable-for">
              <Info className="info-icon" />
              <span>Great for: {recipe.suitableFor.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="ingredients-card">
          <div className="card-header">
            <h3>Ingredients</h3>
            <div className="servings-control">
              <button
                className="serving-btn"
                onClick={() => setServings(Math.max(1, servings - 1))}
              >
                <Remove />
              </button>
              <span>{servings} servings</span>
              <button
                className="serving-btn"
                onClick={() => setServings(servings + 1)}
              >
                <Add />
              </button>
            </div>
          </div>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <span className="ingredient-amount">
                  {(ing.amount * servingMultiplier).toFixed(ing.amount * servingMultiplier < 1 ? 2 : 0)} {ing.unit}
                </span>
                <span className="ingredient-name">{ing.name}</span>
              </li>
            ))}
          </ul>
          <div className="cost-info">
            <span>Estimated cost: ${(recipe.costPerServing * servings).toFixed(2)} (${recipe.costPerServing.toFixed(2)}/serving)</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-card">
          <h3>Instructions</h3>
          <ol className="instructions-list">
            {recipe.instructions.map((step, i) => (
              <li
                key={i}
                className={completedSteps.includes(i) ? 'completed' : ''}
                onClick={() => toggleStep(i)}
              >
                <div className="step-number">
                  {completedSteps.includes(i) ? <CheckCircle /> : i + 1}
                </div>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Add to Meal Plan */}
        <div className="actions-card">
          <button className="add-to-plan-btn">
            <Restaurant />
            <span>Add to Meal Plan</span>
          </button>
        </div>
      </div>

      <style>{`
        .recipe-detail {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--color-secondary);
          font-size: 0.95rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--color-primary);
        }

        .recipe-hero {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .recipe-hero {
            grid-template-columns: 1fr;
          }
        }

        .hero-image {
          background: linear-gradient(135deg, #FFE4D6 0%, #FFF0E8 100%);
          border-radius: var(--radius-xl);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-emoji {
          font-size: 8rem;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
        }

        .hero-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .cuisine-badge {
          padding: 0.375rem 0.875rem;
          background: rgba(255, 107, 53, 0.15);
          color: var(--color-primary);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .favorite-btn {
          width: 44px;
          height: 44px;
          background: white;
          border: 2px solid #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #ccc;
        }

        .favorite-btn:hover {
          border-color: #EF476F;
          color: #EF476F;
        }

        .favorite-btn.active {
          background: #EF476F;
          border-color: #EF476F;
          color: white;
        }

        .hero-content h1 {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }

        .recipe-description {
          color: #666;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .recipe-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-icon {
          color: var(--color-primary);
          font-size: 1.5rem !important;
        }

        .stat-icon.rating {
          color: #F9A826;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: #888;
          margin-left: 0.25rem;
        }

        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.375rem 0.75rem;
          background: rgba(37, 161, 142, 0.1);
          color: var(--color-accent);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .recipe-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .nutrition-card, .benefits-card, .ingredients-card, .instructions-card, .actions-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .nutrition-card h3, .benefits-card h3, .ingredients-card h3, .instructions-card h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .macro-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .macro-item {
          position: relative;
        }

        .macro-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        .macro-label {
          display: block;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .macro-bar {
          height: 4px;
          border-radius: 2px;
          max-width: 100%;
        }

        .macro-bar.protein { background: #FF6B35; }
        .macro-bar.carbs { background: #25A18E; }
        .macro-bar.fat { background: #F9A826; }
        .macro-bar.fiber { background: #004E64; }

        .benefits-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .benefits-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .benefit-icon {
          color: var(--color-success);
          font-size: 1.25rem !important;
          flex-shrink: 0;
        }

        .suitable-for {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(0, 78, 100, 0.05);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }

        .info-icon {
          color: var(--color-secondary);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .servings-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
        }

        .serving-btn {
          width: 32px;
          height: 32px;
          background: #f5f5f5;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .serving-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .ingredients-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ingredients-list li {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          background: #fafafa;
          border-radius: var(--radius-md);
        }

        .ingredient-amount {
          min-width: 100px;
          font-weight: 600;
          color: var(--color-primary);
        }

        .ingredient-name {
          color: var(--color-secondary);
        }

        .cost-info {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
          font-size: 0.9rem;
          color: #666;
        }

        .instructions-list {
          list-style: none;
          counter-reset: step;
        }

        .instructions-list li {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          margin-bottom: 0.75rem;
          background: #fafafa;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }

        .instructions-list li:hover {
          background: #f5f5f5;
        }

        .instructions-list li.completed {
          opacity: 0.6;
        }

        .instructions-list li.completed p {
          text-decoration: line-through;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .instructions-list li.completed .step-number {
          background: var(--color-success);
        }

        .instructions-list li p {
          flex: 1;
          line-height: 1.6;
        }

        .add-to-plan-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-to-plan-btn:hover {
          background: var(--color-primary-dark);
        }
      `}</style>
    </motion.div>
  );
}


