import React from 'react'
import PopupWrapper from '../PopupWrapper';
import { useEffect } from 'react';
import axios from 'axios';


function TransactionOverview({hidePopup}) {

  const [overview, setOverview] = React.useState({});

  async function fetchTransactionOverview(){

    // fetching API...
    const result = await axios.get('http://192.168.1.7:8000/api/user/setting/transaction-status', {
      withCredentials: true //set credentials
    })

    // API response
    const apiResponse = result.data

    // set data of transaction overview
    setOverview(apiResponse.data)
  }
  console.log(overview);
  
  useEffect(()=> {
    // fetching data...
    fetchTransactionOverview()
  }, [])

  return (
    <PopupWrapper>
      
  
  {/* Transaction summary popup */}
     <div
     className='row overflow-auto  justify-content-center bg-light transaction-overview-popup  pt-3 pb-2 rounded-3'>


            {/* heading */}
      <div className="col-11 d-flex border-bottom border-secondary flex-column">
        <h5 
        className="text-black mb-1">Transaction Summary 📊</h5>


             {/*(heading)  */}
         <span className='text-secondary'>
          This month
          </span>


          {/* income and expense total amount */}
         <p>
           Expense: <span className='fw-bold'> ₹{overview.totalExpense} </span> | 
           Income: <span className='fw-bold'> ₹{overview.totalIncome} </span>
         </p>
          
         {/* show transaction status if user has set monthly budget  */}
          {
         overview.isBudgetSet ?  <span className='text-black'>
          Status: <span 
          className={overview.isLimitExceeded ? 'text-danger': 'text-success'}>
            { overview.isLimitExceeded ? 'Spending Limit exceeded!': 'Spending Limit available' }
          </span>
          </span> : ''
           } 
           
      </div>


      {/* list of transactions this month */}
      <div className="col-11">
      <div className="category-list mt-3">

        {/* each category */}
        {overview?.eachCategoryTotal?.length ? (overview.eachCategoryTotal.map((category, index) => (
          <div key={index} className="d-flex  justify-content-between text-black mb-2">
            {/* category */}
            <span className="text-capitalize">{category._id}</span>

            {/* amount */}
            <span 
            className={`${category.type === 'expense' ? 'text-danger':'text-success'} fw-bold`}>

      {category.type === 'expense' ? '-₹'+category.totalAmount: '+₹'+category.totalAmount}
              
              </span>
          </div>
        ))) : ('No transactions found this month')}
      </div>

      </div>


      <div className='col-12 mt-3'>

{/* close popup button */}
        <button
         className='btn text-white bg-secondary  w-100'
         onClick={hidePopup}>
          Close
        </button>


      </div>
       </div>
  
  
</PopupWrapper>
  )
}

export default TransactionOverview
