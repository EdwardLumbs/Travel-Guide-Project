import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AttractionCard from './cards/AttractionCard';
import SearchFilterResults from './SearchFilterResults';

export default function Attractions({
    capital, countryName, continent, countryPage, tripData, setTripData}) {
    const buttonRef = useRef(null);
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const navigate = useNavigate();

    console.log(attractions)

    const handleChange = (e) => {
        setCategory(e.target.value);

        let filtered = categories.filter((data) => 
            data.category.includes(e.target.value)
        );

        if (e.target.value === ''){
            filtered = [];
        };
        setFilteredSuggestions(filtered);
        setHighlightedIndex(filtered.length > 0 ? 0 : -1);
    };

    const handleSuggestionClick = (e, name='none', suggestion) => {
        setCategory(suggestion.category);
        setFilteredSuggestions([]);
        setHighlightedIndex(-1);
        if (buttonRef && buttonRef.current) {
          buttonRef.current.focus();
        }
    };

    const handleInputEnter = (e, buttonRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex !== -1) {
                const highlightedSuggestion = filteredSuggestions[highlightedIndex];
                handleSuggestionClick(e, name='none', highlightedSuggestion);
            } else {
                setFilteredSuggestions([])
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
            filteredSuggestions.length - 1
          );
          setHighlightedIndex(newIndex);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('place', capital)
        urlParams.set('category', category)
        const searchQuery = urlParams.toString()
        navigate(
            countryPage ?
                `/destinations/${continent}/${countryName}?${searchQuery}`
            :
                `/profile/user-trips/?${searchQuery}`
        )
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await fetch ('/api/attractions/getCategories')
                const data = await res.json()

                if (data.success === false) {
                    setError(data.message)
                }
                setCategories(data)
            } catch (error) {
                setError(error)
                console.log(error)
            }
        }
        getCategories()
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (
            buttonRef.current &&
            !buttonRef.current.contains(e.target)
          ) {
            setFilteredSuggestions([]);
          }
        };
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, [buttonRef]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const categoryFromUrl = urlParams.get('category');
        const placeFromUrl = urlParams.get('place');
        const filterQuery = urlParams.toString();

        if (categoryFromUrl) {
            setCategory(categoryFromUrl);
        }

        const getAttractions = async () => {
            setLoading(true);
            if (placeFromUrl !== capital){
                setError("An error occurred");
                return;
            }
    
            try {
                const res = await fetch (`/api/attractions/getAttractions?${filterQuery}`)
                const attractionsData = await res.json() 
                console.log(attractionsData)
                if (attractionsData.success === false) {
                    setLoading(false)
                    setError(attractionsData.message)
                }
                setLoading(false)
                setAttractions(attractionsData)
            } catch (error) {
                setLoading(false)
                setError(error)
                console.log(error)
            }
        }
        
        if (categoryFromUrl) {
            getAttractions()
        }
    }, [location.search])

    const handleClick = (attraction) => {
        console.log(attraction)
        setTripData({
            ...tripData,
            attractions : [...attractions, attraction]
        })
    }

    console.log(tripData.attractions)

  return (
    <div className='flex flex-col'>
        <p>Look for the best attractions</p>
        <div className='flex flex-col'>
            <label>Choose categories to search</label>
            <form onSubmit={handleSubmit}>
                <input 
                    className=''
                    type="text" 
                    onChange={handleChange}
                    value={category}
                    placeholder='Choose a category'
                    onKeyDown={(e) => {
                        handleInputEnter(e, buttonRef);
                        handleArrowNavigation(e);
                    }}
                />
                {filteredSuggestions.length > 0 && 
                    <SearchFilterResults 
                        filteredSuggestions={filteredSuggestions} 
                        handleSuggestionClick={handleSuggestionClick}
                        highlightedIndex={highlightedIndex}
                    />
                }
                <button
                    className=''
                    ref={buttonRef}
                >
                    Submit
                </button>
            </form>
        </div>
        <div>
            {attractions && 
                <div>
                    {loading ? 
                    <p>
                        Loading...
                    </p>
                    : 
                    error ?
                    <p>
                        {error}
                    </p>
                    :
                    attractions.length > 0 && 
                        <div className='flex flex-wrap'>
                            {`Showing Results for ${category}`}
                            {attractions.map((attraction, index) => (
                                countryPage ?
                                <Link 
                                    key={index} 
                                    to={attraction.properties.datasource.raw.website || `https://www.google.com/search?q=${encodeURIComponent(attraction.properties.name)}`}
                                    target='_blank'
                                >
                                    <AttractionCard category={category} attraction={attraction} />
                                </Link>
                                :
                                (
                                <div key={index} onClick={() => handleClick(attraction)}>
                                    <AttractionCard 
                                        category={category} 
                                        attraction={attraction} 
                                    />
                                </div>
                                )
                            ))}
                            {
                            countryPage &&
                                <Link 
                                    className='hover:underline'
                                    to={`/explore?place=${capital}&category=${category}&limit=${20}`}
                                >
                                    Show more
                                </Link>
                            }
                            
                        </div>
                    }
                </div>
            }
        </div>
    </div>
  )
}
