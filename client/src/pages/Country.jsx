import { useParams } from "react-router-dom"
import useGetCountry from "../hooks/useGetCountry"

export default function Country() {
    const { country } = useParams()
    const { chosenCountry, loading } = useGetCountry(country)
    console.log(chosenCountry)
   
  return (
    <>
    {loading ? <p className="text-3xl">
      Loading...
    </p> :
      <div className="flex items-center flex-col gap-5">
        <div className="">
          <img 
            className="object-cover rounded-2xl w-[960px]"
            src={chosenCountry.photo} 
            alt="cover photo" 
          />
          <div className="flex mt-9">
            <div>
              <p className="text-6xl">
                {chosenCountry.country} 
                  <span className="text-2xl"> {chosenCountry.continent_name}</span>
              </p>
              <p className="mt-9">
                {chosenCountry.description}
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
