import DestinationCard from '../components/DestinationCard'
import useGetCountries from '../hooks/useGetCountries'
import useGetContinents from '../hooks/useGetContinents';

export default function Destinations() {
  const countries = useGetCountries();
  const continents = useGetContinents();
  console.log(continents)
  console.log(countries)


  return (
    <div className='p-9 flex justify-center'>
      <div className=''>
        <div className='flex gap-6 mb-7'>
          <input 
            className='border rounded-lg p-3 w-60'
            type="text" 
            placeholder='Search'
          />
          <label className='flex items-center'>
            Filter by type:
          </label>
          <select 
            className='border rounded-lg w-40'
            name="location" 
            id="location"
          >
            <option value="country">Country</option>
            <option value="capital">Capital</option>
            <option value="continent">Continent</option>
          </select>
          <label className='flex items-center'>
            Sort by:
          </label>
          <select 
            className='border rounded-lg w-40'
            name="sort" 
            id="sort"
          >
            <option value="descending">A-Z</option>
            <option value="ascending">Z-A</option>
          </select>
        </div>

        <div>
          <DestinationCard />
        </div>
      </div>
    </div>
  )
}
