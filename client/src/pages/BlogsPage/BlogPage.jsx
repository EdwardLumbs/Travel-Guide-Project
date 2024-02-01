import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BlogPage() {
  const { blogId } = useParams()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState({});
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true)
        const res  = await fetch(`/api/blogs/get-blog/${blogId}`)
        const data = await res.json()
        console.log(data)
        setLoading(false)
        setBlog(data[0])
      } catch (error) {
        setError(error.message)
        setLoading(false)
        console.log(error.message)
      }
    }
    
    getBlog()
  }, [])

  useEffect(() => {
    const getUser = async () => {
        try {
            const res  = await fetch(`/api/user/getUser/${blog.user_id}`)
            const data = await res.json()
            console.log(data)
            console.log(data)
            setUser(data[0])
          } catch (error) {
            console.log(error.message)
          }
    }
    getUser()
  }, [blog])

  return (
    <>
    {error ? 
      <p className="text-3xl">
        {error}
      </p>
    : loading ? 
      <p className="text-3xl">
        Loading...
      </p>
    :
      <div className="flex items-center flex-col gap-5">
        <div className="">
          <img 
            className="object-cover rounded-2xl w-[960px]"
            src={blog.photo} 
            alt="cover photo" 
          />
          <div className="mt-9">
              <p className="text-6xl">
                {blog.title} 
              </p>
              <p className="text-2xl">
                Author: {user.username}
              </p>
              <div
                className="mt-9"
                dangerouslySetInnerHTML={{__html:blog.content}}
              />
          </div>
        </div>

      </div>
    }
    </>
  )
}
