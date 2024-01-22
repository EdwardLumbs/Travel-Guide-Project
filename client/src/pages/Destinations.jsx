import DestinationCard from '../components/DestinationCard'
import useGetCountry from '../hooks/useGetCountry'
import useGetContinent from '../hooks/useGetContinent';
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Destinations() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState({
    type: 'country',
    sort: 'ASC',
    change: true
  });
  const [destinations, setDestinations] = useState([])
  console.log(destinations)

  const navigate = useNavigate();

  
  const { country } = useGetCountry();
  const { continentData } = useGetContinent();

  console.log(country)
  console.log(continentData)

// add error handlers and when no listing found and loading
// regex
// limit Number

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    console.log(urlParams.size)
    if(urlParams.size === 0) {
      setDestinations(country)
    } else {
      const filterQuery = urlParams.toString()
      const searchTermFromUrl = urlParams.get('searchTerm');
      const typeFromUrl = urlParams.get('type')
      const sortFromUrl = urlParams.get('sort')

      console.log(searchTermFromUrl)

      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl || '')
      } 

      if (typeFromUrl || sortFromUrl) {
        setSelectedOption({
          type: typeFromUrl || 'country',
          sort: sortFromUrl || 'ASC'
        })
      }

      const fetchSearchedLocation = () => {
        const searchedCountry = country.find((destinations) => destinations.country.toLowerCase() === searchTermFromUrl.toLowerCase());
        const searchedContinent = continentData.find((destinations) => destinations.continent_name.toLowerCase() === searchTermFromUrl.toLowerCase());
        console.log(searchedCountry)
        console.log(searchedContinent)
        if (searchedCountry) {
          console.log('selected')
          setDestinations([searchedCountry]);
        } else if (searchedContinent) {
          setDestinations([searchedContinent]);
        } else {
          // Handle the case when neither country nor continent is found. Maybe add error handler
          setDestinations([]);
        }
      } 

      const fetchFilteredLocations = async (filterQuery) => {
        try {
          const res = await fetch(`/api/destination/filterCountries?${filterQuery}`);
          const destination = await res.json();
          console.log(destination);
          setDestinations(destination);
        } catch (error) {
          console.log(error);
          // setError(error.message);
          // setLoading(false);
        };
      }

      if (searchTermFromUrl) {
        console.log('selected')
        fetchSearchedLocation()
      }

      if (typeFromUrl || sortFromUrl) {
        fetchFilteredLocations(filterQuery)
      } 
    }
  }, [location.search, country, continentData])


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleOptionChange = (e) => {
    setSelectedOption((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value,
    })
    );
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/destinations?${searchQuery}`)
  }

  const handleOptionSubmit = (e) => {
    e.preventDefault()
    setSearchTerm('')
    const urlParams = new URLSearchParams()
    urlParams.set('type', selectedOption.type)
    urlParams.set('sort', selectedOption.sort)
    const searchQuery = urlParams.toString()
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
              Filter by type:
            </label>
            <select 
              value={selectedOption.type}
              className='border rounded-lg w-40'
              id="type" 
              onChange={handleOptionChange}
            >
              <option value="country">Country</option>
              <option value="continent">Continent</option>
            </select>
            <label className='flex items-center'>
              Sort by:
            </label>
            <select 
              value={selectedOption.sort}
              className='border rounded-lg w-40'
              id="sort" 
              onChange={handleOptionChange}
            >
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
        
        <div className='flex flex-wrap gap-4'>
          {destinations.length > 0 && destinations.map((destination, index) => (
              <Link to={destination.country ? `${destination.continent_name}/${destination.country}` : `${destination.continent_name}`}>
                <DestinationCard key={index} destination={destination}/>
              </Link>
            ))
          }
          
        </div>
      </div>
    </div>
  )
}
