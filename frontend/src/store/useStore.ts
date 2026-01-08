import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  UserProfile, 
  Recipe, 
  MealPlan, 
  DailyLog, 
  Achievement,
  OnboardingData,
  LeaderboardEntry,
  MotivationalQuote
} from '../types';

interface AppState {
  // User
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  onboardingData: OnboardingData;
  userStartDate: string | null;
  
  // Recipes
  recipes: Recipe[];
  featuredRecipes: Recipe[];
  
  // Meal Plans
  currentMealPlan: any | null;
  weeklyMealPlan: MealPlan[];
  
  // Tracking
  dailyLogs: DailyLog[];
  todayLog: DailyLog | null;
  loggedMeals: any[];
  workouts: any[];
  
  // Social
  leaderboard: LeaderboardEntry[];
  achievements: Achievement[];
  
  // Motivation
  dailyQuote: MotivationalQuote | null;
  
  // UI State
  sidebarOpen: boolean;
  activeTab: string;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setOnboarding: (isOnboarding: boolean) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  setUserStartDate: (date: string) => void;
  setMealPlan: (plan: any) => void;
  
  setRecipes: (recipes: Recipe[]) => void;
  setFeaturedRecipes: (recipes: Recipe[]) => void;
  
  setCurrentMealPlan: (plan: MealPlan | null) => void;
  setWeeklyMealPlan: (plans: MealPlan[]) => void;
  markMealCompleted: (planId: string, mealId: string) => void;
  
  addDailyLog: (log: DailyLog) => void;
  updateTodayLog: (log: Partial<DailyLog>) => void;
  logMeal: (meal: any) => void;
  logWorkout: (workout: any) => void;
  
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (achievementId: string) => void;
  
  setDailyQuote: (quote: MotivationalQuote) => void;
  
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  
  logout: () => void;
}

