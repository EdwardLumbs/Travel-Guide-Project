import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import useGetCountry from "../hooks/useGetCountry";
import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import SearchFilterResults from "../components/SearchFilterResults";
import Attractions from "../components/Attractions";
import News from "../components/News";
import TripModal from "../components/TripModal";
import ImageHero from '../components/heroComponent/ImageHero';
import BlogCards from "../components/cards/BlogCards";

export default function Country() {
  // add a function where if continent and country arent validate, return error
  const buttonRef = useRef(null);

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
  const [isModalOpen, setModalOpen] = useState(false);
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogError, setBlogError] = useState(null)
  const [blogs, setBlogs] = useState([])

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const currentDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const location = useLocation()
  const urlParams = new URLSearchParams(location.search);
  const iataQuery = urlParams.toString()

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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogLoading(true)
        const res = await fetch(`/api/blogs/getBlogs?limit=4&tag1=${country.continent_name}&tag2=${country.country}`)
        const data = await res.json()
        console.log(data)
        if (data.success === false) {
          setBlogError(data.message)
          setBlogLoading(false)
          return
        }
        setBlogs(data)
        setBlogError(null)
        setBlogLoading(false)
      } catch (error) {
        console.log(error.message)
        setBlogError(error.message)
        setBlogLoading(false)
      }
    }

    fetchBlogs()
  }, [country.continent_name, country.country])

  const handleInputChange = (e) => {
    const text = e.target.value.toLowerCase();
    if (e.target.id === 'from') {
      setInputValue({
        ...inputValue,
        from: e.target.value.toUpperCase()
      });
    } else {
      setInputValue({
        ...inputValue,
        [e.target.id]: e.target.value
      });
    }

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setFilteredSuggestionsFrom([]);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [buttonRef]);

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
      <div className="">
        <div className="">
          <ImageHero image={country.photo} />
          <div className="mt-4 container flex mx-auto px-4 h-[300px]">
            <div>
              <p className="text-6xl font-bold">
                {country.country}
                  <span className="text-2xl"> {country.continent_name}</span>
              </p>
              <p className="mt-4 text-justify">
                {country.description}
              </p>
              {
                currentUser &&
                <>
                  <p 
                    className="hover:underline hover:cursor-pointer text-blue-600"
                    onClick={openModal}  
                  >
                    Start a plan
                  </p>
                  <TripModal  
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    currentDestination={country.country}
                    user_id={currentUser.id}
                  />
                </>
              }
            </div>
          </div>
        </div>

              {/* flight div */}
        <div className="bg-violet-300 py-7 mx-0 md:mx-2 
          md:px-4 md:rounded-3xl h-[220px] lg:h-[200px] flex items-center">
          <div className="container flex mx-auto px-4 h-full">
            <div className="flex w-full justify-between h-full">
              {/* left */}
              <div className="w-full md:w-2/3 md:border-r md:border-violet-500 h-full flex items-center">
                { flightLoading ? 
                  <div className="text-2xl font-semibold">
                    Finding the cheapest flights for you....
                  </div> :
                flightError ?
                <div className="flex flex-col gap-4">
                  <div className="text-3xl font-bold text-red-900">
                    {flightError}
                  </div>
                  <button
                    className="w-max border px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800"
                    onClick={handleNewEntry}
                  >
                    Enter a different location
                  </button>
                </div> :
                flight ? 
                  <div className="flex flex-col gap-4">
                    <p className="text-3xl font-bold">
                      {`Cheapest flight from ${inputValue.name || inputValue.from || currentUser.user_iata} is:`}
                    </p>
                    {/* specify where is their location */}
                    <div className="flex flex-col gap-4 md:hidden">
                      <p className="text-3xl font-bold">
                        {flight.price}
                      </p>
                      <div className="flex gap-4">
                        <Link
                          className="w-max items-center border px-6 py-2 rounded-full border-blue-800 bg-blue-800 
                            text-white font-semibold hover:bg-white duration-300 hover:text-blue-800"
                          to={`/flights?${filter}`}
                          state={{search: `${location.pathname}?${iataQuery}`}}
                        >Check it out
                        </Link>
                        <button
                          className="w-max border px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800"
                          onClick={handleNewEntry}
                        >
                          Enter a different location
                        </button>
                      </div>
                    </div>
                    
                    <button
                      className="hidden md:flex w-max border px-6 py-2 rounded-full 
                       border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white 
                        duration-300 hover:text-blue-800"
                      onClick={handleNewEntry}
                    >
                      Enter a different location
                    </button>
                  </div>
                :
                <div className="flex flex-col gap-4 mr-2 lg:mr-0">
                  <p className="text-3xl font-bold">
                    {`Check out the cheapest flights for ${country.country}`}
                  </p>
                  <form 
                    onSubmit={handleSubmit}
                  >
                    <input 
                      className='border lg:mb-0 mb-4 hover:border-slate-600 duration-200 
                        rounded-full p-2 w-full md:w-96 box-border'
                      type="text" 
                      required
                      id='from'
                      autoComplete="off"
                      placeholder='Where are you from?'  
                      value={inputValue.from}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        handleInputEnter(e, buttonRef);
                        handleArrowNavigation(e);
                      }}
                    />
                    <div className="absolute bg-white w-[1500px] z-10">                
                      {filteredSuggestionsFrom.length > 0 &&
                          <SearchFilterResults 
                            id={'from'} 
                            filteredSuggestions={filteredSuggestionsFrom} 
                            handleSuggestionClick={handleSuggestionClick}
                            highlightedIndex={highlightedIndex}
                          />  
                      }
                    </div>
                    {/* move search button down do you can still click when therere suggestions */}
                    <button 
                      // make the button style better
                      className='lg:ml-4 w-full md:w-40 border px-6 py-2 rounded-full border-blue-800 bg-blue-800 
                        text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
                      ref={buttonRef}
                    >
                      Search
                    </button>
              
                  </form>
                </div>
                }
              </div>
              {/* right */}
              <div className="md:flex hidden w-1/3 ml-5 h-full items-center">
                { flightLoading ? 
                    <div>
                      Loading....
                      {/* loading animation */}
                    </div> 
                  :
                  flightError ?
                  <div>
                    Error
                    {/* error animation */}
                  </div>
                  :
                  flight ? 
                  <div className="flex flex-col gap-4">
                    <p className="text-3xl font-bold">
                      {flight.price}
                    </p>
                    <Link
                      className="w-max items-center border px-6 py-2 rounded-full border-blue-800 bg-blue-800 
                        text-white font-semibold hover:bg-white duration-300 hover:text-blue-800"
                      to={`/flights?${filter}`}
                      state={{search: `${location.pathname}?${iataQuery}`}}
                    >Check it out
                    </Link>
                  </div>
                  :
                  <p>
                    default display
                  </p>
                }
              </div>
            </div>
          
          </div>
        </div>

                {/* attractions div */}
        <div className="mt-7 py-7 bg-orange-300 mx-0 
          md:mx-2 md:px-4 md:rounded-3xl h-full flex items-center">
            {/* h-[300px] lg:h-[200px] */}
          <div className="container flex mx-auto px-4">
            <Attractions 
              capital={country.capital} 
              countryName={country.country} 
              continent={country.continent_name}
              countryPage={true}
              tripData={null}
              setTripData={null}
            />
          </div>
        </div>

        <div className="py-7 gap-4 mx-auto px-4">
          <div className="mt-4 container gap-4 flex flex-wrap mx-auto px-4 ">
            {
              blogError ?
                <p className="text-3xl">
                  {blogError}
                </p> 
              : blogLoading ? 
                <p className="text-3xl">
                  Loading...
                </p> 
              : 
                blogs.map((blog) => (
                  <Link to={`/blogs/${blog.id}`}>
                    <div className="">
                      <BlogCards blog={blog}/>
                    </div>
                  </Link>
                ))  
            }
            { blogs.length >= 4 &&
            <Link
              className="hover:cursor-pointer hover:underline"
              to={`/blogs?type=${country.country}&page=1`}
            >See More
            </Link>
            }
          </div>
        </div>

        <div className="mt-7 py-4 bg-blue-300 mx-0 
          md:mx-2 md:px-4 md:rounded-3xl h-full">
          <div className="mt-4 container px-4 mx-auto flex flex-col gap-4">
            <p className="text-3xl font-bold">
                {`Check out the Latest News from ${country.country}`} 
            </p>
            <p className="text-justify">
              {`Stay updated with the latest news from ${country.country}! Explore breaking headlines, 
              trending stories, and insightful articles covering diverse topics. Dive into 
              the heartbeat of [Country] with our curated news section.`}
            </p>
            <News place={country.country}/>
          </div>
        </div>
      </div>
      }
    </>
  )
}
