import React from 'react'
import PopupWrapper from '../PopupWrapper'

function ProfileView() {
  return (
    <PopupWrapper>
    <div className='profile-view-popup p-4 d-flex flex-column bg-white align-items-start justify-content-center rounded-3'>

        {/* heading */}
        <h4 className='mb-4 fw-bold'>Account</h4>

        {/* email container  */}
        <div className="mb-3 d-flex justify-content-between w-100">
            {/* email label */}
            <span className='me-5 fw-bold'>
                Email
            </span>
            {/* user's email address */}
            <span className=''>
                yashh2nd@gmail.com
            </span> 
        </div>

        {/* name container */}
        <div className="mb-3 d-flex justify-content-between w-100">
            {/* name label */}
            <span className='me-5 fw-bold'>
                Name
            </span>
            {/* user's name */}
            <span>
                Yash
            </span>

        </div>

        {/* created at container */}
        <div className="mb-4 d-flex justify-content-between w-100">
            {/* created at label */}
            <span className='me-5 fw-bold'>
                Created at
            </span>

            {/* user was created at */}
            <span>
                23 February 2011
            </span>


        </div>

        {/* close popup */}
        <button className="btn btn-secondary w-100">
            Close
        </button>

    </div>
    </PopupWrapper>

  )
}

export default ProfileView
