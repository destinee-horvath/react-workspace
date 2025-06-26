import { useState, useEffect } from 'react';

export default function TimeDisplay() {
  const [time, setTime] = useState(new Date());
  const getFontSize = () => getComputedStyle(document.documentElement).getPropertyValue('--font-size') || '10px';

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000); // update every second
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '90%',
      transform: 'translateX(-50%)',
      color: 'var(--text-color)',
      fontFamily: 'var(--font-family)',
      fontSize: (parseInt(getFontSize()) + 3) + 'px',
      textAlign: 'right',
      zIndex: 9999
    }}>
      <div>{time.toLocaleTimeString()}</div>
      <div style={{ fontSize: (parseInt(getFontSize()) - 3) + 'px', marginTop: '4px', textAlign: 'right' }}>
        {time.toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    </div>
  );
}
