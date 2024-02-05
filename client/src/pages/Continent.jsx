import { Link, useParams } from "react-router-dom";
import useGetContinent from "../hooks/useGetContinent";
import useGetContinentCountries from "../hooks/useGetContinentCountries";
import DestinationCard from "../components/DestinationCard";
import News from "../components/News";
import { useState } from "react";
import TripModal from "../components/TripModal";

export default function Continent() {
  const { continent } = useParams();
  const {continentData, continentLoading, continentError} = useGetContinent(continent);
  const {continentCountries, continentCountriesLoading, continentCountriesError} = useGetContinentCountries(continent);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
    {continentError ? 
      <p className="text-3xl">
        {continentError}
      </p>
    : continentLoading ? 
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
              <p 
                className="hover:underline hover:cursor-pointer text-blue-600"
                onClick={openModal}  
              >
                Start a plan
              </p>
              <TripModal  
                isOpen={isModalOpen}
                onClose={closeModal}
                currentDestination={continentData.continent_name}
              />
          </div>
        </div>

        <div className="flex">
          {
            continentCountriesError ?
              <p className="text-3xl">
                {continentCountriesError}
              </p> 
            : continentCountriesLoading ? 
              <p className="text-3xl">
                Loading...
              </p> : 
              
              continentCountries.map((country) => (
                <Link to={`${country.country}`}>
                  <div className="">
                    <DestinationCard key={country.id} destination={country}/>
                  </div>
                </Link>
              ))  
          }
          <Link
            className="hover:cursor-pointer hover:underline"
            to={`/destinations?type=country&sort=ASC&page=1&continent=${continentData.continent_name}`}
          >See More
          </Link>
        </div>
        
        <div>
          Must Read blogs. Add related blogs here
        </div>

        <div>
          <News place={continentData.continent_name}/>
        </div>

      </div>
    }
    </>
  )
}
