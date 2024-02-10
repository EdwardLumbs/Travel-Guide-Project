import { useState, useEffect, useRef } from 'react'
import SearchFilterResults from './SearchFilterResults';
import useGetContinent from '../hooks/useGetContinent';
import useGetCountry from '../hooks/useGetCountry';
import { MdOutlineClose } from "react-icons/md";

export default function TripModal({ isOpen, onClose, currentDestination, user_id }) {
    if (!isOpen) return null;
    console.log(currentDestination)

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const buttonRef = useRef(null);
    const [suggestions, setSuggestions] = useState([])
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [tripData, setTripData] = useState({
      title: '',
      destination: '',
      user_id: '',
      note: ''
    })
    const { country } = useGetCountry('all')
    const { continentData } = useGetContinent('all')


    useEffect(() => {
        if (Array.isArray(continentData) && Array.isArray(country)) {
            setSuggestions([...continentData, ...country]);
        }
    }, [continentData, country]);
    
    useEffect(() => {
        if (currentDestination || user_id) {
          setTripData({
            ...tripData,
            destination: currentDestination,
            user_id: user_id
          })
        }

    }, [currentDestination, user_id]);

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
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!tripData.title || !tripData.destination || !tripData.note) {
                setLoading(false)
                setError("You left some fields blank")
                setTimeout(() => {
                    setError(null);
                }, 2000);
                return
            }
          
            if (!suggestions.includes(tripData.destination)) {
                setLoading(false)
                setError("Invalid destination field")
                setTimeout(() => {
                    setError(null);
                }, 2000);
                return
            }
          
            const res = await fetch('/api/trips/createTrip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripData)
            })
            const data = await res.json()
          
            if (data.success === false) {
                setLoading(false)
                setError(data.message)
                setTimeout(() => {
                      setError(null);
                }, 2000);
                return;
            }
            setLoading(false)
            onClose()
        } catch (error) {
            setError(error.message)
            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className="bg-white w-[1000px] mx-4 lg:mx-0 p-8 rounded-md flex flex-col items-center">
            <MdOutlineClose 
              onClick={onClose}
              className='ml-auto scale-150 hover:cursor-pointer text-slate-600 hover:text-black'
            />
            <p className='font-bold text-2xl my-6 lg:my-2'>
              Plan Your Adventure: Trip Details           
            </p>
            <div className='w-full flex flex-col gap-1 mb-4'>
              <label className='font-semibold' for='title'>Trip Title</label>
              <input 
                  className='border hover:border-slate-600 duration-200 rounded-full 
                    p-2 w-full box-border'
                  type="text" 
                  id='title'
                  ref={input1Ref}
                  value={tripData.title}
                  onChange={handleChange}
                  placeholder='Enter title'
                  required
                  onKeyDown={(e) => {
                    handleInputEnter(e, input2Ref);
                  }}
              />
            </div>
            
            <div className='w-full flex flex-col gap-1 mb-4'>
              <label className='font-semibold' for='title'>Destination</label>
              <input 
                  className='border hover:border-slate-600 duration-200 rounded-full p-2 w-full box-border'
                  type="text" 
                  id='destination'
                  ref={input2Ref}
                  autoComplete='off'
                  onChange={handleDestinationChange}
                  value={tripData.destination}
                  placeholder='Search destination'
                  required
                  onKeyDown={(e) => {
                    handleInputEnter(e, input3Ref);
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
            </div>

            <div className='w-full flex flex-col gap-1 mb-4'>
              <label className='font-semibold' for='title'>Notes</label>
              <textarea 
                  className='border hover:border-slate-600 duration-200 rounded-md p-2 w-full box-border'
                  type="text" 
                  id='note'
                  ref={input3Ref}
                  autoComplete='off'
                  onChange={handleChange}
                  value={tripData.note}
                  placeholder='Travel Notes'
                  required
                  onKeyDown={(e) => {
                    handleInputEnter(e, buttonRef);
                  }}
              />
              { loading ?
                  <p>
                    Loading...
                  </p>
                  :
                  error ?
                  <p>
                    {error}
                  </p>
                  :
                  <button 
                    onClick={handleSubmit}
                    className='border mt-4 px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
                  >
                    Create trip
                  </button>
              }
            </div>
        </div>
    </div>
  )
}
