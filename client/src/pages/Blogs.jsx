import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import BlogCards from '../components/cards/BlogCards';
import SearchFilter from '../components/SearchFilter';

export default function Blogs() {
  const {currentUser} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [pages, setPages] = useState();
  const [selectedOption, setSelectedOption] = useState({
    type: '',
    sort: '',
    page: 1,
    continent: ''
  });
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  console.log(blogs)

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true)
        const res  = await fetch('/api/blogs/getBlogs')
        const data = await res.json()
        setLoading(false)
        setBlogs(data)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }
    
    if (queryParams.size === 0) {
      getBlogs();
    } 
  }, [])

  const handlePageChange = (newPage) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      page: newPage
    }))
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', newPage);
    const searchQuery = urlParams.toString();
    navigate(`/blogs?${searchQuery}`);
  }


  return (
    <div>
      <div>
        <SearchFilter 
          blog={true} 
          destination={null} 
          setDestinations={null} 
          setBlogs={setBlogs}
          setError={setError}
          setLoading={setLoading}
          setPages={setPages}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
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

        {pages &&
          <div className='flex justfy-center my-4'>
            {pages > 1 &&
              <button
                onClick={() => handlePageChange(selectedOption.page - 1)}
                disabled={selectedOption.page === 1}
                className='px-4 py-2 mr-2 bg-blue-500 text-white'
              >
                Previous Page
              </button>
            }
            <span className='text-lg font-semibold'>{`${selectedOption.page} of ${Math.ceil(pages)}`}</span>
            {pages > 1 &&
              <button
                onClick={() => handlePageChange(selectedOption.page + 1)}
                disabled={selectedOption.page === Math.ceil(pages)}
                className='px-4 py-2 mr-2 bg-blue-500 text-white'
              >
                Next Page
              </button>
            }
          </div>
        }
      </div>
    </div>
  )
}
