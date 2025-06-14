    import React, { useEffect, useState } from 'react'
    import {Settings2Icon , CalendarArrowDown } from 'lucide-react'
    import axios from 'axios'
    
    function Transactions() {
        let [transactionData, setTransactionData] = useState([])
        let [message, setMessage] = useState('');
    
        // fetch transactions
        async function fetchTransactions(){
               // getting response...
         const response = await axios.get('http://localhost:8000/api/transaction', 
            { withCredentials: true }) //sends the request including (cookies, headers)
    
        // api response(contains data, dataLength requestTime)
         const apiResponse = response.data;

        //  transaaction data
         setTransactionData(apiResponse.data || [])

        //  additional message (client has no transactions and other infos)
         setMessage(apiResponse.message || '')
        }
    
        useEffect(()=>{
    
            // fetch transactions...
            fetchTransactions()
        }, [])
    
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
                      <p className='mb-0'>Filters</p>
                      </button>
    
                            {/* Sort transactions by date*/}
                    <button className='rounded-4  d-flex align-items-center '>
                       <CalendarArrowDown className='me-2 text-success transactions-options-icon'/>
                        <p className='mb-0'>Sort by Date</p>
                        </button>
                        </div>
                    </div>
                </div>
    
            
                
                  <div className="row transaction-history-container d-flex justify-content-center">
    
           {/* Heading */}
           <div className='col-11 col-xl-8 mb-1 transaction-card-heading d-flex justify-content-between'>
                    <p className='mb-0 fw-bold'>
                        {transactionData.length + ' Transaction(s) are found'}
                    </p>
    
                      {/* remaining  budget*/}
                      <span className='fw-normal'>
                        Budget left:
                        <span className=' ms-1 text-danger fw-bold'>
                             $500
                            </span>
                        </span>
                </div>
    
             {/* Each transaction */}
           { transactionData?.length ? ( 
                transactionData.map((tran, index) => (
        <div className={`col-12 mb-2 col-xl-8 transaction-card py-3`}
        key={index} id={index}>
    
                         {/*  transaction details */}
                         <div className='mb-3 d-flex justify-content-between align-items-center'>
                            {/* transaction category (food, education, etc)*/}
                            <span 
                               className='fw-bold text-capitalize transaction-category mb-0 d-flex align-items-end'>
                                {tran.category + ' |'}
            
                               {/* transaction type (expense or salary)*/}
                               <span className='fw-normal text-end text-capitalize ms-1 transaction-type'>
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
                             
                             
    
                   {/* transaction amount */}
                    <p 
                    className={`ms-1 fw-bold 
                    ${tran.type ==='salary' ? 'text-success' : 'text-danger' }`}>
    
                     {/* append '-' on expense and '+' on salary  */}
                    {tran.type ==='salary' ? `+₹${tran.amount}` : `-₹${tran.amount}` }
                        
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
            <div className=' col-12 col-xl-8 d-flex mt-5 rounded-2 justify-content-center align-items-center'
            style={{height:'250px', border: '1px rgba(0, 0, 0, 0.46) solid'}}>
                <h4 className='fw-bolder d-inline'>
                       {!transactionData?.length ? message : ''}     
                </h4>
                </div>)}
    
            </div>
            </div>
    
    
             {/* Transaction ended message */}
            <div className='d-flex mb-5 mt-2 justify-content-center'>
               <h4 className='bg-dark w-100 text-center py-2  fw-bolder text-white  '>
                   { transactionData.length?  "End of results": ''}
               </h4>
                </div>
          
        </div>
      )
    }
    
    export default Transactions