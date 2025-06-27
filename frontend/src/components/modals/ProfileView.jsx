import React, { useEffect, useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import axios from 'axios'
import NotificationPopup from './NotificationPopup'
import readableDate from '../../utils/functions/readable-date'

function ProfileView({closePopup}) {
    let [accountDetails, setAccountDetails] = useState(null);
    let [notify, setNotify] = useState(false);
    let [notificationInfo, setNotificationInfo] = useState({ type: '', message: '' });

    async function fetchAccountDetails() {
        try{
        const response = await axios.get('http://192.168.1.7:8000/api/user/setting/account-details',
            {withCredentials: true}
        );

        const apiResponse = response.data;
        
        setAccountDetails(apiResponse.data);
    } 
    
    catch(err){
    
        setNotificationInfo({
            type: 'error',
            message: err.response?.data?.message || 'Server error, please try again later'}); 
        setNotify(true)
    }
    
    }

    useEffect(() => {
        // Fetch account details when the component mounts
        fetchAccountDetails();
    }, [])


  return (
    <PopupWrapper>
    <div className='profile-view-popup p-4 d-flex flex-column bg-white align-items-start justify-content-center rounded-3'>
        {/* heading */}
        <h4 className='mb-4 fw-bold d-inline'>Account</h4>

        <div className="mb-3 d-flex justify-content-between w-100">
            {/* email label */}
            <span className='me-5 fw-bold'>
                Email
            </span>
            {/* user's email address */}
            <span className=''>
                {accountDetails?.email || 'Loading...'}
            </span> 
        </div>

        {/* name container */}
        <div className="mb-3 d-flex justify-content-between w-100">
            {/* name label */}
            <span className='me-5 fw-bold'>
                Name
            </span>
            {/* user's name */}
            <span>
            {accountDetails?.name || 'Loading...'}

            </span>

        </div>

        {/* created at container */}
        <div className="mb-4 d-flex justify-content-between w-100">
            {/* created at label */}
            <span className='me-5 fw-bold'>
                Created at
            </span>

            {/* user was created at */}
            <span>

        {accountDetails ? readableDate(accountDetails?.createdAt) : 'Loading...'}

            </span>
        </div>
        {/* close popup button */}
        <button 
        className="btn btn-secondary w-100"
        onClick={closePopup}>
            Close
        </button>

    </div>
    {/* Notify when needed*/}
     {notify && <NotificationPopup
     notificationInfo={notificationInfo}
     removePopup={() => setNotify(false)}/>}
    </PopupWrapper>

  )
}

export default ProfileView
