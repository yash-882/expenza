import React from 'react'
import PopupWrapper from '../PopupWrapper';


function TransactionOverview({hidePopup}) {
  
  // temporary data sample
  const categories = ['food','transport','housing','entertainment','healthcare',
              'education','others', 'income', 'freelance', 'bonus']

  const [amounts, setAmounts] = React.useState({
    food: 0,
    transport: 0,
    housing: 0,
    entertainment: 0,
    healthcare: 0,
    education: 0,
    others: 0,
    income: 0,
    freelance: 0,
    bonus: 0
  });

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
           Expense: 300 | Income: 400
         </p>
          
         {/* show transaction status if user has set monthly budget  */}
          {
         1 ?  <span className=' text-black'>
          Status: <span className='text-danger'>Limit exceeded!</span>
          </span> : ''
           } 
           
      </div>


      {/* list of transactions this month */}
      <div className="col-11">
      <div className="category-list mt-3">

        {/* each category */}
        {categories.map((category, index) => (
          <div key={index} className="d-flex  justify-content-between text-black mb-2">
            {/* category */}
            <span className="text-capitalize">{category}</span>

            {/* amount */}
            <span className='text-danger fw-bold'>${amounts[category]}</span>
          </div>
        ))}
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
