import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header() {
    const { currentUser } = useSelector(state => state.user);

  return (
    // change background color to white for finished layout
    // add custom 8xl spacing for max width 
    // change font style of header
    // add more effects on hover
    <header className='bg-slate-50'>
        <div className='flex justify-between max-w-7xl items-center px-3 py-5 mx-auto'>
            <Link to='/'>
                <div className='text-xl'>
                    <span className="font-logo font-extrabold text-green-700">
                        Edward's
                    </span>
                    <span className="font-logo text-green-700">
                      TravelGuide
                    </span>
                </div>
            </Link>
        
            <ul className='flex gap-4'>
                <Link to='/destinations'>
                    <li className='hover:underline'>DESTINATIONS</li>
                </Link>
                <Link to='/explore'>
                    <li className='hover:underline'>EXPLORE</li>
                </Link>
                <Link to='/flights'>
                    <li className='hover:underline'>FLIGHTS</li>
                </Link>
                <Link to='/blogs'>
                    <li className='hover:underline'>BLOGS</li>
                </Link>
                <Link to='/reviews'>
                    <li className='hover:underline'>REVIEWS</li>
                </Link>
                <Link to='/about'>
                    <li className='hover:underline'>ABOUT</li>
                </Link>
            </ul>

            <Link to='/profile'>
                { currentUser ? (
                    <img 
                        src={currentUser.photo} 
                        alt="profile"
                        className='rounded-full h-7 w-7 object-cover' 
                    />
                    ) : <p className='border border-blue-600 rounded-lg text-blue-600 px-7 py-1'>
                            LOGIN
                        </p>
                }
                
            
            </Link>
            
        </div>
    </header>
    
  )
}
