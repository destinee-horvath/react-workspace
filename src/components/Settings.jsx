import { useState, useEffect } from 'react'
import Popup from './popups/DeleteConfirmation' 

const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 30
const FONT_STEP = 2

function getContrastYIQ(hexcolour) {
  if (!hexcolour || hexcolour[0] !== '#' || hexcolour.length !== 7) {
    return 'black' 
  }

  const r = parseInt(hexcolour.substr(1, 2), 16)
  const g = parseInt(hexcolour.substr(3, 2), 16)
  const b = parseInt(hexcolour.substr(5, 2), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000 // brightness formula

  return yiq >= 128 ? 'black' : 'white' //icon black if bg is light (vice versa)
}

const defaultSettings = {
  bgColour: '#3a3a3a',      
  bgImage: '',
  navColour: '#a0a0a0',    
  textColour: '#f0f0f0',
  fontFamily: 'system-ui, sans-serif'
}

export default function Settings() {
  const [bgColour, setBgColour] = useState(() => localStorage.getItem('bgColour') || defaultSettings.bgColour)
  const [bgImage, setBgImage] = useState(() => localStorage.getItem('bgImage') || defaultSettings.bgImage)
  const [navColour, setNavColour] = useState(() => localStorage.getItem('navColour') || defaultSettings.navColour)
  const [textColour, setTextColour] = useState(() => localStorage.getItem('textColour') || defaultSettings.textColour)
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || defaultSettings.fontFamily)
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || '16px')
  const [fileName, setFileName] = useState('No file chosen')
  const [message, setMessage] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const fontSizeNumber = parseInt(fontSize, 10) || MIN_FONT_SIZE

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', bgColour)
    document.documentElement.style.setProperty('--bg-image', bgImage ? `url(${bgImage})` : 'none')
    document.documentElement.style.setProperty('--nav-color', navColour)
    
    const iconColour = getContrastYIQ(bgColour)
    document.documentElement.style.setProperty('--icon-color', iconColour)
    
    document.documentElement.style.setProperty('--text-color', textColour)
    document.documentElement.style.setProperty('--font-family', fontFamily)
    document.documentElement.style.setProperty('--font-size', fontSize)

    localStorage.setItem('bgColour', bgColour)
    localStorage.setItem('bgImage', bgImage)
    localStorage.setItem('navColour', navColour)
    localStorage.setItem('textColour', textColour)
    localStorage.setItem('fontFamily', fontFamily)
    localStorage.setItem('fontSize', fontSize)
  }, [bgColour, bgImage, navColour, textColour, fontFamily, fontSize])

  const handleSave = () => {
    localStorage.setItem('bgColour', bgColour)
    localStorage.setItem('bgImage', bgImage)
    localStorage.setItem('navColour', navColour)
    localStorage.setItem('textColour', textColour)
    localStorage.setItem('fontFamily', fontFamily)
    setMessage('Settings saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleResetTheme = () => {
    setShowResetConfirm(true);
    setResetType('theme');
  }

  const handleResetAll = () => {
    setShowResetConfirm(true);
    setResetType('all');
  }

  const [resetType, setResetType] = useState('theme'); 

  const handleResetConfirmed = () => {
    if (resetType === 'theme') {
      setBgColour(defaultSettings.bgColour);
      setBgImage(defaultSettings.bgImage);
      setNavColour(defaultSettings.navColour);
      setTextColour(defaultSettings.textColour);
      setFontFamily(defaultSettings.fontFamily);
      setFontSize('16px');
      
      localStorage.removeItem('bgColour');
      localStorage.removeItem('bgImage');
      localStorage.removeItem('navColour');
      localStorage.removeItem('textColour');
      localStorage.removeItem('fontFamily');
      localStorage.removeItem('fontSize');

      setMessage('Theme settings reset to default.');
    } 
    else if (resetType === 'all') {
      localStorage.clear();

      setBgColour(defaultSettings.bgColour);
      setBgImage(defaultSettings.bgImage);
      setNavColour(defaultSettings.navColour);
      setTextColour(defaultSettings.textColour);
      setFontFamily(defaultSettings.fontFamily);
      setFontSize('16px');

      setMessage('All data and settings reset.');
    }
    setTimeout(() => setMessage(''), 3000);
    setShowResetConfirm(false);
    setResetType('theme'); 
  }

  const handleResetCancelled = () => {
    setShowResetConfirm(false);
  }

  const increaseFontSize = () => {
    if (fontSizeNumber + FONT_STEP <= MAX_FONT_SIZE) {
      setFontSize(`${fontSizeNumber + FONT_STEP}px`)
    }
  }

  const decreaseFontSize = () => {
    if (fontSizeNumber - FONT_STEP >= MIN_FONT_SIZE) {
      setFontSize(`${fontSizeNumber - FONT_STEP}px`)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.files.length > 0) {
      // setErrorMessage(''); 
      const file = e.target.files[0]
      setFileName(file.name)

      const reader = new FileReader()
      reader.onload = () => {
        setBgImage(reader.result) // reader.result is base64 data URL
      }
      reader.readAsDataURL(file)
    } else {
      setFileName('No file chosen')
      setBgImage('')
    }
  }


  // Handle manual input change in number box
  const handleFontSizeChange = (e) => {
    let val = e.target.value
    if (val === '') {
      setFontSize('')
      return
    }
    let num = Number(val)
    if (isNaN(num)) return // ignore invalid input
    if (num < MIN_FONT_SIZE) num = MIN_FONT_SIZE
    else if (num > MAX_FONT_SIZE) num = MAX_FONT_SIZE
    setFontSize(`${num}px`)
  }

  return (
    <div style={{ marginLeft: "100px", textAlign: 'left'}}>
      <h1 style={{textAlign: 'center'}}>Settings</h1>
      <hr className='custom-hr' />

      <div style={{ marginBottom: '20px', padding: '0 10%'}}>
        <label>
          Background Colour: 
          <input 
            type="color" 
            value={bgColour} 
            onChange={e => setBgColour(e.target.value)} 
            style={{ marginLeft: '10px' }}
            className="square-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' , padding: '0 10%'}}>
        <label>
          Background Image URL:
          <input 
            type="text" 
            value={bgImage} 
            onChange={e => setBgImage(e.target.value)} 
            placeholder="Enter image URL" 
            style={{ marginLeft: '10px', width: '300px' }}
            className="square-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' , padding: '0 10%'}}>
        <label htmlFor="file-upload" style={{ cursor: 'pointer', padding: '8px 12px', border: '1px solid var(--text-color)', borderRadius: '5px', display: 'inline-block' }}>
          Upload File
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }} // hide default file input
        />
        <div className="file-name">
          {fileName}
        </div>
      </div>

      <div style={{ marginBottom: '20px' , padding: '0 10%'}}>
        <label>
          Navigation Colour: 
          <input 
            type="color" 
            value={navColour} 
            onChange={e => setNavColour(e.target.value)} 
            style={{ marginLeft: '10px' }}
            className="square-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' , padding: '0 10%'}}>
        <label>
          Text Colour: 
          <input 
            type="color" 
            value={textColour} 
            onChange={e => setTextColour(e.target.value)} 
            style={{ marginLeft: '10px' }}
            className="square-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' , padding: '0 10%'}}>
        <label>
          Font Family: 
          <select 
            className='custom-select'
            value={fontFamily} 
            onChange={e => setFontFamily(e.target.value)} 
            style={{ marginLeft: '10px', fontSize: 'var(--font-size)' }}
          >
            <option value="system-ui, sans-serif">System UI</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '20px' , padding: '0 10%'}}>
        <label>Font Size: </label>
        <button 
          onClick={decreaseFontSize} 
          style={{ 
            marginLeft: '10px', 
            padding: '6px 14px', 
            fontSize: '18px', 
            fontWeight: 'bold',
            borderRadius: '8px', 
            border: '1px solid var(--text-color)', 
            backgroundColor: 'var(--bg-color)', 
            color: 'var(--text-color)', 
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            userSelect: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--icon-color)';
            e.currentTarget.style.color = 'var(--nav-color)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-color)';
            e.currentTarget.style.color = 'var(--text-color)';
          }}
        >−</button>
        <input 
          type="number" 
          value={fontSizeNumber} 
          onChange={handleFontSizeChange} 
          style={{ width: '60px', textAlign: 'center', margin: '0 10px' }}
          min={MIN_FONT_SIZE} 
          max={MAX_FONT_SIZE}
        />
        <button 
          onClick={increaseFontSize} 
          style={{ 
            padding: '6px 14px', 
            fontSize: '18px', 
            fontWeight: 'bold',
            borderRadius: '8px', 
            border: '1px solid var(--text-color)', 
            backgroundColor: 'var(--bg-color)', 
            color: 'var(--text-color)', 
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            userSelect: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--icon-color)';
            e.currentTarget.style.color = 'var(--nav-color)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-color)';
            e.currentTarget.style.color = 'var(--text-color)';
          }}
        >+</button>
      <span> px</span>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button className='button-rectangle' onClick={handleSave} style={{ padding: '8px 20px' }}>Save</button>
        <button className='button-rectangle' onClick={handleResetTheme} style={{ padding: '8px 20px' }}>Reset Theme</button>
        <button className='button-rectangle' onClick={handleResetAll} style={{ padding: '8px 20px', backgroundColor: '#cc4444', color: 'white' }}>Reset All</button>
      </div>

      {showResetConfirm && (
        <Popup
          message="Are you sure you want to reset settings to default?"
          onConfirm={handleResetConfirmed}
          onCancel={handleResetCancelled}
        />
      )}
    </div>
  )
}
