import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCards from '../../components/cards/BlogCards';

export default function UserBlogs() {
  const {currentUser} = useSelector((state) => state.user);
  const [Loading, setLoading] = useState(false)
  const [Error, setError] = useState(null)
  const [blogs, setBlogs] = useState([])
  console.log(currentUser.id)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blogs/getUserBlogs/${currentUser.id}`)
        const data = await res.json()
        console.log(data)
        
        if (data.success === false) {
          setError(data.message)
          setLoading(false)
          return
        }
        setBlogs(data)
        setError(null)
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setError(error.message)
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <div className="px-4 w-full">
        {
          Error ?
            <div>
              <p className="text-3xl">
                {Error}
              </p> 
              <Link to={'/blogs/create'}>
                Post a blog
              </Link>
            </div>
          : Loading ? 
            <p className="text-3xl">
              Loading...
            </p> 
          : 
          <div className='w-full flex flex-col gap-2'>
            <Link 
              className='ml-auto mb-4 border py-2 px-3 rounded-lg text-white 
              bg-blue-500 border-blue-500 hover:text-blue-500 hover:bg-white 
              duration-200 '
              to={'/blogs/create'}
            >
                Post a blog
            </Link>
            <div className='flex gap-4'>
              {blogs.length > 0 && blogs.map((blog) => (
                <Link to={`/blogs/${blog.id}`}>
                  <div className="">
                    <BlogCards blog={blog}/>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        }
    </div>
  )
}
