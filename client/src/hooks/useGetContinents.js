import { useEffect, useState } from "react";

export default function useGetContinents() {
    const [continents, setContinents] = useState({});
    const [loading, setLoading] = useState(false);
    const [continentsError, setError] = useState(null);

    const fetchDestination = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/destination/getContinents`);
            const destination = await res.json();
            console.log(destination);
            setContinents(destination);
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

  return ({continents, loading, continentsError});
}
