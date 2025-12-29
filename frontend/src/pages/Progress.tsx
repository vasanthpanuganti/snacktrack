import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
  TrendingUp,
  TrendingDown,
  LocalFireDepartment,
  FitnessCenter,
  Restaurant,
  EmojiEvents,
  CalendarMonth,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample data
const weightData = [
  { date: 'Week 1', weight: 75 },
  { date: 'Week 2', weight: 74.5 },
  { date: 'Week 3', weight: 74.2 },
  { date: 'Week 4', weight: 73.8 },
  { date: 'Week 5', weight: 73.5 },
  { date: 'Week 6', weight: 73.2 },
  { date: 'Week 7', weight: 72.8 },
  { date: 'Week 8', weight: 72.5 },
];

const calorieData = [
  { day: 'Mon', consumed: 1850, target: 2000 },
  { day: 'Tue', consumed: 1920, target: 2000 },
  { day: 'Wed', consumed: 2100, target: 2000 },
  { day: 'Thu', consumed: 1780, target: 2000 },
  { day: 'Fri', consumed: 1950, target: 2000 },
  { day: 'Sat', consumed: 2200, target: 2000 },
  { day: 'Sun', consumed: 1900, target: 2000 },
];

const macroDistribution = [
  { name: 'Protein', value: 30, color: '#FF6B35' },
  { name: 'Carbs', value: 45, color: '#25A18E' },
  { name: 'Fat', value: 25, color: '#004E64' },
];

const adherenceData = [
  { week: 'W1', adherence: 85 },
  { week: 'W2', adherence: 90 },
  { week: 'W3', adherence: 78 },
  { week: 'W4', adherence: 92 },
  { week: 'W5', adherence: 88 },
  { week: 'W6', adherence: 95 },
  { week: 'W7', adherence: 91 },
  { week: 'W8', adherence: 94 },
];

const achievements = [
  { id: '1', title: 'First Week', icon: '🌟', unlocked: true },
  { id: '2', title: '7-Day Streak', icon: '🔥', unlocked: true },
  { id: '3', title: 'Protein Pro', icon: '💪', unlocked: true },
  { id: '4', title: 'Hydration Hero', icon: '💧', unlocked: true },
  { id: '5', title: '30-Day Streak', icon: '🏆', unlocked: false, progress: 18 },
  { id: '6', title: 'Recipe Master', icon: '👨‍🍳', unlocked: false, progress: 7, target: 20 },
];

