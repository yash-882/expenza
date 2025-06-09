import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
  <div className="container">
    <nav className="navbar">
      <div className="logo">
        <h2>Expense Tracker</h2>
      </div>
      <ul className="nav-links">
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#expenses">Expenses</a></li>
        <li><a href="#income">Income</a></li>
        <li><a href="#reports">Reports</a></li>
      </ul>
    </nav>
  </div>
)
}

export default App
