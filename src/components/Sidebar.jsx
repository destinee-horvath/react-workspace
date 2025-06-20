import { useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './Sidebar.css'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
    <button
        className={`sidebar-toggle ${open ? 'move-right' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
        >
        <FiMenu style={{ color: 'var(--icon-color)' }} />
    </button>


    <div className={`sidebar ${open ? 'open' : ''}`}>
        <h2>Navigation</h2>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/todo">To-Do</Link>
            <Link to="/account">Account</Link>
            <Link to="/settings">Settings</Link>

        </nav>
    </div>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  )
}
