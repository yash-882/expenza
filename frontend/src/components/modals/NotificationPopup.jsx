import React, { useEffect } from 'react'

function NotificationPopup({notificationInfo, removePopup}) {

    function checkType() {
        
        // Check the type of notification and return the appropriate text class color based on that
        if (notificationInfo.type === 'error') 
            return 'text-danger'

        else if(notificationInfo.type === 'success'){
            return 'text-success'
        }
        else return 'text-black'     
    }

    useEffect(() => {
       let timeout = setTimeout(() => {
            removePopup()
        }, 4000)

        // clean up when the component unmounts
        return () => {
            clearTimeout(timeout)
        }
    }, [])

  return (
    <div 
    className=
    {`${notificationInfo.type ? checkType() : ''}
    ${!notificationInfo.type ? 'd-none':'d-block'} px-3 py-2 notification-popup  d-flex fw-bold flex-column align-items-center justify-content-center`}>
        {notificationInfo.message}
    </div>
  )
}

export default NotificationPopup
