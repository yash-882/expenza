import { useState } from 'react'
import {Link} from "react-router-dom"
import {CreditCardIcon, PlusCircle, UserCircle2 } from "lucide-react"

function Navbar() {
    const [activeTab, setActiveTab] = useState('transactions')

  return (
    <div className="container-fluid d-flex py-1 flex-row align-items-center">
        {/* Nav links */}
            <div className=" d-flex" id="navbarContent">

        <ul className="d-flex border-0 gap-2 list-unstyled  nav-tabs mb-2 mb-lg-0">

{/* All transactions */}
          <li className="nav-item">
            <Link onClick={()=> setActiveTab('transactions')} 
              className={`nav-link nav-link-css border-0 rounded-5 p-2  ${
                activeTab === 'transactions' ? 'link-active' : ''
              }`} to="#transactions">
              <CreditCardIcon className='me-1'/>Transactions</Link>
          </li>
          
          {/* Add transactions */}
          <li className="nav-item">
            <Link onClick={()=> setActiveTab('add-transaction')}  
             className={`nav-link nav-link-css border-0 rounded-5 p-2 ${
                activeTab === 'add-transaction' ? 'link-active' : ''}`}
                to="#add-transaction">
              <PlusCircle   className='me-1 text-primary'/>Add Transaction</Link>
          </li>

{/* Settings */}
          <li class="nav-item">
            <Link onClick={()=> setActiveTab('setting')} 
             className={`nav-link nav-link-css border-0 rounded-5 p-2 ${
                activeTab === 'setting' ? ' link-active' : ''}`}
                 to="#settings">
              <UserCircle2 className='me-1'/>Settings</Link>
          </li>
        </ul>
      </div>

    </div>
  );
}

export default Navbar
