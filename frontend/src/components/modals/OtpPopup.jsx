import React, { useEffect, useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import NotificationPopup from './NotificationPopup'
import axios from 'axios'

function OtpPopup(
  {heading, notify, setNotify, removeNotificationPopup, 
    notificationInfo, setNotificationInfo, removeProfileUpdatePopup, sentTo, resendOtp}) {

    let [otp, setOtp] = useState('')
    let [sendAgain, setSendAgain] = useState(0)
    let [loading, setLoading] = useState(false)

  async function validateOTPAndUpdate(evt) {
    evt?.preventDefault()
    setNotificationInfo({type: '', message: ''})

    try{
   const response = await axios.patch('http://192.168.1.7:8000/api/user/setting/change-email', 
    {otp}, 
    {withCredentials: true})

    const apiResponse = response.data;

    // set success message
    setNotificationInfo(() => ({type: 'success', message: apiResponse.message}))

    // 
    setNotify(() => true)

    // remove the parent popup in 2.5 seconds after notifying(success)
    setTimeout(() => {
      
      removeProfileUpdatePopup()

    }, 2500);
    } 

    catch(err){    

      // set error message
    setNotificationInfo({
      type: 'error', 
      message: err.response?.data?.message || 'Server error, please try again later'})

      // show error message inside popup
    setNotify(true)
    }
  }

  // resend OTP
  useEffect(()=> {
    
async function execute(){
  // if client wants to request OTP again
      if(sendAgain){
        setLoading(true) //show loading...

        // re-sending OTP... 
       await resendOtp()

        setLoading(false) //remove loading
    }
    }
    execute()

  }, [sendAgain])
  return (
    <PopupWrapper>
    <div className='bg-light py-4 d-flex w-auto flex-wrap flex-column  px-4 rounded-4'>
        <h5 className='fw-bold mb-4'>
        {/* heading based setting action (change password, change email, etc)*/}
        {heading}
        </h5>
        {/* heading  */}
                <p className='mb-2'
                style={{fontSize: '14px'}}>
                  OTP sent to
           {<span 
           className='fw-bold ms-1'>
             {/* email address that will receive the OTP */}
            {sentTo}
            </span>}
        </p>
    
        {/* OTP form */}
        <form 
        onSubmit={validateOTPAndUpdate}>
                <input
                className='p-2 border-0 rounded-3 w-100 mb-4'
                placeholder='Enter OTP'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                type="text"
                inputMode='numeric' 
                id="otp-input" 
                onChange={(evt) => setOtp(evt.target.value)}/>

            {/* button container */}
            <div className='btn-block mb-3 w-100 d-flex flex-wrap flex-column justify-content-between'>
                {/* submit otp */}
                <button
                disabled={loading} 
                className="btn btn-primary fw-bold mb-2">
                    Submit
                </button>

                {/* close popup */}
                <button 
                type='button'
                className="btn btn-secondary fw-bold mb-2"

                // remove parent popup 
                onClick={removeProfileUpdatePopup}> 
                    Cancel
                </button>
                {/* resend otp button */}
                <button
                type='button'
                onClick={(()=> setSendAgain(sendAgain + 1))}
                className={`${loading? 'text-muted': 'text-primary'} bg-transparent border-0`}
                disabled= {loading}
               >
                {/* show loading when sending again */}
                 { loading? 'Sending...': 'Resend OTP'}
                </button>

            </div>
        </form>
      <div>

      </div>
    </div>

    {/* show messages regarding OTP validation */}
   { notify && <NotificationPopup
    removePopup={removeNotificationPopup}
    notificationInfo={notificationInfo}/>}
    </PopupWrapper>

  )
}

export default OtpPopup
