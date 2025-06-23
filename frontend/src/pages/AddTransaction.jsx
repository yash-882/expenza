import React, { useEffect, useState } from 'react'
import { categoriesByType } from '../constants/transactions/transaction-categories'
import { ShoppingBagIcon, BookText } from 'lucide-react'


function AddTransaction() {
    let [category, setCategory] = useState('');
    let [categoryList, setCategoryList] = useState([])
    let [type, setType] = useState('');

    let [errMessage, setErrMessage] = useState('')
    let [loading, setLoading] = useState(false)

    function handleCategory(evt) {
        //get category ID through dataset attribute
        const categoryID = evt.currentTarget.dataset.id;

        // set categiry
        setCategory(categoryID)

    }

    function handleTransacType(type) {

        // set transaction type
        setType(type)

        // clear err message 
        if (errMessage === 'Select transaction type first')
            setErrMessage('')
    }

    useEffect(() => {

        //set category  list based on the 'type'

        if (type === 'expense') {
            setCategoryList(categoriesByType.expense)

        } else if (type === 'income') {
            setCategoryList(categoriesByType.income)
        }

    }, [type])


    return (
        <div className='d-flex justify-content-center w-`00 align-items-center'>


            {/* add-transaction form */}
            <div className="d-flex justify-content-center w-100 py-5 px-4 align-items-center rounded-4  flex-column">


                {/* heading */}
                <h4 className='fw-bolder mb-2'>Add Transaction</h4>

                {/* err message if occurs */}
                <p className={`${errMessage ? 'visible' : 'invisible'} text-danger`}>
                    {errMessage || 'text for occupying space'}
                </p>

                {/* transaction form */}
                <form className="d-flex w-100 justify-content-center  align-items-center flex-column">

                    {/* form fields container*/}

                    <div className="container-fluid ">

                        <div
                            className="row justify-content-center align-items-center flex-column">
                            {/*  transaction type */}
                            <div
                                className=" col-11 col-lg-6 col-md-6 col-xl-3 d-flex p-2 transaction-form-input-container rounded-3 mb-3 d-flex justify-content-between">
                                {/* shows current selected type */}
                                <input
                                    type="text"
                                    value={type}
                                    className='border-0 ms-2 w-100 text-capitalize text-black fw-bold bg-transparent'
                                    placeholder='Select type' disabled />

                                <div className="dropdown  ">


                                    {/* dropdown menu (expense and income) */}
                                    <div
                                        className="dropdown-menu rounded-3 dropdown-menu-dark transaction-form-dropdown"
                                        aria-labelledby="dropdownMenuLinkAddTransaction">
                                        {/* expense */}
                                        <div
                                            className="dropdown-item dropdown-item-transac"
                                            onClick={() => handleTransacType('expense')}>
                                            Expense
                                        </div>
                                        <div
                                            // income
                                            className="dropdown-item dropdown-item-transac"
                                            onClick={() => handleTransacType('income')}>

                                            Income
                                        </div>
                                    </div>

                                </div>
                                {/* toggle to select transaction type */}
                                <button
                                    className='fw-bold form-input-dropdown-btn rounded-3 btn-secondary btn btn-sm dropdown-toggle d-flex align-items-center'
                                    id="dropdownMenuLinkAddTransaction"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <BookText />
                                    <span className='ms-1'>Type</span>
                                </button>
                            </div>


                            {/* category  */}
                            <div
                                className=" col-11 col-lg-6 col-md-6 col-xl-3 d-flex p-2 transaction-form-input-container rounded-3 mb-3 d-flex justify-content-between">
                                {/* shows current selected category */}
                                <input
                                    type="text"
                                    className='border-0 w-100 text-black ms-2 fw-bold bg-transparent text-capitalize'
                                    placeholder='Select category'
                                    value={category}
                                    disabled />

                                <div className="dropdown">

                                    {/* toggle to select transaction category */}
                                    <button
                                        className='fw-bold  form-input-dropdown-btn rounded-3 btn-secondary btn btn-sm dropdown-toggle d-flex align-items-center'
                                        id="dropdownMenuLinkAddTransaction"

                                        // set toggle only if 'type' is selected
                                        data-bs-toggle={`${type ? 'dropdown' : ''}`}
                                        aria-expanded="false"
                                        onClick={(evt) => { //if 'type' is not selected 
                                            evt.preventDefault()
                                            if (!type)
                                                setErrMessage('Select transaction type first')
                                        }}>

                                        <ShoppingBagIcon />
                                        <span className='ms-1'>Category</span>
                                    </button>
                                    {/* dropdown menu of categories */}
                                    <div
                                        className={`dropdown-menu rounded-3 dropdown-menu-dark px-1 transaction-form-dropdown`}
                                        aria-labelledby="dropdownMenuLinkAddTransaction">
                                        {

                                            // looping over categories
                                            categoryList.map((categ, index) => (
                                                <div
                                                    className="dropdown-item p-1 text-capitalize mb-1  dropdown-item-transac"
                                                    data-id={categ}
                                                    key={index}
                                                    onClick={handleCategory}>
                                                    {categ}
                                                </div>

                                            ))
                                        }

                                    </div>

                                </div>
                            </div>

                            <div
                                className=" col-11 col-lg-6 col-md-6 col-xl-3 d-flex p-2  rounded-3 ">

                                {/* button for submit transaction */}
                                <button
                                    type='submit'
                                    className='btn w-100 fw-bold text-white submit-transaction-btn'>

                                    {/* loader */}
                                    <p
                                        className={`${loading ? 'd-block' : 'd-none'} loader mb-1 text-center`}
                                        style={{ height: '30px', width: '30px' }}>


                                    </p>
                                    {!loading ? 'Create' : ''}

                                </button>
                            </div>

                        </div>

                    </div>
                </form>




            </div>
        </div>
    )
}

export default AddTransaction
