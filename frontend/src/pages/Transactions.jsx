import React from 'react'
import {Settings2Icon , CalendarArrowDown } from 'lucide-react'

function Transactions() {
  return (
    <div className='container-fluid pt-2'>
        
        <div className="row d-flex justify-content-center">
            {/* options (filter, sort, etc) */}
            <div 
            className="col-11 col-xl-8 customize-transactions-options rounded-2 py-2 border border-secondary ">
                <div className="row">
                    <div className="col d-flex justify-content-evenly">
                <button className='rounded-4 d-flex align-items-center '>
                  
                  <Settings2Icon color='blue' className='me-2 transactions-options-icon'/>  
                  <p className='mb-0'>Filters</p></button>


                <button className='rounded-4  d-flex align-items-center '>
                   <CalendarArrowDown className='me-2 text-success transactions-options-icon'/>
                    <p className='mb-0'>Sort by Date</p></button>
                    </div>
                </div>
            </div>

                <div className="row"></div>


        </div>

        
      
    </div>
  )
}

export default Transactions
