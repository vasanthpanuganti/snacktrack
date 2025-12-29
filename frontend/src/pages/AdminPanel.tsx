import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dashboard,
  People,
  MenuBook,
  Restaurant,
  TrendingUp,
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Visibility,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

// Sample data
const statsData = {
  totalUsers: 12847,
  activeUsers: 8923,
  totalRecipes: 456,
  mealPlansGenerated: 34521,
  averageAdherence: 87,
};

const recentUsers = [
  { id: '1', name: 'Emma Wilson', email: 'emma@example.com', joined: '2024-12-20', status: 'active' },
  { id: '2', name: 'James Chen', email: 'james@example.com', joined: '2024-12-19', status: 'active' },
  { id: '3', name: 'Sofia Rodriguez', email: 'sofia@example.com', joined: '2024-12-18', status: 'active' },
  { id: '4', name: 'Alex Thompson', email: 'alex@example.com', joined: '2024-12-17', status: 'inactive' },
  { id: '5', name: 'Priya Patel', email: 'priya@example.com', joined: '2024-12-16', status: 'active' },
];

const recipes = [
  { id: '1', name: 'Mediterranean Quinoa Bowl', cuisine: 'Mediterranean', calories: 420, status: 'published', views: 1234 },
  { id: '2', name: 'Grilled Salmon', cuisine: 'American', calories: 520, status: 'published', views: 987 },
  { id: '3', name: 'Chicken Tikka Masala', cuisine: 'Indian', calories: 480, status: 'published', views: 2341 },
  { id: '4', name: 'Thai Green Curry', cuisine: 'Thai', calories: 450, status: 'draft', views: 0 },
  { id: '5', name: 'Greek Salad', cuisine: 'Greek', calories: 280, status: 'published', views: 756 },
];

