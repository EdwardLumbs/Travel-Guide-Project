import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Flights() {
  const [flight, setFlight] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [filteredSuggestionsFrom, setFilteredSuggestionsFrom] = useState([])
  const [filteredSuggestionsTo, setFilteredSuggestionsTo] = useState([])
  console.log(filteredSuggestionsFrom)
  const [iataCodes, setIataCodes] = useState([])
  const [inputText, setInputText] = useState({
    from: '',
    to: '',
    from_params: '',
    to_params: ''
  })
  console.log(inputText)
  const [maxInput, setMaxInput] = useState({
    adults: '11',
    children: '11',
    infants: '11'
  })
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
  })
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const navigate = useNavigate()

  useEffect(() => {
    const getIataCodes = async () => {
      try {
        const res = await fetch('/api/flights/getIata')
        const data = await res.json()
        console.log(data)
        if (data.success === false) {
          console.log(data.message)
        }
        setIataCodes(data)
      } catch (error) {
        console.log(error)
      }
    }
    getIataCodes()
  }, [])

  const handleInputChange = (e) => {
    const id = e.target.id
    const text = e.target.value.toLowerCase()
    setInputText({
      ...inputText,
      [id]: e.target.value
    })

    console.log(inputText)

    let filtered = iataCodes.filter((iataCode) => 
      iataCode.country.toLowerCase().includes(text)
    )
    if (e.target.value === ''){
      filtered = []
    }

    if (id === 'to') {
      setFilteredSuggestionsTo(filtered)
    } else if (id === 'from') {
      setFilteredSuggestionsFrom(filtered)
    }
  }

  const handleSuggestionClick = (e, name, suggestion) => {
    console.log(name)
    console.log(suggestion)
    setInputText({
      ...inputText,
      [e.target.id]: suggestion.country_iata,
      [name]: suggestion.country
    })
  
    if (e.target.id === 'to') {
      setFilteredSuggestionsTo([])
    } else if (e.target.id === 'from') {
      setFilteredSuggestionsFrom([])
    }
  }

  const handleChange = (e) => {
    if (e.target.id === 'date_from') {
      setParams({...params, date_from: e.target.value, date_to: e.target.value})
    } else if (e.target.id === 'return_from') {
      setParams({...params, return_from: e.target.value, return_to: e.target.value})
    } else if (['adults', 'children', 'infants'].includes(e.target.id)) { 
      let value = parseInt(e.target.value, 10) || 0;
      setParams({ ...params, [e.target.id]: value });
    } else {
      setParams({...params, [e.target.id]: e.target.value})
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    console.log(urlParams)
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
          const res = await fetch(`/api/flights/getFlight/${filterQuery}`);
          const flightData = await res.json();
          console.log(flightData)
          if (flightData.success === false) {
            setLoading(false)
            setError(flightData.message)
          }
          setLoading(false)
          setFlight(flightData)
        } catch (error) {
          setLoading(false)
          setError(error)
          console.log(error)
        }
      }

      if (filterQuery){
        fetchFlightData()
      } 
  }, [location.search])

  useEffect(() => {
    const totalPassengers = params.adults + params.children + params.infants;
    setMaxInput({
      adults: 11 - (totalPassengers - params.adults),
      children: 11 - (totalPassengers - params.children),
      infants: 11 - (totalPassengers - params.infants),
    });
  }, [params.adults, params.children, params.infants]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const urlParams = new URLSearchParams()
    urlParams.set('fly_from', inputText.from)
    urlParams.set('fly_to', inputText.to)
    urlParams.set('date_from', params.date_from)
    urlParams.set('date_to', params.date_to)
    urlParams.set('return_from', params.return_from)
    urlParams.set('return_to', params.return_to)
    urlParams.set('curr', params.curr)
    urlParams.set('adults', params.adults)
    urlParams.set('children', params.children)
    urlParams.set('infants', params.infants)
    urlParams.set('selected_cabins', params.selected_cabins)
    const searchQuery = urlParams.toString()
    navigate(`/flights?${searchQuery}`)
  }

  return (
    <div className='flex flex-col'>
      <form 
        onSubmit={handleSubmit}
        className='flex flex-col justify-center items-center bg-green-300 p-7'
      >
        <div className='flex'>
          <div>
            <label>From</label>
            <input 
              className='border border-black px-3 py-2 rounded-lg'
              type="text" 
              id='from'
              required
              placeholder='Where are you from?'  
              onChange={handleInputChange}
              value={inputText.from}
            />
            {filteredSuggestionsFrom.length > 0 && (
              <ul
                className='"absolute z-10 w-full bg-white border rounded mt-1"'
              >
                {filteredSuggestionsFrom.map((suggestion, index) => (
                  <li
                    key={index}
                    id='from'
                    onClick={(e) => handleSuggestionClick(e, 'from_params', suggestion)}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion.country} ({suggestion.country_iata})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label>To</label>
            <input 
              className='border border-black px-3 py-2 rounded-lg'
              type="text" 
              id='to'
              required
              placeholder='Where do you want to go?'  
              onChange={handleInputChange}
              value={inputText.to}
            />
            {filteredSuggestionsTo.length > 0 && (
              <ul
                className='"absolute z-10 w-full bg-white border rounded mt-1"'
              >
                {filteredSuggestionsTo.map((suggestion, index) => (
                  <li
                    key={index}
                    id='to'
                    onClick={(e) => handleSuggestionClick(e, 'to_params', suggestion)}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion.country} ({suggestion.country_iata})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label>Departure</label>
          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="date" 
            id='date_from'
            min={today}
            required
            onChange={handleChange}
            value={params.date_from}
          />
          <label>Return</label>
          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="date" 
            id='return_from'
            min={params.date_from}
            onChange={handleChange}
            value={params.return_from}
          />
        </div>
        <div>
          <label>Adults (Over 11)</label>
          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="number" 
            id='adults'
            min = "0"
            max={maxInput.adults}
            placeholder='No. of adults'
            onChange={handleChange}
            value={params.adults}
          />
          <label>Children (2-11)</label>
          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="number" 
            id='children'
            min = "0"
            max={maxInput.children}
            placeholder='No. of children'
            onChange={handleChange}
            value={params.children}
          />
          <label>Infants (Under 2)</label>
          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="number" 
            id='infants'
            min = "0"
            max={maxInput.infants}
            placeholder='No. of infants'
            onChange={handleChange}
            value={params.infants}
          />
        </div>
        <div>
          <label>Infants (Under 2)</label>
          <select 
            className='border border-black px-3 py-2 rounded-lg'
            name="" 
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
        <button className='bg-white px-5 py-2'>Search</button>
      </form>
      <div className='bg-red-200'>
        {loading ? 
        <p>
          Loading...
        </p> : error ? 
        <p>
          {error}
        </p>
        : flight ? 
        <div className='flex flex-col'>
          <p>
            Check out the cheapest flight we found 
            from {inputText.from_params} to {inputText.to_params}:
          </p>
          <p className='text-3xl font-semibold'>
            {flight.price}
          </p>
          <a 
            className='text-blue-900 font-semibold underline'
            href={flight.deep_link}
            target="_blank"
          >Check out the details</a>
        </div>
        :
        <div className='flex'>
          <p>
            Look for the cheapest Flights:
          </p>
        </div>
        }
      </div>
    </div>
  )
}