export default function Progress() {
  const { user } = useStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months'>('month');

  const startWeight = weightData[0].weight;
  const currentWeight = weightData[weightData.length - 1].weight;
  const weightChange = currentWeight - startWeight;
  const targetWeight = user?.targetWeight || 70;
  const progressToGoal = Math.min(100, ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100);

  const avgCalories = Math.round(calorieData.reduce((sum, d) => sum + d.consumed, 0) / calorieData.length);
  const avgAdherence = Math.round(adherenceData.reduce((sum, d) => sum + d.adherence, 0) / adherenceData.length);

  return (
    <motion.div
      className="progress-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header">
        <div>
          <h1>Your Progress</h1>
          <p>Track your journey to a healthier you</p>
        </div>
        <div className="time-range-selector">
          {(['week', 'month', '3months'] as const).map((range) => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'week' ? 'Week' : range === 'month' ? 'Month' : '3 Months'}
            </button>
          ))}
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid">
        <motion.div
          className="summary-card weight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-icon">
            <FitnessCenter />
          </div>
          <div className="card-content">
            <span className="card-label">Current Weight</span>
            <span className="card-value">{currentWeight} kg</span>
            <span className={`card-change ${weightChange < 0 ? 'positive' : 'negative'}`}>
              {weightChange < 0 ? <TrendingDown /> : <TrendingUp />}
              {Math.abs(weightChange).toFixed(1)} kg
            </span>
          </div>
        </motion.div>

        <motion.div
          className="summary-card calories"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-icon">
            <LocalFireDepartment />
          </div>
          <div className="card-content">
            <span className="card-label">Avg. Calories</span>
            <span className="card-value">{avgCalories}</span>
            <span className="card-subtext">kcal / day</span>
          </div>
        </motion.div>

        <motion.div
          className="summary-card adherence"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-icon">
            <Restaurant />
          </div>
          <div className="card-content">
            <span className="card-label">Diet Adherence</span>
            <span className="card-value">{avgAdherence}%</span>
            <span className="card-subtext">this month</span>
          </div>
        </motion.div>

        <motion.div
          className="summary-card streak"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-icon fire">
            <LocalFireDepartment />
          </div>
          <div className="card-content">
            <span className="card-label">Current Streak</span>
            <span className="card-value">{user?.currentStreak || 18}</span>
            <span className="card-subtext">days</span>
          </div>
        </motion.div>
      </div>

      {/* Goal Progress */}
      <motion.div
        className="goal-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3>Goal Progress</h3>
        <div className="goal-content">
          <div className="goal-stats">
            <div className="stat-item">
              <span className="stat-label">Starting</span>
              <span className="stat-value">{startWeight} kg</span>
            </div>
            <div className="stat-item current">
              <span className="stat-label">Current</span>
              <span className="stat-value">{currentWeight} kg</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Target</span>
              <span className="stat-value">{targetWeight} kg</span>
            </div>
          </div>
          <div className="goal-bar-container">
            <div className="goal-bar">
              <div
                className="goal-progress"
                style={{ width: `${Math.max(0, progressToGoal)}%` }}
              />
              <div
                className="goal-marker"
                style={{ left: `${Math.max(0, progressToGoal)}%` }}
              />
            </div>
            <span className="goal-percentage">{Math.round(progressToGoal)}% to goal</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Weight Chart */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Weight Trend</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  fill="url(#weightGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Calorie Chart */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Daily Calories</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="consumed" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="target" stroke="#004E64" strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Macro Distribution */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Macro Distribution</h3>
          <div className="chart-container macro-chart">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroDistribution}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {macroDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="macro-legend">
              {macroDistribution.map((macro) => (
                <div key={macro.name} className="legend-item">
                  <span className="legend-color" style={{ background: macro.color }} />
                  <span className="legend-label">{macro.name}</span>
                  <span className="legend-value">{macro.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Adherence Chart */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Weekly Adherence</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="adherence"
                  stroke="#25A18E"
                  strokeWidth={3}
                  dot={{ fill: '#25A18E', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        className="achievements-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="card-header">
          <h3>
            <EmojiEvents className="header-icon" />
            Achievements
          </h3>
          <span className="achievement-count">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length}
          </span>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <span className="achievement-title">{achievement.title}</span>
              {!achievement.unlocked && achievement.progress !== undefined && (
                <div className="achievement-progress">
                  <div
                    className="progress-fill"
                    style={{ width: `${(achievement.progress / (achievement.target || 30)) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .progress-page {
          max-width: 1200px;
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

        .time-range-selector {
          display: flex;
          background: white;
          border-radius: var(--radius-full);
          padding: 0.25rem;
          box-shadow: var(--shadow-sm);
        }

        .range-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .range-btn.active {
          background: var(--color-primary);
          color: white;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .summary-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-card);
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .summary-card.weight .card-icon {
          background: linear-gradient(135deg, #004E64 0%, #0A7294 100%);
        }

        .summary-card.calories .card-icon {
          background: linear-gradient(135deg, #FF6B35 0%, #FF8F66 100%);
        }

        .summary-card.adherence .card-icon {
          background: linear-gradient(135deg, #25A18E 0%, #7AE582 100%);
        }

        .summary-card.streak .card-icon.fire {
          background: linear-gradient(135deg, #F9A826 0%, #FFD166 100%);
        }

        .card-content {
          display: flex;
          flex-direction: column;
        }

        .card-label {
          font-size: 0.85rem;
          color: #888;
        }

        .card-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        .card-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .card-change.positive {
          color: var(--color-success);
        }

        .card-change.negative {
          color: var(--color-error);
        }

        .card-change svg {
          font-size: 1rem;
        }

        .card-subtext {
          font-size: 0.85rem;
          color: #888;
        }

        .goal-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .goal-card h3 {
          font-size: 1.1rem;
          margin-bottom: 1.25rem;
        }

        .goal-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-item.current {
          color: var(--color-primary);
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .goal-bar-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .goal-bar {
          flex: 1;
          height: 12px;
          background: #f0f0f0;
          border-radius: var(--radius-full);
          position: relative;
          overflow: visible;
        }

        .goal-progress {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
          border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }

        .goal-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: var(--color-accent);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: var(--shadow-md);
        }

        .goal-percentage {
          font-weight: 600;
          color: var(--color-secondary);
          white-space: nowrap;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 900px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .chart-card h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .chart-container {
          width: 100%;
        }

        .macro-chart {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .macro-legend {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-label {
          font-size: 0.9rem;
          color: #666;
        }

        .legend-value {
          font-weight: 600;
          color: var(--color-secondary);
        }

        .achievements-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .card-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }

        .header-icon {
          color: #F9A826;
        }

        .achievement-count {
          font-size: 0.9rem;
          color: #666;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .achievement-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem;
          background: #fafafa;
          border-radius: var(--radius-md);
          text-align: center;
          transition: all 0.2s;
        }

        .achievement-item.unlocked {
          background: linear-gradient(135deg, rgba(249, 168, 38, 0.1) 0%, rgba(255, 209, 102, 0.1) 100%);
          border: 2px solid rgba(249, 168, 38, 0.3);
        }

        .achievement-item.locked {
          opacity: 0.6;
        }

        .achievement-icon {
          font-size: 2rem;
        }

        .achievement-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-secondary);
        }

        .achievement-progress {
          width: 100%;
          height: 4px;
          background: #ddd;
          border-radius: 2px;
          overflow: hidden;
        }

        .achievement-progress .progress-fill {
          height: 100%;
          background: var(--color-primary);
        }
      `}</style>
    </motion.div>
  );
}


