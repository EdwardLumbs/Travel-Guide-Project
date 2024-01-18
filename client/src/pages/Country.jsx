import { useParams } from "react-router-dom"
import { useState } from "react"
import useGetLocation from "../hooks/useGetLocation"

export default function Country() {
    const { country } = useParams()

    const location = useGetLocation('country', country)
    console.log(location)
   
  return (
    <div className="flex items-center flex-col gap-5">
      <div className="">
        <img 
          className="object-cover rounded-2xl w-[960px]"
          src={location.photo} 
          alt="cover photo" 
        />
        <div className="flex mt-9">
          <div>
            <p className="text-6xl">
              {location.country} 
                <span className="text-2xl"> {location.continent}</span>
            </p>
            <p className="mt-9">
              {location.description}
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
  )
}
