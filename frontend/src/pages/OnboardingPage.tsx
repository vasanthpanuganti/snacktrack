import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ArrowForward,
  ArrowBack,
  Person,
  FitnessCenter,
  Restaurant,
  Favorite,
  DirectionsRun,
  AttachMoney,
  Public,
  CheckCircle,
} from '@mui/icons-material';

const steps = [
  { icon: Person, title: 'Basic Info', subtitle: 'Tell us about yourself' },
  { icon: FitnessCenter, title: 'Your Goals', subtitle: 'What do you want to achieve?' },
  { icon: Restaurant, title: 'Diet Preferences', subtitle: 'Customize your diet' },
  { icon: Favorite, title: 'Health Info', subtitle: 'Any conditions to consider?' },
  { icon: DirectionsRun, title: 'Lifestyle', subtitle: 'Your daily routine' },
  { icon: AttachMoney, title: 'Budget', subtitle: 'Affordable meal planning' },
  { icon: Public, title: 'Region & Cuisine', subtitle: 'Local & favorite foods' },
];

const dietTypes = [
  { value: 'non_vegetarian', label: 'Non-Vegetarian', emoji: '🍖' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'eggetarian', label: 'Eggetarian', emoji: '🥚' },
  { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
];

const restrictions = [
  'Gluten-free', 'Lactose-free', 'Soy-free', 'Nut-free',
  'Low-sodium', 'Low-sugar', 'Keto', 'Halal', 'Kosher'
];

const commonAllergies = [
  'Peanuts', 'Tree nuts', 'Shellfish', 'Fish', 'Eggs',
  'Milk', 'Wheat', 'Soy', 'Sesame'
];

const healthConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol',
  'PCOS', 'Thyroid Issues', 'Celiac Disease', 'IBS',
  'Kidney Disease', 'Gout', 'Anemia', 'None'
];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', emoji: '🛋️' },
  { value: 'light', label: 'Light', desc: 'Exercise 1-3 days/week', emoji: '🚶' },
  { value: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week', emoji: '🏃' },
  { value: 'active', label: 'Active', desc: 'Exercise 6-7 days/week', emoji: '💪' },
  { value: 'very_active', label: 'Very Active', desc: 'Intense daily exercise', emoji: '🏋️' },
];

const goals = [
  { value: 'weight_loss', label: 'Lose Weight', desc: 'Burn fat and slim down', emoji: '⚖️' },
  { value: 'muscle_gain', label: 'Build Muscle', desc: 'Gain strength and mass', emoji: '💪' },
  { value: 'maintenance', label: 'Maintain', desc: 'Keep your current weight', emoji: '✨' },
  { value: 'health_improvement', label: 'Improve Health', desc: 'Better overall wellness', emoji: '❤️' },
];

const regions = [
  'North America', 'South America', 'Europe', 'Middle East',
  'South Asia', 'East Asia', 'Southeast Asia', 'Africa', 'Oceania'
];

