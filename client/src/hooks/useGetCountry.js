import { useEffect, useState } from "react";

export default function useGetCountry (type='all', page = 1, pageSize = 3) {
    console.log(page)

    const [country, setCountry] = useState({});
    const [loading, setLoading] = useState(false);
    const [countryError, setError] = useState(null);
    const [pages, setPages] = useState()

    const fetchDestination = async () => {
      let sqlQuery
      // if (type === 'all') {
      //   sqlQuery = `/api/destination/getCountries?page=${page}&pageSize=${pageSize}`
      // } else {}
      sqlQuery = `/api/destination/getCountry/${type}`
      
      try {
        setLoading(true);
        const res = await fetch(sqlQuery);
        const destination = await res.json();
        setCountry(destination);
        setPages(destination.totalItems / pageSize);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        console.log(error);
        setLoading(false);
      };
    }

    useEffect(() => {
      fetchDestination();
    }, [type, page, pageSize]);

  return ({country, loading, countryError, pages});
}
