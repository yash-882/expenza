import React, {useState} from 'react'
import PopupWrapper from '../PopupWrapper'
import axios from 'axios'
import NotificationPopup from './NotificationPopup'
import { Eye, EyeClosed } from 'lucide-react'

function ChangePassword({closePopup}) {
    let [loading, setLoading] = useState(false)

        // state for displaying popups
    let [notificationPopup, showNotificationPopup] = useState(false)
      
        // state for error or success messages
    let [notificationInfo, setNotificationInfo] = useState({
                    type: '', 
                    message: '',
        });

    // password 
    let [credentials, setCredentials] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    
    let [isPasswordVisible, setPassVisibility] = useState(false);

    function handleInputs(evt){
        const inputID = evt.target.id;

        // set password 
        setCredentials((prev)=> ({...prev, [inputID]: evt.target.value}))
    }

    async function changeUserPassword(evt){
        evt.preventDefault()

        try{
            setLoading(true) // show loading...

            const response = await axios.patch('http://192.168.1.7:8000/api/user/setting/change-password', 
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

  return (<>

    <PopupWrapper>

        {/* change password popup (PATCH) */}
    <div 
    className={`p-4 d-flex flex-column bg-light  justify-content-center align-items-center rounded-4`}>

{/* change password form */}
        <form 
        className='w-100 d-flex flex-column' 
        onSubmit = {changeUserPassword}>

{/* label for changing password */}
           
                {/* heading */}
                <h5 className='fw-bold mb-4'>Change password</h5>

               {/* input to enter current password */}
                <input 
                type="password"
                onChange = { handleInputs }
                id = 'currentPassword'
                value= { credentials.currentPassword } 
                className=' rounded-3 p-2 mb-3 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Enter current password'
                />
               {/* input to new password */}
                <input 
                type={isPasswordVisible ? 'text' : 'password'}
                id='newPassword'
                onChange = {handleInputs}
                value= { credentials.newPassword }
                className=' rounded-3 p-2 mb-1 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Create new password'
                />
                {<button 
                type='button'
                className='btn btn-sm mb-3'
                onClick={() => setPassVisibility(v => !v)}>
                    
                        {
                            isPasswordVisible ? 
                            // icon when password is visible
                          <> Hide password <EyeClosed className='ms-1'/> </> 
                            : 
                            // icon when password is hidden
                        <> Show password<Eye className='ms-1'/> </>
                        }
   
                </button>}
               {/* input to confirm the new password */}
                <input 
                type="password"
                id='confirmPassword'
                onChange = {handleInputs}
                value= { credentials.confirmPassword }
                className=' rounded-3 p-2 mb-3 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Confirm new password'
                />


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
 
            className='text-white btn fw-bold  bg-secondary mb-2  rounded-3 border-0'>

                Cancel

            </button>

            </div>

            {/* info about reset password via otp verification */}
            <p
            style={{fontSize: '14px', maxWidth: '300px'}} 
            className='mb-0 fw-bold text-primary text-center'>
            Forgot your current password? Log out to reset it via email OTP verification
            </p>
        </form>

    </div>

    </PopupWrapper>

    {/* show error or success popup */}
    {notificationPopup && 
<NotificationPopup 
notificationInfo={notificationInfo} removePopup={()=> showNotificationPopup(false)}/>
}
    </>
  )
}

export default ChangePassword
