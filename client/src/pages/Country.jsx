import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import useGetCountry from "../hooks/useGetCountry";
import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import SearchFilterResults from "../components/SearchFilterResults";
import Attractions from "../components/Attractions";
import News from "../components/News";

export default function Country() {
  // add a function where if continent and country arent validate, return error
  const buttonRef = useRef(null);
  const params = useParams();
  console.log(params)
  const { countryName, continent } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { country, loading, countryError } = useGetCountry(countryName);
  const [flight, setFlight] = useState();
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentUserIata, setCurrentUserIata] = useState(null)

  const currentDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const location = useLocation()
  const urlParams = new URLSearchParams(location.search);
  const iataQuery = urlParams.toString()

  console.log(country.continent_name)
  console.log(continent)

  useEffect(() => {
    setCurrentUserIata(currentUser?.user_iata)

    const getIataCodes = async () => {
      try {
        const res = await fetch('/api/flights/getIata');
        const data = await res.json();
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

    let filtered = iataCodes.filter((iataCode) => 
      iataCode.country.toLowerCase().includes(text)
    );
    if (e.target.value === ''){
      filtered = [];
    }

    setFilteredSuggestionsFrom(filtered);
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  };

  const handleSuggestionClick = (e, name = 'none', suggestion) => {
    setInputValue({
      ...inputValue,
      [e.target.id]: suggestion.country_iata,
      name: suggestion.country
    });
    setFilteredSuggestionsFrom([]);
    setHighlightedIndex(-1);
  }

  const handleInputEnter = (e, buttonRef) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex !== -1) {
            const highlightedSuggestion = filteredSuggestionsFrom[highlightedIndex];
            handleSuggestionClick(e, 'none', highlightedSuggestion);
        } else {
            setFilteredSuggestionsFrom([])
            e.target.blur();
            if (buttonRef && buttonRef.current) {
              buttonRef.current.focus();
              buttonRef.click()
            }
        }
    };
  }

  const handleArrowNavigation = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      const newIndex = Math.min(
        Math.max(highlightedIndex + direction, 0),
        filteredSuggestionsFrom.length - 1
      );
      setHighlightedIndex(newIndex);
    }
  };

  const fetchFlightData = async () => {
    const urlParams = new URLSearchParams;
    urlParams.set('fly_from', currentUserIata || inputValue.from || '');
    urlParams.set('fly_to', country.country_iata);
    urlParams.set('date_from', tomorrow);
    urlParams.set('date_to', tomorrow);
    urlParams.set('curr', 'PHP');
    urlParams.set('adults', 1);
    urlParams.set('children', 0);
    urlParams.set('infants', 0);
    urlParams.set('selected_cabins', 'M');
    const filterQuery = urlParams.toString();
    setFilter(filterQuery);

    try {
      setFlightLoading(true);
      const res = await fetch(`/api/flights/getFlight/${filterQuery}/${currentUserIata || inputValue.from}/${country.country_iata}`);
      const flightData = await res.json();

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
    const urlParams = new URLSearchParams(location.search);
    const iataFromUrl = urlParams.get('iata')

    if (iataFromUrl) {
      setInputValue({
        ...inputValue,
        from: iataFromUrl
      })
    }

    if (currentUserIata || inputValue.from) {
      fetchFlightData();
    }

    // add error 404 page
    if (country && country.continent_name && continent && country.continent_name.toLowerCase() !== continent.toLowerCase()) {
      console.log('error 404')
    }

  }, [country, location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.from === country.country_iata) {
      setFlightError("Please enter a different location")
      return
    }
    const urlParams = new URLSearchParams();
    urlParams.set('iata', inputValue.from);
    const flightQuery = urlParams.toString();
    navigate(`${location.pathname}?${flightQuery}`)
  }

  const handleNewEntry = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('iata');
    setCurrentUserIata(null)
    setFlightError(null)
    setInputValue({})
    setFlight('')
    navigate(`${location.pathname}`)
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
                  <p>{`Cheapest flight from ${inputValue.name || inputValue.from || currentUser.user_iata} is:`}</p>
                  {/* specify where is their location */}
                  <p>{flight.price}</p>
                  <Link
                    className="text-blue-900 hover:underline"
                    to={`/flights?${filter}`}
                    state={{search: `${location.pathname}?${iataQuery}`}}
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
                      onKeyDown={(e) => {
                        handleInputEnter(e, buttonRef);
                        handleArrowNavigation(e);
                      }}
                    />
                    {filteredSuggestionsFrom.length > 0 &&
                      <SearchFilterResults 
                        id={'from'} 
                        filteredSuggestions={filteredSuggestionsFrom} 
                        handleSuggestionClick={handleSuggestionClick}
                        highlightedIndex={highlightedIndex}
                      />  
                    }
                    {/* move search button down do you can still click when therere suggestions */}
                    <button 
                      className='bg-green-200 px-5 py-2'
                      ref={buttonRef}
                    >
                      Search
                    </button>
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
          <News place={country.country}/>
        </div>

      </div>
      }
    </>
  )
}