const initialOnboardingData: OnboardingData = {
  step: 0,
  basicInfo: {
    name: '',
    age: 25,
    gender: '',
    height: 170,
    weight: 70,
  },
  goals: {
    goal: '',
    targetWeight: undefined,
    timeline: '',
  },
  dietPreferences: {
    dietType: '',
    restrictions: [],
    allergies: [],
  },
  healthInfo: {
    conditions: [],
    medications: [],
  },
  lifestyle: {
    activityLevel: '',
    cookingTime: '',
    mealsPerDay: 3,
  },
  budget: {
    dailyBudget: undefined,
    weeklyBudget: undefined,
    currency: 'USD',
  },
  regionCuisine: {
    region: '',
    preferredCuisines: [],
  },
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isOnboarding: false,
      onboardingData: initialOnboardingData,
      userStartDate: null,
      
      recipes: [],
      featuredRecipes: [],
      
      currentMealPlan: null,
      weeklyMealPlan: [],
      
      dailyLogs: [],
      todayLog: null,
      loggedMeals: [],
      workouts: [],
      
      leaderboard: [],
      achievements: [],
      
      dailyQuote: null,
      
      sidebarOpen: true,
      activeTab: 'dashboard',
      
      // User Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      setOnboarding: (isOnboarding) => set({ isOnboarding }),
      
      updateOnboardingData: (data) => set((state) => ({
        onboardingData: { ...state.onboardingData, ...data }
      })),
      
      completeOnboarding: () => {
        const { onboardingData } = get();
        const newUser: UserProfile = {
          id: `user_${Date.now()}`,
          name: onboardingData.basicInfo.name,
          email: '',
          age: onboardingData.basicInfo.age,
          height: onboardingData.basicInfo.height,
          weight: onboardingData.basicInfo.weight,
          gender: onboardingData.basicInfo.gender as UserProfile['gender'],
          activityLevel: onboardingData.lifestyle.activityLevel as UserProfile['activityLevel'],
          goal: onboardingData.goals.goal as UserProfile['goal'],
          targetWeight: onboardingData.goals.targetWeight,
          dietType: onboardingData.dietPreferences.dietType as UserProfile['dietType'],
          restrictions: onboardingData.dietPreferences.restrictions,
          allergies: onboardingData.dietPreferences.allergies,
          favoriteFoods: [],
          dislikedFoods: [],
          healthConditions: onboardingData.healthInfo.conditions,
          dailyBudget: onboardingData.budget.dailyBudget,
          weeklyBudget: onboardingData.budget.weeklyBudget,
          currency: onboardingData.budget.currency,
          region: onboardingData.regionCuisine.region,
          preferredCuisines: onboardingData.regionCuisine.preferredCuisines,
          currentStreak: 0,
          longestStreak: 0,
          totalDaysTracked: 0,
          joinedAt: new Date().toISOString(),
        };
        
        // Calculate BMR, TDEE, and targets
        const bmr = calculateBMR(newUser);
        const tdee = calculateTDEE(bmr, newUser.activityLevel);
        const dailyCalorieTarget = calculateCalorieTarget(tdee, newUser.goal);
        const macroTargets = calculateMacroTargets(dailyCalorieTarget, newUser.goal);
        
        set({
          user: {
            ...newUser,
            bmr,
            tdee,
            dailyCalorieTarget,
            macroTargets,
          },
          isAuthenticated: true,
          isOnboarding: false,
          onboardingData: initialOnboardingData,
        });
      },
      
      setUserStartDate: (date) => set({ userStartDate: date }),
      
      setMealPlan: (plan) => set({ currentMealPlan: plan }),
      
      // Recipe Actions
      setRecipes: (recipes) => set({ recipes }),
      setFeaturedRecipes: (recipes) => set({ featuredRecipes: recipes }),
      
      // Meal Plan Actions
      setCurrentMealPlan: (plan) => set({ currentMealPlan: plan }),
      setWeeklyMealPlan: (plans) => set({ weeklyMealPlan: plans }),
      
      markMealCompleted: (planId, mealId) => set((state) => {
        const updatePlan = (plan: MealPlan | null): MealPlan | null => {
          if (!plan || plan.id !== planId) return plan;
          return {
            ...plan,
            meals: plan.meals.map((meal) =>
              meal.id === mealId
                ? { ...meal, completed: true, completedAt: new Date().toISOString() }
                : meal
            ),
          };
        };
        
        return {
          currentMealPlan: updatePlan(state.currentMealPlan),
          weeklyMealPlan: state.weeklyMealPlan.map((plan) =>
            plan.id === planId ? (updatePlan(plan) as MealPlan) : plan
          ),
        };
      }),
      
      // Tracking Actions
      addDailyLog: (log) => set((state) => ({
        dailyLogs: [...state.dailyLogs, log],
      })),
      
      updateTodayLog: (logUpdate) => set((state) => ({
        todayLog: state.todayLog
          ? { ...state.todayLog, ...logUpdate }
          : null,
      })),
      
      logMeal: (meal) => set((state) => ({
        loggedMeals: [...state.loggedMeals, { ...meal, loggedAt: new Date().toISOString() }],
      })),
      
      logWorkout: (workout) => set((state) => ({
        workouts: [...state.workouts, { ...workout, loggedAt: new Date().toISOString() }],
      })),
      
      // Social Actions
      setLeaderboard: (entries) => set({ leaderboard: entries }),
      setAchievements: (achievements) => set({ achievements }),
      
      unlockAchievement: (achievementId) => set((state) => ({
        achievements: state.achievements.map((a) =>
          a.id === achievementId
            ? { ...a, unlockedAt: new Date().toISOString() }
            : a
        ),
      })),
      
      // Motivation Actions
      setDailyQuote: (quote) => set({ dailyQuote: quote }),
      
      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Logout
      logout: () => set({
        user: null,
        isAuthenticated: false,
        currentMealPlan: null,
        weeklyMealPlan: [],
        dailyLogs: [],
        todayLog: null,
      }),
    }),
    {
      name: 'snacktrack-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userStartDate: state.userStartDate,
        currentMealPlan: state.currentMealPlan,
        // Limit historical data to prevent localStorage quota issues
        // Keep only last 30 days of logs (~30 entries max)
        dailyLogs: state.dailyLogs.slice(-30),
        // Keep only last 100 logged meals (~1-2 weeks of data)
        loggedMeals: state.loggedMeals.slice(-100),
        // Keep only last 100 workouts (~3-4 months of data)
        workouts: state.workouts.slice(-100),
        // Achievements can be refetched from API, so don't persist
        // achievements: state.achievements,
      }),
    }
  )
);

// Helper functions for calculations
function calculateBMR(user: UserProfile): number {
  // Mifflin-St Jeor Equation
  const { weight, height, age, gender } = user;
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

function calculateCalorieTarget(tdee: number, goal: string): number {
  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee * 0.8); // 20% deficit
    case 'muscle_gain':
      return Math.round(tdee * 1.1); // 10% surplus
    default:
      return tdee;
  }
}

function calculateMacroTargets(calories: number, goal: string): { protein: number; carbs: number; fat: number } {
  let proteinPct = 0.3;
  let carbsPct = 0.4;
  let fatPct = 0.3;
  
  if (goal === 'muscle_gain') {
    proteinPct = 0.35;
    carbsPct = 0.45;
    fatPct = 0.2;
  } else if (goal === 'weight_loss') {
    proteinPct = 0.35;
    carbsPct = 0.35;
    fatPct = 0.3;
  }
  
  return {
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbsPct) / 4),
    fat: Math.round((calories * fatPct) / 9),
  };
}


