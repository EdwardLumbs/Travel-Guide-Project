import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import BlogCards from '../components/cards/BlogCards';

export default function Blogs() {
  const {currentUser} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true)
        const res  = await fetch('/api/blogs/get-blogs')
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
    getBlogs()
  }, [])

  return (
    <div>
      <div>
        <form action="">
          <select name="" id="">
            <option value="">Put countries</option>
          </select>
        </form>
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
          blogs.length > 0 && 
            <div className='flex gap-4 flex-wrap'>
              {blogs.map((blog, index) => (
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
