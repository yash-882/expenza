import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import Transactions from './pages/Transactions';
import Login from './pages/Login';

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
            }

        ]
    }
])

export default () => <RouterProvider router={router}/>
