import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
  EmojiEvents,
  TrendingUp,
  TrendingDown,
  Remove,
  LocalFireDepartment,
  PersonAdd,
  Search,
  Close,
} from '@mui/icons-material';

// Sample leaderboard data
const leaderboardData = [
  { id: '1', name: 'Emma Wilson', avatar: '👩‍🦰', streak: 45, adherence: 98, points: 2450, rank: 1, change: 0 },
  { id: '2', name: 'James Chen', avatar: '👨', streak: 38, adherence: 95, points: 2280, rank: 2, change: 1 },
  { id: '3', name: 'Sofia Rodriguez', avatar: '👩', streak: 42, adherence: 92, points: 2150, rank: 3, change: -1 },
  { id: '4', name: 'You', avatar: '🙂', streak: 18, adherence: 88, points: 1820, rank: 4, change: 2, isCurrentUser: true },
  { id: '5', name: 'Alex Thompson', avatar: '🧔', streak: 28, adherence: 85, points: 1650, rank: 5, change: -1 },
  { id: '6', name: 'Priya Patel', avatar: '👩‍🦱', streak: 22, adherence: 82, points: 1480, rank: 6, change: 0 },
  { id: '7', name: 'Marcus Johnson', avatar: '👨‍🦱', streak: 15, adherence: 80, points: 1320, rank: 7, change: 3 },
  { id: '8', name: 'Lisa Wang', avatar: '👧', streak: 19, adherence: 78, points: 1200, rank: 8, change: -2 },
  { id: '9', name: 'David Kim', avatar: '👨‍🦰', streak: 12, adherence: 75, points: 980, rank: 9, change: 0 },
  { id: '10', name: 'Sarah Miller', avatar: '👱‍♀️', streak: 8, adherence: 72, points: 850, rank: 10, change: 1 },
];

const tabs = ['All Time', 'This Month', 'This Week', 'Friends'];

