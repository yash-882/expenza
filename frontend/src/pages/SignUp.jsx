import { Link } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import { Eye, EyeOff } from 'lucide-react'


function SignUp() {

  let {isAuthenticated, setIsAuthenticated} = useContext(UserContext)

    let [credentials, setCredentials] = useState({
        name: '', email: '', password: '', confirmPassword: ''
    })

    let [errMessage, setErrMessage] = useState('')
    let [loading, setLoading] = useState(false)
    let [showPassword, setShowPassword] = useState(false)
    
    let navigate = useNavigate()

     function handleShowPassword (evt){
      evt.preventDefault();
    //   show/hide password
      
    //  input has some text
      if(credentials.password)
      setShowPassword(v => !v)
    }

  async function handleSignup(evt){
        evt.preventDefault()

        try{

            // set message empty before showing new err message
            setErrMessage('')

            // show loading
            setLoading(true)
            // sending request for signing up
            await axios.post('http://192.168.1.7:8000/api/auth/sign-up',
                credentials,
                {
                    withCredentials: true
             })
            //  remove loading
        setLoading(false)
        
        // setting true after signing up 
        setIsAuthenticated(true)


        } catch(err){
          
            // remove loading
        setLoading(false) 

            setErrMessage(err.response?.data?.message || 'Server error, please try again later')
            
        }
    }

    useEffect(() => {
        // redirect to '/' if already authenticated
        if(isAuthenticated){

            navigate('/')
        }

    }, [isAuthenticated])

  return (
     <div className='d-flex justify-content-center align-items-center'>


{/* signup form */}
<div className="d-flex justify-content-center signup-form py-5 px-4 align-items-center rounded-4 mt-1 flex-column">


     {/* heading */}
      <h4 className='fw-bolder mb-'>Sign up to Expenza</h4>
  
   {/* err message if occurs */}
        <p className={`${errMessage ? 'visible': 'invisible'} text-danger`}>
            {errMessage || 'text for occupying space'}
        </p>



    {/* signup form */}
    <form onSubmit={handleSignup} className="d-flex justify-content-center  align-items-center flex-column">

        {/* input name */}
    <input 
    type="text" 
    className='px-2  py-2 mb-3 border-dark border-0 rounded-3 email-input' 
    placeholder='Name' 
    value={credentials.name}
    onChange={(evt) => setCredentials(cred => ({...cred, name: evt.target.value}))}/>

    {/* input email */}
    <input 
    type="text" 
    className='px-2  py-2 mb-3 border-dark border-0 rounded-3 email-input' 
    placeholder='Email' 
    value={credentials.email}
    onChange={(evt) => setCredentials(cred => ({...cred, email: evt.target.value}))}/>
        
        {/* input password */}
        <input 
         type={showPassword ? 'text' : 'password'}
        className='px-2  py-2 border-dark border-0 rounded-3 mb-1 password-input'
        placeholder='Password (at least 8 characters)'
        value={credentials.password}
        onChange={(evt) => setCredentials(cred => ({...cred, password: evt.target.value}))}/>
         <button 
        className='btn btn-sm mb-1 d-flex align-items-center' 
        onClick={handleShowPassword}>

           <span className='d-flex align-items-center'> {showPassword ? 
            <><EyeOff className='me-1'/> Hide password</> : 
            
         <><Eye className='me-1'/> Show password </>} </span>
            
            </button>

        {/* input confirm password */}
        <input 
        type="password" 
        className='px-2  py-2 border-dark border-0 rounded-3 mb-3 password-input'
        placeholder='Confirm password'
        value={credentials.confirmPassword}
        onChange={(evt) => setCredentials(cred => ({...cred, confirmPassword: evt.target.value}))}/>

        {/* submit button */}
        <button 
        type='submit'
        disabled={loading}
        className='btn text-white d-flex justify-content-center text-center login-btn mb-3 rounded-3 fw-bolder'>
   
          <p 
          className={`${loading ? 'd-block': 'd-none'} loader mb-1 text-center`}
          style={{height:'30px', width: '30px'}}>


      </p>
     { !loading ?  'Sign up': '' }
        </button>


        {/* login link */}
        <Link to="/login" className='nav-link text-primary'>
        Already have an account? Login
        </Link>
    </form>



      
</div>
    </div>
  )
}

export default SignUp
