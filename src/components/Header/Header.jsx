import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext';

const Header = () => {
    const { user, logOut } = useContext(AuthContext);
    const listItems = <>
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/available-foods">AVAILABLE FOODS</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
    </>
    return (
        <div className="navbar shadow-sm md:px-5">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {listItems}
                    </ul>
                </div>
                <Link className="flex items-center gap-1 cursor-pointer select-none">
                    <img src="/logo.png" alt="" className='rounded-full' />
                    <h1 className="font-semibold text-2xl">Share A Bite</h1>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {listItems}
                </ul>
            </div>
            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt={user?.displayName || user?.email || 'user avatar'}
                                    src={user?.photoURL || "https://i.ibb.co.com/yQGvpKV/user-icon-on-transparent-background-free-png.webp"}
                                    title={user?.displayName || user?.email}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to={"/add-food"} className="justify-between">
                                    Add Food
                                </Link>
                                <Link to={"/my-foods"} className="justify-between">
                                    My Foods
                                </Link>
                                <Link to={"/my-requests"} className="justify-between">
                                    My Requests
                                </Link>
                            </li>
                            <li> <a onClick={() => logOut()}>Logout</a> </li>
                        </ul>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" className="btn bg-green-600 border-0 text-white px-7">Login</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header
