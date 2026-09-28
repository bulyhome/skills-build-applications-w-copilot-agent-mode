import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

function App() {
  const navigation = [
    { label: 'Overview', to: '/', icon: 'O', end: true },
    { label: 'Activities', to: '/activities', icon: 'A' },
    { label: 'Leaderboard', to: '/leaderboard', icon: 'L' },
    { label: 'Teams', to: '/teams', icon: 'T' },
    { label: 'Users', to: '/users', icon: 'U' },
    { label: 'Workouts', to: '/workouts', icon: 'W' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="OctoFit Tracker home">
          <span className="brand-mark">O</span>
          <span>octofit<span className="brand-light"> / tracker</span></span>
        </NavLink>
        <div className="sidebar-label">Workspace</div>
        <nav className="nav flex-column" aria-label="Main navigation">
          {navigation.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Tracker workspace</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <span>FITNESS OPERATIONS</span>
          <div className="topbar-user"><span className="avatar">OF</span> OctoFit</div>
        </header>
        <Routes>
          <Route path="/" element={<Overview navigation={navigation.slice(1)} />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function Overview({ navigation }) {
  return (
    <section className="page-content overview-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR TRAINING DESK</p>
        <h1>Keep your team moving.</h1>
        <p className="page-subtitle">Activity, community, and progress in one place.</p>
      </div>
      <div className="overview-band">
        <div>
          <p className="eyebrow">OCTOFIT TRACKER</p>
          <h2>Progress is a team sport.</h2>
          <p>Check in on the people, sessions, and goals that keep your crew moving.</p>
        </div>
        <div className="band-mark" aria-hidden="true">OF</div>
      </div>
      <div className="section-heading">
        <h2>Workspace</h2>
        <span>Browse tracker data</span>
      </div>
      <div className="row g-3 workspace-links">
        {navigation.map(({ label, to, icon }) => (
          <div className="col-12 col-sm-6 col-xl-4" key={to}>
            <NavLink to={to} className="workspace-link">
              <span className="workspace-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              <span className="link-arrow" aria-hidden="true">&gt;</span>
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  )
}

export default App
