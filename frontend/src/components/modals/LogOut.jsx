import React, {useContext, useState} from 'react'
import PopupWrapper from '../PopupWrapper'
import {UserContext} from '../../contexts/UserContext'
import axios from 'axios'
import NotificationPopup from './NotificationPopup'

function LogOut({closePopup}) {
    let [loading, setLoading] = useState(false)

      let {setIsAuthenticated} = useContext(UserContext)
             // state for displaying popups
      let [notificationPopup, showNotificationPopup] = useState(false)
            
              // state for error or success messages
      let [notificationInfo, setNotificationInfo] = useState({
              type: '', 
              message: '',
          });

        async function logOutUser(){
            try{
                setLoading(true) //show loading...

                // logging out...
                await axios.post('http://192.168.1.7:8000/api/user/setting/logout',
                       {}, {withCredentials: true}
                   )
            setLoading(false) //remove loading

            // this will redirect the user to /login page
            setIsAuthenticated(false)

            } 
            catch(err){

            setLoading(false) //remove loading

                // set error properties
                setNotificationInfo({
                    type: 'error',
                    message: err.response?.data?.message || 'Server error, please try again later'
                })

                // show popup
                showNotificationPopup(true)
            }
        }

  return (
         <PopupWrapper>
            <div className='d-flex flex-column bg-light mb-3 py-4 px-4 rounded-4'>

                {/* confirmation message */}
                <p className='fw-bold fs-5  mb-4 border-bottom border-secondary pb-3'>
                 Are you sure you want to log out?
                </p>


                <div>
                    {/* close popup */}
                    <button
                        className='btn btn-secondary me-3'
                        onClick={closePopup}>
                        Cancel
                    </button>

                    {/* logout button */}
                    <button
                        className='btn btn-danger'
                        disabled={loading}
                        onClick={logOutUser}>
                        {/* loader */}
                        <p
                            className={`${loading ? 'd-block' : 'd-none'} loader mb-1 text-center`}
                            style={{ height: '25px', width: '25px' }}>

                        </p>
                        {!loading ? 'Logout' : ''}

                    </button>

                </div>
            </div>

{/* show reponse */}
            {notificationPopup && 
            <NotificationPopup
            notificationInfo={notificationInfo}
            removePopup={() => showNotificationPopup(false)}/>}
        </PopupWrapper>
  )
}

export default LogOut
