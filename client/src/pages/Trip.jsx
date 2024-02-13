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
      <p className="text-3xl">
        Loading...
      </p>
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
            <p className="text-6xl font-bold">
              {trip.title} 
            </p>

            <p className="mt-4 text-3xl font-semibold">
              {trip.destination} 
            </p>

            <p className="mt-4 text-justify">
              {trip.note} 
            </p>


          </div>


        </div>
      </div>
    }
    </>
  )
}
