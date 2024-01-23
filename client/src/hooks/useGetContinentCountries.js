import { useEffect, useState } from "react";

export default function useGetContinentCountries (value) {
    console.log(value)
    const [continentCountries, setContinentCountries] = useState([]);
    const [continentCountriesLoading, setLoading] = useState(false);
    const [continentCountriesError, setError] = useState(null);

    const fetchDestination = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/destination/getContinentCountry?continent=${value}`);
            
            const destination = await res.json();
            console.log(destination);

            if (destination.success === false) {
              setError(destination.message)
              return
            }
            setContinentCountries(destination.location);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
      fetchDestination();
    }, [value]);

  return ({continentCountries, continentCountriesLoading, continentCountriesError});
}