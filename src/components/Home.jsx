import { useState, useEffect } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  
  useEffect(() => {
    const storedName = localStorage.getItem('name')
    if (storedName) {
      setName(storedName)
    }
  }, [])

  return <div style={{ marginLeft: "100px", textAlign:'center'}}>
    <h1>Hello {name || ''}!</h1>
    
  </div>
}