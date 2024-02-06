import DestinationCard from '../components/DestinationCard'
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/Hero';

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
      <Hero/>
      <div className='container flex flex-col items-center mx-auto px-4'>
        <div>
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
        <p className='text-3xl font-semibold'>
          Loading...
        </p> :
        error ? 
        <p className='text-3xl font-semibold'>
          {error}
        </p> :
        <div className='flex justify-center'>
          <div className='flex justify-center flex-wrap gap-4 w-auto'>
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

        {pages &&
          <div className='flex justfy-center my-4'>
            {pages > 1 &&
              <button
                onClick={() => handlePageChange(selectedOption.page - 1)}
                disabled={selectedOption.page === 1}
                className='px-4 py-2 mr-2 bg-blue-500 text-white'
              >
                Previous Page
              </button>
            }
            <span className='text-lg font-semibold'>{`${selectedOption.page} of ${Math.ceil(pages)}`}</span>
            {pages > 1 &&
              <button
                onClick={() => handlePageChange(selectedOption.page + 1)}
                disabled={selectedOption.page === Math.ceil(pages)}
                className='px-4 py-2 mr-2 bg-blue-500 text-white'
              >
                Next Page
              </button>
            }
          </div>
        }
        
      </div>
    </div>
  )
}
