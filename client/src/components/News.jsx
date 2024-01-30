import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NewsCard from './NewsCard'

export default function News({place}) {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    console.log(news)

    useEffect(() => {
        const getNews = async () => {
            try {
                const res = await fetch(`/api/news/getNews/${place}`)
                const data = await res.json()
                if (data.success === false) {
                    setLoading(false)
                    setError(data.message)
                }
                setLoading(false)
                setNews(data)
            } catch (error) {
                setLoading(false)
                setError(error)
                console.log(error)
            }
        }
        getNews()
    }, [])
  return (
    <div>
        {loading ? 
            <p>
                Loading...
            </p>
        :
        error ?
            <p>
                {error}
            </p>
        :
        news.length > 0 && 
            <div className='flex flex-wrap gap-5'>
                {news.map((article, index) => (
                    <Link 
                        to={article.url}
                        key={index}
                        target='_blank'
                    >
                        <NewsCard article={article}/>
                    </Link>
                ))}
            </div>
        }
    </div>
  )
}
