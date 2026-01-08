import { useState, useMemo, useDeferredValue } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FilterList,
  AccessTime,
  LocalFireDepartment,
  Favorite,
  FavoriteBorder,
  Star,
  Close,
} from '@mui/icons-material';

// Sample recipes data
const allRecipes = [
  {
    id: '1',
    name: 'Mediterranean Quinoa Bowl',
    image: '🥗',
    cuisine: 'Mediterranean',
    calories: 420,
    protein: 18,
    prepTime: 25,
    rating: 4.8,
    reviews: 124,
    tags: ['High Protein', 'Vegetarian', 'Gluten-Free'],
    description: 'A nutritious bowl packed with quinoa, fresh vegetables, and tangy feta cheese.',
  },
  {
    id: '2',
    name: 'Grilled Salmon with Asparagus',
    image: '🐟',
    cuisine: 'American',
    calories: 520,
    protein: 42,
    prepTime: 30,
    rating: 4.9,
    reviews: 89,
    tags: ['High Protein', 'Keto', 'Omega-3'],
    description: 'Perfectly grilled salmon fillet with roasted asparagus and lemon butter.',
  },
  {
    id: '3',
    name: 'Chicken Tikka Masala',
    image: '🍛',
    cuisine: 'Indian',
    calories: 480,
    protein: 35,
    prepTime: 40,
    rating: 4.7,
    reviews: 156,
    tags: ['High Protein', 'Spicy', 'Comfort Food'],
    description: 'Tender chicken in a creamy, aromatic tomato-based curry sauce.',
  },
  {
    id: '4',
    name: 'Avocado Toast with Poached Eggs',
    image: '🥑',
    cuisine: 'American',
    calories: 380,
    protein: 14,
    prepTime: 15,
    rating: 4.6,
    reviews: 203,
    tags: ['Quick', 'Vegetarian', 'Breakfast'],
    description: 'Creamy avocado on sourdough topped with perfectly poached eggs.',
  },
  {
    id: '5',
    name: 'Thai Green Curry',
    image: '🍜',
    cuisine: 'Thai',
    calories: 450,
    protein: 28,
    prepTime: 35,
    rating: 4.8,
    reviews: 98,
    tags: ['Spicy', 'Dairy-Free', 'High Protein'],
    description: 'Fragrant green curry with vegetables and your choice of protein.',
  },
  {
    id: '6',
    name: 'Greek Salad with Grilled Chicken',
    image: '🥙',
    cuisine: 'Greek',
    calories: 380,
    protein: 32,
    prepTime: 20,
    rating: 4.5,
    reviews: 67,
    tags: ['High Protein', 'Low Carb', 'Fresh'],
    description: 'Classic Greek salad topped with juicy grilled chicken breast.',
  },
  {
    id: '7',
    name: 'Japanese Miso Soup',
    image: '🍲',
    cuisine: 'Japanese',
    calories: 120,
    protein: 8,
    prepTime: 15,
    rating: 4.4,
    reviews: 78,
    tags: ['Low Calorie', 'Vegetarian', 'Quick'],
    description: 'Traditional miso soup with tofu, seaweed, and green onions.',
  },
  {
    id: '8',
    name: 'Protein Pancakes',
    image: '🥞',
    cuisine: 'American',
    calories: 320,
    protein: 25,
    prepTime: 20,
    rating: 4.7,
    reviews: 145,
    tags: ['High Protein', 'Breakfast', 'Fitness'],
    description: 'Fluffy pancakes packed with protein, topped with fresh berries.',
  },
  {
    id: '9',
    name: 'Vegetable Stir Fry',
    image: '🥦',
    cuisine: 'Chinese',
    calories: 280,
    protein: 12,
    prepTime: 20,
    rating: 4.5,
    reviews: 92,
    tags: ['Vegan', 'Quick', 'Low Calorie'],
    description: 'Colorful vegetables stir-fried in a savory garlic ginger sauce.',
  },
];

