import DestinationCard from '../components/DestinationCard'
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Destinations() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState({
    type: '',
    sort: '',
    page: 1,
    continent: ''
  });
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [pages, setPages] = useState()
  const pageSize = 8

  console.log(pages)
  console.log(Math.ceil(pages))

  const navigate = useNavigate();

// create loading animation

  const getUrlParams = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams
  }

  const handlePageChange = (newPage) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      page: newPage
    }))
    const urlParams = getUrlParams();
    urlParams.set('page', newPage);
    const searchQuery = urlParams.toString();
    navigate(`/destinations?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = getUrlParams();
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const sortFromUrl = urlParams.get('sort');
    const pageFromUrl = urlParams.get('page');
    const continentFromUrl = urlParams.get('continent');
    
    if (!searchTermFromUrl && !typeFromUrl && !sortFromUrl) {
      navigate(`/destinations?type=country&sort=ASC&page=1`)
    } else {
      const filterQuery = urlParams.toString();
      console.log(filterQuery)

      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl || '');
      } 

      if (typeFromUrl || sortFromUrl || pageFromUrl || continentFromUrl) {
        setSelectedOption({
          type: typeFromUrl || 'country',
          sort: sortFromUrl || 'ASC',
          page: parseInt(pageFromUrl) || 1,
          continent: continentFromUrl || ''
        });
      };

      const fetchSearchedLocation = async () => {
        setLoading(true);
        setPages(null)

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
      console.log(filterQuery)
      const fetchFilteredLocations = async (filterQuery) => {
        setLoading(true);
        console.log(continentFromUrl)
        if (typeFromUrl === 'country' && continentFromUrl) {
          try {
            const res = await fetch(`/api/destination/getContinentCountry?${filterQuery}`);
            const destination = await res.json();
            console.log(destination.totalItems)
            if (destination.success === false) {
              setLoading(false);
              setError(destination.message);
            } else {
              setLoading(false);
              setError(null);
              setDestinations(destination.location);
              setPages(destination.totalItems / pageSize)
              console.log(destinations)
              // setPages(destination.totalItems / pageSize)
            }
          } catch (error) {
            console.log(error);
            setError(error.message);
            setLoading(false);
          };
        } else if (typeFromUrl === 'continent' && continentFromUrl) {
          navigate('/destinations?type=continent&sort=ASC&page=1')
        } else {
          try {
            const res = await fetch(`/api/destination/filterCountries?${filterQuery}`);
            const destination = await res.json();

            if (destination.success === false) {
              setLoading(false);
              setError(destination.message);
            } else {
              setLoading(false);
              setError(null);
              setDestinations(destination.location);
              setPages(destination.totalItems / pageSize)
            }
          } catch (error) {
            console.log(error);
            setError(error.message);
            setLoading(false);
          };
        }
      }

      if (searchTermFromUrl) {
        fetchSearchedLocation();
      }

      if (typeFromUrl || sortFromUrl) {
        fetchFilteredLocations(filterQuery);
      } 
    }
  }, [location.search]);


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
      sort: '',
      page: '',
      continent: ''
    })
    urlParams.set('searchTerm', searchTerm);
    urlParams.delete('type');
    urlParams.delete('sort');
    urlParams.delete('page');
    urlParams.delete('continent');
    const searchQuery = urlParams.toString();
    navigate(`/destinations?${searchQuery}`);
  }

  const handleOptionSubmit = (e) => {
    e.preventDefault();
    const urlParams = getUrlParams();
    setSearchTerm('');
    urlParams.delete('searchTerm');
    urlParams.set('type', selectedOption.type);
    urlParams.set('sort', selectedOption.sort);
    urlParams.set('continent', selectedOption.continent);
    if (selectedOption.type === 'continent') {
      urlParams.delete('continent');
    }
    urlParams.set('page', 1);
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
              required
            />
            <button 
              type='submit'
            >
              <FaSearch />
            </button>
          </form>

          <form onSubmit={handleOptionSubmit}>
            <div className='flex'>
              <div>
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
              </div>
              { selectedOption.type === 'country' && 
                <div>
                  <label className='flex items-center'>
                    Filter by Continent:
                  </label>
                  <select 
                    value={selectedOption.continent}
                    className='border rounded-lg w-40'
                    id="continent" 
                    onChange={handleOptionChange}
                  >
                    <option value="" selected>Any</option>
                    <option value="asia">Asia</option>
                    <option value="europe">Europe</option>
                    <option value="north america">North America</option>
                    <option value="south america">South America</option>
                    <option value="africa">Africa</option>
                    <option value="australia">Australia</option>
                  </select>
                </div>
              }
            </div>
            
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
                <Link to={destination.country ? `${destination.continent_name}/${destination.country}` : 
                `${destination.continent_name}`}>
                  <DestinationCard key={destination.country} destination={destination}/>
                </Link>
              ))
            }
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
