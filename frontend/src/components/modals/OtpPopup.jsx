import React from 'react'
import PopupWrapper from '../PopupWrapper'

function OtpPopup({heading}) {
  return (
    <PopupWrapper>
    <div className='bg-light py-4 d-flex w-auto flex-wrap flex-column px-4 rounded-4'>
        <h5 className='fw-bold mb-4'>
        {heading}
        </h5>
    
        {/* OTP form */}
        <form>
                <input
                className='p-2 border-0 rounded-3 w-100 mb-4'
                placeholder='Enter OTP'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                type="text"
                inputMode='numeric' 
                id="otp-input" />

            {/* button container */}
            <div className='btn-block mb-3 w-100 d-flex flex-wrap flex-column justify-content-between'>
                {/* submit otp */}
                <button 
                className="btn btn-primary fw-bold mb-2">
                    Submit
                </button>

                {/* close popup */}
                <button 
                type='button'
                className="btn btn-secondary fw-bold mb-2">
                    Cancel
                </button>
                {/* resend otp button */}
                <button
                type='button' 
                className='text-primary bg-transparent border-0 '>
                    Resend OTP
                </button>

            </div>
        </form>
      <div>
        <p className='mb-0'>
            {/* message */}
        </p>
      </div>
    </div>
    </PopupWrapper>

  )
}

export default OtpPopup
