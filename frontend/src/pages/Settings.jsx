import React, {useState, useContext} from 'react'
import AccountSettings from '../constants/settings/settings'
import { SettingsIcon } from 'lucide-react'
import { UserContext } from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom'
import ProfileView from '../components/modals/ProfileView'
import ProfileUpdate from '../components/modals/ProfileUpdate';


function Settings() {
  
    let navigate = useNavigate()
    // user authentication status
    let {isAuthenticated} = useContext(UserContext)

    // redirect to /login page if not authenticated
    if(!isAuthenticated){
      navigate('/login')
    }

 // state for select individual setting
  const [setting, setSetting] = useState({path: '', isActive: false});

  function handleSettingClick(event) {
    //  get clicked button id
    const path = event.target.id;

    if(path){
      // show setting
      setSetting({path, isActive: true})
    }
  }

  return (
    <div 
    className='py-3 d-flex flex-column align-items-center justify-content-center'>
      <h4 className='fw-bold d-flex align-items-center text-primary'>
        <SettingsIcon className='me-2'/>
      Account Settings
     </h4>

{
  // settings is an array of sections, each section contains multiple options
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
              <button 
              className='btn py-3 rounded-3  w-100'
              id={option.path}
              onClick={handleSettingClick}
              >

              {option.label}
              </button>
            </div> 
          ))
        }
        
        </div>
))}
{/* show account details */}
{setting.path === '/account-details' && setting.isActive && 
<ProfileView closePopup={()=> setSetting({path: '/account-details', isActive: false})}/>}

{/* change email */}
{setting.path === '/change-email' && setting.isActive && 
<ProfileUpdate 
  closePopup={()=> setSetting({path: '/change-email', isActive: false})}
  placeholder ='Enter new email'
  heading = 'Change email'
  description = 'An OTP will be requested to the new email'
  action = 'EmailUpdation'/>}

{/* change name */}
{setting.path === '/change-name' && setting.isActive && 
<ProfileUpdate 
  closePopup={()=> setSetting({path: '/change-name', isActive: false})}
  placeholder ='Enter new name'
  heading = 'Change name'
  action = 'NameUpdation'/>}
      
    </div>
  )
}

export default Settings
