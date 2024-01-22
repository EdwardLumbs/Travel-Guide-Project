import DestinationCard from '../components/DestinationCard'
import useGetCountry from '../hooks/useGetCountry'
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Destinations() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState({
    type: '',
    sort: ''
  });
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { country } = useGetCountry();
// add error handlers and when no listing found and loading
// regex
// limit Number
// create loading animation

  const getUrlParams = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams
  }

  useEffect(() => {
    const urlParams = getUrlParams();
    console.log(urlParams.size);
    if (urlParams.size === 0) {
      setDestinations(country)
    } else {
      const filterQuery = urlParams.toString();
      const searchTermFromUrl = urlParams.get('searchTerm');
      const typeFromUrl = urlParams.get('type');
      const sortFromUrl = urlParams.get('sort');

      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl || '');
      } 

      if (typeFromUrl || sortFromUrl) {
        setSelectedOption({
          type: typeFromUrl || 'country',
          sort: sortFromUrl || 'ASC'
        });
      };

      const fetchSearchedLocation = async () => {
        setLoading(true);

        try {
          const res = await fetch(`/api/destination/searchDestination/${searchTerm}`);
          const searchedDestination = await res.json();
          console.log(searchedDestination);

          if (searchedDestination.success === false) {
            setLoading(false);
            setError(searchedDestination.message);
          } else {
            setLoading(false);
            setError(null);
            setDestinations(searchedDestination);
          }
        } catch (error) {
          console.log(error);
          setError(error.message);
          setLoading(false);
        }
      } 

      const fetchFilteredLocations = async (filterQuery) => {
        setLoading(true);
        try {
          const res = await fetch(`/api/destination/filterCountries?${filterQuery}`);
          const destination = await res.json();

          if (destination.success === false) {
            setLoading(false);
            setError(destination.message);
          } else {
            setLoading(false);
            setError(null);
            setDestinations(destination);
          }
        } catch (error) {
          console.log(error);
          setError(error.message);
          setLoading(false);
        };
      }

      if (searchTermFromUrl) {
        console.log('selected');
        fetchSearchedLocation();
      }

      if (typeFromUrl || sortFromUrl) {
        fetchFilteredLocations(filterQuery);
      } 
    }
  }, [location.search, country]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleOptionChange = (e) => {
    setSelectedOption((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value,
    })
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = getUrlParams();
    setSelectedOption({
      type: '',
      sort: ''
    })
    urlParams.set('searchTerm', searchTerm);
    urlParams.set('type', '');
    urlParams.set('sort', '');
    const searchQuery = urlParams.toString();
    navigate(`/destinations?${searchQuery}`);
  }

  const handleOptionSubmit = (e) => {
    e.preventDefault();
    const urlParams = getUrlParams();
    setSearchTerm('');
    urlParams.set('searchTerm', '');
    urlParams.set('type', selectedOption.type);
    urlParams.set('sort', selectedOption.sort);
    const searchQuery = urlParams.toString();
    navigate(`/destinations?${searchQuery}`);
  }

  return (
    <div className='p-9 flex justify-center'>
      <div className=''>
        <div className='flex gap-6 mb-7'>
          <form onSubmit={handleSearchSubmit}>
            <input 
              className='border rounded-lg p-3 w-60'
              type="text" 
              id='searchTerm'
              placeholder='Search'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button 
              type='submit'
            >
              <FaSearch />
            </button>
          </form>

          <form onSubmit={handleOptionSubmit}>
            <label className='flex items-center'>
              Filter by type of Place:
            </label>
            <select 
              value={selectedOption.type}
              className='border rounded-lg w-40'
              id="type" 
              onChange={handleOptionChange}
              required
            >
              <option value="" disabled selected>Type</option>
              <option value="country">Country</option>
              <option value="continent">Continent</option>
            </select>
            <label className='flex items-center'>
              Sort palces by:
            </label>
            <select 
              value={selectedOption.sort}
              className='border rounded-lg w-40'
              id="sort" 
              onChange={handleOptionChange}
              required
            >
              <option value="" disabled selected>Order</option>
              <option value="ASC">A-Z</option>
              <option value="DESC">Z-A</option>
            </select>
            <button
              type='submit'
            >
              Filter
            </button>
          </form>
          
        </div>
        
        { loading ?
        <p className='text-3xl font-semibold'>
          Loading...
        </p> :
        error ? 
        <p className='text-3xl font-semibold'>
          {error}
        </p> :
          <div className='flex flex-wrap gap-4'>
            {destinations.length > 0 && destinations.map((destination) => (
                <Link to={destination.country ? `${destination.continent_name}/${destination.country}` : `${destination.continent_name}`}>
                  <DestinationCard key={destination.country} destination={destination}/>
                </Link>
              ))
            }
          </div>
        }
        
      </div>
    </div>
  )
}
