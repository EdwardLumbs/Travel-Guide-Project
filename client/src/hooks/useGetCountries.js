import { useEffect, useState } from "react";

export default function useGetCountries() {
    const [countries, setCountries] = useState({});
    const [loading, setLoading] = useState(false);
    const [countriesError, setError] = useState(null);

    const fetchDestination = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/destination/getCountries`);
            const destination = await res.json();
            console.log(destination);
            setCountries(destination);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            console.log(error);
            setLoading(false);
        };
    }

    useEffect(() => {
      fetchDestination();
    }, []);

  return ({countries, loading, countriesError});
}
