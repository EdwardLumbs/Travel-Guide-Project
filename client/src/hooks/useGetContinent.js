import { useEffect, useState } from "react";

export default function useGetContinent (type='all') {
    const [continentData, setContinentData] = useState({});
    const [continentPhoto, setContinentPhoto] = useState({});
    const [continentLoading, setLoading] = useState(false);
    const [continentError, setError] = useState(null);

    const fetchDestination = async () => {
      let sqlQuery
      if (type === 'all') {
        sqlQuery = `/api/destination/getContinents`
      } else {
        sqlQuery = `/api/destination/getContinent/${type}`
      }

      try {
        setLoading(true)
        const res = await fetch(sqlQuery);
        const destination = await res.json();
        console.log(destination);

        if (type === 'all') {
          const continentNames = destination.map((continent) => continent.continent_name)
          setContinentData(continentNames);
          setContinentPhoto(destination);
          setLoading(false);
        } else {
          setContinentData(destination);
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        console.log(error);
        setLoading(false);
      };

    }

    useEffect(() => {
      fetchDestination();
    }, [type]);

  return ({continentData, continentPhoto, continentLoading, continentError});
}