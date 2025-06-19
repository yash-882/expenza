import React from 'react'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className='d-flex justify-content-center align-items-center'>


<div className="d-flex justify-content-center login-form py-5 px-4 align-items-center rounded-4 mt-5 flex-column">

      <h4 className='fw-bolder mb-4'>Login to Expenza</h4>
    <form action="" className="d-flex justify-content-center  align-items-center flex-column">
    <input type="text" className='px-2  py-2 mb-3 border-dark border-0 rounded-3 email-input' placeholder='Email' />
        
        <input type="text" className='px-2  py-2 border-dark border-0 rounded-3 mb-3 password-input' placeholder='Password'/>
        <button type='submit' className='btn text-white login-btn mb-3 rounded-3 fw-bolder'>
            Login
        </button>
        <Link href="#" className='nav-link text-primary'>
        Reset password
        </Link>
        <Link href="#" className='nav-link text-primary'>
        Sign up
        </Link>

    </form>



      
</div>
    </div>
  )
}

export default Login
