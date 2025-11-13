import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home/Home'
import AvailableFoods from '../pages/AvailableFoods/AvailableFoods'
import FoodDetails from '../pages/FoodDetails/FoodDetails'
import AddFood from '../pages/AddFood/AddFood'
import MyFoods from '../pages/MyFoods/MyFoods'
import MyRequests from '../pages/MyRequests/MyRequests'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import ErrorPage from '../pages/ErrorPage/ErrorPage'
import PrivateRoute from './PrivateRoute'
import About from '../pages/About/About'
import UpdateFood from '../pages/UpdateFood/UpdateFood'

const router = createBrowserRouter([
    {
        path: '/', element: <App />, errorElement: <ErrorPage />, children: [
            { path: '/', element: <Home /> },
            { path: '/available-foods', element: <AvailableFoods /> },
            { path: '/about', element: <About /> },
            { path: '/available-foods', element: <AvailableFoods /> },
            { path: '/food/:id', element: <FoodDetails /> },
            { path: '/add-food', element: <PrivateRoute><AddFood /></PrivateRoute> },
            { path: '/my-foods', element: <PrivateRoute><MyFoods /></PrivateRoute> },
            { path: '/my-requests', element: <PrivateRoute><MyRequests /></PrivateRoute> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: "/update-food/:id", element: <PrivateRoute><UpdateFood /></PrivateRoute> },
        ]
    },
])

export default router