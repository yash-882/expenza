import React, {useState, useContext} from 'react'
import AccountSettings from '../constants/settings/settings'
import { SettingsIcon } from 'lucide-react'
import { UserContext } from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom'
import ProfileView from '../components/modals/ProfileView'
import ProfileUpdate from '../components/modals/ProfileUpdate';
import TransactionOverview from '../components/modals/TransactionOverview'
import SetMonthlyBudget from '../components/modals/SetMonthlyBudget';
import DeleteConfirmation from '../components/modals/DeleteConfirmation';
import NotificationPopup from '../components/modals/NotificationPopup';
import ChangePassword from '../components/modals/ChangePassword';

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

    // state for displaying popups
   let [notificationPopup, showNotificationPopup] = useState(false)
  
    // state typically for error messages
    let [notificationInfo, setNotificationInfo] = useState({
                type: '', 
                message: '',
            });

            // notify popup
        function notifyPopup({type, message}){
          // set message 
          setNotificationInfo({
            type: type,
            message: message
          })
        
          // show notification popup
          showNotificationPopup(true)
        }

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
{/* notification popup */}
{notificationPopup && <NotificationPopup 
removePopup={()=>showNotificationPopup(false)} 
notificationInfo={notificationInfo}
/>}

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

{/* show transaction overview */}
{setting.path === '/transaction-status' && setting.isActive && 
<TransactionOverview 
  hidePopup = {()=> setSetting({path: '/transaction-status', isActive: false})}/>}

{/* set budget */}
{setting.path === '/set-budget' && setting.isActive && 
<SetMonthlyBudget 
  hidePopup = {()=> setSetting({path: '/set-budget', isActive: false})}/>}

{/* Change password */}
{setting.path === '/change-password' && setting.isActive && 
<ChangePassword 
  closePopup = {()=> setSetting({path: '/change-password', isActive: false})}/>}

{/* clear all transactions */}
{setting.path === '/clear-all-transactions' && setting.isActive && 
<DeleteConfirmation 
  hidePopup = {()=> setSetting({path: '/clear-all-transactions', isActive: false})}
  heading= 'Delete all transactions?'
  dataToDelete={{apiPath: 'transaction', id: 'delete'}}
  notifyPopup={notifyPopup}
  
  // do nothing
  refetchData={() => {}}/>}
      
    </div>
  )
}

export default Settings
