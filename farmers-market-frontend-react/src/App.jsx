import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LogInPage from './pages/LogIn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <LogInPage/>
    // <h1>Hello</h1>
  )
}

export default App
