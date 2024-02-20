import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import SearchFilterResults from '../components/SearchFilterResults';
import AttractionCard from '../components/cards/AttractionCard';
import Hero from '../components/heroComponent/Hero';

export default function Explore() {
  const buttonRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const [chosen, setChosen] = useState(null)
  const [chosenCategory, setChosenCategory] = useState(null)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputText, setInputText] = useState({
    place: '',
    category: '',
    limit: 20
  })
  const navigate = useNavigate()

  console.log(chosenCategory)
  console.log(attractions)


  const handleChange = (e) => {
    const text = e.target.value

    if (e.target.id === 'category') {
      setChosenCategory(text)
    }

    setInputText({
      ...inputText,
      [e.target.id]: e.target.value
    });

    if (e.target.id === 'category') {
      let filtered = categories.filter((data) => 
        data.category.includes(text.toLowerCase())
      );

      if (e.target.value === ''){
          filtered = [];
      };
      setFilteredSuggestions(filtered);
      setHighlightedIndex(filtered.length > 0 ? 0 : -1);
    }
  };

  const handleSuggestionClick = (e, name='none', suggestion) => {
    setChosenCategory(suggestion.category)
    setInputText({
      ...inputText,
      'category': suggestion.category
    });
    setFilteredSuggestions([]);
    setHighlightedIndex(-1);
    if (buttonRef && buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    console.log('clicked')
    e.preventDefault()
    console.log(inputText)
    setChosen(chosenCategory)
    const urlParams = new URLSearchParams()
    urlParams.set('place', inputText.place)
    urlParams.set('category', inputText.category)
    urlParams.set('limit', inputText.limit)
    const searchQuery = urlParams.toString()
    console.log(searchQuery)
    navigate(`/explore?${searchQuery}`)
  }

  const handleInputEnter = (e, nextInputRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex !== -1) {
        const highlightedSuggestion = filteredSuggestions[highlightedIndex];
        handleSuggestionClick(e, name='none', highlightedSuggestion);
      } else {
        setFilteredSuggestions([]);
        if (nextInputRef && nextInputRef.current) {
          nextInputRef.current.focus();
        } else {
          e.target.blur();
        }
      }
    } 
  };

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
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = urlParams.get('category');
    const placeFromUrl = urlParams.get('place');
    const limitFromUrl = urlParams.get('limit');
    const filterQuery = urlParams.toString();

    if (categoryFromUrl || placeFromUrl || limitFromUrl) {
        setChosenCategory(categoryFromUrl)
        setChosen(categoryFromUrl)

        setInputText({
          place: placeFromUrl || '',
          category: categoryFromUrl || '',
          limit: limitFromUrl || 20
        });
    }

    const getAttractions = async () => {
        setLoading(true);

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

    if (categoryFromUrl || placeFromUrl || limitFromUrl) {
        getAttractions()
    }
  }, [location.search])


  useEffect(() => {
    const getCategories = async () => {
        try {
            const res = await fetch ('/api/attractions/getCategories')
            const data = await res.json()

            if (data.success === false) {
                setLoading(false)
                setError(data.message)
            }
            setLoading(false)
            setCategories(data)
        } catch (error) {
            setLoading(false)
            setError(error)
            console.log(error)
        }
    }
    getCategories()
  }, [])


  return (
    <div>
      <Hero 
        image={"photos/explore.jpg"}
        content={
          <p className='font-bold'>
          Navigate through numerous attractions using our Explore Page
          </p>
          }
      />
      <div className='mt-5 container flex flex-col mx-auto px-4'>
        <form 
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex flex-col gap-2'>
              <label>Where do you want to go?</label>
              <input
                className='border hover:border-slate-600 duration-200 rounded-full p-2 w-full lg:w-96 box-border'
                type="text"
                id='place'
                required
                placeholder='Type a place'
                onChange={handleChange}
                value={inputText.place}
                onKeyDown={(e) => {
                  handleInputEnter(e, input2Ref);
                }}
                ref={input1Ref}
              />
            </div>

            <div className='relative flex flex-col gap-2'>
              <label>Choose a category</label>
              <input
                className='border hover:border-slate-600 duration-200 rounded-full p-2 w-full lg:w-96 box-border'
                type="text"
                id='category'
                required
                autoComplete='off'
                placeholder='Type a category'
                onChange={handleChange}
                value={inputText.category}
                onKeyDown={(e) => {
                  handleInputEnter(e, input2Ref);
                  handleArrowNavigation(e);
                }}
                ref={input2Ref}
              />
              {filteredSuggestions.length > 0 && 
                <div className="absolute top-full left-0 w-[1500px]">
                  <SearchFilterResults 
                    name={'category'} 
                    id={'category'} 
                    filteredSuggestions={filteredSuggestions} 
                    handleSuggestionClick={handleSuggestionClick}
                    highlightedIndex={highlightedIndex}
                  />
                </div>
              }
            </div>
          </div>
          <button
            className='lg:w-40 mb-6 border px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
            ref={buttonRef}
          >
            <p className='font-bold'>
              Explore
            </p>
          </button>
        </form>
        <div className='mb-5'>
          {attractions.length > 0 ? 
            <div>
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
                <div className='flex flex-col'>
                  <p className='font-semibold mb-6'>
                    {`Showing Results for ${chosen} in ${inputText.place}`}
                  </p>
                    <div className='flex w-full flex-wrap gap-4'>
                      {attractions.map((attraction, index) => (                   
                          <Link 
                            key={index} 
                            to={attraction.properties.datasource.raw.website || `https://www.google.com/search?q=${encodeURIComponent(attraction.properties.name)}`}
                            target='_blank'
                          >
                            <AttractionCard category={chosen} attraction={attraction} />
                          </Link>
                      ))}
                    </div>
                </div>
              }
            </div>
          :
          loading ? 
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
            <div className='w-full bg-orange-100 p-7 rounded-xl'>
              <h1 className='text-5xl font-bold'>              
                Don't know where to go? Don't worry, we got you!
              </h1>
              <p className='text-lg mt-2'>
                Our explore page helps you find attractions that interests you.
              </p>

              <div className='flex flex-col gap-4 mt-4 h-full'>

                <div className='bg-white rounded-xl flex-1'>
                  <div className='flex gap-2 flex-col lg:flex-row items-center p-4 mx-auto lg:mx-40 justify-between'>
                    <div className='flex flex-col lg:flex-row gap-10 items-center'>
                      <p className='text-8xl font-bold bg-orange-300 rounded-full min-w-32 min-h-32 flex items-center justify-center'>
                        1 
                      </p>
                      <p className='text-xl text-justify'>
                        Input the place you want to go to (e.g Berlin, Paris). The more specific the better.
                      </p>
                    </div>
                    <div className='w-1/4 flex justify-end'>
                      <img 
                        className='h-[150px]'
                        src="vectors/location-pin.svg" 
                        alt="pin" 
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-xl flex-1'>
                  <div className=' flex gap-2 flex-col lg:flex-row items-center p-4 mx-auto lg:mx-40 justify-between'>
                    <div className='w-1/4 flex justify-start'>
                      <img 
                        className='h-[150px]'
                        src="vectors/category.svg" 
                        alt="category" 
                      />
                    </div>
                    <div className='flex flex-col lg:flex-row gap-4 items-center'>
                      <p className='text-xl text-justify'>
                        Choose the category that interests you (e.g Sports, Restaurants). Choose one from the dropdown suggestions
                      </p>
                      <p className='text-8xl font-bold bg-orange-300 rounded-full min-w-32 min-h-32 flex items-center justify-center'>
                        2 
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-xl flex-1'>
                  <div className='flex gap-2 flex-col lg:flex-row items-center p-4 mx-auto lg:mx-40 justify-between'>
                    <div className='flex flex-col lg:flex-row gap-10 items-center'>
                      <p className='text-8xl font-bold bg-orange-300 rounded-full min-w-32 min-h-32 flex items-center justify-center'>
                        3
                      </p>
                      <p className='text-xl'>
                        Wait for the results. Happy exploring!
                      </p>
                    </div>
                    <div className='w-1/4 flex justify-end'>
                      <img 
                        className='h-[150px]'
                        src="vectors/sunglasses.svg" 
                        alt="glasses" 
                      />
                    </div>
                  </div>
                </div>

              </div>
          
            </div>
          }
        </div>
      </div>
    </div>
  )
}
