import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Sidebar from './components/Sidebar'

import ToDo from './components/ToDo'
import Account from './components/Account'
import Settings from './components/Settings'

function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<ToDo />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </>
  )
}

export default App
