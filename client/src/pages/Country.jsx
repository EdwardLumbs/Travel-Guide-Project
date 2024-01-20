import { useParams } from "react-router-dom";
import useGetCountry from "../hooks/useGetCountry";

export default function Country() {
    const { countryName } = useParams();
    console.log(countryName)
    const { country, loading, countryError } = useGetCountry(countryName);
    console.log(country);
   
  return (
    <>
    { countryError ? <p className="text-3xl">
      {countryError}
    </p>
    : loading ? <p className="text-3xl">
      Loading...
    </p> :
      <div className="flex items-center flex-col gap-5">
        <div className="">
          <img 
            className="object-cover rounded-2xl w-[960px]"
            src={country.photo} 
            alt="cover photo" 
          />
          <div className="flex mt-9">
            <div>
              <p className="text-6xl">
                {country.country} 
                  <span className="text-2xl"> {country.continent_name}</span>
              </p>
              <p className="mt-9">
                {country.description}
              </p>
              <p className="hover:underline hover:cursor-pointer text-blue-600">
                Start a plan
              </p>
            </div>
            <p>Check the cheapest flights, add flights component here</p>
          </div>
        </div>

        <div>
          Must See attractions. Add the notable places here
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
