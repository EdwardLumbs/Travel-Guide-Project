import { useParams } from "react-router-dom"
import { useState } from "react"
import useGetLocation from "../hooks/useGetLocation"

export default function Country() {
    const { country } = useParams()

    const location = useGetLocation('country', country)
   
  return (
    <div>
      <h1>
        {location.continent}
      </h1>
      <h1>
        {location.capital}
      </h1>
      <h1>
        {location.id}
      </h1>
        
    </div>
  )
}
