import React from 'react'
import PopupWrapper from '../PopupWrapper'

function DeleteConfirmation({hidePopup}) {


  return (
    <PopupWrapper>
    <div className='d-flex flex-column delete-confirmation-popup  bg-light mb-3 py-4 px-4 rounded-4'>

{/* confirmation message */}
        <p className='fw-bold fs-5  mb-4 border-bottom border-secondary pb-3'>
            Are you sure you want to delete it permanantely?
            </p>          


<div>
    {/* close popup */}
    <button 
    className='btn btn-secondary me-3'
    onClick={hidePopup}>
        Cancel

    </button>

{/* Delete transactions */}
    <button className='btn btn-danger'>
        Delete
        
    </button>

</div>


      
    </div>
    </PopupWrapper>
  )
}

export default DeleteConfirmation
