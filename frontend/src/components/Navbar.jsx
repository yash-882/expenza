import { useEffect, useRef, useState } from 'react'
import {Link} from "react-router-dom"
import { NavLinks } from '@constants/nav-bar/links.js';
import ExpenzaLogo from "@assets/images/EXPENZA-LOGO.png"

function Navbar({setNavbarRef}) {

let [activeTab, setActiveTab] = useState('/')
let navbarRef = useRef(null)

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
              //Rendering links...
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

              ))
          }

        </ul>
      </div>

    </div>
  );
}

export default Navbar