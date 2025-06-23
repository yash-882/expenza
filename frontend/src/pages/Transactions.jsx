    import React, { useContext, useEffect, useState } from 'react'
    import {Settings2Icon , CalendarArrowDown } from 'lucide-react'
    import axios from 'axios'
    import TransactionOverview from '../components/modals/TransactionOverview';
    import getReadableDate from '../utils/functions/readable-date';
    import TransactionFilters from '../components/modals/TransactionFilters'
    import { transactionCategories } from '../constants/transactions/transaction-categories';
    import { UserContext } from '../contexts/UserContext';
    import { Navigate, useNavigate } from 'react-router-dom';
    
    
    function Transactions() {
  
      // user's authentication status
      const {isAuthenticated, setIsAuthenticated} = useContext(UserContext)
      const navigate = useNavigate()
      
        let [transactionData, setTransactionData] = useState([])
        let [message, setMessage] = useState('');
        let [overviewPopup, setOverviewPopup] = useState(false)
        let [filtersSlidePanel, setFiltersSlidePanel ] = useState(false)
        let [sortByAmount, setSortByAmount] = useState('')
        let [transactionType, setTransactionType] = useState({
          expense: false,
          income: false,
          all: true
        })

        let [categories, setCategories] = useState(
          // copying categories...
          transactionCategories.map(categ => ({...categ, isActive: false}))
        )
        
        let [sortOrder, setSortOrder] = useState({
          descending: true,
          ascending: false
        })

        let [loading, setLoading ] = useState(false)
        
        function clearFilters() {

          // reset all selected categories
          setCategories(  
            transactionCategories.map(categ => ({...categ, isActive: false})) 
          )
          // reset sort value
          setSortByAmount('')

          // reset type to 'all'
          setTransactionType('all')
        }

        function handleSortByAmount(evt){
          const btnID = evt.currentTarget.dataset.id;

          // sort transactions by amount in ascending order
          if(btnID === 'ascending'){
            setSortByAmount('sort-in-ascending')
          }
          // sort transactions by amount in descending order
          else if(btnID === 'descending'){
            setSortByAmount('sort-in-descending')
          }        
      }

      // set transaction type
        function handleSetTransactionType(evt){
          // selected transaction-type id
          const transacTypeID = evt.currentTarget.dataset.id;        

          // selected types
          setTransactionType(prevType => {

            if(transacTypeID !== 'all')
              // unhighlight 'all' option when different option is selected
              return {...prevType, 
                [transacTypeID]: !prevType[transacTypeID], 
                all: false, 
              }

              // highlight 'all' option and unhighlight other deselected options
              else 
              return {
                 expense: false,
                 income: false,
                 all: true, 
              }
            
          })  
      }
      

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

    // create query parameters
    function createParameters(){

        // filter only selected categories
        const selectedCategories = categories.filter(categ => categ.isActive)

        // params to be used for sorting results
        let toSortBy = []
        // sorting amount order
        if(sortByAmount === 'sort-in-ascending')
          toSortBy.push('amount')
        
        else if(sortByAmount === 'sort-in-descending')
            toSortBy.push('-amount')
            

          //sort order by date is applied in ascending
          if(sortOrder.ascending)
           toSortBy.push('createdAt')

          
          //sort order by date is applied in descending
          else if(sortOrder.descending){
            toSortBy.push('-createdAt')
          }

          // sorting parameters
          let qs = 'sort=' + toSortBy.join(',') + '&' 


          // filter transaction type

         //if type is 
         if(transactionType.expense)
          qs = qs + 'type=expense&'

         //sort order by date is applied in descending
          if(transactionType.income){
            qs = qs + 'type=income&'
         }

        // if any category(s) are selected
        if(selectedCategories.length){
            selectedCategories.forEach(categ => {
   
                // appending categories
              qs = qs.concat(`category=${!categ.emoji ? categ.id : categ.emoji + ' ' + (categ.id)}&`)
            })
        }
         
        // remove '&' from the end of query string
        if(qs[qs.length-1] === '&')
            qs = qs.slice(0, qs.length - 1)
          
        // encodes a full URI by escaping special characters like spaces, but keeps URI structure (e.g. ?, =, &)
        return encodeURI(qs)
    }

        // fetch transactions
        async function fetchTransactions(params){
          const setParams = params ? params : '';
          // getting response...

          setLoading(true) //show loading while fetching..
              const response = await axios.get(`http://192.168.1.7:8000/api/transaction?${setParams}`, 
            { withCredentials: true }) //sends the request including (cookies, headers)
    
        // api response(contains data, dataLength requestTime)
         const apiResponse = response.data;
         
         

           //  transaaction data
           setTransactionData(apiResponse.data || [])
           //  additional message (client has no transactions and other infos)
           setMessage(apiResponse.message || '')

           setLoading(false) // remove loading after setting data
   
        }

        useEffect(() => {
          // redirect to '/login' if not authenticated
          if(!isAuthenticated)
            navigate('/login')

        }, [isAuthenticated])
          
          
          useEffect(()=> {
          // sort order of transactions...
          let params = createParameters();
          
          // if sorting applied
          if(sortOrder.ascending || sortOrder.descending)
          fetchTransactions(params)

        }, [sortOrder.descending, sortOrder.ascending])


          return (

  <>
    <div className='container-fluid pt-2'>
      <div className="row d-flex justify-content-center">
        {/* options (filter, sort, etc) */}
        <div className="col-12 mb-3 col-xl-8 customize-transactions-options py-2">
          <div className="row">
            <div className="col d-flex justify-content-evenly">

              {/* Filter transactions */}
              <button
                onClick={() => setFiltersSlidePanel(true)}
                className='rounded-4 d-flex align-items-center '>
                <Settings2Icon color='blue' className='me-2 transactions-options-icon' />
                <p className='mb-0'>Filters</p>
              </button>

              <div className="dropdown">
                {/* Sort transactions by date*/}
                <button
                  className='rounded-4 dropdown-toggle d-flex align-items-center' id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <CalendarArrowDown className='me-2 text-success transactions-options-icon' />
                  <p className='mb-0'>Sort by Date</p>
                </button>

                {/* sorting menu */}
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a
                      className="dropdown-item border-bottom border-muted"
                      role='button'
                      onClick={() => setSortOrder({ ascending: false, descending: true })}>
                      {'Latest (Default)'}
                    </a></li>

                  <li>
                    <a className="dropdown-item"
                      onClick={() => setSortOrder({ ascending: true, descending: false })}
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

            {/* remaining  budget */}
            <button
              className={`text-success fw-bold  text-decoration-underline border-0 bg-transparent transaction-overview-btn`}
              onClick={() => setOverviewPopup(true)}>
              View Summary
            </button>
          </div>

          {/* Transactions or Loader */}
          {loading ? (
            <div className='d-flex justify-content-center py-5'>
              <span className='loader'></span>
            </div>
          ) : transactionData?.length ? (
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

                  {/* options */}
                  <span className='mb-0'>
                    {/* Delete transaction */}
                    <button className='btn text-danger transaction-card-opt text-white p-1'>
                      Delete
                    </button>
                  </span>
                </div>

                {/* transaction amount */}
                <p
                  className={`ms-1 fw-bold 
                    ${tran.type === 'income' ? 'text-success' : 'text-danger'}`}>

                  {tran.type === 'income' ? `+₹${tran.amount}` : `-₹${tran.amount}`}
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
            // when user has 0 transactions
            <div className=' col-12 col-xl-8 d-flex mt-5 rounded-2 justify-content-center align-items-center'
              style={{ height: '250px', border: '1px rgba(0, 0, 0, 0.46) solid' }}>
              <h4 className='fw-bolder d-inline'>
                {!transactionData?.length ? message : ''}
              </h4>
            </div>
          )}
        </div>
      </div>

      {/* Transaction ended message */}
      <div className='d-flex mb-5 mt-2 justify-content-center'>
        <h4 className='bg-dark w-100 text-center py-2  fw-bolder text-white  '>
          {transactionData.length ? "End of results" : ''}
        </h4>
      </div>
    </div>

    {/* slider-panel for filtering transactions */}
    {filtersSlidePanel && <TransactionFilters
      closeSlidePanel={() => setFiltersSlidePanel(false)}
      selectCategory={selectCategory}
      categories={categories}
      handleSortByAmount={handleSortByAmount}
      sortByAmount={sortByAmount}
      clearFilters={clearFilters}
      fetchTransactions={fetchTransactions}
      createParameters={createParameters}
      handleSetTransactionType={handleSetTransactionType}
      transactionType={transactionType} />}

    {/* transactions overview */}
    {overviewPopup ? <TransactionOverview
      hidePopup={() => setOverviewPopup(false)} /> : ''}
  </>
)


    }
    
    export default Transactions