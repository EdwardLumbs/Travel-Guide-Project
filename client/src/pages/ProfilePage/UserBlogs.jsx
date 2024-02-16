import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCards from '../../components/cards/BlogCards';
import DeleteModal from '../../components/DeleteModal';

export default function UserBlogs() {
  const {currentUser} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [openedDeleteModalId, setOpenedDeleteModalId] = useState(null);

  const openDeleteModal = (blogId) => {
    setOpenedDeleteModalId(blogId);
  };  

  const closeDeleteModal = () => {
    setOpenedDeleteModalId(null);
  };

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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    console.log(blogId)
    try {
        const res = await fetch(`/api/blogs/deleteBlog/${blogId}`, {
          method: 'DELETE'
        })
        const data = await res.json()// show a prompt that shows the message of res
        console.log(data)
        fetchBlogs()
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="p-7 w-full">
      <div className='text-5xl font-bold mb-4'>
        Your Blogs
      </div>
        {
          error ?
            <div>
              <p className="text-3xl">
                {error}
              </p> 
              <Link 
                to={'/blogs/create'}
                className='font-bold mb-4 border py-2 px-3 rounded-lg text-white 
                bg-blue-500 border-blue-500 hover:text-blue-500 hover:bg-white 
                duration-200 '
              >
                Post a blog
              </Link>
            </div>
          : loading ? 
            <div className='animate-pulse my-4 flex flex-col items-center'>
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
          <div className='w-full flex flex-col gap-2'>
            <Link 
              className='font-bold ml-auto mb-4 border py-2 px-3 rounded-lg text-white 
              bg-blue-500 border-blue-500 hover:text-blue-500 hover:bg-white 
              duration-200 '
              to={'/blogs/create'}
            >
                Post a blog
            </Link>
            <div className='flex flex-wrap gap-4'>
              {blogs.length > 0 && blogs.map((blog) => (
                <>
                  <Link to={`/blogs/${blog.id}`}>
                    <div className="">
                      <BlogCards 
                        blog={blog}
                        openDeleteModal={() => openDeleteModal(blog.id)}
                      />
                    </div>
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
    </div>
  )
}
