import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './components/Home'
import Sidebar from './components/Sidebar'

import ToDo from './components/ToDo'
import Account from './components/Account'
import Settings from './components/Settings'

function App() {
  useEffect(() => {
    //read styling from localStorage
    const bgColour = localStorage.getItem('bgColour') || '#000000';
    const bgImage = localStorage.getItem('bgImage') || '';
    const navColour = localStorage.getItem('navColour') || '#1a1a1a';
    const textColour = localStorage.getItem('textColour') || '#ffffff';
    const fontFamily = localStorage.getItem('fontFamily') || 'system-ui, sans-serif';
    const fontSize = localStorage.getItem('fontSize') || '16px';

    //apply styles to the document
    document.documentElement.style.setProperty('--bg-color', bgColour);
    document.documentElement.style.setProperty('--bg-image', bgImage ? `url(${bgImage})` : 'none');
    document.documentElement.style.setProperty('--nav-color', navColour);
    document.documentElement.style.setProperty('--text-color', textColour);
    document.documentElement.style.setProperty('--font-family', fontFamily);
    document.documentElement.style.setProperty('--font-size', fontSize);

    // handle icon colour contrast if you want
    const getContrastYIQ = (hexcolour) => {
      hexcolour = hexcolour.replace('#', '');
      const r = parseInt(hexcolour.substr(0,2),16);
      const g = parseInt(hexcolour.substr(2,2),16);
      const b = parseInt(hexcolour.substr(4,2),16);
      const yiq = (r*299 + g*587 + b*114) / 1000;
      return yiq >= 128 ? 'black' : 'white';
    };
    const iconColour = getContrastYIQ(navColour);
    document.documentElement.style.setProperty('--icon-color', iconColour);

  }, []); 

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