const cuisines = [
  { value: 'indian', label: 'Indian', emoji: '🍛' },
  { value: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { value: 'mexican', label: 'Mexican', emoji: '🌮' },
  { value: 'chinese', label: 'Chinese', emoji: '🥡' },
  { value: 'japanese', label: 'Japanese', emoji: '🍣' },
  { value: 'thai', label: 'Thai', emoji: '🍜' },
  { value: 'italian', label: 'Italian', emoji: '🍝' },
  { value: 'american', label: 'American', emoji: '🍔' },
  { value: 'korean', label: 'Korean', emoji: '🍲' },
  { value: 'middle_eastern', label: 'Middle Eastern', emoji: '🧆' },
];

// Unit conversion helpers
const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

const feetInchesToCm = (feet: number, inches: number): number => {
  return Math.round((feet * 12 + inches) * 2.54);
};

const kgToLbs = (kg: number): number => Math.round(kg * 2.205);
const lbsToKg = (lbs: number): number => Math.round(lbs / 2.205);

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData, completeOnboarding, setOnboarding } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Unit preferences
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  
  // Local state for feet/inches input
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(6);
  const [weightLbs, setWeightLbs] = useState(150);

  // Initialize feet/inches from cm value
  useEffect(() => {
    if (onboardingData.basicInfo.height > 0) {
      const { feet, inches } = cmToFeetInches(onboardingData.basicInfo.height);
      setHeightFeet(feet);
      setHeightInches(inches);
    }
    if (onboardingData.basicInfo.weight > 0) {
      setWeightLbs(kgToLbs(onboardingData.basicInfo.weight));
    }
  }, []);

  // Update cm when feet/inches change
  useEffect(() => {
    if (heightUnit === 'ft') {
      const cm = feetInchesToCm(heightFeet, heightInches);
      updateOnboardingData({
        basicInfo: { ...onboardingData.basicInfo, height: cm },
      });
    }
  }, [heightFeet, heightInches, heightUnit]);

  // Update kg when lbs change
  useEffect(() => {
    if (weightUnit === 'lbs') {
      const kg = lbsToKg(weightLbs);
      updateOnboardingData({
        basicInfo: { ...onboardingData.basicInfo, weight: kg },
      });
    }
  }, [weightLbs, weightUnit]);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!onboardingData.basicInfo.name.trim()) {
          newErrors.name = 'Please enter your name';
        }
        if (!onboardingData.basicInfo.gender) {
          newErrors.gender = 'Please select your gender';
        }
        if (onboardingData.basicInfo.age < 10 || onboardingData.basicInfo.age > 120) {
          newErrors.age = 'Please enter a valid age';
        }
        if (onboardingData.basicInfo.height < 100 || onboardingData.basicInfo.height > 250) {
          newErrors.height = 'Please enter a valid height';
        }
        if (onboardingData.basicInfo.weight < 20 || onboardingData.basicInfo.weight > 300) {
          newErrors.weight = 'Please enter a valid weight';
        }
        break;
      case 1:
        if (!onboardingData.goals.goal) {
          newErrors.goal = 'Please select a goal';
        }
        break;
      case 2:
        if (!onboardingData.dietPreferences.dietType) {
          newErrors.dietType = 'Please select your diet type';
        }
        break;
      case 4:
        if (!onboardingData.lifestyle.activityLevel) {
          newErrors.activityLevel = 'Please select your activity level';
        }
        break;
      case 6:
        if (!onboardingData.regionCuisine.region) {
          newErrors.region = 'Please select your region';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === steps.length - 1) {
        completeOnboarding();
        navigate('/meal-plan-preview');
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      setOnboarding(false);
      navigate('/');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleArrayItem = (
    array: string[],
    item: string,
    key: 'restrictions' | 'allergies' | 'conditions' | 'preferredCuisines'
  ) => {
    const newArray = array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];

    if (key === 'restrictions' || key === 'allergies') {
      updateOnboardingData({
        dietPreferences: { ...onboardingData.dietPreferences, [key]: newArray },
      });
    } else if (key === 'conditions') {
      updateOnboardingData({
        healthInfo: { ...onboardingData.healthInfo, conditions: newArray },
      });
    } else {
      updateOnboardingData({
        regionCuisine: { ...onboardingData.regionCuisine, preferredCuisines: newArray },
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="step-content">
            <div className="input-group">
              <label>What's your name?</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={onboardingData.basicInfo.name}
                onChange={(e) =>
                  updateOnboardingData({
                    basicInfo: { ...onboardingData.basicInfo, name: e.target.value },
                  })
                }
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Gender</label>
              <div className="option-grid cols-4">
                {['male', 'female', 'other', 'prefer_not_to_say'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`option-btn ${onboardingData.basicInfo.gender === g ? 'selected' : ''}`}
                    onClick={() =>
                      updateOnboardingData({
                        basicInfo: { ...onboardingData.basicInfo, gender: g },
                      })
                    }
                  >
                    {g === 'prefer_not_to_say' ? 'Prefer not' : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            <div className="input-group">
              <label>Age</label>
              <input
                type="number"
                value={onboardingData.basicInfo.age || ''}
                onChange={(e) =>
                  updateOnboardingData({
                    basicInfo: { ...onboardingData.basicInfo, age: parseInt(e.target.value) || 0 },
                  })
                }
                placeholder="Enter your age"
                min={10}
                max={120}
                className={errors.age ? 'error' : ''}
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

            {/* Height with Unit Toggle */}
            <div className="input-group">
              <div className="label-with-toggle">
                <label>Height</label>
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${heightUnit === 'cm' ? 'active' : ''}`}
                    onClick={() => setHeightUnit('cm')}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${heightUnit === 'ft' ? 'active' : ''}`}
                    onClick={() => setHeightUnit('ft')}
                  >
                    ft/in
                  </button>
                </div>
              </div>
              
              {heightUnit === 'cm' ? (
                <input
                  type="number"
                  value={onboardingData.basicInfo.height || ''}
                  onChange={(e) =>
                    updateOnboardingData({
                      basicInfo: { ...onboardingData.basicInfo, height: parseInt(e.target.value) || 0 },
                    })
                  }
                  placeholder="Height in cm (e.g., 170)"
                  min={100}
                  max={250}
                  className={errors.height ? 'error' : ''}
                />
              ) : (
                <div className="input-row-compact">
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
                      min={3}
                      max={8}
                    />
                    <span className="suffix">ft</span>
                  </div>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(parseInt(e.target.value) || 0)}
                      min={0}
                      max={11}
                    />
                    <span className="suffix">in</span>
                  </div>
                </div>
              )}
              <span className="helper-text">
                {heightUnit === 'cm' 
                  ? `≈ ${cmToFeetInches(onboardingData.basicInfo.height || 170).feet}′${cmToFeetInches(onboardingData.basicInfo.height || 170).inches}″`
                  : `≈ ${onboardingData.basicInfo.height} cm`
                }
              </span>
              {errors.height && <span className="error-text">{errors.height}</span>}
            </div>

            {/* Weight with Unit Toggle */}
            <div className="input-group">
              <div className="label-with-toggle">
                <label>Weight</label>
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                    onClick={() => setWeightUnit('kg')}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${weightUnit === 'lbs' ? 'active' : ''}`}
                    onClick={() => setWeightUnit('lbs')}
                  >
                    lbs
                  </button>
                </div>
              </div>
              
              {weightUnit === 'kg' ? (
                <input
                  type="number"
                  value={onboardingData.basicInfo.weight || ''}
                  onChange={(e) =>
                    updateOnboardingData({
                      basicInfo: { ...onboardingData.basicInfo, weight: parseInt(e.target.value) || 0 },
                    })
                  }
                  placeholder="Weight in kg (e.g., 70)"
                  min={20}
                  max={300}
                  className={errors.weight ? 'error' : ''}
                />
              ) : (
                <input
                  type="number"
                  value={weightLbs || ''}
                  onChange={(e) => setWeightLbs(parseInt(e.target.value) || 0)}
                  placeholder="Weight in lbs (e.g., 154)"
                  min={44}
                  max={660}
                  className={errors.weight ? 'error' : ''}
                />
              )}
              <span className="helper-text">
                {weightUnit === 'kg' 
                  ? `≈ ${kgToLbs(onboardingData.basicInfo.weight || 70)} lbs`
                  : `≈ ${onboardingData.basicInfo.weight} kg`
                }
              </span>
              {errors.weight && <span className="error-text">{errors.weight}</span>}
            </div>
          </div>
        );

      case 1: // Goals
        return (
          <div className="step-content">
            <div className="input-group">
              <label>What's your primary goal?</label>
              <div className="goal-grid">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    className={`goal-card ${onboardingData.goals.goal === goal.value ? 'selected' : ''}`}
                    onClick={() =>
                      updateOnboardingData({
                        goals: { ...onboardingData.goals, goal: goal.value },
                      })
                    }
                  >
                    <span className="goal-emoji">{goal.emoji}</span>
                    <span className="goal-label">{goal.label}</span>
                    <span className="goal-desc">{goal.desc}</span>
                  </button>
                ))}
              </div>
              {errors.goal && <span className="error-text">{errors.goal}</span>}
            </div>

            {(onboardingData.goals.goal === 'weight_loss' || onboardingData.goals.goal === 'muscle_gain') && (
              <div className="input-group">
                <label>Target weight ({weightUnit}) - Optional</label>
                <input
                  type="number"
                  placeholder={`Enter your target weight in ${weightUnit}`}
                  value={onboardingData.goals.targetWeight || ''}
                  onChange={(e) =>
                    updateOnboardingData({
                      goals: { ...onboardingData.goals, targetWeight: parseInt(e.target.value) || undefined },
                    })
                  }
                  min={30}
                  max={300}
                />
              </div>
            )}
          </div>
        );

      case 2: // Diet Preferences
        return (
          <div className="step-content">
            <div className="input-group">
              <label>What's your diet type?</label>
              <div className="diet-grid">
                {dietTypes.map((diet) => (
                  <button
                    key={diet.value}
                    type="button"
                    className={`diet-card ${onboardingData.dietPreferences.dietType === diet.value ? 'selected' : ''}`}
                    onClick={() =>
                      updateOnboardingData({
                        dietPreferences: { ...onboardingData.dietPreferences, dietType: diet.value },
                      })
                    }
                  >
                    <span className="diet-emoji">{diet.emoji}</span>
                    <span>{diet.label}</span>
                  </button>
                ))}
              </div>
              {errors.dietType && <span className="error-text">{errors.dietType}</span>}
            </div>

            <div className="input-group">
              <label>Any dietary restrictions? (Optional)</label>
              <div className="chip-grid">
                {restrictions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`chip ${onboardingData.dietPreferences.restrictions.includes(r) ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem(onboardingData.dietPreferences.restrictions, r, 'restrictions')}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Any food allergies? (Optional)</label>
              <div className="chip-grid">
                {commonAllergies.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`chip warning ${onboardingData.dietPreferences.allergies.includes(a) ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem(onboardingData.dietPreferences.allergies, a, 'allergies')}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Health Info
        return (
          <div className="step-content">
            <div className="input-group">
              <label>Do you have any health conditions?</label>
              <p className="helper-text">
                This helps us recommend foods that support your health.
              </p>
              <div className="chip-grid">
                {healthConditions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${onboardingData.healthInfo.conditions.includes(c) ? 'selected' : ''} ${c === 'None' ? 'none-option' : ''}`}
                    onClick={() => {
                      if (c === 'None') {
                        updateOnboardingData({
                          healthInfo: { ...onboardingData.healthInfo, conditions: ['None'] },
                        });
                      } else {
                        const conditions = onboardingData.healthInfo.conditions.filter((x) => x !== 'None');
                        toggleArrayItem(conditions, c, 'conditions');
                      }
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="info-box">
              <Favorite className="info-icon" />
              <div>
                <strong>Why we ask this</strong>
                <p>We personalize meal recommendations based on your health needs.</p>
              </div>
            </div>
          </div>
        );

      case 4: // Lifestyle
        return (
          <div className="step-content">
            <div className="input-group">
              <label>How active are you?</label>
              <div className="activity-grid">
                {activityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    className={`activity-card ${onboardingData.lifestyle.activityLevel === level.value ? 'selected' : ''}`}
                    onClick={() =>
                      updateOnboardingData({
                        lifestyle: { ...onboardingData.lifestyle, activityLevel: level.value },
                      })
                    }
                  >
                    <span className="activity-emoji">{level.emoji}</span>
                    <span className="activity-label">{level.label}</span>
                    <span className="activity-desc">{level.desc}</span>
                  </button>
                ))}
              </div>
              {errors.activityLevel && <span className="error-text">{errors.activityLevel}</span>}
            </div>

            <div className="input-group">
              <label>How many meals per day?</label>
              <div className="option-grid cols-4">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`option-btn ${onboardingData.lifestyle.mealsPerDay === n ? 'selected' : ''}`}
                    onClick={() =>
                      updateOnboardingData({
                        lifestyle: { ...onboardingData.lifestyle, mealsPerDay: n },
                      })
                    }
                  >
                    {n} meals
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Budget
        return (
          <div className="step-content">
            <div className="input-group">
              <label>What's your food budget? (Optional)</label>
              <p className="helper-text">
                We'll recommend meals that fit your budget.
              </p>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Daily budget</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    placeholder="e.g., 15"
                    value={onboardingData.budget.dailyBudget || ''}
                    onChange={(e) =>
                      updateOnboardingData({
                        budget: { ...onboardingData.budget, dailyBudget: parseInt(e.target.value) || undefined },
                      })
                    }
                    min={5}
                    max={500}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Weekly budget</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    value={onboardingData.budget.weeklyBudget || ''}
                    onChange={(e) =>
                      updateOnboardingData({
                        budget: { ...onboardingData.budget, weeklyBudget: parseInt(e.target.value) || undefined },
                      })
                    }
                    min={20}
                    max={2000}
                  />
                </div>
              </div>
            </div>

            <div className="info-box success">
              <AttachMoney className="info-icon" />
              <div>
                <strong>Budget-friendly eating</strong>
                <p>We prioritize affordable ingredients without compromising nutrition.</p>
              </div>
            </div>
          </div>
        );

      case 6: // Region & Cuisine
        return (
          <div className="step-content">
            <div className="input-group">
              <label>Where are you located?</label>
              <select
                value={onboardingData.regionCuisine.region}
                onChange={(e) =>
                  updateOnboardingData({
                    regionCuisine: { ...onboardingData.regionCuisine, region: e.target.value },
                  })
                }
                className={errors.region ? 'error' : ''}
              >
                <option value="">Select your region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.region && <span className="error-text">{errors.region}</span>}
            </div>

            <div className="input-group">
              <label>What cuisines do you enjoy?</label>
              <div className="cuisine-grid">
                {cuisines.map((cuisine) => (
                  <button
                    key={cuisine.value}
                    type="button"
                    className={`cuisine-card ${onboardingData.regionCuisine.preferredCuisines.includes(cuisine.value) ? 'selected' : ''}`}
                    onClick={() =>
                      toggleArrayItem(onboardingData.regionCuisine.preferredCuisines, cuisine.value, 'preferredCuisines')
                    }
                  >
                    <span className="cuisine-emoji">{cuisine.emoji}</span>
                    <span>{cuisine.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container glass">
        {/* Progress Header */}
        <div className="onboarding-header">
          <div className="logo">
            <div className="logo-mark">S</div>
            <span className="logo-text">SnackTrack</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Step Navigation */}
        <div className="step-nav">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div
                key={index}
                className={`step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                {isCompleted ? <CheckCircle /> : <Icon />}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="step-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="step-container"
            >
              <div className="step-header">
                <h2>{steps[currentStep].title}</h2>
                <p>{steps[currentStep].subtitle}</p>
              </div>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-footer">
          <button className="nav-btn back" onClick={handleBack}>
            <ArrowBack />
            <span>{currentStep === 0 ? 'Cancel' : 'Back'}</span>
          </button>
          <button className="nav-btn next" onClick={handleNext}>
            <span>{currentStep === steps.length - 1 ? 'Generate My Plan' : 'Continue'}</span>
            <ArrowForward />
          </button>
        </div>
      </div>

      <style>{`
        .onboarding-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--color-black);
          background-image: 
            radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.02) 0%, transparent 50%);
        }

        .onboarding-container {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-2xl);
          width: 100%;
          max-width: 700px;
          overflow: hidden;
        }

        .onboarding-header {
          background: rgba(255, 255, 255, 0.03);
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
          color: #000;
        }

        .logo-text {
          font-size: 1.375rem;
          font-weight: 600;
          color: var(--color-white);
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--color-white);
          border-radius: var(--radius-full);
          transition: width 0.4s ease;
        }

        .step-indicator {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          color: var(--color-gray-500);
        }

        .step-nav {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .step-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-gray-600);
          transition: all 0.3s;
        }

        .step-dot svg {
          font-size: 1.125rem;
        }

        .step-dot.active {
          background: var(--color-white);
          color: var(--color-black);
          transform: scale(1.1);
        }

        .step-dot.completed {
          background: var(--color-success);
          color: white;
        }

        .step-wrapper {
          padding: 2rem;
          min-height: 420px;
        }

        .step-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .step-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: var(--color-white);
        }

        .step-header p {
          color: var(--color-gray-500);
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-weight: 500;
          color: var(--color-gray-300);
          font-size: 0.95rem;
        }

        .label-with-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .unit-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-full);
          padding: 2px;
        }

        .unit-btn {
          padding: 0.375rem 0.875rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-gray-500);
          transition: all 0.2s;
        }

        .unit-btn.active {
          background: var(--color-white);
          color: var(--color-black);
        }

        .helper-text {
          font-size: 0.8rem;
          color: var(--color-gray-600);
        }

        .input-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .input-row-compact {
          display: flex;
          gap: 1rem;
        }

        .input-with-suffix {
          position: relative;
          flex: 1;
        }

        .input-with-suffix input {
          width: 100%;
          padding-right: 2.5rem;
        }

        .suffix {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-500);
          font-size: 0.875rem;
        }

        input, select {
          padding: 0.875rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.03);
          color: var(--color-white);
        }

        input:focus, select:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        input.error, select.error {
          border-color: var(--color-error);
        }

        input::placeholder {
          color: var(--color-gray-600);
        }

        .error-text {
          color: var(--color-error);
          font-size: 0.8rem;
        }

        .input-with-prefix {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
        }

        .input-with-prefix:focus-within {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .input-prefix {
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-gray-500);
          font-weight: 500;
        }

        .input-with-prefix input {
          border: none;
          flex: 1;
          background: transparent;
        }

        .input-with-prefix input:focus {
          box-shadow: none;
        }

        .option-grid {
          display: grid;
          gap: 0.75rem;
        }

        .option-grid.cols-4 {
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        }

        .option-btn {
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          color: var(--color-gray-400);
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .option-btn.selected {
          background: var(--color-white);
          border-color: var(--color-white);
          color: var(--color-black);
        }

        .goal-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .goal-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s;
        }

        .goal-card:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-2px);
        }

        .goal-card.selected {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-white);
        }

        .goal-emoji {
          font-size: 2.5rem;
        }

        .goal-label {
          font-weight: 600;
          color: var(--color-white);
        }

        .goal-desc {
          font-size: 0.8rem;
          color: var(--color-gray-500);
        }

        .diet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 0.75rem;
        }

        .diet-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          cursor: pointer;
          color: var(--color-gray-400);
          transition: all 0.2s;
        }

        .diet-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .diet-card.selected {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-white);
          color: var(--color-white);
        }

        .diet-emoji {
          font-size: 1.75rem;
        }

        .chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .chip {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          color: var(--color-gray-400);
          cursor: pointer;
          transition: all 0.2s;
        }

        .chip:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .chip.selected {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-white);
          color: var(--color-white);
        }

        .chip.warning.selected {
          background: rgba(239, 68, 68, 0.15);
          border-color: var(--color-error);
          color: var(--color-error);
        }

        .chip.none-option.selected {
          background: rgba(34, 197, 94, 0.15);
          border-color: var(--color-success);
          color: var(--color-success);
        }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.75rem;
        }

        .activity-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }

        .activity-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .activity-card.selected {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-white);
        }

        .activity-emoji {
          font-size: 1.5rem;
        }

        .activity-label {
          font-weight: 600;
          color: var(--color-white);
          font-size: 0.875rem;
        }

        .activity-desc {
          font-size: 0.7rem;
          color: var(--color-gray-500);
          text-align: center;
        }

        .cuisine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(95px, 1fr));
          gap: 0.75rem;
        }

        .cuisine-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--color-gray-400);
          transition: all 0.2s;
        }

        .cuisine-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .cuisine-card.selected {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-white);
          color: var(--color-white);
        }

        .cuisine-emoji {
          font-size: 1.5rem;
        }

        .info-box {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--color-gray-600);
        }

        .info-box.success {
          border-left-color: var(--color-success);
        }

        .info-icon {
          color: var(--color-gray-500);
          flex-shrink: 0;
        }

        .info-box.success .info-icon {
          color: var(--color-success);
        }

        .info-box strong {
          display: block;
          margin-bottom: 0.25rem;
          color: var(--color-white);
          font-size: 0.9rem;
        }

        .info-box p {
          font-size: 0.85rem;
          color: var(--color-gray-500);
          margin: 0;
        }

        .onboarding-footer {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.02);
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: var(--radius-full);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn.back {
          background: transparent;
          color: var(--color-gray-500);
        }

        .nav-btn.back:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-white);
        }

        .nav-btn.next {
          background: var(--color-white);
          color: var(--color-black);
        }

        .nav-btn.next:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
        }

        .nav-btn svg {
          font-size: 1.25rem;
        }

        @media (max-width: 500px) {
          .goal-grid {
            grid-template-columns: 1fr;
          }
          
          .onboarding-container {
            border-radius: var(--radius-xl);
          }
          
          .step-wrapper {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
