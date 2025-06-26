import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TimeDisplay from './components/sub-components/TimeDisplay'; 

export default function App() {
  useEffect(() => {
    const bgColour = localStorage.getItem('bgColour') || '#000000';
    const bgImage = localStorage.getItem('bgImage') || '';
    const navColour = localStorage.getItem('navColour') || '#1a1a1a';
    const textColour = localStorage.getItem('textColour') || '#ffffff';
    const fontFamily = localStorage.getItem('fontFamily') || 'system-ui, sans-serif';
    const fontSize = localStorage.getItem('fontSize') || '16px';

    document.documentElement.style.setProperty('--bg-color', bgColour);
    document.documentElement.style.setProperty('--bg-image', bgImage ? `url(${bgImage})` : 'none');
    document.documentElement.style.setProperty('--nav-color', navColour);
    document.documentElement.style.setProperty('--text-color', textColour);
    document.documentElement.style.setProperty('--font-family', fontFamily);
    document.documentElement.style.setProperty('--font-size', fontSize);

    const getContrastYIQ = (hex) => {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? 'black' : 'white';
    };

    const iconColour = getContrastYIQ(navColour);
    document.documentElement.style.setProperty('--icon-color', iconColour);

    const inputBgColour = iconColour === 'black' ? '#fff' : '#000';
    document.documentElement.style.setProperty('--input-bg-color', inputBgColour);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <TimeDisplay />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}
