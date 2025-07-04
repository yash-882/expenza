import { useContext, useEffect, useRef, useState } from 'react'
import {Link, useLocation} from "react-router-dom"
import { NavLinks } from '@constants/nav-bar/links.js';
import ExpenzaLogo from "@assets/images/EXPENZA-LOGO.png"
import { UserContext } from '../contexts/UserContext';
import { UserCircle2 } from "lucide-react"


function Navbar({setNavbarRef}) {

  let navbarRef = useRef(null)
  let {isAuthenticated} = useContext(UserContext)
  let location = useLocation()
  
  // returns the pathname of url (using for only highlighting the active tab on the first render)
  let [activeTab, setActiveTab] = useState(location.pathname); 
  
  // whenever user switch to another route(/add-transaction, /settings, etc), 
  // the location updates, useEffect triggers and update the activeTab
useEffect(() => {

  // set active tab
  setActiveTab(location.pathname)

}, [location.pathname])


useEffect(() => {

  // sharing Navbar's ref to Parent
  setNavbarRef(navbarRef);

}, [])

  return (
    // Navbar
    <div className="container-fluid custom-navbar position-fixed py-1" 
    ref={navbarRef}>
        {/* Nav links */}
            <div className="d-flex align-items-center justify-content-evenly" id="navbarContent">

{/* Website logo */}
        <div className='expenza-logo h-100'>
              {/* Image logo/Link */}
              <a href='http://localhost:5173' className='d-block'>
            <img alt=""
                height={'50px'} 
                width='170px' 
                src={ExpenzaLogo}
                style={
                  {objectFit: "cover"}}/>
            </a>
        
        </div>

        {/* list of nav links */}
        <ul className="d-flex border-0 text-white py-2 gap-2 list-unstyled nav-tabs mb-2 mb-lg-0">

            {
              // show links if authorized
              isAuthenticated ? 

          (    //Rendering links...
                NavLinks.map(({label, icon: Icon, path, className}, index) => (
                    <li className="nav-item" key={index}>

                        {/* Link */}
            <Link onClick={()=> setActiveTab(path)} 
              className={`nav-link  nav-link-css border-0 rounded-4 p-2 ${
                activeTab === path ? 'link-active' : ''
              }`} to= {path}>
                
                {/* link label with icon */}
                <Icon className={className} />
                
                {/* Link's label */}
                 <span>{label}</span></Link>
          </li>

              ))): ( 

                // show link 'login' when unauthorised
              <li className="nav-item">
                        {/* login Link */}
            <Link  
              className={`nav-link nav-link-css border-0 rounded-4 p-2 ${
                activeTab === '/login' ? 'link-active' : ''
              }`} to= '/login'>
                
                {/* link label with icon */}
                <UserCircle2 className='nav-icon nav-icon-login me-2'/>
                
                {/* Link's label */}
                 <span className = 'nav-login-label fw-bold'>
                  Login
                </span>
                 </Link>
          </li>)
          }

        </ul>
      </div>

    </div>
  );
}

export default Navbar