import { useParams } from "react-router-dom"
import useGetContinent from "../hooks/useGetContinent"
import useGetContinentCountries from "../hooks/useGetContinentCountries"

export default function Continent() {
  const { continent } = useParams()
  const {continentData, continentLoading} = useGetContinent(continent)
  const {continentCountries, continentCountriesLoading} = useGetContinentCountries(continent)
  console.log(continentCountries)
  console.log(continentCountriesLoading)

  return (
    <>
    {continentLoading ? 
      <p className="text-3xl">
        Loading...
      </p>
    :
      <div className="flex items-center flex-col gap-5">
        <div className="">
          <img 
            className="object-cover rounded-2xl w-[960px]"
            src={continentData.continent_photo} 
            alt="cover photo" 
          />
          <div className="mt-9">

              <p className="text-6xl">
                {continentData.continent_name} 
              </p>
              <p className="mt-9">
                {continentData.continent_description}
              </p>
              <p className="hover:underline hover:cursor-pointer text-blue-600">
                Start a plan
              </p>
            
          </div>
        </div>

        <div className="flex">
          {
            continentCountriesLoading ? 
              <p className="text-3xl">
                Loading...
              </p> : 
              
              continentCountries.map((country) => (
                <div className="">
                  <img 
                    className="h-20"
                    src={country.photo}
                    alt="country photo" 
                  />
                  <p>
                    {country.country}
                  </p>
                </div>
              ))  
          }
        </div>
        
        <div>
          Must Read blogs. Add related blogs here
        </div>

        <div>
          Check out user's reviews. Add reviews
        </div>

      </div>
    }
    </>
  )
}
