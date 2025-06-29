import React, { useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import OtpPopup from './OtpPopup'
import axios from 'axios'
import NotificationPopup from './NotificationPopup'

function ProfileUpdate({heading, placeholder, description, closePopup}) {
    let [notify, setNotify] = useState(false)
    let [notificationInfo, setNotificationInfo] = useState({type: '', message: ''})
    let [email, setEmail] = useState('')
    let [loading, setLoading] = useState(false)
    let [hidden, setHidden] = useState(false)
    let [isOtpSent, setOtpSent] = useState(false)

    async function requestOTP(evt){
        evt.preventDefault()
        try{
            setNotificationInfo({type: '', message: ''}) //reset notification for each request

            setLoading(true) //show loading
            // requesting OTP...
            const response = await axios.post('http://192.168.1.7:8000/api/user/setting/verify-email',
                {
                    newEmail: email //new email
                }, 
                {
                    withCredentials: true
                })

                setLoading(false) //remove loader
                // api response
            const apiResponse = response.data;
            
            // show popup that includes success message
            setNotificationInfo({type: 'success', message: apiResponse.message})

            // show notification popup
            setNotify(true)

            // hide current profile updation popup and show the OTP popup
            setHidden(true)

            // otp sent
            setOtpSent(true)
        }
        catch(err){
            setLoading(false) //remove loader
            
            // show popup that includes failure message
            setNotificationInfo({type: 'error', 
                message: err.response?.data.message || 'Server error, please try again later'})

            // show notification popup
            setNotify(true)
        }
    }

  return (
    <>
    {/* hide popup when another popup displays(OTP popup) */}
    <PopupWrapper hidden={hidden}>

        {/* profile updation popup (PATCH) */}
    <div 
    className={`profile-update-popup p-4 d-flex flex-column bg-light  justify-content-center rounded-4`}>

        <form onSubmit={requestOTP}>

{/* label for changing email */}
            <label htmlFor="modify-profile" className='mb-4'>
                {/* updation content heading */}
                <h5 className='fw-bold mb-4'>{heading}</h5>

                {/* update description */}
                <p>{description}</p>

               {/* input to enter new email */}
                <input 
                type="text"
                onChange={evt => setEmail(evt.target.value)}
                value={email} 
                id='modify-profile'
                className=' rounded-3 p-2 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder={placeholder}
                />
            </label>

            {/* buttons container */}

            <div className='w-100 d-flex flex-wrap flex-column'>

{/* submit button */}
            <button
            type='submit'
            className='text-white d-flex justify-content-center align-items-center btn fw-bold bg-primary mb-2 rounded-3 border-0'>

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

    {/* show notification popup inside the current component only if there is any error occured */}
    {notify && <NotificationPopup 
    notificationInfo={notificationInfo} 
    removePopup={()=> setNotify(false)}/>}


    {/* show popup for OTP validation only after sending the OTP to the new email*/}
    {
        isOtpSent &&
        <OtpPopup
        notificationInfo={notificationInfo} // notificaton info
        notify={notify} // notification popup state
        removeNotificationPopup = {() => setNotify(false)}  //remove notification popup           
        heading={'Enter OTP for email updation'}
        sentTo = {email} //email that will receive the OTP
        setNotificationInfo = {setNotificationInfo} //response message from the server
        setNotify = {setNotify} //set message and its type
        removeProfileUpdatePopup = {closePopup}/> //remove the ProfileUpdate popup
    }
</>
  )
}

export default ProfileUpdate
