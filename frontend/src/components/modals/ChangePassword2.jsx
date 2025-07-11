import { Eye, EyeClosed } from 'lucide-react'
import React, { useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import NotificationPopup from './NotificationPopup'
import axios from 'axios'

// change password form for unauthenticated users
function ChangePassword2({closePopup}) {
    let [loading, setLoading] = useState(false)
    let [credentials, setCredentials]  = useState({
        password: '', //new password
        confirmPassword: '' //confirm new password
    })
    let [isPasswordVisible, setPassVisibility] = useState(false)

        // state for displaying popups
    let [notificationPopup, showNotificationPopup] = useState(false)
          
        // state for error or success messages
    let [notificationInfo, setNotificationInfo] = useState({
                        type: '', 
                        message: '',
        });

    function handleInputs (evt) {
        const inputID = evt.target.id; //confirmPassword / password

        // set credentials
        setCredentials(prev => ({...prev, [inputID]: evt.target.value}))
    }

    async function changePassword(evt){
        evt.preventDefault();

           try{
            setLoading(true) // show loading...

            // change password...
            const response = await axios.patch('http://192.168.1.7:8000/api/auth/reset-password-otp/change-password', 
                credentials, //body
                {withCredentials: true}
            );

            // remove loading
            setLoading(false)

            // api reponse
            const apiResponse = response.data

            // create success message
            setNotificationInfo({type: 'success', message: apiResponse.message})

            // show popup
            showNotificationPopup(true)

            // close change-password popup after 3 seconds
            setTimeout(() => {
                closePopup()
            }, 3000)
        }

        catch(err){

            // remove loading
            setLoading(false)

           // create error message
            setNotificationInfo({
                type: 'error', 
                message: err.response?.data.message || 'Server error, please try again later'
            })

            // show popup
            showNotificationPopup(true)
        }

    }

  return (
    <PopupWrapper>

        {/* change password popup (PATCH) */}
    <div 
    className={`p-4 d-flex flex-column bg-light  justify-content-center align-items-center rounded-4`}>

{/* change password form */}
        <form
        onSubmit={changePassword} 
        className='w-100 d-flex flex-column' >

{/* label for changing password */}
           
                {/* heading */}
                <h5 className='fw-bold mb-4'>Change password</h5>
                <p>Create a strong password</p>
               {/* input to enter current password */}
                <input 
                type="password"
                onChange = { handleInputs }
                id = 'password'
                value= { credentials.password } 
                className=' rounded-3 p-2 mb-3 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Enter new password'
                />
               {/* input to confirm new password */}
                <input 
                type={isPasswordVisible ? 'text' : 'password'}
                id='confirmPassword'
                onChange = {handleInputs}
                value= { credentials.confirmPassword }
                className=' rounded-3 p-2 mb-1 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Confirm new password'
                />
                {<button 
                type='button'
                className='btn btn-sm mb-3'
                onClick={() => setPassVisibility(v => !v)}>
                    
                        {
                            // set visibilty of password
                            isPasswordVisible ? 
                            // icon when password is visible
                          <> Hide password <EyeClosed className='ms-1'/> </> 
                            : 
                            // icon when password is hidden
                        <> Show password<Eye className='ms-1'/> </>
                        }
   
                </button>}

            {/* buttons container */}

            <div className='w-100 d-flex flex-wrap flex-column'>

{/* submit button */}
            <button
            disabled={loading}
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
 
            className='text-white btn fw-bold  bg-secondary mb-2  rounded-3 border-0'>

                Cancel

            </button>

            </div>
        </form>
    </div>


{/* show error/succes reponse message */}
    {
        notificationPopup && 
        <NotificationPopup
        notificationInfo={notificationInfo}
        removePopup={()=> showNotificationPopup(false)}/>

    }

    </PopupWrapper>
  )
}

export default ChangePassword2
