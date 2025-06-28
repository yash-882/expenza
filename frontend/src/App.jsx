import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

function App() {
  let [marginTop, setMarginTop] = useState('');
  
  function setNavbarRef(navbarRef){

    let height = navbarRef?.current?.offsetHeight || 60; //assuming 60px height of navbar if not found
      
    //  set margin of main content(below the navbar)
     setMarginTop(`${height}px`)
  }

  return (
    <>
    {/* Navigation bar */}
    <Navbar setNavbarRef = {setNavbarRef}/>

    {/* Main content */}
    <main style={{ height: '100%', marginTop: marginTop }}> 

    <Outlet/>

    </main>
    </>
  )
}

export default App
