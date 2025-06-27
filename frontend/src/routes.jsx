import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddTransaction from './pages/AddTransaction';
import Settings from './pages/Settings';

const router = createBrowserRouter([
    {
        element: <App/>,
        path: '/',
        children:[
            {
                element: <Transactions/>,
                path : '/',
            },
            {
                element: <Login/>,
                path : '/login',
            },
            {
                element: <SignUp/>,
                path : '/sign-up',
            },
            {
                element: <AddTransaction/>,
                path : '/add-transaction',
            },
            {
                element: <Settings/>,
                path : '/account-settings',
            },

        ]
    }
])

export default () => <RouterProvider router={router}/>
