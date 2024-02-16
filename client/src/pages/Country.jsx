import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import useGetCountry from "../hooks/useGetCountry";
import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import SearchFilterResults from "../components/SearchFilterResults";
import Attractions from "../components/Attractions";
import News from "../components/News";
import TripModal from "../components/TripModal";
import DeleteModal from "../components/DeleteModal";
import ImageHero from '../components/heroComponent/ImageHero';
import BlogCards from "../components/cards/BlogCards";
import { TbCurrencyPeso } from "react-icons/tb";

export default function Country() {
  // add a function where if continent and country arent validate, return error
  const buttonRef = useRef(null);

  const { countryName, continent } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { country, loading, countryError } = useGetCountry(countryName);
  const [error, setError] = useState(null)
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

  const [openedDeleteModalId, setOpenedDeleteModalId] = useState(null);

  const [blogLoading, setBlogLoading] = useState(false)
  const [blogError, setBlogError] = useState(null)
  const [blogs, setBlogs] = useState([])

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openDeleteModal = (blogId) => {
    setOpenedDeleteModalId(blogId);
  };  

  const closeDeleteModal = () => {
    setOpenedDeleteModalId(null);
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

  useEffect(() => {
    fetchBlogs()
  }, [country.continent_name, country.country, blogError])

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
      setError('Continent Error')
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

  const handleDelete = async (blogId) => {
    console.log(blogId)
    try {
        const res = await fetch(`/api/blogs/deleteBlog/${blogId}`, {
          method: 'DELETE'
        })
        const data = await res.json()// show a prompt that shows the message of res
        console.log(data)
        fetchBlogs()
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
    { error ? 
    <p className="mx-auto container px-4 text-3xl">
      {error}
    </p>
    :
    countryError ? 
    <p className="mx-auto container px-4 text-3xl">
      {countryError}
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
          <ImageHero image={country.photo} />
          <div className="mt-4 container flex mx-auto px-4">
            <div>
              <p className="text-8xl font-bold">
                {country.country}
                  <span className="text-2xl"> {country.continent_name}</span>
              </p>
              <p className="my-4 text-lg text-justify">
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
        <div className="mt-20 bg-violet-100 py-7 mx-0 md:mx-2 
          md:px-4 md:rounded-3xl h-[220px] lg:h-[200px] flex items-center">
          <div className="container flex flex-col mx-auto px-4 h-full">
            <div className="flex w-full justify-between h-full">
              {/* left */}
              <div className="w-full md:w-2/3 md:border-r md:border-violet-500 h-full flex items-center">
                { flightLoading ? 
                  <div className="mx-auto px-4 text-2xl font-semibold">
                    Finding the cheapest flight for you....
                  </div> :
                flightError ?
                <div className="flex flex-col gap-4">
                  <div className="mx-auto px-4 text-3xl font-bold text-red-900">
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
                    <p className="text-4xl font-bold">
                      {`Cheapest flight from ${inputValue.name || inputValue.from || currentUser.user_iata}:`}
                    </p>
                    {/* specify where is their location */}
                    <div className="flex flex-col justify-center items-center gap-4 md:hidden">
                      <p className="flex text-7xl font-bold">
                        <TbCurrencyPeso/>
                        {flight.price}
                      </p>
                      <div className="flex gap-4 w-full">
                        <Link
                          className="flex-1 text-center items-center border px-6 py-2 rounded-full border-blue-800 bg-blue-800 
                            text-white font-semibold hover:bg-white duration-300 hover:text-blue-800"
                          to={`/flights?${filter}`}
                          state={{search: `${location.pathname}?${iataQuery}`}}
                        >Check it out
                        </Link>
                        <button
                          className="flex-1 text-center border px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800"
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
                  <p className="text-4xl font-bold">
                    {`Check out the cheapest flights to ${country.country}`}
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
              <div className="md:flex hidden w-1/3 ml-5 h-full justify-center items-center">
                { flightLoading ? 
                    <div className=''>
                      <img
                        className='w-32 animate-pulse' 
                        src="/vectors/magnifying-glass.svg" 
                        alt="maginfying-glass" 
                      />
                    </div>
                  :
                  flightError ?
                  <div className="container mx-auto px-4 ">
                    Error
                    {/* error animation */}
                  </div>
                  :
                  flight ? 
                  <div className="flex items-center flex-col gap-4">
                    <p className="flex text-5xl font-bold">
                      <TbCurrencyPeso/>
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
                  <div className='flex flex-col justify-center items-center'>
                    <img
                      className='w-32' 
                      src="/vectors/magnifying-glass.svg" 
                      alt="maginfying-glass" 
                    />
                    <p className='text-center mt-1 text-lg font-semibold'>
                      Search for a Flight 
                    </p>
                  </div>
                }
              </div>
            </div>
          
          </div>
        </div>

                {/* blogs */}
        {
          <div className="container my-20 py-7 gap-4 mx-auto px-4">
            <div className="container gap-4 mx-auto">
              <h1 className="text-6xl font-bold">
                Blogspot: Where Stories Unfold
              </h1>
              <p className="my-4 text-lg text-justify">
                {`Dive into the heart of ${country.country}  with our captivating 
                blogs! Join fellow adventurers as they uncover hidden gems, 
                share insider tips, and recount their unforgettable experiences 
                across this diverse landscape. Let their stories spark your 
                imagination and inspire your next incredible journey.`}
              </p>
              <Link
                className="hover:cursor-pointer max-w-max flex gap-2 items-center 
                text-white bg-blue-500 py-2 px-3 rounded-lg hover:bg-white 
                duration-300 hover:text-blue-800 mt-2"
                to={'/blogs'}
              >
                Check all blogs
              </Link>
            </div>
            {
              blogError ?
              <p className="mt-4 container mx-auto px-4 text-3xl">
                {blogError}
              </p> 
            : blogLoading ? 
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
            <div className="mt-4 container gap-4 flex flex-wrap mx-auto">
            { blogs.length > 0 && blogs.map((blog) => (
              <>
                {console.log(blog)}
                <Link to={`/blogs/${blog.id}`}>
                  <div className="">
                    <BlogCards 
                      blog={blog}
                      openDeleteModal={() => openDeleteModal(blog.id)}
                    />
                  </div>
                </Link>
                <DeleteModal  
                  blogId={blog.id}
                  isOpen={openedDeleteModalId === blog.id}
                  onClose={closeDeleteModal}
                  handleDelete={handleDelete}
                />
              </>
            ))}
            { blogs.length >= 5 &&
              <Link
                className="hover:cursor-pointer hover:underline"
                to={`/blogs?type=${country.country}&page=1`}
              >See More
              </Link>
            }
            </div>
            }
          </div>
        }

            {/* attractions div */}
        <div className="my-20 py-7 bg-orange-100 mx-0 
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

        <div className="my-20 py-7 bg-blue-100 mx-0 
          md:mx-2 md:px-4 md:rounded-3xl h-full">
          <div className="container px-4 mx-auto flex flex-col gap-4">
            <p className="text-6xl font-bold">
                {`Check out the Latest News from ${country.country}`} 
            </p>
            <p className="mb-4 text-lg text-justify">
              {`Stay updated with the latest news from ${country.country}! Explore breaking headlines, 
              trending stories, and insightful articles covering diverse topics. Dive into 
              the heartbeat of ${country.country} with our curated news section.`}
            </p>
            <News place={country.country}/>
          </div>
        </div>
      </div>
      }
    </>
  )
}
