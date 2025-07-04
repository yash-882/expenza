import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { Eye, EyeOff } from 'lucide-react'
import ResetPassword from '../components/modals/ResetPassword'


function Login() {
    let [credentials, setCredentials] = useState({
        email: '', password: ''
    })
    let [errMessage, setErrMessage] = useState('')
    let [loading, setLoading] = useState(false)
    let {isAuthenticated, setIsAuthenticated} = useContext(UserContext)
    let [showPassword, setShowPassword] = useState(false)
    let [resetPassPopup, setResetPassPopup] = useState(false)
    let navigate = useNavigate()

    function handleShowPassword (evt){
      evt.preventDefault();
    //   show/hide password
      
    //  input has some text
      if(credentials.password)
      setShowPassword(v => !v)
    }

    async function handleLogin(evt){
        evt.preventDefault()

        try{

            // set message empty before showing new err message
            setErrMessage('')

            // show loading
            setLoading(true)
            // sending request for login
            await axios.post('http://192.168.1.7:8000/api/auth/login',
                {
                    email: credentials.email,
                    password: credentials.password
                },
                {
                    withCredentials: true
             })
            //  remove loading
        setLoading(false)

        // user is authenticated now
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


{/* Login form */}
<div className="d-flex justify-content-center login-form py-5 px-4 align-items-center rounded-4 mt-5 flex-column">

             {/* heading */}
      <h4 className='fw-bolder mb-4'>Login to Expenza</h4>
  
  {/* err message if occurs */}
        <p className={`${errMessage ? 'visible': 'invisible'} text-danger`}>
            {errMessage || 'text for occupying space'}
        </p>


    {/* login form */}
    <form onSubmit={handleLogin} className="d-flex justify-content-center  align-items-center flex-column">

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
        className='px-2  py-2 border-dark border-0 rounded-3 mb-2 password-input'
        placeholder='Password'
        value={credentials.password}
        onChange={(evt) => setCredentials(cred => ({...cred, password: evt.target.value}))}
        /> 
        
        <button 
        className='btn btn-sm mb-4 d-flex align-items-center' 
        onClick={handleShowPassword}>

           <span className='d-flex align-items-center'> {showPassword ? 
            <><EyeOff className='me-1'/> Hide password</> : 
            
         <><Eye className='me-1'/> Show password </>} </span>
            
            </button>

        {/* submit button */}
        <button 
        type='submit'
        disabled={loading}
        className='btn text-white d-flex justify-content-center text-center login-btn mb-3 rounded-3 fw-bolder'>
   
          <p 
          className={`${loading ? 'd-block': 'd-none'} loader mb-1 text-center`}
          style={{height:'30px', width: '30px'}}>


      </p>
     { !loading ?  'Login': '' }
        </button>

{/* reset password */}
        <button
        type='button'
        onClick={()=> setResetPassPopup(true)} 
        className='nav-link text-primary'>
        Reset password
        </button>

        {/* sign up link */}
        <Link to= '/sign-up' className='nav-link text-primary'>
        Sign up
        </Link>
    </form>



      
</div>
{resetPassPopup && 
<ResetPassword 
closePopup={()=> setResetPassPopup(false)}/>}
    </div>
  )
}

export default Login
