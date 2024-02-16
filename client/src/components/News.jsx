import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NewsCard from './cards/NewsCard'

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
            <div className='mx-auto animate-pulse container px-4 my-4 flex flex-col items-center'>
                <img 
                    className='h-[80px]'
                    src="/vectors/plane.svg" 
                    alt="plane" 
                />
                <p className='text-lg'>
                    Waiting for Landing
                </p>
            </div>
        :
        error ?
            <p>
                {error}
            </p>
        :
        news.length > 0 && 
            <div className='flex gap-5 lg:flex-row flex-col'>
                <div className='bg-white shadow-md hover:shadow-lg relative
                    transition-shadow overflow-hidden rounded-lg w-full flex-1'
                >
                    <Link 
                        to={news[0].url}
                        target='_blank'
                    >
                        <img 
                            className='h-full w-full object-cover hover:scale-105 transition-scale duration-300'
                            src={news[0].urlToImage} 
                            alt="Cover Image" 
                        />
                        <div className="absolute left-0 right-0 bottom-0 
                            p-7 flex flex-col gap-1 hover:scale-105 transition-scale duration-300">
                            <p className="text-sm font-semibold line-clamp-1 text-white">
                                author: {news[0].author}
                            </p>
                            <p className='text-6xl font-bold text-white'>
                                {news[0].title}
                            </p>
                            <p className="text-sm text-white">
                                {news[0].description}
                            </p>
                        </div>
                    </Link>
                </div>
                <div className='flex flex-col gap-4 flex-1'>
                    {news.slice(1).map((article, index) => (
                        <Link 
                            to={article.url}
                            key={index}
                            target='_blank'
                        >
                            <NewsCard article={article}/>
                        </Link>
                    ))}
                </div>
            </div>
        }
    </div>
  )
}
