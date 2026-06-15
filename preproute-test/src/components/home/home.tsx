import { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import {
  AiFillEdit,
  AiOutlineFileSearch,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineRise,
} from 'react-icons/ai'
import AddQuestions from '../test-creation/addQuestions.tsx'
import TestCreation from '../test-creation/testCreation.tsx'
import TestTracking from '../test-tracking/testTracking.tsx'
import Dashboard from './Dashboard.tsx'
import HomeHeader from './HomeHeader.tsx'
import './home.css'
import preprouteLogo from '../../assets/Preproute logo.png'

const navItems = [
  { to: '/home', label: 'Dashboard', end: true, Icon: AiOutlineRise },
  { to: '/home/test-creation', label: 'Test Creation', end: false, Icon: AiFillEdit },
  { to: '/home/test-tracking', label: 'Test Tracking', end: false, Icon: AiOutlineFileSearch },
] as const

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="home-layout">
      <aside
        className={`home-sidebar${isSidebarCollapsed ? ' home-sidebar--collapsed' : ''}`}
      >
        <img
          src={preprouteLogo}
          alt="PrepRoute"
          className="home-sidebar__logo"
        />

        <nav className="home-sidebar__nav" aria-label="Main navigation">
          {navItems.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={isSidebarCollapsed ? label : undefined}
              className={({ isActive }) =>
                `home-sidebar__link${isActive ? ' home-sidebar__link--active' : ''}`
              }
            >
              <Icon className="home-sidebar__icon" aria-hidden="true" />
              <span className="home-sidebar__label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="home-sidebar__toggle"
          onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isSidebarCollapsed}
        >
          {isSidebarCollapsed ? (
            <AiOutlineMenuUnfold className="home-sidebar__toggle-icon" aria-hidden="true" />
          ) : (
            <AiOutlineMenuFold className="home-sidebar__toggle-icon" aria-hidden="true" />
          )}
          <span className="home-sidebar__toggle-label">
            {isSidebarCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </button>
      </aside>

      <div className="home-content">
        <HomeHeader />
        <main className="home-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="test-creation" element={<TestCreation />} />
          <Route path="test-creation/questions" element={<AddQuestions />} />
          <Route path="test-tracking" element={<TestTracking />} />
        </Routes>
        </main>
      </div>
    </div>
  )
}
