import DestinationCard from '../components/cards/DestinationCard'
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/heroComponent/Hero';

export default function Destinations() {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [pages, setPages] = useState()
  const [selectedOption, setSelectedOption] = useState({
    type: '',
    sort: '',
    page: 1,
    continent: ''
  });
  
  const queryParams = new URLSearchParams(location.search);

  const navigate = useNavigate();

// create loading animation
// change accent colors

  useEffect(() => {
    const getContinents = async () => {
      try {
        setLoading(true)
        const res  = await fetch(`/api/destination/getContinents`)
        const continents = await res.json()
        if (continents.success === false) {
          setLoading(false);
          setError(continents.message);
        } else {
          setLoading(false)
          console.log(continents)
          setDestinations(continents);
        }
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    if (queryParams.size === 0) {
      getContinents();
    } 
  }, [])

  const handlePageChange = (newPage) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      page: newPage
    }))
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', newPage);
    const searchQuery = urlParams.toString();
    navigate(`/destinations?${searchQuery}`);
  }

  return (
    <div className=''>
      <Hero 
        image={"photos/destination.jpg"}
        content={'Find your next Destination'}
      />
      <div className='mt-5 container flex flex-col items-center mx-auto px-4'>
        <div className='w-full'>
          <SearchFilter 
            blog={null} 
            destination={true} 
            setDestinations={setDestinations} 
            setBlogs={null}
            setError={setError}
            setLoading={setLoading}
            setPages={setPages}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>
        
        { loading ?
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
        error ? 
        <p className='text-3xl font-semibold'>
          {error}
        </p> :
        <div className='flex w-full'>
          <div className='flex w-full flex-wrap gap-4'>
            {destinations.length > 0 && destinations.map((destination) => (
                <Link to={destination.country ? `${destination.continent_name}/${destination.country}` : 
                `${destination.continent_name}`}>
                  <DestinationCard key={destination.country} destination={destination}/>
                </Link>
              ))
            }
          </div>
        </div>
        }

        {pages && (
          <div className='flex justify-center my-4'>
            {selectedOption.page > 1 && (
              <button
                onClick={() => handlePageChange(selectedOption.page - 1)}
                className='px-4 py-2 mr-2 text-blue-500 bg-white border border-blue-500 hover:text-white hover:bg-blue-500 duration-200 rounded-xl'
              >
                Previous Page
              </button>
            )}
        
            <div className="flex items-center">
              {Array.from({ length: Math.ceil(pages) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 text-white bg-blue-500 border border-blue-500 hover:text-blue-500 hover:bg-white duration-200 rounded-xl ${
                    selectedOption.page === index + 1 ? 'font-semibold' : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
                
            {selectedOption.page < Math.ceil(pages) && (
              <button
                onClick={() => handlePageChange(selectedOption.page + 1)}
                className='px-4 py-2 ml-2 text-blue-500 bg-white border border-blue-500 hover:text-white hover:bg-blue-500 duration-200 rounded-xl'
              >
                Next Page
              </button>
            )}
          </div>
        )}
        
      </div>
    </div>
  )
}
