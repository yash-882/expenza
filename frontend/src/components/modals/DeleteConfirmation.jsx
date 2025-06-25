import React, { useEffect, useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import axios from 'axios';

function DeleteConfirmation({ hidePopup, dataToDelete, refetchData }) {
    let [isDelete, setDeleteData] = useState(false);
    let [errMessage, setErrMessage] = useState('');
    let [loading, setLoading] = useState(false)

    async function deleteData() {
        try {
            setErrMessage('') //clear prev err message
            setLoading(true) //show loading  

            await axios.delete(`http://192.168.1.7:8000/api/${dataToDelete.apiPath}/${dataToDelete.id}`,
                { withCredentials: true })



            setLoading(false)

        } catch (err) {

            setLoading(false)
            setErrMessage(err.response?.data.message || 'Server error, please try again later')
        }
    }

    useEffect(() => {

        async function handleTask() {
            if (isDelete) {
                setLoading(true) //show loading
                await deleteData() //deleting data...
                hidePopup() //hide popup
                refetchData()//fetch data to show new results
            }
        }

        handleTask()

    }, [isDelete])

    return (
        <PopupWrapper>
            <div className='d-flex flex-column delete-confirmation-popup  bg-light mb-3 py-4 px-4 rounded-4'>

                {/* confirmation message */}
                <p className='fw-bold fs-5  mb-4 border-bottom border-secondary pb-3'>
                    Are you sure you want to delete it permanantely?
                </p>


                <div>
                    {/* close popup */}
                    <button
                        className='btn btn-secondary me-3'
                        onClick={hidePopup}>
                        Cancel
                    </button>

                    {/* delete transaction button 🔴*/}
                    <button
                        className='btn btn-danger'
                        onClick={() => setDeleteData(true)}>
                        {/* loader */}
                        <p
                            className={`${loading ? 'd-block' : 'd-none'} loader mb-1 text-center`}
                            style={{ height: '25px', width: '25px' }}>

                        </p>
                        {!loading ? 'Delete' : ''}

                    </button>

                </div>



            </div>
        </PopupWrapper>
    )
}

export default DeleteConfirmation
