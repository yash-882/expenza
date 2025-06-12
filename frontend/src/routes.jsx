import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import Transactions from './pages/Transactions';

const router = createBrowserRouter([
    {
        element: <App/>,
        path: '/',
        children:[
            {
                element: <Transactions/>,
                path : '/',
            }

        ]
    }
])

export default () => <RouterProvider router={router}/>
