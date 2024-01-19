import { useEffect, useState } from "react"

export default function useGetContinentCountries (value) {
    const [continentCountries, setContinentCountries] = useState([]);
    const [continentCountriesLoading, setLoading] = useState(false);

    const fetchDestination = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/destination/getContinentCountry/${value}`);
            
            const destination = await res.json();
            console.log(destination)
            setContinentCountries(destination);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    useEffect(() => {
      fetchDestination();
    }, [value])

  return ({continentCountries, continentCountriesLoading});
}