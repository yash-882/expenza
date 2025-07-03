import React, { useState } from 'react'
import PopupWrapper from '../PopupWrapper';
import axios from 'axios';
import OtpPopup from './OtpPopup';
import NotificationPopup from './NotificationPopup';

// send OTP to email to reset the password
function ResetPassword({closePopup}) {
    let [loading, setLoading] = useState(false);
    let [email, setEmail] = useState('')
    let [hidden, setHidden] = useState(false)
    let [isOtpSent, setOtpSent] = useState(false)
         // state for displaying popups
      let [notificationPopup, showNotificationPopup] = useState(false)
            
              // state for error or success messages
      let [notificationInfo, setNotificationInfo] = useState({
              type: '', 
              message: '',
          }); 

    async function requestOTP(evt){

        evt?.preventDefault()
        setLoading(true) //show loading
            try{
                // send OTP to email for resetting the password...
                const response = await axios.post('http://192.168.1.7:8000/api/auth/reset-password-otp',
                {email}, 
                {withCredentials: true})

                setLoading(false) //remove loader
                // api response
            const apiResponse = response.data;
            
            //  state that contains success message
            setNotificationInfo({type: 'success', message: apiResponse.message})

            // show notification popup
            showNotificationPopup(true)

            // hide current ResetPassword popup and show the OTP popup
            setHidden(true)

            // otp sent
            setOtpSent(true)

        }
        catch(err){
             setLoading(false) //remove loading   

            //  state that contains error message
            setNotificationInfo({
                type: 'error', 
                message: err.response?.data.message || 'Server error, please try again later'
            })

        // show popup
        showNotificationPopup(true)
        }

    }


  return (<>

    {/* hide popup when another popup displays(OTP popup) */}
    <PopupWrapper hidden={hidden} >

        {/* profile updation popup (PATCH) */}
    <div 
    className={`p-4 d-flex flex-column bg-light  justify-content-center rounded-4`}>

        <form onSubmit={requestOTP}>

{/* label for changing email */}
            <label htmlFor="modify-profile" className='mb-4'>
                {/* heading */}
                <h5 className='fw-bold mb-4'>
                    Reset password
                </h5>

                {/*  description */}
                <p>An OTP will be requested to your email</p>

               {/* input to enter email */}
                <input 
                type="text"
                value={email}
                onChange={(evt)=> setEmail(evt.target.value)}

                id='modify-profile'
                className=' rounded-3 p-2 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Enter email'
                />
            </label>

            {/* buttons container */}

            <div className='w-100 d-flex flex-wrap flex-column'>

{/* submit button */}
            <button
            type='submit'
            className='text-white d-flex justify-content-center align-items-center btn fw-bold bg-primary mb-2 rounded-3 border-0'
            disabled={loading}>

                {loading ? 
                // show loading...
                <p 
                className='loader mb-0'
                style={{width: '25px', height: '25px'}}
                ></p> :
                'Submit'}
            </button>

{/* close popup button */}
            <button 
            type='button'
            onClick={closePopup}
 
            className='text-white btn fw-bold  bg-secondary  rounded-3 border-0'>

                Cancel

            </button>

            </div>
        </form>

    </div>

    </PopupWrapper>

    {/* error or success message after submiting OTP */}
    {
        notificationPopup && 
        <NotificationPopup
        notificationInfo={notificationInfo}
        removePopup={()=> showNotificationPopup(false)}/>
    }

    {
        // show OTP form popup after successful delivery
        isOtpSent && 
        <OtpPopup
        heading='Enter OTP to reset password'
        sentTo={email}
        setNotificationInfo={setNotificationInfo}
        notificationInfo={notificationInfo}
        removeNotificationPopup={()=> showNotificationPopup(false)}
        setNotify={showNotificationPopup}
        notify={notificationPopup}
        resendOtp={requestOTP}
        action='ResetPassword'
        removeProfileUpdatePopup={closePopup}
        />
    
    }
</>
  )
}

export default ResetPassword