const tabs = ['Overview', 'Users', 'Recipes', 'Meal Plans', 'Reports'];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');

  const renderOverview = () => (
    <>
      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stat-icon users">
            <People />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.totalUsers.toLocaleString()}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <span className="stat-trend up">+12.5%</span>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon active">
            <TrendingUp />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.activeUsers.toLocaleString()}</span>
            <span className="stat-label">Active Users</span>
          </div>
          <span className="stat-trend up">+8.3%</span>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon recipes">
            <MenuBook />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.totalRecipes}</span>
            <span className="stat-label">Recipes</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon meals">
            <Restaurant />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.mealPlansGenerated.toLocaleString()}</span>
            <span className="stat-label">Meal Plans</span>
          </div>
          <span className="stat-trend up">+23.1%</span>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-header">
            <h3>Recent Users</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.joined}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <h3>Popular Recipes</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="recipe-list">
            {recipes.slice(0, 5).map((recipe, index) => (
              <div key={recipe.id} className="recipe-item">
                <span className="recipe-rank">{index + 1}</span>
                <div className="recipe-info">
                  <span className="recipe-name">{recipe.name}</span>
                  <span className="recipe-meta">{recipe.cuisine} • {recipe.calories} kcal</span>
                </div>
                <span className="recipe-views">
                  <Visibility />
                  {recipe.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <div className="admin-section">
      <div className="section-header">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="section-actions">
          <button className="filter-btn">
            <FilterList />
            <span>Filter</span>
          </button>
          <button className="add-btn">
            <Add />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="data-card">
        <table className="data-table full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.joined}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? <CheckCircle /> : <Warning />}
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" title="View">
                      <Visibility />
                    </button>
                    <button className="action-btn" title="Edit">
                      <Edit />
                    </button>
                    <button className="action-btn delete" title="Delete">
                      <Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRecipes = () => (
    <div className="admin-section">
      <div className="section-header">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="section-actions">
          <button className="filter-btn">
            <FilterList />
            <span>Filter</span>
          </button>
          <button className="add-btn">
            <Add />
            <span>Add Recipe</span>
          </button>
        </div>
      </div>

      <div className="data-card">
        <table className="data-table full">
          <thead>
            <tr>
              <th>Recipe</th>
              <th>Cuisine</th>
              <th>Calories</th>
              <th>Status</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>
                  <span className="recipe-name">{recipe.name}</span>
                </td>
                <td>{recipe.cuisine}</td>
                <td>{recipe.calories} kcal</td>
                <td>
                  <span className={`status-badge ${recipe.status}`}>
                    {recipe.status}
                  </span>
                </td>
                <td>{recipe.views.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" title="View">
                      <Visibility />
                    </button>
                    <button className="action-btn" title="Edit">
                      <Edit />
                    </button>
                    <button className="action-btn delete" title="Delete">
                      <Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recipe Tags Management */}
      <div className="tags-management">
        <h3>Manage Tags</h3>
        <div className="tags-grid">
          <div className="tag-category">
            <h4>Cuisines</h4>
            <div className="tags">
              {['Mediterranean', 'Indian', 'Thai', 'American', 'Japanese', 'Chinese', 'Greek', 'Mexican'].map((t) => (
                <span key={t} className="tag editable">{t}</span>
              ))}
              <button className="add-tag-btn">+ Add</button>
            </div>
          </div>
          <div className="tag-category">
            <h4>Diet Types</h4>
            <div className="tags">
              {['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Low-Calorie', 'High-Protein'].map((t) => (
                <span key={t} className="tag editable">{t}</span>
              ))}
              <button className="add-tag-btn">+ Add</button>
            </div>
          </div>
          <div className="tag-category">
            <h4>Health Conditions</h4>
            <div className="tags">
              {['Diabetes-Friendly', 'Heart-Healthy', 'Low-Sodium', 'PCOS-Friendly'].map((t) => (
                <span key={t} className="tag editable health">{t}</span>
              ))}
              <button className="add-tag-btn">+ Add</button>
            </div>
          </div>
          <div className="tag-category">
            <h4>Allergies</h4>
            <div className="tags">
              {['Nut-Free', 'Dairy-Free', 'Gluten-Free', 'Soy-Free', 'Egg-Free'].map((t) => (
                <span key={t} className="tag editable allergy">{t}</span>
              ))}
              <button className="add-tag-btn">+ Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverview();
      case 'Users':
        return renderUsers();
      case 'Recipes':
        return renderRecipes();
      default:
        return (
          <div className="coming-soon">
            <span className="emoji">🚧</span>
            <h3>{activeTab}</h3>
            <p>This section is under construction</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="admin-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header">
        <div>
          <h1>
            <Dashboard className="header-icon" />
            Admin Panel
          </h1>
          <p>Manage recipes, users, and monitor platform activity</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="admin-content">
        {renderContent()}
      </div>

      <style>{`
        .admin-panel {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .header-icon {
          color: var(--color-primary);
        }

        .page-header p {
          color: #666;
        }

        .admin-tabs {
          display: flex;
          gap: 0.25rem;
          background: white;
          padding: 0.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .admin-tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-tab:hover {
          background: #f5f5f5;
        }

        .admin-tab.active {
          background: var(--color-primary);
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-card);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.users {
          background: linear-gradient(135deg, #004E64 0%, #0A7294 100%);
        }

        .stat-icon.active {
          background: linear-gradient(135deg, #25A18E 0%, #7AE582 100%);
        }

        .stat-icon.recipes {
          background: linear-gradient(135deg, #FF6B35 0%, #FF8F66 100%);
        }

        .stat-icon.meals {
          background: linear-gradient(135deg, #F9A826 0%, #FFD166 100%);
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-secondary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: #888;
        }

        .stat-trend {
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .stat-trend.up {
          background: rgba(37, 161, 142, 0.15);
          color: var(--color-accent);
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
        }

        .overview-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-header h3 {
          font-size: 1.1rem;
          font-family: var(--font-body);
        }

        .view-all-btn {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          border-bottom: 1px solid #eee;
        }

        .data-table td {
          padding: 0.75rem;
          font-size: 0.9rem;
          border-bottom: 1px solid #f5f5f5;
        }

        .data-table.full th, .data-table.full td {
          padding: 1rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge svg {
          font-size: 0.9rem;
        }

        .status-badge.active, .status-badge.published {
          background: rgba(37, 161, 142, 0.15);
          color: var(--color-accent);
        }

        .status-badge.inactive, .status-badge.draft {
          background: rgba(249, 168, 38, 0.15);
          color: #F9A826;
        }

        .recipe-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .recipe-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: #fafafa;
          border-radius: var(--radius-md);
        }

        .recipe-rank {
          width: 24px;
          height: 24px;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .recipe-info {
          flex: 1;
        }

        .recipe-name {
          display: block;
          font-weight: 500;
          color: var(--color-secondary);
        }

        .recipe-meta {
          display: block;
          font-size: 0.8rem;
          color: #888;
        }

        .recipe-views {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: #888;
        }

        .recipe-views svg {
          font-size: 1rem;
        }

        .admin-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-full);
          padding: 0 1rem;
          width: 300px;
        }

        .search-bar:focus-within {
          border-color: var(--color-primary);
        }

        .search-icon {
          color: #999;
          margin-right: 0.5rem;
        }

        .search-bar input {
          flex: 1;
          border: none;
          padding: 0.75rem 0;
          font-size: 0.95rem;
          background: transparent;
        }

        .search-bar input:focus {
          outline: none;
        }

        .section-actions {
          display: flex;
          gap: 0.75rem;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .add-btn {
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

        .add-btn:hover {
          background: var(--color-primary-dark);
        }

        .data-card {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #888;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f5f5f5;
          color: var(--color-secondary);
        }

        .action-btn.delete:hover {
          background: rgba(239, 71, 111, 0.1);
          color: var(--color-error);
        }

        .tags-management {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .tags-management h3 {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .tag-category h4 {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 0.75rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag.editable {
          padding: 0.375rem 0.75rem;
          background: #f5f5f5;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag.editable:hover {
          background: #eee;
        }

        .tag.health {
          background: rgba(0, 78, 100, 0.1);
          color: var(--color-secondary);
        }

        .tag.allergy {
          background: rgba(239, 71, 111, 0.1);
          color: var(--color-error);
        }

        .add-tag-btn {
          padding: 0.375rem 0.75rem;
          background: transparent;
          border: 2px dashed #ddd;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          color: #888;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-tag-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .coming-soon {
          text-align: center;
          padding: 4rem 2rem;
        }

        .coming-soon .emoji {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .coming-soon h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .coming-soon p {
          color: #666;
        }
      `}</style>
    </motion.div>
  );
}


