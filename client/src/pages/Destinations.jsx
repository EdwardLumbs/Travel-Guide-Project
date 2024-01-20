import DestinationCard from '../components/DestinationCard'
import useGetCountries from '../hooks/useGetCountries'
import useGetContinents from '../hooks/useGetContinents';
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Destinations() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState({
    type: 'country',
    sort: 'ASC'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    console.log(searchTermFromUrl)
    const typeFromUrl = urlParams.get('type')
    const sortFromUrl = urlParams.get('sort')

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl || '')
    } else if (typeFromUrl ||sortFromUrl) {
      setSelectedOption({
        type: typeFromUrl || 'country',
        sort: sortFromUrl || 'ASC'
      })
    }

  }, [location.search])


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleOptionChange = (e) => {
    console.log(e.target.id)
    console.log(e.target.value)
    setSelectedOption((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value 
    })
    );
  }

  // useEffect(() => {
  //   handleOptionSubmit()
  // }, [selectedOption])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', searchTerm)
    urlParams.set('type', selectedOption.type)
    urlParams.set('sort', selectedOption.sort)
    const searchQuery = urlParams.toString()
    navigate(`/destinations?${searchQuery}`)
  }

  const handleOptionSubmit = () => {
    console.log('submitted')
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', searchTerm)
    urlParams.set('type', selectedOption.type)
    urlParams.set('sort', selectedOption.sort)
    const searchQuery = urlParams.toString()
    navigate(`/destinations?${searchQuery}`)
  }


  const countries = useGetCountries();
  const continents = useGetContinents();

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
            <option value="capital">Capital</option>
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
        </div>
        
        <div>
          <DestinationCard />
        </div>
      </div>
    </div>
  )
}
