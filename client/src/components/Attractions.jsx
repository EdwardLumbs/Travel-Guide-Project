import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AttractionCard from './cards/AttractionCard';
import SearchFilterResults from './SearchFilterResults';

export default function Attractions({capital, countryName, continent}) {
    const buttonRef = useRef(null);
    const [category, setCategory] = useState();
    const [chosenCategory, setChosenCategory] = useState();
    const [categories, setCategories] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const navigate = useNavigate();

    console.log(chosenCategory)
    console.log(attractions)

    const handleChange = (e) => {
        const text = e.target.value.toLowerCase();
        setCategory(text);

        let filtered = categories.filter((data) => 
            data.category.includes(text)
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
                setFilteredSuggestions([]);
                e.target.blur();
                if (buttonRef && buttonRef.current) {
                  buttonRef.current.focus();
                  buttonRef.click();
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
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('place', capital);
        urlParams.set('category', category);
        setChosenCategory(category);
        const searchQuery = urlParams.toString();
        navigate(`/destinations/${continent}/${countryName}?${searchQuery}`);
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await fetch ('/api/attractions/getCategories');
                const data = await res.json();

                if (data.success === false) {
                    setError(data.message);
                };
                setCategories(data);
            } catch (error) {
                setError(error);
                console.log(error);
            }
        }
        getCategories();
    }, []);

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
            setChosenCategory(categoryFromUrl)
        }

        const getAttractions = async () => {
            setLoading(true);
            if (placeFromUrl !== capital){
                setError("An error occurred");
                return;
            };
    
            try {
                const res = await fetch (`/api/attractions/getAttractions?${filterQuery}`);
                const attractionsData = await res.json() ;
                console.log(attractionsData)
                if (attractionsData.success === false) {
                    setLoading(false);
                    setError(attractionsData.message);
                }
                setLoading(false);
                setAttractions(attractionsData);
                setError(false);

            } catch (error) {
                setLoading(false);
                setError(error);
                console.log(error);
            }
        }
        
        if (categoryFromUrl) {
            getAttractions();
        }
    }, [location.search]);

  return (
    <div className=''>
        <p className='text-6xl font-bold mb-4'>Find great attractions</p>
        <div className='flex flex-col relative'>
            <p className='mb-4 text-xl text-justify'>
                Discover local gems effortlessly! Explore nearby attractions with our 
                intuitive search feature. Start your adventure now!
            </p>
            <form 
                className='flex flex-col lg:flex-row relative'
                onSubmit={handleSubmit}
            >
                <input 
                    className='border lg:mb-0 mb-4 hover:border-slate-600 duration-200 rounded-full 
                        p-2 w-full md:w-96 box-border'
                    type="text" 
                    onChange={handleChange}
                    value={category}
                    disabled={loading}
                    placeholder='Choose a category'
                    onKeyDown={(e) => {
                        handleInputEnter(e, buttonRef);
                        handleArrowNavigation(e);
                    }}
                />
                <div className="absolute bg-white w-[1500px] mt-11 z-10">
                    {filteredSuggestions.length > 0 && 
                        <SearchFilterResults 
                            filteredSuggestions={filteredSuggestions} 
                            handleSuggestionClick={handleSuggestionClick}
                            highlightedIndex={highlightedIndex}
                        /> 
                    }
                </div>
                <button
                    className='lg:ml-4 w-full md:w-40 border px-6 py-2 rounded-full border-blue-800 bg-blue-800 
                        text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
                    ref={buttonRef}
                    disabled={loading}
                >
                    Submit
                </button>
            </form>
        </div>
        <div>
            {attractions && 
                <div className='mt-4'>
                    {loading ? 
                    <div className='animate-pulse mx-auto container px-4 my-4 flex flex-col items-center'>
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
                    error ?
                    <p>
                        {error}
                    </p>
                    :
                    attractions.length > 0 && 
                        <div className='flex flex-col flex-wrap gap-4'>
                            <div className='text-3xl font-bold'>
                                {`Showing Results for ${category} ${capital && `at ${capital}`}`}
                            </div>
                            <div className='flex flex-wrap gap-4'>
                                {attractions.map((attraction, index) => (
                                    <Link 
                                        key={index} 
                                        to={attraction.properties.datasource.raw.website || `https://www.google.com/search?q=${encodeURIComponent(attraction.properties.name)}`}
                                        target='_blank'
                                    >
                                        <AttractionCard category={chosenCategory} attraction={attraction} />
                                    </Link>
                                ))}
                                {
                                    <Link 
                                        className='hover:underline'
                                        to={`/explore?place=${capital}&category=${category}&limit=${20}`}
                                    >
                                        {/* make this beautiful */}
                                        Show more
                                    </Link>
                                }
                            </div>
                            
                        </div>
                    }
                </div>
            }
        </div>
    </div>
  )
}
