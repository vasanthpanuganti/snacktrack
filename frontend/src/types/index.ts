// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health_improvement';
  targetWeight?: number;
  
  // Diet Preferences
  dietType: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian' | 'pescatarian';
  restrictions: string[];
  allergies: string[];
  favoriteFoods: string[];
  dislikedFoods: string[];
  
  // Health
  healthConditions: string[];
  
  // Budget & Region
  dailyBudget?: number;
  weeklyBudget?: number;
  currency: string;
  region: string;
  preferredCuisines: string[];
  
  // Tracking
  currentStreak: number;
  longestStreak: number;
  totalDaysTracked: number;
  joinedAt: string;
  
  // Calculated fields
  bmr?: number;
  tdee?: number;
  dailyCalorieTarget?: number;
  macroTargets?: MacroTargets;
}

export interface MacroTargets {
  protein: number; // grams
  carbs: number;
  fat: number;
  fiber?: number;
}

// Recipe Types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  calories: number;
  macros: MacroTargets;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl?: string;
  tags: string[];
  region: string;
  costPerServing: number;
  healthBenefits: string[];
  suitableFor: string[]; // health conditions it's good for
  notSuitableFor: string[]; // health conditions to avoid
  rating: number;
  reviewCount: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories?: number;
  optional?: boolean;
}

// Meal Plan Types
export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: PlannedMeal[];
  totalCalories: number;
  totalMacros: MacroTargets;
  adherence?: number; // percentage
}

export interface PlannedMeal {
  id: string;
  recipeId: string;
  recipe: Recipe;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  completed: boolean;
  completedAt?: string;
}

// Tracking Types
export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  meals: LoggedMeal[];
  totalCalories: number;
  totalMacros: MacroTargets;
  water: number; // glasses
  weight?: number;
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
}

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  macros: MacroTargets;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// Progress Types
export interface WeightEntry {
  date: string;
  weight: number;
}

export interface ProgressStats {
  currentWeight: number;
  startingWeight: number;
  targetWeight: number;
  weightHistory: WeightEntry[];
  averageCalories: number;
  adherenceRate: number;
  currentStreak: number;
  weeklyProgress: {
    week: string;
    calories: number;
    adherence: number;
  }[];
}

// Social Types
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  score: number;
  streak: number;
  rank: number;
  change: number; // position change from last week
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Motivation Types
export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
}

// Onboarding Types
export interface OnboardingData {
  step: number;
  basicInfo: {
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
  };
  goals: {
    goal: string;
    targetWeight?: number;
    timeline?: string;
  };
  dietPreferences: {
    dietType: string;
    restrictions: string[];
    allergies: string[];
  };
  healthInfo: {
    conditions: string[];
    medications?: string[];
  };
  lifestyle: {
    activityLevel: string;
    cookingTime: string;
    mealsPerDay: number;
  };
  budget: {
    dailyBudget?: number;
    weeklyBudget?: number;
    currency: string;
  };
  regionCuisine: {
    region: string;
    preferredCuisines: string[];
  };
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRecipes: number;
  totalMealPlans: number;
  averageAdherence: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


