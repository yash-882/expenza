import React, { useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import axios from 'axios'

function SetMonthlyBudget({hidePopup}) {
    let [budget, setBudget] = useState(0);

  return (
 <PopupWrapper>
    <div className='bg-light py-4 d-flex flex-wrap flex-column  px-4 rounded-4'
    style={{maxWidth: '400px'}}>
        <h5 className='fw-bold mb-4'>
        {/* heading */}
       Set monthly budget
        </h5>

        {/* set budget form */}
        <form className='w-100'>
                <input
                className='p-2 border-0 rounded-3 w-100 mb-4'
                placeholder='₹ Enter budget amount'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                type="text"
                inputMode='numeric'
                onChange={(evt) => setBudget(evt.target.value)}/>

            {/* button container */}
            <div className='btn-block mb-3 w-100 d-flex flex-wrap flex-column justify-content-between'>
                {/* submit budget amount */}
                <button 
                className="btn btn-primary fw-bold mb-2">
                    Submit
                </button>

                {/* close popup */}
                <button 
                type='button'
                className="btn btn-secondary fw-bold"

                // remove popup 
                onClick={hidePopup}> 
                    Cancel
                </button>

            </div>
                    
        {/* warning about transaction summary  */}
        <p 
        style={{fontSize:'14px'}}
        className='mb-1 d-inline  fw-bolder'>
           Updating or creating a monthly budget will reset the month, 
           clear past summaries, and start a new one from today
        </p>
        </form>
      <div>

      </div>
    </div>


    </PopupWrapper>
  )
}

export default SetMonthlyBudget
