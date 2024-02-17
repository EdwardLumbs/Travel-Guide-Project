import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SearchFilterResults from '../components/SearchFilterResults';
import Hero from '../components/heroComponent/Hero';
import { TbCurrencyPeso } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";

export default function Flights() {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const [flight, setFlight] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filteredSuggestionsFrom, setFilteredSuggestionsFrom] = useState([]);
  const [filteredSuggestionsTo, setFilteredSuggestionsTo] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [iataCodes, setIataCodes] = useState([]);
  const [inputText, setInputText] = useState({
    from: '',
    to: '',
    from_params: '',
    to_params: ''
  });
  console.log(inputText)
  const [maxInput, setMaxInput] = useState({
    adults: '11',
    children: '11',
    infants: '11'
  });
  const [params, setParams] = useState({
    fly_from: "",
    fly_to: "",
    date_from: "",
    date_to: "",
    return_from: "",
    return_to: "",
    curr: "PHP",
    adults: 1,
    children: 0,
    infants: 0,
    selected_cabins: 'M',
  });
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.state?.search || "";

  useEffect(() => {
    const getIataCodes = async () => {
      try {
        const res = await fetch('/api/flights/getIata');
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
        };
        setIataCodes(data);
      } catch (error) {
        console.log(error);
      }
    }
    getIataCodes();
  }, []);

  const handleInputChange = (e) => {
    const id = e.target.id;
    const text = e.target.value.toLowerCase();
    setInputText({
      ...inputText,
      [id]: e.target.value
    });

    let filtered = iataCodes.filter((iataCode) => 
      iataCode.country.toLowerCase().includes(text)
    );
    if (e.target.value === ''){
      filtered = []
    };

    if (id === 'to') {
      setFilteredSuggestionsTo(filtered);
    } else if (id === 'from') {
      setFilteredSuggestionsFrom(filtered);
    };
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  };

  // add an onclick on the input field or enter click

  const handleSuggestionClick = (e, name = 'none', suggestion) => {
    setInputText({
      ...inputText,
      [e.target.id]: suggestion.country_iata,
      [name]: suggestion.country
    });
  
    if (e.target.id === 'to') {
      setFilteredSuggestionsTo([]);
      setHighlightedIndex(-1);
    } else if (e.target.id === 'from') {
      setFilteredSuggestionsFrom([]);
      setHighlightedIndex(-1);
    };
  };

  const handleInputEnter = (e, nextInputRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex !== -1) {
        const suggestions = e.target.id === 'from' ? filteredSuggestionsFrom : filteredSuggestionsTo;
        const highlightedSuggestion = suggestions[highlightedIndex];
        handleSuggestionClick(e, name='none', highlightedSuggestion);
      } else {
        setFilteredSuggestionsTo([]);
        setFilteredSuggestionsFrom([]);
        if (nextInputRef && nextInputRef.current) {
          nextInputRef.current.focus();
        } else {
          e.target.blur();
        }
      };
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      const suggestions = e.target.id === 'from' ? filteredSuggestionsFrom : filteredSuggestionsTo;
      const newIndex = Math.min(Math.max(highlightedIndex + direction, 0), suggestions.length - 1);
      setHighlightedIndex(newIndex);
    };
  };

  const handleChange = (e) => {
    if (e.target.id === 'date_from') {
      setParams({...params, date_from: e.target.value, date_to: e.target.value});
    } else if (e.target.id === 'return_from') {
      setParams({...params, return_from: e.target.value, return_to: e.target.value});
    } else if (['adults', 'children', 'infants'].includes(e.target.id)) { 
      let value = parseInt(e.target.value, 10) || 0;
      setParams({ ...params, [e.target.id]: value });
    } else {
      setParams({...params, [e.target.id]: e.target.value});
    };
  };

  const handleArrowNavigation = (name, e) => {
    let filteredSuggestions;
    if (name === 'from') {
      filteredSuggestions = filteredSuggestionsFrom;
    } else {
      filteredSuggestions = filteredSuggestionsTo;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      const newIndex = Math.min(
        Math.max(highlightedIndex + direction, 0),
        filteredSuggestions.length - 1
      );
      setHighlightedIndex(newIndex);
    };
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    console.log(urlParams);
    const flyFromUrl = urlParams.get('fly_from');
    const flyToUrl = urlParams.get('fly_to');
    const dateFromUrl = urlParams.get('date_from');
    const dateToUrl = urlParams.get('date_to');
    const returnFromUrl = urlParams.get('return_from');
    const returnToUrl = urlParams.get('return_to');
    const currFromUrl = urlParams.get('curr');
    const adultsFromUrl = urlParams.get('adults');
    const childrenFromUrl = urlParams.get('children');
    const infantsFromUrl = urlParams.get('infants');
    const cabinsFromUrl = urlParams.get('selected_cabins');
    const filterQuery = urlParams.toString();
    setFrom(flyFromUrl)
    setTo(flyToUrl)

    if (flyFromUrl || 
      flyToUrl ||
      dateFromUrl ||
      dateToUrl ||
      returnFromUrl ||
      returnToUrl ||
      currFromUrl ||
      adultsFromUrl ||
      childrenFromUrl ||
      infantsFromUrl ||
      cabinsFromUrl) {
        setParams({
          date_from: dateFromUrl || "",
          date_to: dateToUrl || "",
          return_from: returnFromUrl || "",
          return_to: returnToUrl || "",
          curr: currFromUrl || "PHP",
          adults: parseInt(adultsFromUrl) || 1,
          children: parseInt(childrenFromUrl) || 0,
          infants: parseInt(infantsFromUrl) || 0,
          selected_cabins: cabinsFromUrl || 'M'
        })
        setInputText({
          ...inputText,
          from: flyFromUrl || "",
          to: flyToUrl || "",
        })
      }

      const fetchFlightData = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/flights/getFlight/${filterQuery}/${flyFromUrl}/${flyToUrl}`);
          const flightData = await res.json();
          if (flightData.success === false) {
            setLoading(false);
            setError(flightData.message);
          }
          setLoading(false);
          setFlight(flightData);
        } catch (error) {
          setLoading(false);
          setError(error);
          console.log(error);
        }
      }

      if (filterQuery){
        fetchFlightData();
      } ;
  }, [location.search]);

  useEffect(() => {
    const totalPassengers = params.adults + params.children + params.infants;
    setMaxInput({
      adults: 11 - (totalPassengers - params.adults),
      children: 11 - (totalPassengers - params.children),
      infants: 11 - (totalPassengers - params.infants),
    });
  }, [params.adults, params.children, params.infants]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        input1Ref.current &&
        !input1Ref.current.contains(e.target) &&
        input2Ref.current &&
        !input2Ref.current.contains(e.target)
      ) {
        setFilteredSuggestionsFrom([]);
        setFilteredSuggestionsTo([]);
      };
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [input1Ref, input2Ref]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilteredSuggestionsTo([]);
    setFilteredSuggestionsFrom([]);
    setLoading(true);
    setFrom(inputText.from_params || inputText.from)
    setTo(inputText.to_params || inputText.to)
    const urlParams = new URLSearchParams();
    urlParams.set('fly_from', inputText.from);
    urlParams.set('fly_to', inputText.to);
    urlParams.set('date_from', params.date_from);
    urlParams.set('date_to', params.date_to);
    urlParams.set('return_from', params.return_from);
    urlParams.set('return_to', params.return_to);
    urlParams.set('curr', params.curr);
    urlParams.set('adults', params.adults);
    urlParams.set('children', params.children);
    urlParams.set('infants', params.infants);
    urlParams.set('selected_cabins', params.selected_cabins);
    const searchQuery = urlParams.toString();
    navigate(`/flights?${searchQuery}`);
  };

  return (
    // change accent colors
    <div>
      <Hero 
        image={"photos/airplane.jpg"}
        content={
          <p className='font-bold'>
            Finding the cheapest flights has never been easier
          </p>
        }
        
      />
      <div className="h-[1680px] lg:h-[780px]">
        {location.state && 
        <Link
          to={`${search}`}
          relative="path"
          className="hover-underline"
          >&larr; <span>Back to Last Page</span></Link>
        }
        <form 
          onSubmit={handleSubmit}
          className='bg-white shadow-lg rounded-xl flex flex-col justify-center items-center p-7 relative gap-4
          container left-1/2 -translate-x-1/2 -translate-y-1/4 lg:-translate-y-1/2'
        >
          <div className='flex flex-col lg:flex-row gap-4 w-full justify-center flex-grow'>
            <div className='relative flex-grow'>
              <label 
                htmlFor="from" 
                className="absolute text-gray-500 top-7 left-7 transform -translate-y-full -translate-x-1/2 text-sm font-semibold"
              >
                From
              </label>
              <input
                className='border text-xl border-black px-3 py-2 rounded-md pt-8 w-full lg:flex-grow'
                type="text"
                id='from'
                required
                autoComplete='off'
                placeholder='Type a valid IATA code'
                onChange={handleInputChange}
                value={inputText.from}
                onKeyDown={(e) => {
                  handleInputEnter(e, input2Ref);
                  handleArrowNavigation('from', e);
                }}
                ref={input1Ref}
              />
              <div className="absolute top-full left-0 w-[1300px] lg:w-[825px]">
                {filteredSuggestionsFrom.length > 0 && 
                  <SearchFilterResults 
                    name={'from_params'} 
                    id={'from'} 
                    filteredSuggestions={filteredSuggestionsFrom} 
                    handleSuggestionClick={handleSuggestionClick}
                    highlightedIndex={highlightedIndex}
                  />
                }
              </div>
            </div>
            <div className='relative flex-grow'>
              <label 
                htmlFor="to" 
                className="absolute top-7 text-gray-500 left-5 transform -translate-y-full -translate-x-1/2 text-sm font-semibold"
              >
                To
              </label>
              <input
                className='border text-xl border-black px-3 py-2 rounded-lg pt-8 w-full lg:flex-grow'
                type="text"
                id='to'
                required
                autoComplete='off'
                placeholder='Type a valid IATA code'
                onChange={handleInputChange}
                value={inputText.to}
                onKeyDown={(e) => {
                  handleInputEnter(e, null);
                  handleArrowNavigation('to', e);
                }}
                ref={input2Ref}
              />
              <div className="absolute top-full left-0 w-[1300px] lg:w-[825px]">
                {filteredSuggestionsTo.length > 0 && (
                  <SearchFilterResults 
                    name={'to_params'} 
                    id={'to'} 
                    filteredSuggestions={filteredSuggestionsTo} 
                    handleSuggestionClick={handleSuggestionClick}
                    highlightedIndex={highlightedIndex}
                  />
                )}
              </div>
            </div>
            <div className='border border-black px-3 rounded-lg flex justify-evenly lg:flex-grow'>
              <div className='relative'>
                <label htmlFor="departure" className="text-gray-500 absolute top-7 left-8 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Departure</label>
                <input 
                  className='pt-8 text-xl'
                  type="date" 
                  id='date_from'
                  min={today}
                  required
                  onChange={handleChange}
                  value={params.date_from}
                />
              </div>
              <div className='relative'>
                <label htmlFor="return" className="text-gray-500 absolute top-7 left-5 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Return</label>
                <input 
                  className='pt-8 text-xl'
                  type="date" 
                  id='return_from'
                  min={params.date_from}
                  onChange={handleChange}
                  value={params.return_from}
                />
              </div>
            </div>
            
          </div>
          <div className='flex flex-col lg:flex-row gap-4 w-full justify-center flex-grow'>
            {/* for smaller screen */}
            <div className='lg:hidden flex gap-4 justify-between'>
              <div className='relative flex-grow w-full'>
                <label htmlFor="adults" className="text-gray-500 absolute top-7 left-8 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Adults</label>
                <input 
                  className='border text-xl border-black pl-3 pr-2 py-2 rounded-lg pt-8 w-full'
                  type="number" 
                  id='adults'
                  min = "0"
                  max={maxInput.adults}
                  placeholder='No. of adults'
                  onChange={handleChange}
                  value={params.adults}
                />
              </div>
              <div className='relative flex-grow w-full'>
                <label htmlFor="children" className="text-gray-500 absolute top-7 left-10 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Children</label>
                <input 
                  className='border text-xl border-black pl-3 pr-2 py-2 rounded-lg pt-8 w-full'
                  type="number" 
                  id='children'
                  min = "0"
                  max={maxInput.children}
                  placeholder='No. of children'
                  onChange={handleChange}
                  value={params.children}
                />
              </div>
              <div className='relative flex-grow w-full'>
                <label htmlFor="infants" className="text-gray-500 absolute top-7 left-9 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Infants</label>
                <input 
                  className='border text-xl border-black pl-3 pr-2 py-2 rounded-lg pt-8 w-full'
                  type="number" 
                  id='infants'
                  min = "0"
                  max={maxInput.infants}
                  placeholder='No. of infants'
                  onChange={handleChange}
                  value={params.infants}
                />
              </div>
            </div>
            {/* end for smaller screen */}
            <div className='hidden lg:flex gap-4 w-full'>
              <div className='relative flex-grow w-full'>
                <label htmlFor="adults" className="text-gray-500 absolute top-7 left-8 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Adults</label>
                <input 
                  className='border text-xl border-black pl-3 pr-2 py-2 rounded-lg pt-8 w-full'
                  type="number" 
                  id='adults'
                  min = "0"
                  max={maxInput.adults}
                  placeholder='No. of adults'
                  onChange={handleChange}
                  value={params.adults}
                />
              </div>
              <div className='relative flex-grow w-full'>
                <label htmlFor="children" className="text-gray-500 absolute top-7 left-10 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Children</label>
                <input 
                  className='border text-xl border-black pl-3 pr-2 py-2 rounded-lg pt-8 w-full'
                  type="number" 
                  id='children'
                  min = "0"
                  max={maxInput.children}
                  placeholder='No. of children'
                  onChange={handleChange}
                  value={params.children}
                />
              </div>
              <div className='relative flex-grow w-full'>
                <label htmlFor="infants" className="text-gray-500 absolute top-7 left-9 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Infants</label>
                <input 
                  className='border text-xl border-black pl-3 pr-2 py-2 rounded-lg pt-8 w-full'
                  type="number" 
                  id='infants'
                  min = "0"
                  max={maxInput.infants}
                  placeholder='No. of infants'
                  onChange={handleChange}
                  value={params.infants}
                />
              </div>
            </div>
            <div className='relative w-full'>
              <label htmlFor="class" className="text-gray-500 absolute top-7 left-8 transform -translate-y-full -translate-x-1/2 text-sm font-semibold">Class</label>
              <select 
                className='border text-xl border-black px-3 py-2 rounded-md pt-8 w-full'
                name="cabin" 
                id="selected_cabins"
                onChange={handleChange}
                value={params.selected_cabins}
              >
                <option value="M" selected>Economy</option>
                <option value="W">Economy Premium</option>
                <option value="C">Business</option>
                <option value="F">First Class</option>
              </select>
            </div>
            <button 
              className='bg-blue-800 text-xl rounded-md text-white font-semibold px-5 py-2 w-full
                  hover:bg-white hover:text-blue-800 duration-200 border border-blue-800'
            >
              Search for Cheap Flights
            </button>
          </div>
        </form>
        
        <div className='flex flex-col lg:flex-row items-center gap-4 container mx-auto -translate-y-20 bg-blue-100 p-7 rounded-xl'>
          {/* left */}
          <div className='lg:w-2/3'>
            {loading ? 
            <p className='text-4xl font-semibold items-center'>
              {/* change loading animation */}
              Getting your flight for you...
            </p> 
            : error ? 
            <p>
              {error}
            </p>
            : !flight ?
            // default display
            <div className='w-full'>
              <h1 className='text-4xl font-extrabold'>
                Discover the Best Deals! 
              </h1>
              <p className='text-lg'>
                Explore our flight search feature, designed to find you the cheapest airfares effortlessly. 
              </p>
              {/* first step */}
              <div className='bg-white rounded-xl'>
                <div className='flex lg:flex-row flex-col items-center p-4 mt-4 mx-16 justify-between'>
                  <div className='flex gap-4 items-center'>
                    <p className='text-6xl font-bold bg-blue-300 rounded-full min-w-24 min-h-24 flex items-center justify-center'>
                      1
                    </p> 
                    <p className='text-lg'>
                      Input your departure and destination cities          
                    </p>
                  </div>
                  <div className='lg:w-1/4 flex justify-end lg:border-l border-black'>
                    <img 
                      className='h-[80px]'
                      src="vectors/location-pin.svg" 
                      alt="pin" 
                    />
                  </div>
                </div>
              </div>
              {/* second step */}
              <div className='bg-white rounded-xl'>
                <div className='flex lg:flex-row flex-col  items-center p-4 mt-4 mx-16 justify-between'>
                  <div className='lg:w-1/4 flex justify-start lg:border-r border-black'>
                    <img 
                      className='w-32'
                      src="vectors/two-calendar.svg" 
                      alt="calendar" 
                    />
                  </div>
                  <div className='flex gap-4 items-center justify-end'>
                    <p className='text-lg'>
                      Select your travel dates 
                    </p>
                    <p className='text-6xl font-bold bg-blue-300 rounded-full min-w-24 min-h-24 flex items-center justify-center'>
                      2
                    </p> 
                  </div>
                </div>
              </div>
              {/* third step */}
              <div className='bg-white rounded-xl'>
                <div className='flex lg:flex-row flex-col items-center p-4 mt-4 mx-16 justify-between'>
                  <div className='flex gap-4 items-center'>
                    <p className='text-6xl font-bold bg-blue-300 rounded-full  min-w-24 min-h-24 flex items-center justify-center'>
                      3
                    </p> 
                    <p className='text-lg'>
                      Let our powerful search engine do the rest. 
                    </p>
                  </div>
                  <div className='lg:w-1/4 flex justify-end lg:border-l border-black'>
                    <img 
                      className='h-[80px]'
                      src="vectors/plane.svg" 
                      alt="plane" 
                    />
                  </div>
                </div>
              </div>
            
              <p className='mt-4 text-lg font-bold'>
                Find unbeatable prices and book your next adventure with ease!
              </p>
            </div>

            : flight &&
            <div className='flex flex-col h-full'>
              <p className='text-4xl font-semibold items-center'>
                Check out the cheapest flight we found 
                from {from} to {to}:
              </p>
            </div>
            }
          </div>

          {/* right */}
          <div className='flex justify-center items-center lg:w-1/3'>
            {
              loading ?
              <div className=''>
                  <img
                    className='w-64 animate-pulse' 
                    src="vectors/magnifying-glass.svg" 
                    alt="maginfying-glass" 
                  />
                  <p className='text-center mt-4 text-lg font-semibold'>
                    Searching...
                  </p>
                </div>
              :
              flight ?
                <div className='lg:pl-20 gap-4 lg:border-l lg:border-black flex flex-col h-64 justify-center items-center'>
                  <p className='flex text-8xl lg:text-6xl font-semibold'>
                    <TbCurrencyPeso/>
                    {flight.price}
                  </p>
                  <div className='flex items-center text-lg duration-200 text-blue-900 hover:text-blue-600'>
                    <a 
                      className='font-semibold'
                      href={flight.deep_link}
                      target="_blank"
                    >
                      Check out the details
                    </a>
                    <IoIosArrowForward />
                  </div>
                </div>
              :
                <div className=''>
                  <img
                    className='w-64' 
                    src="vectors/magnifying-glass.svg" 
                    alt="maginfying-glass" 
                  />
                  <p className='text-center mt-4 text-lg font-semibold'>
                    Search for a Flight 
                  </p>
                </div>
            }
          </div>
        </div>
          
        </div>
    </div>
  )
}
