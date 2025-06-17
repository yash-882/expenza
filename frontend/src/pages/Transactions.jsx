    import React, { useEffect, useState } from 'react'
    import {Settings2Icon , CalendarArrowDown } from 'lucide-react'
    import axios from 'axios'
    import TransactionOverview from '../components/modals/TransactionOverview';
    import getReadableDate from '../utils/functions/readable-date';
    import TransactionFilters from '../components/modals/TransactionFilters'
    import { transactionCategories } from '../constants/transactions/transaction-categories';
    
    
    function Transactions() {
        let [transactionData, setTransactionData] = useState([])
        let [message, setMessage] = useState('');
        let [overviewPopup, setOverviewPopup] = useState(false)
        let [filtersSlidePanel, setFiltersSlidePanel ] = useState(false)

        let [categories, setCategories] = useState(
          // copying categories...
          transactionCategories.map(categ => ({id: categ, isActive: false}))
        )

        let [sortOrder, setSortOrder] = useState({
          descending: true,
          ascending: false
        })

        function selectCategory(evt){
          // selected category id
        const categID = evt.currentTarget.dataset.id;
        
        // set category
        setCategories(allCategs => {

          // get index of selected option from allCategs array
        const categIndex = allCategs.findIndex(categ => categ.id === categID )

        // new array
        const updatedCategs = [...allCategs]

        // category option(object) that was clicked
        const categToMutate = updatedCategs[categIndex]
 
        // modifying the index's value(selected option) in array
        updatedCategs[categIndex] = {
          ...categToMutate,
          isActive: !categToMutate.isActive
        }
    
        return updatedCategs;

          })
    }

        // fetch transactions
        async function fetchTransactions(params){
          const setParams = params ? params : '';
               // getting response...
              const response = await axios.get(`http://192.168.1.7:8000/api/transaction?${setParams}`, 
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


          async function sortTransactionOrder(){
            let params = ''; //will contain a field as a part of query string for sorting

            //sort order is applied in ascending
            if(sortOrder.ascending)
              params = 'sort=createdAt'

            //sort order is applied descending
            else if(sortOrder.descending){
              params = 'sort=-createdAt'
            }

            // fetch transactions...
            fetchTransactions(params)
          }

          useEffect(()=> {
            // sort order of transactions...
            sortTransactionOrder()

          }, [sortOrder.ascending, sortOrder.descending])
          
          return (
            <>
            <div className='container-fluid pt-2'>
            
            <div className="row d-flex justify-content-center">
                {/* options (filter, sort, etc) */}
                <div 
                className="col-12 mb-3 col-xl-8 customize-transactions-options py-2">
                    <div className="row">
                        <div className="col d-flex justify-content-evenly">
    
                            {/* Filter transactions */}
                    <button 
                    onClick={() => setFiltersSlidePanel(true)}
                    className='rounded-4 d-flex align-items-center '>
                      <Settings2Icon color='blue' className='me-2 transactions-options-icon'/>  
                      <p className='mb-0'>Filters</p>
                      </button>


                <div className="dropdown">
                    {/* Sort transactions by date*/}
                    <button 
                    className='rounded-4 dropdown-toggle d-flex align-items-center' id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                       <CalendarArrowDown className='me-2 text-success transactions-options-icon'/>
                        <p className='mb-0'>Sort by Date</p>
                        </button>

                         {/* sorting menu */}
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                          <li>
                            <a 
                          className="dropdown-item border-bottom border-muted" 
                          role='button'
                          // set transaction order in descending (latest)
                          onClick={() => setSortOrder({ascending: false, descending: true})}>
                             {'Latest (Default)'}
                            </a></li>

                          <li>
                            <a className="dropdown-item" 
                          // set transaction order in descending (oldest )
                            onClick={() => setSortOrder({ascending: true, descending: false})}
                            role='button'>
                              Oldest
                              </a>
                            </li>
                        </ul>


                  </div>
  
                       </div>
                    </div>
                </div>
    
            
                
                  <div className="row transaction-history-container d-flex justify-content-center">
    
           {/* Heading */}
           <div className='col-11 px-0 col-xl-8 mb-1 transaction-card-heading d-flex align-items-center justify-content-between'>
                    <p className='mb-0 fw-bold'>
                        {transactionData.length + ' Transaction(s) are found'}
                    </p>
    
                      {/* remaining  budget*/}
    
                        <button 
                className={`text-success fw-bold  text-decoration-underline border-0 bg-transparent transaction-overview-btn`}
                onClick={()=> setOverviewPopup(true)}> 
                        View Summary
                        </button>
                           
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
            
                               {/* transaction type (expense or income)*/}
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
                    ${tran.type ==='income' ? 'text-success' : 'text-danger' }`}>
    
                     {/* append '-' on expense and '+' on income  */}
                    {tran.type ==='income' ? `+₹${tran.amount}` : `-₹${tran.amount}` }
                        
                    </p>
    
                    {/* transaction added dated */}
                    <p 
                    className={`ms-1 pb-1 transaction-date border-bottom border-secondary fw-bold`}>
                          {(getReadableDate(tran.createdAt))}
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
        {filtersSlidePanel && <TransactionFilters 
        closeSlidePanel = {()=>setFiltersSlidePanel(false)}
        selectCategory = {selectCategory}
        categories={categories}/>}

        {overviewPopup ? <TransactionOverview 
        hidePopup = {() => setOverviewPopup(false)}/> : ''}
        </>
      )
    }
    
    export default Transactions