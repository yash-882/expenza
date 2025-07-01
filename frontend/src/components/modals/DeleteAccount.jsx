import React, { useState } from 'react'
import PopupWrapper from '../PopupWrapper'

function DeleteAccount({closePopup}) {

    let [password, setPassword] = useState('');
    let [loading, setLoading] = useState(false)

  return (
<PopupWrapper>
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
</PopupWrapper>
  )
}

export default DeleteAccount
