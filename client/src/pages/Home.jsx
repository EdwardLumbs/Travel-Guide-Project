import Hero from "../components/heroComponent/Hero"
import { Link, useNavigate } from "react-router-dom"
import useGetContinent from "../hooks/useGetContinent"
import DestinationCard from "../components/cards/DestinationCard"
import { useEffect, useState } from "react"
import BlogCards from "../components/cards/BlogCards"
import TripModal from "../components/TripModal"
import { useSelector } from 'react-redux';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const {continentPhoto, continentLoading, continentError} = useGetContinent('all')
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogError, setBlogError] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState([])
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogLoading(true)
        const res = await fetch(`/api/blogs/getBlogs?limit=5`)
        const data = await res.json()
        console.log(data.blogs)

        if (data.success === false) {
          setBlogError(data.message)
          setBlogLoading(false)
          return
        }

        setBlogs(data.blogs)
        setBlogError(null)
        setBlogLoading(false)

        if(data.blogs[0].user_id) {
          try {
            const res  = await fetch(`/api/user/getUser/${data.blogs[0].user_id}`)
            console.log(data.blogs[0].user_id)
  
            const userData = await res.json()
            console.log(userData)
            setUser(userData[0])
          } catch (error) {
            console.log(error.message)
          }
        }

      } catch (error) {
        console.log(error.message)
        setBlogError(error.message)
        setBlogLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Hero 
        image={"photos/home.jpg"}
        home={true}
        content={
        <>
          <h1 className="text-8xl">
            Welcome To <span className="font-logo"><span className="font-extrabold font-logo">Edward's</span>TravelGuide</span>
          </h1>
          <p className="mt-4 text-2xl font-semibold">
            Your Journey Starts Here
          </p>
        </>}
      />
          {/* plan section */}
      <div className="mt-20 bg-orange-100 mx-0 lg:mx-2 lg:px-4 lg:rounded-3xl">
        <div className="mt-20 container mx-auto px-4 py-20">
          <h1 className="text-6xl font-bold">
            Plan your next trip on us
          </h1>
          <div className="mt-4">
            {currentUser ?
              <>
                <TripModal  
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  user_id={currentUser.id}
                />
                <button 
                  className="border border-white px-3 py-1 rounded-full hover:bg-white
                  hover:text-violet-300 text-lg bg-violet-300 duration-300 text-white"
                  onClick={openModal}  
                >
                  Check it out
                </button>
              </>
            :
            <>
              <p className="text-lg mb-4">
                Create an account and start planning for your next adventure
              </p>
              <Link
                  className="border border-white px-3 py-1 rounded-full hover:bg-white
                  hover:text-violet-300 text-lg bg-violet-300 duration-300 text-white"
                  to={'/sign-up'}
              >
                Create an account
              </Link>
            </>
            }
          </div>
        </div>
      </div>

          {/* destination section */}
      <div className="mt-20 container flex flex-col  mx-auto px-4">
        <h1 className="text-6xl font-bold ">
          Your next adventure awaits
        </h1>
        <p className="text-lg mt-2">
          Explore various places effortlessly.
        <Link 
          className="ml-2 border px-3 py-1 rounded-full border-blue-800 bg-blue-800 
          text-white hover:bg-white duration-300 hover:text-blue-800"
          to={'/destinations'}
        >
          Check it out
        </Link>
        </p>
        { 
        continentLoading ?
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
        continentError ? 
          <p className='mt-4 text-3xl font-semibold'>
            {continentError}
          </p> :
        <div className="flex gap-4 flex-wrap mt-4">
          {continentPhoto.length > 0 && continentPhoto.map((continent) => (
            <Link to={`/destinations/${continent.continent_name}`}>
              <DestinationCard key={continent.continent_name} destination={continent}/>
            </Link>
          ))}
        </div>
        }
      </div>

          {/* flight section */}
      <div className="mt-20 bg-violet-300">
        <div className="mt-20 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold">
            Find the cheapest flights
          </h1>
          <p className="text-lg my-4">
            Explore our flight search feature, designed to find you the cheapest airfares effortlessly. 
          </p>
          <Link 
            className="border border-white px-3 py-1 rounded-full hover:bg-white
            hover:text-violet-300 text-lg bg-violet-300 duration-300 text-white"
            to={'/flights'}
          >
            Check it out
          </Link>
        </div>
      </div>

          {/* blog section */}
      <div className="mt-20 container mx-auto px-4">
        <h1 className="text-6xl font-bold">
          Read travelers' experiences
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p>
            Learn cultures through the eyes of our users
          </p>
          <Link 
            className="border border-white px-3 py-1 rounded-full hover:bg-white
            hover:text-violet-300 text-lg bg-violet-300 duration-300 text-white"
            to={'/blogs'}
          >
            Check it out
          </Link>
        </div>
        
        <div className="mt-4"> 
          {
            blogLoading ? 
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
            blogError ?
                <p className="mt-4 text-center">
                    {blogError}
                </p>
            :
            blogs.length > 0 &&
              <div className="flex gap-5 w-full flex-col">
                <div className='bg-white shadow-md hover:shadow-lg relative
                    transition-shadow w-full flex-1'
                >
                  <Link to={`/blogs/${blogs[0].id}`}>
                    <img 
                      className="h-96 w-full rounded-xl object-cover hover:scale-105 transition-scale duration-300"
                      src={blogs[0].photo} 
                      alt="cover" 
                    />
                    <div className="absolute left-0 right-0 bottom-0 
                      p-7 flex flex-col gap-1 hover:scale-105 transition-scale duration-300">
                      <p className="text-sm font-semibold line-clamp-1 text-white">
                        By: {user.username}
                      </p>
                      <p className='text-4xl font-bold text-white'>
                        {blogs[0].title}
                      </p>
                    </div>
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4 flex-1'>
                  {blogs.slice(1).map((blog) => (
                    <Link 
                      to={`/blogs/${blog.id}`}
                    >
                      <BlogCards 
                        blog={blog}
                        home={true}
                      />
                    </Link>
                  ))}
                </div>
              </div>
          }
        </div>
      </div>

          {/* attractions section */}
      <div className="my-20 bg-orange-100 mx-0 lg:mx-2 lg:px-4 lg:rounded-3xl">
        <div className="mt-20 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold">
            Discover attractions
          </h1>
          <p className="text-lg my-4">
            Easily explore attractions that interests you through our explore page
          </p>
          <Link 
            className="border border-white px-3 py-1 rounded-full hover:bg-white
            hover:text-violet-300 text-lg bg-violet-300 duration-300 text-white"
            to={'/explore'}
          >
            Check it out
          </Link>
        </div>
      </div>

    </div>
  )
}
