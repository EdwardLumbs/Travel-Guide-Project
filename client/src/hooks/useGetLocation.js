import { useEffect, useState } from "react"

export default function useGetLocation (selector, value) {
    const [location, setLocation] = useState({});

    const fetchDestination = async () => {
        try {
            const res = await fetch(`/api/destination/getLocation/${value}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({selector})
            });
            
            const destination = await res.json();
            
            setLocation(destination);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
      fetchDestination();
    }, [])

  return (location);
}
