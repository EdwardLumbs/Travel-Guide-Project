import { useEffect, useState } from "react";

export default function useGetContinent (type='all') {
    const [continentData, setContinentData] = useState({});
    const [continentLoading, setLoading] = useState(false);
    const [continentError, setError] = useState(null);

    console.log(type)

    const fetchDestination = async () => {
      if (type === 'all') {
        try {
          setLoading(true)
          const res = await fetch(`/api/destination/getContinents`);
          const destination = await res.json();
          console.log(destination);
          setContinentData(destination);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          console.log(error);
          setLoading(false);
        };
      } else {
        try {
            setLoading(true);
            const res = await fetch(`/api/destination/getContinent/${type}`);
            
            const destination = await res.json();
            console.log(destination);
            setContinentData(destination);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.log(error);
        }
      }
    }

    useEffect(() => {
      fetchDestination();
    }, [type]);

  return ({continentData, continentLoading, continentError});
}