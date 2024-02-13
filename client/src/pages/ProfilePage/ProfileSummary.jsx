import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import TripModal from '../../components/TripModal';

export default function ProfileSummary() {
  const {currentUser} = useSelector((state) => state.user);
  const [blogCount, setBlogCount] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [error, setError] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(blogCount)
  console.log(tripCount)

  const openModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchBlogCount = async () => {
      const res = await fetch(`/api/user/getBlogCount/${currentUser.id}`)
      const data = await res.json()
      if (data.success === false) {
        setError(data.message)
        return
      }
      setBlogCount(data)
    }

    const fetchTripCount = async () => {
      const res = await fetch(`/api/user/getTripCount/${currentUser.id}`)
      const data = await res.json()
      if (data.success === false) {
        setError(data.message)
        return
      }
      setTripCount(data)
    }

    fetchBlogCount()
    fetchTripCount()
  }, [])


  return (
    <div className='p-7 flex flex-col gap-6'>
      <TripModal  
        isOpen={isModalOpen}
        onClose={closeModal}
        currentDestination={null}
        user_id={currentUser.id}
      />
      <div className=''>
        <h1 className='text-3xl font-bold'>
          Welcome to your personalized travel hub! 
        </h1>
        <p className='text-justify mt-2'>
          Here, you're in command of your adventures. 
          Explore, plan, and share your travel experiences with ease. 
          Let's embark on a journey tailored just for you.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-3 flex-1 basis-full'>
        <Link 
          to={'/profile/user-trips'} 
          className='bg-white p-4 rounded-xl basis-full'
        >
          <p className='text-3xl font-bold'>Travel Plans:</p>
          {
            tripCount > 0 
          ?
            <p className='text-3xl font-semibold mt-2'>
              {tripCount}
            </p>
          :
            <div className='mt-3'>
              <p className='text-3xl'>
                No trips found!
              </p>
              <button 
                className='mt-2 w-full border py-2 px-3 rounded-lg text-white 
                bg-blue-500 border-blue-500 hover:text-blue-500 hover:bg-white 
                duration-200'
                onClick={(e) => openModal(e)}
              >
                Plan a trip
              </button>
            </div>
          }
        </Link>

        <Link 
          to={'/profile/user-blogs'} 
          className='bg-white p-4 rounded-xl basis-full'
        >
          <p className='text-3xl font-bold'>Blogs:</p>
          {
            blogCount > 0 
          ?
            <p className='text-3xl font-semibold mt-2'>
              {blogCount}
            </p>
          :
            <div className='mt-3'>
              <p className='text-3xl'>
                No blogs found
              </p>
              <div 
                className='text-center mt-2 border py-2 px-3 rounded-lg text-white 
                bg-blue-500 border-blue-500 hover:text-blue-500 hover:bg-white 
                  duration-200'>
                <Link 
                  to={'/blogs/create'}
                  className='w-full'
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Post a blog
                </Link>
              </div>
              
            </div>
          }
        </Link>

      </div>
    </div>
  )
}
