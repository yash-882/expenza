import React, {useContext} from 'react'
import AccountSettings from '../constants/settings/settings'
import { SettingsIcon } from 'lucide-react'
import { UserContext } from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom'

function Settings() {
  
    let navigate = useNavigate()
    // user authentication status
    let {isAuthenticated} = useContext(UserContext)

    // redirect to /login page if not authenticated
    if(!isAuthenticated){
      navigate('/login')
    }


  return (
    <div 
    className='py-3 d-flex flex-column align-items-center justify-content-center'>
      <h4 className='fw-bold d-flex align-items-center text-primary'>
        <SettingsIcon className='me-2'/>
      Account Settings
     </h4>

{
  // 
    AccountSettings.map((section, index) => (
      <div 
      key={index} 
      className='account-setting-section p-3 mt-3 rounded-4 d-flex flex-column align-iems-center justify-content-center '>
        <span className='text-center fw-bold fs-5 mb-3'>{section.sectionName}</span>

        {/* each setting section (contains different settings)  */}
        {
          section.options.map((option, index) => (
            <div 
            key={index}
            className="setting-individual-option mb-2  w-100 rounded-3">
              <button className='btn py-3 rounded-3  w-100'>

              {option.label}
              </button>
            </div> 
          ))
        }
        
        </div>
))}
      
    </div>
  )
}

export default Settings
