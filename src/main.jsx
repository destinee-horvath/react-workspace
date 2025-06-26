import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import Schedule from './components/Schedule';
import Grades from './components/Grades';
import Settings from './components/Settings';
import Timer from './components/Timer';
import ToDo from './components/ToDo';
import Account from './components/Account';
import './App.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="todo" element={<ToDo />} />
        <Route path="grades" element={<Grades />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="timer" element={<Timer />} />
        <Route path="account" element={<Account />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </Router>
);