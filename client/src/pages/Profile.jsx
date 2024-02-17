import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/slices/userSlice.js';
import { CiCirclePlus } from "react-icons/ci";

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname)

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart);
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
      navigate('/')
    } catch (error) {
      signOutUserFailure(error.message)
    }
  }

  return (
    <div className='container bg-slate-200 rounded-3xl mx-auto flex flex-col md:flex-row mt-24 mb-4'>
      <div className='md:min-h-screen'>
        {/* profile details */}
        {/* change max width? */}
        {/* insert profile picture with props */}
        {/* change background to picture and profile color to color accents */}
        {/* configure screen sizes */}
        
        <div className='p-7 flex flex-col gap-5 justify-center items-center'>
          <img 
            src={currentUser.photo}
            alt="profile picture" 
            className='rounded-full h-40 w-40 object-cover'
          />
          <button
            className="text-white hover:cursor-pointer hover:text-red-600 font-semibold 
              duration-100 hover:bg-white border border-black px-4 py-1 rounded-full bg-red-600"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
        
        <div className='px-7 flex flex-col w-[400px]'>
          <h1 className='text-4xl basis-full font-semibold'>
            {currentUser.username}
          </h1>
          <div className='text-justify text-xl mt-2'>{
            currentUser.description || 
            <Link to='edit'>
              <div className="flex items-center gap-2 opacity-70 hover:opacity-100 hover:cursor-pointer">
                <CiCirclePlus className="scale-150"/> 
                <p>Add a description</p>
              </div>
            </Link>}
          </div>
          <div className='mt-2 text-xl'>{
            currentUser.user_iata || 
            <Link to='edit'>
              <div className="flex items-center gap-2 opacity-70 hover:opacity-100 hover:cursor-pointer">
                <CiCirclePlus className="scale-150"/> 
                <p>Add the IATA code near you</p>
              </div>
            </Link>}
          </div>
        </div>
        
        <div className="mt-5 bg-slate-400">
          <div className="flex font-semibold text-lg flex-row md:flex-col border-y-2 border-black">
            <Link 
              to={''}
              className={`hover:bg-slate-500 px-7 py-2 duration-100 
                ${location.pathname === '/profile' ? 'bg-slate-300' : ''}`}
            >
                  Summary
            </Link>
            <Link 
              to={'edit'}
              className={`hover:bg-slate-500 px-7 py-2 duration-100 
                ${location.pathname === '/profile/edit' ? 'bg-slate-300' : ''}`}
            >
                  Edit Profile
            </Link>
            <Link 
              to={'user-blogs'}
              className={`hover:bg-slate-500 px-7 py-2 duration-100 
                ${location.pathname === '/profile/user-blogs' ? 'bg-slate-300' : ''}`}
            >
                  Blogs
            </Link>
            <Link 
              to={'user-trips'}
              className={`hover:bg-slate-500 px-7 py-2 duration-100 
                ${location.pathname === '/profile/user-trips' ? 'bg-slate-300' : ''}`}
            >
                  Trips
            </Link>
          </div>
        </div>   

      </div>
 
      <div className='flex-1 bg-slate-300 rounded-r-3xl'>
        <Outlet/>
      </div>
    </div>
  )
}
