import React, {useState} from 'react'
import PopupWrapper from '../PopupWrapper'

function LogOut({closePopup}) {
    let [loading, setLoading] = useState(false)

  return (
         <PopupWrapper>
            <div className='d-flex flex-column bg-light mb-3 py-4 px-4 rounded-4'>

                {/* confirmation message */}
                <p className='fw-bold fs-5  mb-4 border-bottom border-secondary pb-3'>
                 Are you sure you want to log out?
                </p>


                <div>
                    {/* close popup */}
                    <button
                        className='btn btn-secondary me-3'
                        onClick={closePopup}>
                        Cancel
                    </button>

                    {/* logout button */}
                    <button
                        className='btn btn-danger'
                        disabled={loading}>
                        {/* loader */}
                        <p
                            className={`${loading ? 'd-block' : 'd-none'} loader mb-1 text-center`}
                            style={{ height: '25px', width: '25px' }}>

                        </p>
                        {!loading ? 'Logout' : ''}

                    </button>

                </div>



            </div>
        </PopupWrapper>
  )
}

export default LogOut
