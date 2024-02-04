import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useGetCountry from '../../hooks/useGetCountry'
import useGetContinent from '../../hooks/useGetContinent'
import SearchFilterResults from '../../components/SearchFilterResults';
import Attractions from '../../components/Attractions'

export default function UserTrips() {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const [isCountry, setIsCountry] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    attractions: []
  })
  const navigate = useNavigate();
  const { country } = useGetCountry('all')
  const { continentData } = useGetContinent('all')

  console.log(tripData.attractions)

  useEffect(() => {
    if (Array.isArray(continentData) && Array.isArray(country)) {
      setSuggestions([...continentData, ...country]);
    }
  }, [continentData, country]);

  useEffect(() => {
    if (country.length > 0) {
      let isCountryMatch = country.includes(tripData.destination);
      setIsCountry(isCountryMatch);
    }
  }, [tripData.destination]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        input1Ref.current &&
        !input1Ref.current.contains(e.target) &&
        input2Ref.current &&
        !input2Ref.current.contains(e.target)
      ) {
        setFilteredSuggestions([]);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [input1Ref, input2Ref]);

  useEffect(() => {
    console.log('clicked')
    const fetchCountry = async () => {
      try {
        const res = await fetch(`/api/destination/getCountry/${tripData.destination}`);
        const destination = await res.json();
        setSelectedCountry(destination);
      } catch (error) {
        console.log(error);
      };
    }
    if (tripData.destination) {
      fetchCountry()
    }
  }, [tripData.destination]);

  const handleClick = () => {
    setIsClicked(true)
  }

  const handleChange = (e) => {
    setTripData({
      ...tripData,
      [e.target.id]: e.target.value
    })
  }

  const handleDestinationChange = (e) => {
    const text = e.target.value.toLowerCase();
    setTripData({
      ...tripData,
      destination: e.target.value
    })

    let filtered = suggestions.filter((suggestion) => 
      suggestion.toLowerCase().includes(text)
    );
    setFilteredSuggestions(filtered)
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  }

  const handleSuggestionClick = (e, name = 'none', suggestion) => {
    console.log('clicked')
    console.log(suggestion)
    setTripData({
      ...tripData,
      destination: suggestion
    });
    setFilteredSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleInputEnter = (e, nextInputRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex !== -1) {
        const suggestions = filteredSuggestions;
        const highlightedSuggestion = suggestions[highlightedIndex];
        handleSuggestionClick(e, name='none', highlightedSuggestion);
      } else {
        setFilteredSuggestions([]);
        if (nextInputRef && nextInputRef.current) {
          nextInputRef.current.focus();
        } else {
          e.target.blur();
        }
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      const suggestions = filteredSuggestions;
      const newIndex = Math.min(Math.max(highlightedIndex + direction, 0), suggestions.length - 1);
      setHighlightedIndex(newIndex);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsClicked(false)
  }

  return (
    <div>
      {
        !isClicked ?
        <>
          <button onClick={handleClick}>
            Plan a trip
          </button>
          <div>
            Show your plans here
          </div>
        </>
        :
        <div className='flex flex-col'>
          <label for='title'>Trip Title</label>
          <input 
            type="text" 
            id='title'
            ref={input1Ref}
            value={tripData.title}
            onChange={handleChange}
            placeholder='Enter title'
            onKeyDown={(e) => {
              handleInputEnter(e, input2Ref);
            }}
          />
          <label for='title'>Destination</label>
          <input 
            type="text" 
            id='destination'
            ref={input2Ref}
            autoComplete='off'
            onChange={handleDestinationChange}
            value={tripData.destination}
            placeholder='Search destination'
            onKeyDown={(e) => {
              handleInputEnter(e, null);
            }}
          />
          {filteredSuggestions.length > 0 && 
            <SearchFilterResults 
              name={'trips'} 
              id={'trip'} 
              filteredSuggestions={filteredSuggestions} 
              handleSuggestionClick={handleSuggestionClick}
              highlightedIndex={highlightedIndex}
            />
          }
          {isCountry && 
            <Attractions
              capital={selectedCountry.capital} 
              countryName={selectedCountry.country} 
              continent={selectedCountry.continent_name}
              countryPage={null}
              userTrip={true}
              tripData={tripData}
              setTripData={setTripData}
            />
          }
          <button onClick={handleSubmit}>
            Create trip
          </button>
        </div>
      }
    </div>
  )
}
