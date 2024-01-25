import { useNavigate, useParams, Link } from "react-router-dom";
import useGetCountry from "../hooks/useGetCountry";
import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';

export default function Country() {
  // add a function where if continent and country arent validate, return error
  const { countryName } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { country, loading, countryError } = useGetCountry(countryName);
  const [flight, setFlight] = useState()
  const [iata, setIata] = useState()
  const [flightLoading, setFlightLoading] = useState(false)
  const [flightError, setFlightError] = useState(null)
  const [filter, setFilter] = useState('')
  const inputValue = useRef('');
  const navigate = useNavigate()

  console.log(flight)
  console.log(iata)

  const currentDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  console.log(country.capital_iata)

  const fetchFlightData = async () => {
    const urlParams = new URLSearchParams
    urlParams.set('fly_from', currentUser?.user_iata || iata || '')
    urlParams.set('fly_to', country.capital_iata)
    urlParams.set('date_from', tomorrow)
    urlParams.set('date_to', tomorrow)
    urlParams.set('curr', 'PHP')
    urlParams.set('adults', 1)
    urlParams.set('children', 0)
    urlParams.set('infants', 0)
    urlParams.set('selected_cabins', 'M')
    const filterQuery = urlParams.toString();

    console.log(country.capital_iata)
    console.log(filterQuery)
    setFilter(filterQuery)

    try {
      setFlightLoading(true)
      const res = await fetch(`/api/flights/getFlight/${filterQuery}`);
      const flightData = await res.json();

      console.log(flightData)

      if (flightData.success === false) {
        setFlightError(flightData.message)
        setFlightLoading(false)
      }
      setFlight(flightData)
      setFlightError(null)
      setFlightLoading(false)
    } catch (error) {
      setFlightLoading(false)
      setFlightError(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser?.user_iata) {
      fetchFlightData()
    }

    if (iata) {
      fetchFlightData()
    }
  }, [iata, country])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIata(inputValue.current);
  }

  return (
    <>
    { countryError ? <p className="text-3xl">
      {countryError}
    </p>
    : loading ? <p className="text-3xl">
      Loading...
    </p> :
      <div className="flex items-center flex-col gap-5">
        <div className="">
          <img 
            className="object-cover rounded-2xl w-[960px]"
            src={country.photo} 
            alt="cover photo" 
          />
          <div className="flex mt-9">
            <div>
              <p className="text-6xl">
                {country.country}
                  <span className="text-2xl"> {country.continent_name}</span>
              </p>
              <p className="mt-9">
                {country.description}
              </p>
              <p className="hover:underline hover:cursor-pointer text-blue-600">
                Start a plan
              </p>
            </div>
            <div>
              { flightLoading ? 
              <div>
                  Finding the cheapest flights for you....
              </div> :
              flightError ?
              <div>
                  {flightError}
              </div> :
              flight ? 
                <div>
                  <p>Cheapest flight from your location is:</p>
                  <p>{flight.price}</p>
                  <Link
                    className="text-blue-900 hover:underline"
                    to={`/flights?${filter}`}
                  >Check it out
                  </Link>
                </div>
              :
                <div>
                  <p>Check out the cheapest flights</p>
                  <form onSubmit={handleSubmit}>
                    <label>From</label>
                    <input 
                      className='border border-black px-3 py-2 rounded-lg'
                      type="text" 
                      required
                      placeholder='Where are you from?'  
                      value={iata}
                      onChange={(e) => inputValue.current = e.target.value}
                    />
                    <button className='bg-green-200 px-5 py-2'>Search</button>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>

        <div>
          Must See attractions. Add the notable places here
        </div>

        <div>
          Must Read blogs. Add related blogs here
        </div>

        <div>
          Check out user's reviews. Add reviews
        </div>

      </div>
      }
    </>
  )
}
