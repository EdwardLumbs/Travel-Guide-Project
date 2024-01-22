import { useEffect, useState } from "react";

export default function useGetCountry (type='all') {
    const [country, setCountry] = useState({});
    const [loading, setLoading] = useState(false);
    const [countryError, setError] = useState(null);

    const fetchDestination = async () => {
      let sqlQuery
      if (type === 'all') {
        sqlQuery = `/api/destination/getCountries`
      } else {
        sqlQuery = `/api/destination/getCountry/${type}`
      }

      try {
        setLoading(true)
        const res = await fetch(sqlQuery);
        const destination = await res.json();
        console.log(destination);
        setCountry(destination);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        console.log(error);
        setLoading(false);
      };
    }

    useEffect(() => {
      fetchDestination();
    }, [type]);

  return ({country, loading, countryError});
}
