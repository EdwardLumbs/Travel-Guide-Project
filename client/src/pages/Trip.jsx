import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Hero from '../components/heroComponent/Hero';

export default function Trip() {
  const { tripId } = useParams()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trip, setTrip] = useState({});
  const location = useLocation();
  console.log(location.state)

  useEffect(() => {
    const getTrip = async () => {
      console.log('click')
      try {
        setLoading(true)
        const res = await fetch(`/api/trips/getTrip/${tripId}`);
        const data = await res.json()
        console.log(data)
        if (data.success === false) {
          setLoading(false)
          setError(data.message)
          return
        }
        setTrip(data[0])
        setError(null)
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setError(error.message)
        setLoading(false) 
      }
    }
    getTrip()
  }, []);

  return (
    <>
    {error ? 
      <p className="text-3xl">
        {error}
      </p>
    : loading ? 
    <div className='mx-auto animate-pulse container px-4 my-4 flex flex-col items-center'>
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
      <div className="">
        <div className="">
          <Hero image={"/photos/trip.jpg"} />
          <div className="mt-4 container mx-auto px-4">
            {location.state && 
            <Link
              to={`${location.state}`}
              relative="path"
              className="hover-underline"
              >&larr; <span>Back to Last Page</span></Link>
            }
            <div className='mb-8 mt-8 bg-orange-100 rounded-xl p-7'>
              <p className="text-6xl font-bold">
                {trip.title} 
              </p>

              <p className="mt-4 text-3xl font-semibold">
                To: {trip.destination} 
              </p>

              <p className="mt-4 text-justify">
                Notes: {trip.note} 
              </p>
            </div>
          </div>


        </div>
      </div>
    }
    </>
  )
}
