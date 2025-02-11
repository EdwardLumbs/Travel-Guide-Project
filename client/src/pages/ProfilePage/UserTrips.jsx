import { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import TripModal from '../../components/TripModal';
import TripCard from '../../components/cards/TripCard'
import { useSelector } from 'react-redux';
import DeleteModal from '../../components/DeleteModal';

export default function UserTrips() {
  const {currentUser} = useSelector((state) => state.user);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trips, setTrips] = useState([])
  const location = useLocation();
  const [openedDeleteModalId, setOpenedDeleteModalId] = useState(null);

  const openDeleteModal = (blogId) => {
    setOpenedDeleteModalId(blogId);
  };  

  const closeDeleteModal = () => {
    setOpenedDeleteModalId(null);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const getTrips = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/trips/getUserTrips/${currentUser.id}`)
      const data = await res.json()
      console.log(data)
      
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }
      setTrips(data)
      setError(null)
      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    getTrips()
  }, [isModalOpen])

  const handleDelete = async (tripId) => {
    console.log(tripId)
    try {
        const res = await fetch(`/api/trips/deleteTrip/${tripId}`, {
          method: 'DELETE'
        })
        const data = await res.json()// show a prompt that shows the message of res
        console.log(data)
        getTrips()    
      } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className='w-full'>
      <TripModal  
        isOpen={isModalOpen}
        onClose={closeModal}
        currentDestination={null}
        user_id={currentUser.id}
      />
      <div className="p-7 w-full">
        <div className='text-5xl font-bold mb-4'>
          Your Trips
        </div>
        {
          error ?
            <div>
              <p className="text-3xl">
                {error}
              </p> 
              <button 
                className='font-bold mb-4 border py-2 px-3 rounded-lg text-white 
                bg-blue-500 border-blue-500 hover:text-blue-500 hover:bg-white 
                duration-200 '
                onClick={openModal}
              >
                Plan a trip
              </button>
            </div>
          : loading ? 
          <div className='animate-pulse my-4 flex flex-col items-center'>
            <img 
              className='h-[80px]'
              src="/vectors/plane.svg" 
              alt="plane" 
            />
            <p className='text-lg'>
              Waiting for Landing
            </p>
          </div>
          : 
          <div className='w-full flex flex-col gap-2'>
            <button 
              className='font-bold ml-auto mb-4 border py-2 px-3 rounded-lg text-white 
              bg-blue-500 border-blue-500 hover:text-blue-500 hover:bg-white 
              duration-200 '
              onClick={openModal}
            >
              Plan a trip
            </button>
            <div className='flex flex-wrap gap-4'>
              {trips.length > 0 && trips.map((trip) => (
                <>
                  <Link 
                    to={`${trip.id}`}
                    state={`${location.pathname}`}  
                  >
                    <div className="">
                      <TripCard 
                        trip={trip}
                        openDeleteModal={() => openDeleteModal(trip.id)}
                      />
                    </div>
                  </Link>
                  <DeleteModal  
                    blogId={trip.id}
                    isOpen={openedDeleteModalId === trip.id}
                    onClose={closeDeleteModal}
                    handleDelete={handleDelete}
                  />
                </>
              ))}
            </div>
          </div>
        }
      </div>
    </div>

    

  )
}
