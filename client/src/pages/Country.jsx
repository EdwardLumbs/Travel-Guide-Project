import { useNavigate, useParams, Link } from "react-router-dom";
import useGetCountry from "../hooks/useGetCountry";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import SearchFilterResults from "../components/SearchFilterResults";
import Attractions from "../components/Attractions";

export default function Country() {
  // add a function where if continent and country arent validate, return error
  const { countryName } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { country, loading, countryError } = useGetCountry(countryName);
  const [flight, setFlight] = useState();
  const [iata, setIata] = useState('');
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState(null);
  const [filter, setFilter] = useState('');
  const [inputValue, setInputValue] = useState({
    from: '',
    name: ''
  });
  const navigate = useNavigate();
  const [filteredSuggestionsFrom, setFilteredSuggestionsFrom] = useState([]);
  const [iataCodes, setIataCodes] = useState([])

  const currentDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  useEffect(() => {
    const getIataCodes = async () => {
      try {
        const res = await fetch('/api/flights/getIata');
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          console.log(data.message);
        }
        setIataCodes(data);
      } catch (error) {
        console.log(error);
      }
    }
    getIataCodes();
  }, [])

  const handleInputChange = (e) => {
    const text = e.target.value.toLowerCase();
    setInputValue({
      ...inputValue,
      [e.target.id]: e.target.value
    });

    console.log(inputValue.from);

    let filtered = iataCodes.filter((iataCode) => 
      iataCode.country.toLowerCase().includes(text)
    );
    if (e.target.value === ''){
      filtered = [];
    } else {
      setFilteredSuggestionsFrom(filtered);
    };
  };

  const handleSuggestionClick = (e, name = 'none', suggestion) => {
    console.log('clicked');
    console.log(name);
    console.log(suggestion);
    setInputValue({
      ...inputValue,
      [e.target.id]: suggestion.country_iata,
      name: suggestion.country
    });
    setFilteredSuggestionsFrom([]);
  }

  const fetchFlightData = async () => {
    const urlParams = new URLSearchParams;
    urlParams.set('fly_from', currentUser?.user_iata || iata || '');
    urlParams.set('fly_to', country.country_iata);
    urlParams.set('date_from', tomorrow);
    urlParams.set('date_to', tomorrow);
    urlParams.set('curr', 'PHP');
    urlParams.set('adults', 1);
    urlParams.set('children', 0);
    urlParams.set('infants', 0);
    urlParams.set('selected_cabins', 'M');
    const filterQuery = urlParams.toString();
    console.log('clicked')
    console.log(filterQuery)

    console.log(country.country_iata);
    console.log(filterQuery);
    setFilter(filterQuery);

    try {
      setFlightLoading(true);
      const res = await fetch(`/api/flights/getFlight/${filterQuery}/${currentUser?.user_iata || iata}/${country.country_iata}`);
      const flightData = await res.json();
      console.log(res);

      console.log(flightData);

      if (flightData.success === false) {
        setFlightError(flightData.message);
        setFlightLoading(false);
        return
      }
      setFlight(flightData);
      setFlightError(null);
      setFlightLoading(false);
    } catch (error) {
      setFlightLoading(false);
      setFlightError(error.message);
      console.log(error);
    }
  }

  useEffect(() => {
    console.log('clicked')
    console.log(iata)
    console.log(currentUser?.user_iata)
    if (currentUser?.user_iata) {
      fetchFlightData();
    }

    if (iata) {
      fetchFlightData();
    }
  }, [iata, country]);

  const handleSubmit = (e) => {
    console.log('clicked')
    if (inputValue.from === country.country_iata) {
      setFlightError("Please enter a different location")
      return
    }
    e.preventDefault();
    setIata(inputValue.from);
  }

  const handleNewEntry = () => {
    setFlightError(null)
    setIata('')
    setInputValue({})
    setFlight('')
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
                  <button
                    className="text-blue-900 hover:underline"
                    onClick={handleNewEntry}
                  >
                    Enter a different location
                  </button>
              </div> :
              flight ? 
                <div>
                  <p>{`Cheapest flight from ${inputValue.name || inputValue.from} is:`}</p>
                  {/* specify where is their location */}
                  <p>{flight.price}</p>
                  <Link
                    className="text-blue-900 hover:underline"
                    to={`/flights?${filter}`}
                  >Check it out
                  </Link>
                  <button
                    className="text-blue-900 hover:underline"
                    onClick={handleNewEntry}
                  >
                    Enter a different location
                  </button>
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
                      id='from'
                      placeholder='Where are you from?'  
                      value={inputValue.from}
                      onChange={handleInputChange}
                    />
                    {filteredSuggestionsFrom.length > 0 &&
                      <SearchFilterResults id={'from'} filteredSuggestions={filteredSuggestionsFrom} handleSuggestionClick={handleSuggestionClick}/>  
                    }
                    {/* move search button down do you can still click when therere suggestions */}
                    <button className='bg-green-200 px-5 py-2'>Search</button>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>

        <div>
          <Attractions capital={country.capital} countryName={country.country} continent={country.continent_name}/>
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
