import React from 'react'
import PopupWrapper from '../PopupWrapper'

function ProfileUpdate({heading, placeholder, closePopup}) {
  return (
    <PopupWrapper>

        {/* profile updation popup (PATCH) */}
    <div 
    className='profile-update-popup p-4 d-flex flex-column bg-light  justify-content-center rounded-4'>

        <form>

{/* label for changing email */}
            <label htmlFor="modify-profile" className='mb-4 fw-bold'>
                <h5 className='fw-bold mb-4'>{heading}</h5>

               {/* input to enter new email */}
                <input 
                type="text" 
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

            className='text-white btn fw-bold bg-primary mb-2  rounded-3 border-0'>

                Submit

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
  )
}

export default ProfileUpdate
