import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer class="bg-gray-800 py-7 mt-8">
        <div className='text-white mx-auto flex container px-4'>
            <div className='min-w-max'> 
                <Link to='/'>
                    <div className="text-xl font-logo text-green-700">
                        <span className="font-extrabold">Edward's</span>TravelGuide
                    </div>
                </Link>
                <p className='mt-2'>Making Travel Easier</p>
                <p className='mt-4 text-2xl font-bold'>
                    Your journey starts here.
                </p>
                <p className='mt-2'>
                    Join now for effortless adventures!
                </p>
                <Link to='/sign-up'>
                    <div className="mt-4 text-center border px-6 py-2 rounded-full border-blue-800 bg-blue-800 
                        text-white font-semibold hover:bg-white duration-300 hover:text-blue-800">
                        Create an Account
                    </div>
                </Link>
            </div>
            <div className='w-full ml-32'>
                <div className='flex justify-between'>
                    <div className='flex flex-col'>
                        <h1 className='text-lg font-semibold'>
                            Site Map
                        </h1>
                        <div className='flex flex-col gap-2 mt-2'>
                            <Link 
                                to={'/destinations'}
                                className='transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            >
                                Destinations
                            </Link>
                            <Link 
                                to={'/explore'}
                                className='transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            >
                                Explore
                            </Link>
                            <Link 
                                to={'/flights'}
                                className='transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            >
                                Flights
                            </Link>
                            <Link 
                                to={'/blogs'}
                                className='transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            >
                                Blogs
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='text-lg font-semibold'>
                            About us
                        </h1>
                        <div className='flex flex-col gap-2 mt-2'>
                            <Link 
                                to={'/about'}
                                className='transition-opacity duration-100 hover:opacity-70 hover:cursor-pointer' 
                            >
                                About Edward'sTravelGuide
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='text-lg font-semibold'>
                            Contact Us
                        </h1>
                        <div className='flex flex-col gap-2 mt-2'>
                            <p>
                                edwardtravelguide@gmail.com
                            </p>
                            <p>
                                555-123-4567
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-8 border-t-2 border-gray-600 pt-7 container mx-auto text-center text-white">
            <p class="text-sm">&copy; 2024 Edward'sTravelGuide. All rights reserved.</p>
        </div>
    </footer>
  )
}
