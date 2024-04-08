import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdMenu, MdOutlineClose } from "react-icons/md";
import { useState, useEffect, useRef } from 'react';


export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [toggled, setToggled] = useState(false);
    const dropdownRef = useRef(null);

    const handleClick = (e) => {
        // Navigate to the current location to force a re-render
        navigate(`/${e.target.id}`);
        window.location.reload();
    };

    const handleToggle = () => {
        setToggled(!toggled);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setToggled(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

  return (
    // change background color to white for finished layout
    // add custom 8xl spacing for max width 
    // change font style of header
    // add more effects on hover
    <header className='bg-transparent absolute top-0 left-0 w-full z-10'>
        <div className="container mx-auto">
            <nav className= 'py-5'>
                <div className='flex items-center justify-between px-4 '>
                    <Link to='/'>
                        <div className="text-xl font-logo text-white">
                            <span className="font-extrabold">Edward's</span>TravelGuide
                        </div>
                    </Link>

                    <ul 
                        className='hidden text-white font-bold
                        lg:flex lg:visible px-2 py-3 rounded-md flex-row gap-4'
                    >
                        <li 
                            className='px-2 rounded transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            id='destinations' 
                            onClick={handleClick}
                        >
                            DESTINATIONS
                        </li>
                        <li 
                            className='px-2 rounded transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            id='explore' 
                            onClick={handleClick}
                        >
                            EXPLORE
                        </li>
                        <li 
                            className='px-2 rounded transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            id='flights' 
                            onClick={handleClick}
                        >
                            FLIGHTS
                        </li>
                        <li 
                            className='px-2 rounded transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            id='blogs' 
                            onClick={handleClick}
                        >
                            BLOGS
                        </li>
                        <li 
                            className='px-2 rounded transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            id='about' 
                            onClick={handleClick}
                        >
                            ABOUT
                        </li>
                    </ul>

                    
                    <div className='flex items-center gap-4'>
                        <Link to='/profile'>
                            { currentUser ? (
                                <img 
                                    src={currentUser.photo} 
                                    alt="profile"
                                    className='rounded-full h-7 w-7 object-cover' 
                                />
                                ) : <p className='border border-blue-800 rounded-lg  px-7 py-1 font-bold
                                        bg-blue-800 text-white duration-200 hover:bg-transparent'
                                    >
                                        LOGIN
                                    </p>
                            }
                        </Link>
                        <div className='lg:hidden scale-150'>
                            { toggled ?
                                <MdOutlineClose onClick={handleToggle} />
                            :
                                <MdMenu onClick={handleToggle} />
                            }
                        </div>
                    </div>
                </div>
                
                <ul 
                    ref={dropdownRef}
                    className={`${!toggled && 'hidden'} lg:hidden px-2 py-3 rounded-md bg-white bg-opacity-10 backdrop-blur-md lg:bg-transparent flex flex-col lg:flex-row gap-1 lg:gap-4 mt-3`}
                >
                    <li 
                        className='hover:bg-white hover:bg-opacity-50 px-2 rounded font-semibold lg:hover:underline cursor-pointer' 
                        id='destinations' 
                        onClick={handleClick}
                    >
                        DESTINATIONS
                    </li>
                    <li 
                        className='hover:bg-white hover:bg-opacity-50 px-2 rounded font-semibold lg:hover:underline cursor-pointer' 
                        id='explore' 
                        onClick={handleClick}
                    >
                        EXPLORE
                    </li>
                    <li 
                        className='hover:bg-white hover:bg-opacity-50 px-2 rounded font-semibold lg:hover:underline cursor-pointer' 
                        id='flights' 
                        onClick={handleClick}
                    >
                        FLIGHTS
                    </li>
                    <li 
                        className='hover:bg-white hover:bg-opacity-50 px-2 rounded font-semibold lg:hover:underline cursor-pointer' 
                        id='blogs' 
                        onClick={handleClick}
                    >
                        BLOGS
                    </li>
                    <li 
                        className='hover:bg-white hover:bg-opacity-50 px-2 rounded font-semibold lg:hover:underline cursor-pointer' 
                        id='about' 
                        onClick={handleClick}
                    >
                        ABOUT
                    </li>

                </ul>


            </nav>
        </div>
    </header>
    
  )
}
