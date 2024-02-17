import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import BlogCards from '../components/cards/BlogCards';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/heroComponent/Hero';
import { FaPlus } from "react-icons/fa";
import DeleteModal from '../components/DeleteModal';

export default function Blogs() {
  const {currentUser} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [pages, setPages] = useState();

  const [openedDeleteModalId, setOpenedDeleteModalId] = useState(null);

  const [selectedOption, setSelectedOption] = useState({
    type: '',
    sort: '',
    page: 1,
    continent: ''
  });
  const pageSize = 8;

  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const openDeleteModal = (blogId) => {
    setOpenedDeleteModalId(blogId);
  };  

  const closeDeleteModal = () => {
    setOpenedDeleteModalId(null);
  };

  const getBlogs = async () => {
    const urlParams = new URLSearchParams(location.search);
    try {
      setLoading(true);
      urlParams.set('page', selectedOption.page);
      const searchQuery = urlParams.toString();
      const res  = await fetch(`/api/blogs/getBlogs?${searchQuery}`);
      const blogs = await res.json();
      if (blogs.success === false) {
        setLoading(false);
        setError(blogs.message);
      } else {
        setLoading(false);
        setBlogs(blogs.blogs);
        setPages(blogs.totalItems / pageSize);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageFromUrl = urlParams.get('page');

    if (pageFromUrl) {
      setSelectedOption({
        page: parseInt(pageFromUrl) || 1
      });
    };

    if (queryParams.size <= 1) {
      getBlogs();
    } 
  }, [selectedOption.page]);

  const handlePageChange = (newPage) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      page: newPage
    }));
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', newPage);
    const searchQuery = urlParams.toString();
    navigate(`/blogs?${searchQuery}`);
  }

  const handleDelete = async (blogId) => {
    console.log(blogId)
    try {
        const res = await fetch(`/api/blogs/deleteBlog/${blogId}`, {
          method: 'DELETE'
        })
        const data = await res.json()// show a prompt that shows the message of res
        console.log(data)
        getBlogs()
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div>
      <Hero 
        image={"photos/blogs.jpg"}
        content={
          <p className='font-bold'>
            Explore traveler insights on our Blog Page
          </p>
        }
      />
      <div className='mt-4 container flex flex-col items-center mx-auto px-4'>

        <div className='w-full'>
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

        <Link
          className='ml-auto mb-4 border py-2 px-3 rounded-lg text-white bg-blue-800 border-blue-800 hover:text-blue-800 hover:bg-white duration-200 ' 
          to={currentUser ? '/blogs/create' : '/login'}>
          <div className='flex font-bold items-center gap-1'>
            <FaPlus/>
            Post A Blog
          </div>
        </Link>
          {
            loading ? 
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
            <div className='flex w-full'>
              <div className='flex gap-4 flex-wrap'>
                {blogs.length > 0 && blogs.map((blog, index) => (
                  <>
                    <Link
                      key={index}
                      to={`/blogs/${blog.id}`}
                    >
                      <BlogCards 
                        blog={blog}
                        openDeleteModal={() => openDeleteModal(blog.id)}
                      />
                    </Link>
                    <DeleteModal  
                      blogId={blog.id}
                      isOpen={openedDeleteModalId === blog.id}
                      onClose={closeDeleteModal}
                      handleDelete={handleDelete}
                    />
                  </>
                ))}
              </div>
            </div>
          }

          {pages && (
            <div className='flex justify-center my-4'>
              {selectedOption.page > 1 && (
                <button
                  onClick={() => handlePageChange(selectedOption.page - 1)}
                  className='px-4 py-2 mr-2 text-blue-800 bg-white border border-blue-800 hover:text-white hover:bg-blue-800 duration-200 rounded-xl'
                >
                  Previous Page
                </button>
              )}

              <div className="flex items-center">
                {Array.from({ length: Math.ceil(pages) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 mx-1 text-white bg-blue-800 border border-blue-800 hover:text-blue-800 hover:bg-white duration-200 rounded-xl ${
                      selectedOption.page === index + 1 ? 'font-semibold' : ''
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
                  
              {selectedOption.page < Math.ceil(pages) && (
                <button
                  onClick={() => handlePageChange(selectedOption.page + 1)}
                  className='px-4 py-2 ml-2 text-blue-800 bg-white border border-blue-800 hover:text-white hover:bg-blue-800 duration-200 rounded-xl'
                >
                  Next Page
                </button>
              )}
            </div>
          )}
      
      </div>
    </div>
  )
}
