import {createBrowserRouter, RouterProvider, useNavigate} from 'react-router-dom';
import App from './App';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddTransaction from './pages/AddTransaction';
import Settings from './pages/Settings';
import { useContext, useEffect } from 'react';
import { UserContext } from './contexts/UserContext';

// returns the protected route to authenticated users
function AuthenticationStatus({children}){
    let {isAuthenticated} = useContext(UserContext)
    let navigate = useNavigate();
    

    useEffect(()=> {

        // if the user is unauthenticated
        if(!isAuthenticated)
            navigate('/login')
    }, [isAuthenticated])

    // only return the protected route if the user is authenticated
    return (isAuthenticated && children)
}

const router = createBrowserRouter([
    {
        element: <App/>,
        path: '/',
        children:[
            // protected routes
            {
                element: <AuthenticationStatus> 
                    <Transactions/> 
                    </AuthenticationStatus>,
                path : '/',
            },
            {
                element: <AuthenticationStatus> 
                    <AddTransaction/> 
                    </AuthenticationStatus>,
                path : '/add-transaction',
            },
            {
                element: <AuthenticationStatus> 
                    <Settings/> 
                    </AuthenticationStatus>,
                path : '/account-settings',
            },

            // unprotected routes
            {
                element: <Login/>,
                path : '/login',
            },
            {
                element: <SignUp/>,
                path : '/sign-up',
            },

        ]
    }
])

export default () => <RouterProvider router={router}/>
