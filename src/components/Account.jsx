import { useState, useEffect } from 'react'


export default function Account() {
    //useState with localStorage
    const [name, setName] = useState(() => localStorage.getItem('name') || '')
    const [email, setEmail] = useState(() => localStorage.getItem('email') || '')  
    const [dob, setDob] = useState(() => localStorage.getItem('dob') || '')
    const [message, setMessage] = useState('')

    const handleSave = () => {
        localStorage.setItem('name', name)
        localStorage.setItem('email', email)
        localStorage.setItem('dob', dob)
        setMessage("Changes saved!")
    }

    //when variable changes, save to localStorage
    useEffect(() => {
        localStorage.setItem('name', name)
    }, [name])

    useEffect(() => {
        localStorage.setItem('email', email)
    }, [email])

    useEffect(() => {
        localStorage.setItem('dob', dob)
    }, [dob])


  return (
    <div style={{ }}>
      <h1 style={{ textAlign: 'center' }}>Account</h1>
      <hr className='custom-hr' />

      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <p style={{ width: '120px', margin: 0, textAlign: 'right', paddingRight: '10px' }}>Name:</p>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          style={{ flex: 1 }}
        />
      </div>

      <br></br>

      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <p style={{ width: '120px', margin: 0, textAlign: 'right', paddingRight: '10px' }}>Email:</p>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          style={{ flex: 1 }}
        />
      </div>

      <br></br>

      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <p style={{ width: '120px', margin: 0, textAlign: 'right', paddingRight: '10px' }}>Date of Birth:</p>
        <input
          type='date'
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          placeholder='Date of Birth'
          style={{ flex: 1 }}
        />
      </div>

      <br></br>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className='button-rectangle' onClick={handleSave}>Save</button>
      </div>

      {message && <p style={{ color: 'green', marginTop: '20px', textAlign: 'center' }}>{message}</p>}
    </div>
  )
}