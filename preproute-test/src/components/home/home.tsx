import { NavLink, Route, Routes } from 'react-router-dom'
import { AiFillEdit, AiOutlineFileSearch, AiOutlineRise } from 'react-icons/ai'
import TestCreation from '../test-creation/testCreation.tsx'
import TestTracking from '../test-tracking/testTracking.tsx'
import HomeHeader from './HomeHeader.tsx'
import './home.css'
import preprouteLogo from '../../assets/Preproute logo.png'

const navItems = [
  { to: '/home', label: 'Dashboard', end: true, Icon: AiOutlineRise },
  { to: '/home/test-creation', label: 'Test Creation', end: false, Icon: AiFillEdit },
  { to: '/home/test-tracking', label: 'Test Tracking', end: false, Icon: AiOutlineFileSearch },
] as const

export default function Home() {
  return (
    <div className="home-layout">
      <aside className="home-sidebar">
        {/* <p className="home-sidebar__brand">PrepRoute</p> */}
        <img
            src={preprouteLogo}
            alt="PrepRoute"
            className="login__logo"
          />
        <nav className="home-sidebar__nav" aria-label="Main navigation">
          {navItems.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `home-sidebar__link${isActive ? ' home-sidebar__link--active' : ''}`
              }
            >
              <Icon className="home-sidebar__icon" />
              <span className="home-sidebar__label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="home-content">
        <HomeHeader />
        <main className="home-main">
        <Routes>
          <Route
            index
            element={
              <div className="home__page">
                <h1 className="home__page-title">Dashboard</h1>
                <p className="home__page-description">Welcome to PrepRoute.</p>
              </div>
            }
          />
          <Route path="test-creation" element={<TestCreation />} />
          <Route path="test-tracking" element={<TestTracking />} />
        </Routes>
        </main>
      </div>
    </div>
  )
}