const cuisines = ['All', 'Mediterranean', 'Indian', 'Thai', 'American', 'Japanese', 'Chinese', 'Greek', 'Mexican'];
const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
const dietFilters = ['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'High Protein', 'Low Calorie'];

export default function Recipes() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedMealType, setSelectedMealType] = useState('All');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  // Use deferred value for search to avoid filtering on every keystroke
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Memoize filtered recipes to prevent recalculation on every render
  const filteredRecipes = useMemo(() => {
    const searchLower = deferredSearchQuery.toLowerCase();

    return allRecipes.filter((recipe) => {
      // Early return for non-matching cuisine
      if (selectedCuisine !== 'All' && recipe.cuisine !== selectedCuisine) {
        return false;
      }

      // Early return for non-matching diets
      if (selectedDiets.length > 0 && !selectedDiets.some((diet) => recipe.tags.includes(diet))) {
        return false;
      }

      // Finally check search query if present
      if (searchLower && !recipe.name.toLowerCase().includes(searchLower) &&
          !recipe.description.toLowerCase().includes(searchLower)) {
        return false;
      }

      return true;
    });
  }, [deferredSearchQuery, selectedCuisine, selectedDiets]);

  return (
    <motion.div
      className="recipes-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header">
        <div>
          <h1>Recipes</h1>
          <p>Discover delicious, healthy meals tailored for you</p>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="search-bar">
        <div className="search-input">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              <Close />
            </button>
          )}
        </div>
        <button
          className={`filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterList />
          <span>Filters</span>
          {(selectedDiets.length > 0 || selectedCuisine !== 'All') && (
            <span className="filter-count">
              {selectedDiets.length + (selectedCuisine !== 'All' ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          className="filter-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="filter-section">
            <h4>Cuisine</h4>
            <div className="filter-chips">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  className={`filter-chip ${selectedCuisine === cuisine ? 'selected' : ''}`}
                  onClick={() => setSelectedCuisine(cuisine)}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h4>Diet</h4>
            <div className="filter-chips">
              {dietFilters.map((diet) => (
                <button
                  key={diet}
                  className={`filter-chip ${selectedDiets.includes(diet) ? 'selected' : ''}`}
                  onClick={() => toggleDiet(diet)}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-actions">
            <button
              className="clear-filters"
              onClick={() => {
                setSelectedCuisine('All');
                setSelectedDiets([]);
              }}
            >
              Clear All
            </button>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="results-count">
        <span>{filteredRecipes.length} recipes found</span>
      </div>

      {/* Recipe Grid */}
      <div className="recipes-grid">
        {filteredRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            className="recipe-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            <div className="recipe-image">
              <span className="image-emoji">{recipe.image}</span>
              <button
                className={`favorite-btn ${favorites.includes(recipe.id) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(recipe.id);
                }}
              >
                {favorites.includes(recipe.id) ? <Favorite /> : <FavoriteBorder />}
              </button>
              <span className="cuisine-badge">{recipe.cuisine}</span>
            </div>
            <div className="recipe-content">
              <h3>{recipe.name}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <div className="recipe-tags">
                {recipe.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="recipe-meta">
                <div className="meta-item">
                  <LocalFireDepartment />
                  <span>{recipe.calories} kcal</span>
                </div>
                <div className="meta-item">
                  <AccessTime />
                  <span>{recipe.prepTime} min</span>
                </div>
                <div className="meta-item rating">
                  <Star />
                  <span>{recipe.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="no-results">
          <span className="no-results-emoji">🍽️</span>
          <h3>No recipes found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}

      <style>{`
        .recipes-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: #666;
        }

        .search-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .search-input {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-full);
          padding: 0 1rem;
          transition: all 0.2s;
        }

        .search-input:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .search-icon {
          color: #999;
          margin-right: 0.5rem;
        }

        .search-input input {
          flex: 1;
          border: none;
          padding: 0.875rem 0;
          font-size: 1rem;
          background: transparent;
        }

        .search-input input:focus {
          outline: none;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 1.5rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover, .filter-btn.active {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .filter-count {
          background: var(--color-primary);
          color: white;
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .filter-panel {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: var(--shadow-card);
        }

        .filter-section {
          margin-bottom: 1rem;
        }

        .filter-section h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-chip {
          padding: 0.5rem 1rem;
          background: #f5f5f5;
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-chip:hover {
          background: #eee;
        }

        .filter-chip.selected {
          background: rgba(255, 107, 53, 0.15);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .filter-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .clear-filters {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: 500;
          cursor: pointer;
        }

        .results-count {
          margin-bottom: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .recipe-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
          cursor: pointer;
          transition: all 0.3s;
        }

        .recipe-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .recipe-image {
          position: relative;
          height: 180px;
          background: linear-gradient(135deg, #FFE4D6 0%, #FFF0E8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-emoji {
          font-size: 5rem;
        }

        .favorite-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all 0.2s;
          color: #ccc;
        }

        .favorite-btn:hover {
          transform: scale(1.1);
        }

        .favorite-btn.active {
          color: #EF476F;
        }

        .cuisine-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          padding: 0.375rem 0.75rem;
          background: white;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-secondary);
          box-shadow: var(--shadow-sm);
        }

        .recipe-content {
          padding: 1.25rem;
        }

        .recipe-content h3 {
          font-size: 1.1rem;
          font-family: var(--font-body);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .recipe-description {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .recipe-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.5rem;
          background: rgba(37, 161, 142, 0.1);
          color: var(--color-accent);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .recipe-meta {
          display: flex;
          gap: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid #eee;
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

        .meta-item.rating svg {
          color: #F9A826;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
        }

        .no-results-emoji {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-results h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .no-results p {
          color: #666;
        }
      `}</style>
    </motion.div>
  );
}


