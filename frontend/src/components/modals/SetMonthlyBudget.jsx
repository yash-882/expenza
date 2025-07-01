import React, { useState } from 'react'
import PopupWrapper from '../PopupWrapper'
import axios from 'axios'
import NotificationPopup from './NotificationPopup'

function SetMonthlyBudget({hidePopup}) {
    let [budget, setBudget] = useState(0)
    let [notify, setNotify] = useState(false)
    let [notificationInfo, setNotificationInfo] = useState({type: '', message: ''})
    let [loading, setLoading] = useState(false)
     let [isChecked, setChecked] = useState(false) //state for confirming a warning

    function handleCheck(evt){
        // if warning is checked
        if(evt.target.checked){
            setChecked(true)
        } 
        // if warning is unchecked
        else if(evt.target.checked == false){
            setChecked(false)
        } 
        
        else setChecked(false)
    }

    async function handleSettingBudget(evt) {
        evt?.preventDefault()
        // reset notification
        setNotificationInfo({type: '', message: ''})
        
        // if the warning message is not checked
        if(!isChecked){

        //  state that contains error message
        setNotificationInfo({type: 'error', message: 'You must acknowledge the warning first'})
        // show popup
        setNotify(true)
        return;
        }
        
        try{
            setLoading(true)

            // setting budget...
            const response = await axios.patch('http://192.168.1.7:8000/api/user/setting/set-budget',
                {budget}, 
                {withCredentials: true}
            )

            const apiResponse = response.data
            setLoading(false) //remove loading

            //  state that contains success message
            setNotificationInfo({type: 'success', message: apiResponse.message})

            // show popup
            setNotify(true);

           // remove the popup in 2.5 seconds after notifying(success)
            setTimeout(() => {
                hidePopup()
            }, 2500)

        } catch(err){
            //  state that contains error message
            setLoading(false)
            // 
             setNotificationInfo({
                type: 'error', 
                message: err.response?.data.message || 'Server error, please try again later'
            })
            // show popup
            setNotify(true);
        }

        
    }

  return (
    <>
 <PopupWrapper>
    <div className='bg-light py-4 d-flex flex-wrap flex-column  px-4 rounded-4'
    style={{maxWidth: '400px'}}>
        <h5 className='fw-bold mb-4'>
        {/* heading */}
       Set monthly budget
        </h5>

        {/* set budget form */}
        <form className='w-100'
        onSubmit={handleSettingBudget}>
                <input
                className='p-2 border-0 rounded-3 w-100 mb-4'
                placeholder='₹ Enter budget amount'
                style={{outline: "solid 3px rgb(157, 181, 218)"}}
                type="number"

                inputMode='numeric'
                onChange={(evt) => setBudget(evt.target.value)}/>

            {/* button container */}
            <div className='btn-block mb-3 w-100 d-flex flex-wrap flex-column justify-content-between'>
                {/* submit budget amount */}
                <button
                disabled={loading} 
                className="btn btn-primary fw-bold mb-2 d-flex justify-content-center align-items-center">
                    {/* loader */}
                    {
                        loading ? 

                        <p className='loader text-center mb-0'
                        style={{width: '24px', height: '24px'}}>
                        </p> :

                        'Submit'
                    }
                </button>

                {/* close popup */}
                <button 
                type='button'
                className="btn btn-secondary fw-bold"

                // remove popup 
                onClick={hidePopup}> 
                    Cancel
                </button>

            </div>

{/* checkbox indicates that the client read the warning */}
            <input 
            type="checkbox" 
            className='me-1'
            onChange={handleCheck} />
                    
        {/* warning about transaction summary  */}
        <p 
        style={{fontSize:'14px'}}
        className='mb-1 d-inline  fw-bolder'>
           Updating or creating a monthly budget will reset the month, 
           clear past summaries, and start a new one from today
        </p>
        </form>
      <div>

      </div>
    </div>


    </PopupWrapper>
        {/* show messages regarding budget updation */}
   { notify && <NotificationPopup
    removePopup={() => setNotify(false)}
    notificationInfo={notificationInfo}/>}
    </>
  )
}

export default SetMonthlyBudget
