import React from 'react'
import {Settings2Icon , CalendarArrowDown } from 'lucide-react'

function Transactions() {
  return (
    <div className='container-fluid pt-2'>
        
        <div className="row d-flex justify-content-center">
            {/* options (filter, sort, etc) */}
            <div 
            className="col-12 mb-3 col-xl-8 customize-transactions-options py-2">
                <div className="row">
                    <div className="col d-flex justify-content-evenly">

                        {/* Filter transactions */}
                <button className='rounded-4 d-flex align-items-center '>
                  
                  <Settings2Icon color='blue' className='me-2 transactions-options-icon'/>  
                  <p className='mb-0'>Filters</p></button>


                <button className='rounded-4  d-flex align-items-center '>
                   <CalendarArrowDown className='me-2 text-success transactions-options-icon'/>
                    <p className='mb-0'>Sort by Date</p></button>
                    </div>
                </div>
            </div>

        
            
              <div className="row transaction-history-container d-flex justify-content-center">

       {/* Heading */}
           <div className='col-12 col-xl-8 mb-1 transaction-card-heading d-flex justify-content-between'>
                    <span className='mb-0 text-center fw-bold'>
                        {[].length + ' Transaction(s) are found'}
                    </span>
    
                      {/* remaining  budget*/}
                      <span className='text-center fw-normal'>
                        Budget left:
                        <span className=' ms-1 text-center text-danger fw-bold'>
                             $500
                            </span>
                        </span>
                </div>

         {/* Each transaction */}
       { []?.length ? ( 
            [{}].map((tran, index) => (
    <div className={`col-12 mb-2 col-xl-8 transaction-card py-3`}
    key={index} id={index}>

                     {/*  transaction details */}
                     <div className='mb-3 d-flex justify-content-between align-items-center'>
                        {/* transaction category (food, education, etc)*/}
                        <span 
                           className='fw-bold transaction-category mb-0 d-flex align-items-center'>
                            {tran.category + ' |'}
        
                           {/* transaction type (expense or salary)*/}
                           <span className='fw-normal ms-1 transaction-type'>
                              {tran.type}
                            </span>
                            </span>
    
                            { /* options */}
                            <span  className='mb-0'>
                           {/* Delete transaction */}
                           <button className='btn text-danger transaction-card-opt text-white p-1'>
                                    Delete
                            </button>                            
                            </span >     
                     </div>
                         
                         

               {/* transacto=ion amount */}
                <p 
                className={`ms-1 fw-bold 
                ${tran.type ==='Salary' ? 'text-success' : 'text-danger' }`}>
                    ₹{tran.amount}
                </p>

                {/* transaction added dated */}
                <p 
                className={`ms-1 pb-1 transaction-date border-bottom border-secondary fw-bold`}>
                      {tran.createdAt}
                </p>


         {/* transaction description */}
           <span className='ms-1 fw-bold'>Description: </span>
              <p className='d-inline transaction-description'>
                    {tran.description || 'No description provided'}
                    </p>

                    </div>
    ))
) : (
       //  when user has 0 transactions
        <div className='d-flex mt-2 justify-content-center'>
            <h4>
                No transactions found
            </h4>
            </div>)}

        </div>
        </div>


         {/* Transaction ended message */}
        <div className='d-flex mb-5 mt-2 justify-content-center'>
            <h4>
               { []?.length ?  "That's all you've transacted )": ''}
                
            </h4>
            </div>
      
    </div>
  )
}

export default Transactions
