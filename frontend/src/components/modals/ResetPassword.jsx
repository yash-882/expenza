import React, { useState } from 'react'
import PopupWrapper from '../PopupWrapper';

// send OTP to email to reset the password
function ResetPassword({closePopup}) {
    let [loading, setLoading] = useState(false);


  return (<>
    <PopupWrapper >

        {/* profile updation popup (PATCH) */}
    <div 
    className={`p-4 d-flex flex-column bg-light  justify-content-center rounded-4`}>

        <form>

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
</>
  )
}

export default ResetPassword
