import React, { useEffect, useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import {Settings2Icon} from 'lucide-react'


function TransactionFilters(
{fetchTransactions, createParameters, 
closeSlidePanel, categories, selectCategory, 
handleSortByAmount, sortByAmount, clearFilters, handleSetTransactionType, transactionType}) {

    let [isApplied, setSetApplied] = useState(false)
    
     function handleSetApplied(){
        setSetApplied(true) // apply filters
        
    }

    useEffect(()=> {

        // fetch transactions if the filters are applied
        async function executeFetching(){
            if(isApplied){
                closeSlidePanel() //close slide panel
                let params = createParameters() //create query parameters
               await fetchTransactions(params) //fetch transactions
            }
    }

        executeFetching()

    }, [isApplied])

  return (
    <PopupWrapper>
               {/* contains categories and amount */}
        <div className='px-2 py-2 d-flex flex-column align-items-start justify-content-center  transaction-filter-silde-panel bg-light'>

        <div className='border-bottom d-flex py-1 w-100'>
    {/* heading */}
                {/* icon */}
                <Settings2Icon size={30} className=' ms-1 text-primary'/>
             <h4 className='ms-1 fw-bold'>Find by filters 
                
                </h4>
            
        </div>

{/* transaction type */}
          <div className='d-flex flex-wrap   pt-3 pb-2 transactions-categories-list'>  
              <h5 className='me-2 py-1 mb-0 fw-bold'>Type</h5>
            <div 
                role='button' 
                data-id='all'
                className={` 
                ${(!transactionType.expense && !transactionType.income) || transactionType.all? 
                'highlight-filter-option': ''} 
                 me-2 mb-2 fw-bold px-2 py-1 transaction-category-option`}
                 onClick={handleSetTransactionType}>
                    All
                </div>
            <div 
                 role='button' 
                data-id='expense'
                 className={` ${transactionType.expense ? 'highlight-filter-option': ''} 
                 me-2 mb-2 fw-bold px-2 py-1 transaction-category-option`}
                 onClick={handleSetTransactionType}>
                    Expense
                </div>
            <div 
                 role='button' 
                data-id='income'
                 className={` ${transactionType.income ? 'highlight-filter-option': ''} 
                 me-2 mb-2 fw-bold px-2 py-1 transaction-category-option`}
                 onClick={handleSetTransactionType}>
                    Income
                </div>

          </div>
        
                     {/* // categories */}
                 <div className='d-flex py-2 flex-wrap transactions-categories-list ' aria-multiselectable={true}>
                     <h5 className='me-2  py-1  fw-bold mb-0'>Categories</h5>
                
                {
                    categories.map((categ, index) => (
                        
                        // category option
                        <div 
                        data-id={categ.id}
                        className={`${categ.isActive ? 'highlight-filter-option' : ''}
                        me-2 mb-2 fw-bold px-2 py-1  transaction-category-option`} 
                        onClick={selectCategory}
                        key={index}>

                      {/* category name */}
                      <span>
                        {categ.id[0].toUpperCase() + categ.id.slice(1, categ.id.length)}
                        </span>  

                        </div>
                            
                    ))
                }


                </div>
                {/* option to sort by amount */}
                    <div className='d-flex py-2 flex-wrap mb-3 transactions-categories-list'>
                     <h5 className='me-2 py-1 fw-bold mb-0'>Sort by Amount</h5>

{/* sort by lowest to highest amount */}
                 <div 
                 role='button' 
                 data-id='ascending'
                 className={` ${sortByAmount === 'sort-in-ascending' ? 'highlight-filter-option': ''} 
                 me-2 mb-2 fw-bold px-2 py-1 transaction-category-option`}
                 onClick={handleSortByAmount}>
                    Lowest to highest

                    </div>

{/* sort by highest to lowest amount */}

                 <div 
                 role='button' 
                data-id='descending'
                 className={` ${sortByAmount === 'sort-in-descending' ? 'highlight-filter-option': ''} 
                 me-2 mb-2 fw-bold px-2 py-1 transaction-category-option`}
                 onClick={handleSortByAmount}>
                    Highest to lowest
                    </div>

                </div>

                <div 
                className='filter-panel-btn-group '>

                     {/* apply filters */}
                    <button 
                    onClick={handleSetApplied}
                    className='btn mb-1 me-2 text-primary fw-bold'>
                        Apply
                    </button>
                    {/* clear filters */}
                    <button 
                    onClick={clearFilters}
                    className='btn mb-1 me-2 text-danger fw-bold'>
                        Clear Filters
                    </button>
                    {/* close panel */}
                    <button 
                    className='btn mb-1  btn-secondary fw-bold'
                    onClick={closeSlidePanel}>
                        Close
                     </button>


                </div>

        </div>


    </PopupWrapper>
      
    
  )
}

export default TransactionFilters
