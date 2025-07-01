import PopupWrapper from '../PopupWrapper';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationPopup from './NotificationPopup';


function TransactionOverview({hidePopup}) {

  const [overview, setOverview] = useState({});
  let [loading, setLoading ] = useState(false);

         // state for displaying popups
  let [notificationPopup, showNotificationPopup] = useState(false)
        
          // state for error or success messages
  let [notificationInfo, setNotificationInfo] = useState({
          type: '', 
          message: '',
      });

  async function fetchTransactionOverview(){

    try{

    setLoading(true) //loading in process...

    // fetching API...
    const result = await axios.get('http://192.168.1.7:8000/api/user/setting/transaction-status', {
      withCredentials: true //set credentials
    })

    setLoading(false) //remove loading

    // API response
    const apiResponse = result.data

    // set data of transaction overview
    setOverview(apiResponse.data)
  } 
  catch(err){
         // remove loading
            setLoading(false)

           // create error message
            setNotificationInfo({
                type: 'error', 
                message: err.response?.data.message || 'Server error, please try again later'
            })

            // show popup
            showNotificationPopup(true)
  }
  }
  
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
        className="text-black mb-1 fw-bold">
           {
            //  show loader when api request is in process
          loading ? <p className='loader mb-0 ' style={{height: '30px', width:'30px'}}>
          </p>: 'Transaction Summary 📊' }
          </h5>


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

         {/* Show monthly budget  */}
          {
            <p className='text-black'>
            Monthly budget: 
            <span className='fw-bold'>
           {   overview.isBudgetSet ? ' ₹' + overview.monthlyBudget : ' Not set'}
            </span>
            </p>
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

       {notificationPopup && 
       <NotificationPopup 
       removePopup={()=> showNotificationPopup(false)}
       notificationInfo={notificationInfo}/>}
  
</PopupWrapper>
  )
}

export default TransactionOverview
