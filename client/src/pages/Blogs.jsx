import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import BlogCards from '../components/cards/BlogCards';
import SearchFilter from '../components/SearchFilter';

export default function Blogs() {
  const {currentUser} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  console.log(blogs)
  const queryParams = new URLSearchParams(location.search);

  console.log('clicked')

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true)
        const res  = await fetch('/api/blogs/getBlogs')
        const data = await res.json()
        console.log(data)
        setLoading(false)
        setBlogs(data)
      } catch (error) {
        setError(error.message)
        setLoading(false)
        console.log(error.message)
      }
    }
    
    if (queryParams.size === 0) {
      getBlogs();
    } 
  }, [])

  return (
    <div>
      <div>
        <SearchFilter blog={true} destination={null} setDestinations={null} setBlogs={setBlogs}/>
      </div>
      <div>
        <Link to={currentUser ? '/blogs/create' : '/login'}>
          Post A Blog
        </Link>
      </div>
      <div>
        {
          loading ? 
          <p>
            Loading...
          </p>
          :
          error ? 
          <p>
            {error}
          </p>
          :
            <div className='flex gap-4 flex-wrap'>
              {blogs.length > 0 && blogs.map((blog, index) => (
                <Link
                  key={index}
                  to={`/blogs/${blog.id}`}
                >
                  <BlogCards blog={blog}/>
                </Link>
              ))}
            </div>
        }
      </div>
    </div>
  )
}