export default function Leaderboard() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('This Month');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserRank = leaderboardData.find((u) => u.isCurrentUser);

  const filteredData = searchQuery
    ? leaderboardData.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : leaderboardData;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="change-icon up" />;
    if (change < 0) return <TrendingDown className="change-icon down" />;
    return <Remove className="change-icon same" />;
  };

  return (
    <motion.div
      className="leaderboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header">
        <div>
          <h1>Leaderboard</h1>
          <p>Compete with friends and stay motivated</p>
        </div>
        <button className="invite-btn">
          <PersonAdd />
          <span>Invite Friends</span>
        </button>
      </header>

      {/* Current User Rank Card */}
      {currentUserRank && (
        <motion.div
          className="rank-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rank-badge">
            <span className="rank-number">#{currentUserRank.rank}</span>
            <span className="rank-label">Your Rank</span>
          </div>
          <div className="rank-stats">
            <div className="stat-item">
              <LocalFireDepartment className="stat-icon fire" />
              <div>
                <span className="stat-value">{currentUserRank.streak}</span>
                <span className="stat-label">day streak</span>
              </div>
            </div>
            <div className="stat-item">
              <EmojiEvents className="stat-icon trophy" />
              <div>
                <span className="stat-value">{currentUserRank.points.toLocaleString()}</span>
                <span className="stat-label">points</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-value">{currentUserRank.adherence}%</span>
              <span className="stat-label">adherence</span>
            </div>
          </div>
          <div className="rank-change">
            {getChangeIcon(currentUserRank.change)}
            <span>
              {currentUserRank.change > 0
                ? `Up ${currentUserRank.change} from last week`
                : currentUserRank.change < 0
                ? `Down ${Math.abs(currentUserRank.change)} from last week`
                : 'Same as last week'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              <Close />
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="podium">
        {leaderboardData.slice(0, 3).map((user, index) => {
          const positions = [1, 0, 2]; // Order: 2nd, 1st, 3rd
          const displayIndex = positions[index];
          const displayUser = leaderboardData[displayIndex];
          return (
            <motion.div
              key={displayUser.id}
              className={`podium-item rank-${displayUser.rank}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="podium-avatar">{displayUser.avatar}</div>
              <span className="podium-name">{displayUser.name}</span>
              <span className="podium-points">{displayUser.points.toLocaleString()} pts</span>
              <div className="podium-base">
                <span className="podium-rank">{getRankIcon(displayUser.rank)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        {filteredData.slice(3).map((user, index) => (
          <motion.div
            key={user.id}
            className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="item-rank">
              <span className="rank-num">{user.rank}</span>
              {getChangeIcon(user.change)}
            </div>
            <div className="item-avatar">{user.avatar}</div>
            <div className="item-info">
              <span className="item-name">{user.name}</span>
              <div className="item-stats">
                <span>
                  <LocalFireDepartment className="mini-icon" />
                  {user.streak} days
                </span>
                <span>{user.adherence}% adherence</span>
              </div>
            </div>
            <div className="item-points">
              <span className="points-value">{user.points.toLocaleString()}</span>
              <span className="points-label">points</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How Points Work */}
      <div className="points-info">
        <h3>How Points Work</h3>
        <div className="points-grid">
          <div className="points-item">
            <span className="points-emoji">✅</span>
            <span className="points-action">Complete a meal</span>
            <span className="points-amount">+10 pts</span>
          </div>
          <div className="points-item">
            <span className="points-emoji">🔥</span>
            <span className="points-action">Daily streak bonus</span>
            <span className="points-amount">+5 pts/day</span>
          </div>
          <div className="points-item">
            <span className="points-emoji">💧</span>
            <span className="points-action">Hydration goal</span>
            <span className="points-amount">+15 pts</span>
          </div>
          <div className="points-item">
            <span className="points-emoji">⭐</span>
            <span className="points-action">Perfect day</span>
            <span className="points-amount">+50 pts</span>
          </div>
        </div>
      </div>

      <style>{`
        .leaderboard-page {
          max-width: 900px;
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

        .invite-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--color-secondary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .invite-btn:hover {
          background: var(--color-secondary-dark);
        }

        .rank-card {
          background: linear-gradient(135deg, #FF6B35 0%, #FF8F66 100%);
          color: white;
          border-radius: var(--radius-xl);
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .rank-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-right: 2rem;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
        }

        .rank-number {
          font-size: 2.5rem;
          font-weight: 800;
        }

        .rank-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .rank-stats {
          display: flex;
          gap: 2rem;
          flex: 1;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-icon {
          font-size: 1.5rem !important;
        }

        .stat-icon.fire {
          color: #FFD166;
        }

        .stat-icon.trophy {
          color: #FFD166;
        }

        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          opacity: 0.85;
        }

        .rank-change {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-full);
          font-size: 0.9rem;
        }

        .change-icon {
          font-size: 1rem !important;
        }

        .change-icon.up {
          color: #7AE582;
        }

        .change-icon.down {
          color: #FFD166;
        }

        .tabs-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tabs {
          display: flex;
          background: white;
          border-radius: var(--radius-full);
          padding: 0.25rem;
          box-shadow: var(--shadow-sm);
        }

        .tab {
          padding: 0.625rem 1.25rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: var(--color-primary);
          color: white;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-full);
          padding: 0 1rem;
          width: 250px;
        }

        .search-box:focus-within {
          border-color: var(--color-primary);
        }

        .search-icon {
          color: #999;
          margin-right: 0.5rem;
        }

        .search-box input {
          flex: 1;
          border: none;
          padding: 0.625rem 0;
          font-size: 0.9rem;
          background: transparent;
        }

        .search-box input:focus {
          outline: none;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 0;
          display: flex;
        }

        .podium {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
        }

        .podium-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .podium-item.rank-1 .podium-base {
          height: 100px;
          background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
        }

        .podium-item.rank-2 .podium-base {
          height: 70px;
          background: linear-gradient(180deg, #C0C0C0 0%, #A8A8A8 100%);
        }

        .podium-item.rank-3 .podium-base {
          height: 50px;
          background: linear-gradient(180deg, #CD7F32 0%, #A0522D 100%);
        }

        .podium-avatar {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .podium-name {
          font-weight: 600;
          color: var(--color-secondary);
          margin-bottom: 0.25rem;
        }

        .podium-points {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .podium-base {
          width: 100px;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .podium-rank {
          font-size: 2rem;
        }

        .leaderboard-list {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s;
        }

        .leaderboard-item:hover {
          background: #fafafa;
        }

        .leaderboard-item:last-child {
          border-bottom: none;
        }

        .leaderboard-item.current-user {
          background: rgba(255, 107, 53, 0.08);
        }

        .item-rank {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 60px;
        }

        .rank-num {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        .item-rank .change-icon {
          font-size: 1rem !important;
        }

        .item-rank .change-icon.up {
          color: var(--color-success);
        }

        .item-rank .change-icon.down {
          color: var(--color-error);
        }

        .item-rank .change-icon.same {
          color: #ccc;
        }

        .item-avatar {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          background: #f5f5f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          display: block;
          font-weight: 600;
          color: var(--color-secondary);
          margin-bottom: 0.25rem;
        }

        .item-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #888;
        }

        .item-stats span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .mini-icon {
          font-size: 1rem !important;
          color: var(--color-warning);
        }

        .item-points {
          text-align: right;
        }

        .points-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .points-label {
          font-size: 0.8rem;
          color: #888;
        }

        .points-info {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .points-info h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .points-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .points-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #fafafa;
          border-radius: var(--radius-md);
        }

        .points-emoji {
          font-size: 1.5rem;
        }

        .points-action {
          flex: 1;
          font-size: 0.9rem;
          color: #555;
        }

        .points-amount {
          font-weight: 600;
          color: var(--color-success);
        }
      `}</style>
    </motion.div>
  );
}


