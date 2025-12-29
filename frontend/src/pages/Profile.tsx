import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
  Person,
  Edit,
  Save,
  LocalFireDepartment,
  EmojiEvents,
  Restaurant,
  FitnessCenter,
  Favorite,
  AttachMoney,
  Public,
  Notifications,
  DarkMode,
  Language,
} from '@mui/icons-material';

export default function Profile() {
  const { user, updateUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) return null;

  const handleSave = () => {
    if (editedUser) {
      updateUser(editedUser);
    }
    setIsEditing(false);
  };

  const stats = [
    { label: 'Current Streak', value: user.currentStreak, icon: LocalFireDepartment, color: '#FF6B35' },
    { label: 'Longest Streak', value: user.longestStreak || 45, icon: EmojiEvents, color: '#F9A826' },
    { label: 'Days Tracked', value: user.totalDaysTracked || 128, icon: Restaurant, color: '#25A18E' },
    { label: 'Recipes Tried', value: 47, icon: FitnessCenter, color: '#004E64' },
  ];

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header">
        <h1>Profile</h1>
        <button
          className={`edit-btn ${isEditing ? 'saving' : ''}`}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? <Save /> : <Edit />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </header>

      {/* Profile Card */}
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-header">
          <div className="avatar">
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-info">
            {isEditing ? (
              <input
                type="text"
                className="name-input"
                value={editedUser?.name || ''}
                onChange={(e) =>
                  setEditedUser((prev) => prev && { ...prev, name: e.target.value })
                }
              />
            ) : (
              <h2>{user.name}</h2>
            )}
            <p>Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="stat-card">
                <Icon className="stat-icon" style={{ color: stat.color }} />
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="details-grid">
        {/* Personal Info */}
        <motion.div
          className="detail-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <Person className="card-icon" />
            <h3>Personal Information</h3>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="info-label">Age</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedUser?.age || 0}
                  onChange={(e) =>
                    setEditedUser((prev) => prev && { ...prev, age: parseInt(e.target.value) })
                  }
                />
              ) : (
                <span className="info-value">{user.age} years</span>
              )}
            </div>
            <div className="info-row">
              <span className="info-label">Gender</span>
              <span className="info-value">{user.gender}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Height</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedUser?.height || 0}
                  onChange={(e) =>
                    setEditedUser((prev) => prev && { ...prev, height: parseInt(e.target.value) })
                  }
                />
              ) : (
                <span className="info-value">{user.height} cm</span>
              )}
            </div>
            <div className="info-row">
              <span className="info-label">Weight</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedUser?.weight || 0}
                  onChange={(e) =>
                    setEditedUser((prev) => prev && { ...prev, weight: parseInt(e.target.value) })
                  }
                />
              ) : (
                <span className="info-value">{user.weight} kg</span>
              )}
            </div>
            <div className="info-row">
              <span className="info-label">Activity Level</span>
              <span className="info-value">{user.activityLevel}</span>
            </div>
          </div>
        </motion.div>

        {/* Goals & Targets */}
        <motion.div
          className="detail-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <FitnessCenter className="card-icon" />
            <h3>Goals & Targets</h3>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="info-label">Goal</span>
              <span className="info-value badge">{user.goal.replace('_', ' ')}</span>
            </div>
            {user.targetWeight && (
              <div className="info-row">
                <span className="info-label">Target Weight</span>
                <span className="info-value">{user.targetWeight} kg</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Daily Calories</span>
              <span className="info-value">{user.dailyCalorieTarget} kcal</span>
            </div>
            <div className="info-row">
              <span className="info-label">Protein Target</span>
              <span className="info-value">{user.macroTargets?.protein}g</span>
            </div>
            <div className="info-row">
              <span className="info-label">Carbs Target</span>
              <span className="info-value">{user.macroTargets?.carbs}g</span>
            </div>
            <div className="info-row">
              <span className="info-label">Fat Target</span>
              <span className="info-value">{user.macroTargets?.fat}g</span>
            </div>
          </div>
        </motion.div>

        {/* Diet Preferences */}
        <motion.div
          className="detail-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <Restaurant className="card-icon" />
            <h3>Diet Preferences</h3>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="info-label">Diet Type</span>
              <span className="info-value badge">{user.dietType.replace('_', ' ')}</span>
            </div>
            <div className="info-row vertical">
              <span className="info-label">Restrictions</span>
              <div className="tags">
                {user.restrictions.length > 0 ? (
                  user.restrictions.map((r) => <span key={r} className="tag">{r}</span>)
                ) : (
                  <span className="no-data">None</span>
                )}
              </div>
            </div>
            <div className="info-row vertical">
              <span className="info-label">Allergies</span>
              <div className="tags">
                {user.allergies.length > 0 ? (
                  user.allergies.map((a) => <span key={a} className="tag allergy">{a}</span>)
                ) : (
                  <span className="no-data">None</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Health Conditions */}
        <motion.div
          className="detail-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <Favorite className="card-icon" />
            <h3>Health Conditions</h3>
          </div>
          <div className="card-content">
            <div className="tags">
              {user.healthConditions.length > 0 ? (
                user.healthConditions.map((c) => <span key={c} className="tag health">{c}</span>)
              ) : (
                <span className="no-data">No health conditions specified</span>
              )}
            </div>
            <p className="info-note">
              Your meal recommendations are personalized to support your health conditions.
            </p>
          </div>
        </motion.div>

        {/* Budget & Region */}
        <motion.div
          className="detail-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <AttachMoney className="card-icon" />
            <h3>Budget & Region</h3>
          </div>
          <div className="card-content">
            {user.dailyBudget && (
              <div className="info-row">
                <span className="info-label">Daily Budget</span>
                <span className="info-value">${user.dailyBudget}</span>
              </div>
            )}
            {user.weeklyBudget && (
              <div className="info-row">
                <span className="info-label">Weekly Budget</span>
                <span className="info-value">${user.weeklyBudget}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Region</span>
              <span className="info-value">{user.region}</span>
            </div>
            <div className="info-row vertical">
              <span className="info-label">Preferred Cuisines</span>
              <div className="tags">
                {user.preferredCuisines.map((c) => (
                  <span key={c} className="tag cuisine">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          className="detail-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card-header">
            <Notifications className="card-icon" />
            <h3>Settings</h3>
          </div>
          <div className="card-content">
            <div className="setting-row">
              <div className="setting-info">
                <Notifications className="setting-icon" />
                <div>
                  <span className="setting-label">Notifications</span>
                  <span className="setting-desc">Meal reminders & updates</span>
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <DarkMode className="setting-icon" />
                <div>
                  <span className="setting-label">Dark Mode</span>
                  <span className="setting-desc">Switch to dark theme</span>
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <Language className="setting-icon" />
                <div>
                  <span className="setting-label">Language</span>
                  <span className="setting-desc">English (US)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .profile-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.75rem;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-full);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .edit-btn.saving {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        .profile-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-card);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: 700;
        }

        .profile-info h2 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .profile-info p {
          color: #666;
        }

        .name-input {
          font-size: 1.5rem;
          font-weight: 600;
          font-family: var(--font-display);
          border: 2px solid var(--color-primary);
          border-radius: var(--radius-md);
          padding: 0.5rem 1rem;
          color: var(--color-secondary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: #fafafa;
          border-radius: var(--radius-md);
          text-align: center;
        }

        .stat-icon {
          font-size: 1.5rem !important;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: #888;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .detail-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .card-icon {
          color: var(--color-primary);
        }

        .card-header h3 {
          font-size: 1.1rem;
          font-family: var(--font-body);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-row.vertical {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .info-label {
          color: #888;
          font-size: 0.9rem;
        }

        .info-value {
          font-weight: 500;
          color: var(--color-secondary);
        }

        .info-value.badge {
          padding: 0.25rem 0.75rem;
          background: rgba(255, 107, 53, 0.1);
          color: var(--color-primary);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          text-transform: capitalize;
        }

        .info-row input {
          padding: 0.5rem 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          width: 100px;
          text-align: right;
        }

        .info-row input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.375rem 0.75rem;
          background: #f0f0f0;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
        }

        .tag.allergy {
          background: rgba(239, 71, 111, 0.1);
          color: var(--color-error);
        }

        .tag.health {
          background: rgba(0, 78, 100, 0.1);
          color: var(--color-secondary);
        }

        .tag.cuisine {
          background: rgba(37, 161, 142, 0.1);
          color: var(--color-accent);
        }

        .no-data {
          font-size: 0.9rem;
          color: #999;
          font-style: italic;
        }

        .info-note {
          font-size: 0.85rem;
          color: #666;
          padding: 0.75rem;
          background: rgba(37, 161, 142, 0.08);
          border-radius: var(--radius-md);
          margin-top: 0.5rem;
        }

        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .setting-row:last-child {
          border-bottom: none;
        }

        .setting-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .setting-icon {
          color: #888;
        }

        .setting-label {
          display: block;
          font-weight: 500;
          color: var(--color-secondary);
        }

        .setting-desc {
          display: block;
          font-size: 0.85rem;
          color: #888;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #ddd;
          border-radius: 26px;
          transition: 0.3s;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle input:checked + .toggle-slider {
          background: var(--color-primary);
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }
      `}</style>
    </motion.div>
  );
}


