import { useEffect, useRef, useState } from 'react'
import { AiOutlineBell, AiOutlineDown } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { clearAllSessionData } from '../../utils/clearSessionData.ts'
import { getUser } from '../../utils/authStorage.ts'

function getInitials(userId: string) {
  return userId.slice(0, 2).toUpperCase()
}

export default function HomeHeader() {
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const user = getUser()
  const displayName = user?.userId ?? 'Guest'

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function handleLogout() {
    clearAllSessionData()
    setIsOpen(false)
    navigate('/login')
  }

  return (
    <header className="home-header">
      <div className="home-header__actions">
        <button
          type="button"
          className="home-header__notification-btn"
          aria-label="Notifications"
        >
          <AiOutlineBell className="home-header__notification-icon" aria-hidden="true" />
        </button>

        <div className="home-header__profile-menu" ref={menuRef}>
        <button
          type="button"
          className="home-header__profile-trigger"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="home-header__avatar" aria-hidden="true">
            {getInitials(displayName)}
          </span>
          <span className="home-header__name">{displayName}</span>
          <AiOutlineDown
            className={`home-header__chevron${isOpen ? ' home-header__chevron--open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="home-header__dropdown" role="menu">
            <button
              type="button"
              className="home-header__dropdown-item"
              role="menuitem"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
        </div>
      </div>
    </header>
  )
}
