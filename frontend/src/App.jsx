import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
    {/* Navigation bar */}
    <Navbar/>
    <Outlet/>
    </>
  )
}

export default App
