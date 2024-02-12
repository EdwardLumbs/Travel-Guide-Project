import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css';
import ImageHero from '../../components/heroComponent/ImageHero';

export default function BlogPage() {
  const { blogId } = useParams()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState({});
  const [user, setUser] = useState([]);
  console.log(blog.place_tag)

  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true)
        const res  = await fetch(`/api/blogs/getBlog/${blogId}`)
        const data = await res.json()
        setLoading(false)
        const options = { month: 'long', day: 'numeric', year: 'numeric' }
        const formattedTimestamp = new Date(data[0].created_at).toLocaleString('en-US', options)
        setBlog({
          ...data[0],
          created_at: formattedTimestamp
        })

      } catch (error) {
        setError(error.message)
        setLoading(false)
        console.log(error.message)
      }
    }
    
    getBlog()
  }, [blogId])

  useEffect(() => {
    const getUser = async () => {
        try {
            const res  = await fetch(`/api/user/getUser/${blog.user_id}`)
            console.log(blog.user_id)
            const data = await res.json()
            console.log(data)
            setUser(data[0])
          } catch (error) {
            console.log(error.message)
          }
    }
    if (Object.keys(blog).length > 0) {
      getUser()
    }
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
      <div className="">
        <div className="">
          <ImageHero image={blog.photo} />
          <div className="mt-4 container mx-auto px-4">

              <p className="text-6xl font-semibold">
                {blog.title} 
              </p>

              <div className="flex flex-col mt-6 justify-center gap-2 pb-6 border-b">
                <div className='flex gap-2 items-center'>
                  <img 
                    className='h-9 w-9 object-cover rounded-full mr-2'
                    src={user.photo} 
                    alt="Cover Image" 
                  />
                  <div className='font-semibold'>
                    <p>
                      Author: {user.username}
                    </p>
                    <p>
                      Created at: {blog.created_at} 
                    </p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <p className='font-semibold'>
                    Tag(s):
                  </p>
                  {blog.place_tag && blog.place_tag.map((tag) =>   
                    <p>
                      {tag}
                    </p>
                  )}
                </div>
              </div>

              <div
                className="text-justify text-lg mt-6"
                dangerouslySetInnerHTML={{__html:blog.content}}
              />
          </div>
        </div>

      </div>
    }
    </>
  )
}
