import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AttractionCard from './AttractionCard';

export default function Attractions({capital, countryName, continent}) {
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    console.log(categories)
    console.log(attractions)
    console.log('yow')

    const handleChange = (e) => {
        setCategory(e.target.value)
    }

    const handleSubmit = (e) => {
        console.log('clicks')
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('capital', capital)
        urlParams.set('category', category)
        const searchQuery = urlParams.toString()
        navigate(`/destinations/${continent}/${countryName}?${searchQuery}`)
    }

    useEffect(() => {
        console.log('clicks')
        const getCategories = async () => {
            try {
                const res = await fetch ('/api/attractions/getCategories')
                const data = await res.json()

                if (data.success === false) {
                    setLoading(false)
                    setError(data.message)
                }
                setLoading(false)
                setCategories(data)
            } catch (error) {
                setLoading(false)
                setError(error)
                console.log(error)
            }
        }

        getCategories()
    }, [])

    useEffect(() => {
        console.log('clicks')
        const urlParams = new URLSearchParams(location.search)
        const categoryFromUrl = urlParams.get('category')
        const filterQuery = urlParams.toString()
        console.log(urlParams)

        if (categoryFromUrl) {
            setCategory(categoryFromUrl)
        }

        const getAttractions = async () => {
            setLoading(true)
            try {
                const res = await fetch (`/api/attractions/getAttractions?${filterQuery}`)
                const attractionsData = await res.json() 
                console.log(attractionsData)
                if (attractionsData.success === false) {
                    setLoading(false)
                    setError(attractionsData.message)
                }
                setLoading(false)
                setAttractions(attractionsData)
            } catch (error) {
                setLoading(false)
                setError(error)
                console.log(error)
            }
        }
        
        if (category) {
            getAttractions()
        }
    }, [location.search])

  return (
    <div className='flex flex-col'>
        <p>Look for the best attractions</p>
        <div className='flex flex-col'>
            <label>Choose categories to search</label>
            <form onSubmit={handleSubmit}>
                <select
                    onChange={handleChange}
                    value={category}
                    defaultValue=''
                >
                    <option value="" disabled selected>Category</option>
                    {categories.length > 0 && 
                        categories.map((data) => (
                            <option value={data.category}>{data.category}</option>
                        ))
                    }
                </select>
                <button>Submit</button>
            </form>
        </div>
        <div>
            {attractions && 
                <div>
                    {attractions.length > 0 && 
                        <div className='flex'>
                            {attractions.map((attraction, index) => (
                                <Link 
                                    key={index} 
                                    to={attraction.properties.datasource.raw.website || `https://www.google.com/search?q=${encodeURIComponent(attraction.properties.name)}`}
                                    target='_blank'
                                >
                                    <AttractionCard category={category} attraction={attraction} />
                                </Link>
                            ))}
                        </div>
                    }
                </div>
            }
        </div>
    </div>
  )
}
