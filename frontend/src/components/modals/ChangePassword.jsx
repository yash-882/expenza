import React, {useState} from 'react'
import PopupWrapper from '../PopupWrapper'

function ChangePassword({closePopup}) {

        let [loading, setLoading] = useState(false)

  return (<>

    <PopupWrapper>

        {/* change password popup (PATCH) */}
    <div 
    className={`p-4 d-flex flex-column bg-light  justify-content-center align-items-center rounded-4`}>

{/* change password form */}
        <form className='w-100 d-flex flex-column' onSubmit>

{/* label for changing password */}
           
                {/* heading */}
                <h5 className='fw-bold mb-4'>Change password</h5>

               {/* input to enter current password */}
                <input 
                type="password"
                onChange
                value='' 
                className=' rounded-3 p-2 mb-3 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Enter current password'
                />
               {/* input to new password */}
                <input 
                type="password"
                onChange
                value=''
                className=' rounded-3 p-2 mb-3 w-100 border-0'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                placeholder='Create new password'
                />
               {/* input to confirm the new password */}
                <input 
                type="password"
                onChange
                value=''
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
    </>
  )
}

export default ChangePassword
