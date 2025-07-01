import React, { useState, useContext } from 'react'
import PopupWrapper from '../PopupWrapper'
import axios from 'axios';
import NotificationPopup from './NotificationPopup';
import DeleteConfirmation from './DeleteConfirmation'
import {UserContext} from '../../contexts/UserContext'

function DeleteAccount({closePopup}) {

    let [password, setPassword] = useState('');
    let [loading, setLoading] = useState(false)
    let [hidden, setHidden] = useState(false)
    let {setIsAuthenticated} = useContext(UserContext)
         // state for displaying popups
  let [notificationPopup, showNotificationPopup] = useState(false)
        
          // state for error or success messages
  let [notificationInfo, setNotificationInfo] = useState({
          type: '', 
          message: '',
      });

    //   handles the server response (error or success)
      function notifyPopup({type, message}){

        // if deletion of the account was successful
        if(type === 'success')
            // this will redirect the user to /login page
            setIsAuthenticated(false)

            // show error 
        else if(type === 'error'){
            // set error properties
            setNotificationInfo({type, message})
            // show popup
            showNotificationPopup(true)
        }

      }

    async function verifyPassword(evt){
        evt.preventDefault();
        try{
            setLoading(true) //show loading...
            // verifying password...
            await axios.post('http://192.168.1.7:8000/api/user/setting/verify-password',
                {password}, //user's password
                {withCredentials: true}
            )
            setLoading(false) //remove loading 
            setHidden(true) //hidden the current popup and show delete confirmation popup(child)

        } 
        catch(err){
            setLoading(false) //remove loading
            
            //  state that contains failure message
            setNotificationInfo({type: 'error', 
                message: err.response?.data.message || 'Server error, please try again later'})
                
         // show notification popup
            showNotificationPopup(true)

        }
    }

  return (
<PopupWrapper hidden = {hidden}>
    <div
    className={`p-4 d-flex flex-column bg-light  justify-content-center rounded-4`}>

        {/* heading */}
        <h4 className='fw-bolder'>
            Account deletion
            </h4>

            {/* description */}
        <p className='fw-bold'>
            Verification is required for this action
        </p>

               {/* input to enter current password */}
                <input 
                type="password"
                onChange = {(evt) => setPassword(evt.target.value)}
                value= { password } 
                className=' rounded-3 p-2 mb-3 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Enter password'/>

                 {/* buttons container */}

            <div className='w-100 d-flex flex-wrap flex-column'>

{/* submit button */}
            <button
            disabled={loading}
            type='submit'
            onClick={verifyPassword}
            className='text-white d-flex justify-content-center align-items-center btn fw-bold bg-danger mb-2 rounded-3 border-0'>

                {loading ? 
                // show loading...
                <p 
                className='loader mb-0'
                style={{width: '25px', height: '25px'}}
                ></p> :
                'Continue'}
            </button>

{/* close popup button */}
            <button 
            type='button'
            onClick={closePopup}
 
            className='text-white btn fw-bold  bg-secondary mb-2  rounded-3 border-0'>

                Cancel

            </button>

            </div>
    </div>

{/* error or success message */}
    {notificationPopup &&
    <NotificationPopup
    notificationInfo={notificationInfo}
    removePopup={()=> showNotificationPopup(false)} />}

{   

// delete confirmation popup
hidden && 
<DeleteConfirmation
heading= "Are you sure you want to delete your account?"
hidePopup={()=> setHidden(false)}
dataToDelete={{apiPath: 'user/setting', id : 'delete-account'}}

// this function only displays popup on account deletion error
notifyPopup={notifyPopup}
//do nothing
refetchData={()=> {}}/>

}
</PopupWrapper>
  )
}

export default DeleteAccount
