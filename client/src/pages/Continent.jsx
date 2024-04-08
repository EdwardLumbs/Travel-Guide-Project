import { Link, useParams } from "react-router-dom";
import useGetContinent from "../hooks/useGetContinent";
import useGetContinentCountries from "../hooks/useGetContinentCountries";
import DestinationCard from "../components/cards/DestinationCard";
import News from "../components/News";
import { useEffect, useState } from "react";
import TripModal from "../components/TripModal";
import { useSelector } from 'react-redux';
import ImageHero from "../components/heroComponent/ImageHero";
import BlogCards from "../components/cards/BlogCards";
import { MdFlight } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

export default function Continent() {
  const { currentUser } = useSelector((state) => state.user);
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogError, setBlogError] = useState(null)
  const [blogs, setBlogs] = useState([])

  const { continent } = useParams();
  const {continentData, continentLoading, continentError} = useGetContinent(continent);
  const {continentCountries, continentCountriesLoading, continentCountriesError} = useGetContinentCountries(continent);
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(continentData.continent_name)

  const fetchBlogs = async () => {
    try {
      setBlogLoading(true)
      const res = await fetch(`/api/blogs/getBlogs?limit=4&tag1=${continentData.continent_name}`)
      const data = await res.json()
      console.log(data)
      if (data.success === false) {
        setBlogError(data.message)
        setBlogLoading(false)
        return
      }
      setBlogs(data)
      setBlogError(null)
      setBlogLoading(false)
    } catch (error) {
      console.log(error.message)
      setBlogError(error.message)
      setBlogLoading(false)
    }
  }
  
  useEffect(() => {
    fetchBlogs()
  }, [continentData.continent_name, blogError])

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
    <div>
      {continentError ? 
        <p className="text-3xl mx-auto px-4 mt-4">
          {continentError}
        </p>
      : continentLoading ? 
        <div className='mx-auto h-screen animate-pulse container px-4 my-4 flex flex-col justify-center items-center'>
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
      <div className="">
        <div className="">
          <ImageHero image={continentData.continent_photo} />
          <div className="mt-4 container flex flex-col mx-auto px-4">
              <p className="text-8xl font-bold ">
                {continentData.continent_name} 
              </p>
              <p className="my-4 text-lg text-justify">
                {continentData.continent_description}
              </p>
              {
                currentUser &&
                <>
                  <p 
                    className="hover:underline text-lg hover:cursor-pointer text-blue-600"
                    onClick={openModal}  
                  >
                    Start a plan
                  </p>
                  <div className="">
                    <TripModal  
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      currentDestination={continentData.continent_name}
                      user_id={currentUser.id}
                    />
                  </div>
                  
                </>
              }
              <div className="flex justify-end items-center mt-7 gap-7">
                <Link to={`/explore`}>
                  <div className="bg-yellow-100 w-56 h-auto rounded-lg p-4 flex flex-col gap-7">
                    <h1 className="text-2xl font-semibold">
                      Find the best things to do
                    </h1>
                    <div className="text-6xl justify-end flex">
                      <MdExplore />
                    </div>
                  </div>
                </Link>
                <Link to={`/flights`}>
                  <div className="bg-red-100 w-56 h-auto rounded-lg p-4 flex flex-col gap-7">
                    <h1 className="text-2xl font-semibold">
                      Search for cheap flights
                    </h1>
                    <div className="text-6xl justify-end flex">
                      <MdFlight />
                    </div>
                  </div>
                </Link>
              </div>
          
          </div>
        </div>

        {/* Countries */}
        <div className="bg-blue-100 mt-6 mb-20 py-7 mx-0 lg:mx-2 lg:px-4 lg:rounded-3xl">
          <div className="container gap-4 mx-auto px-4">
            <h1 className="text-6xl font-bold">
              {`Explore ${continentData.continent_name}`}
            </h1>
            <p className="my-4 text-lg text-justify">
              {`Dive into the rich mosaic of ${continentData.continent_name}'s countries! Explore diverse 
              cultures, landscapes, and histories as we guide you through this 
              captivating continent's unique destinations.`}
            </p>
          </div>
          <div className="container gap-4 flex flex-wrap mx-auto px-4 pb-6">
            {
              continentCountriesError ?
                <p className="mx-auto px-4 text-3xl">
                  {continentCountriesError}
                </p> 
              : continentCountriesLoading ? 
              <div className='mx-auto animate-pulse container px-4 my-4 flex flex-col items-center justify-center'>
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
              continentCountries.length > 0 &&
              <div className='flex gap-5 flex-col w-full'>
                <div className='bg-white shadow-md hover:shadow-lg
                    transition-shadow overflow-hidden rounded-lg'
                >
                    <Link 
                        to={continentCountries[0].country}
                    >
                        <img 
                          className='w-full h-96 object-cover hover:scale-105 transition-scale duration-300'
                          src={continentCountries[0].photo || continentCountries[0].continent_photo} 
                          alt="Cover Image" 
                        />
                        <p className='text-lg px-4 pt-2 font-semibold'>
                          {continentCountries[0].continent_name}
                        </p>
                        <p className={`${continentCountries[0].country ? 'pb-2' : 'py-2'} md:text-3xl text-2xl font-bold px-4`}>
                          {continentCountries[0].country || continentCountries[0].continent_name}
                        </p>
                    </Link>
                </div>
                <div className='flex md:flex-row flex-col flex-wrap gap-4'>
                  {continentCountries.slice(1).map((country) => (
                    <Link to={`${country.country}`}>
                      <div className="">
                        <DestinationCard key={country.id} destination={country}/>
                      </div>
                    </Link>
                  ))}
                  { continentCountries.length >= 5 &&
                  <Link
                    className="hover:cursor-pointer"
                    to={`/destinations?type=country&sort=ASC&page=1&continent=${continentData.continent_name}`}
                  >
                    <div 
                      className="max-w-max flex gap-2 items-center text-white bg-blue-800 py-2 px-3 rounded-lg
                              hover:bg-white duration-300 hover:text-blue-800"
                    >
                      <p className="font-bold text-lg">
                        See more
                      </p>
                      <div>
                        <FaArrowRight />
                      </div>
                    </div>
                  </Link>
                }
                </div>
              </div>
            }
          </div>
        </div>
        
        {/* Blogs */}
        {
          <div className="py-7 my-20">
            <div className="container gap-4 mx-auto px-4">
              <h1 className="text-6xl font-bold">
                Blogspot: Where Stories Unfold
              </h1>
              <p className="my-4 text-lg text-justify">
                {`Discover ${continentData.continent_name} through the eyes of fellow travelers! 
                Dive into our blog section filled with captivating stories, 
                adventures, and insights, offering a glimpse into the rich 
                tapestry of experiences waiting to be explored across this 
                remarkable continent.`}
              </p>
              <Link
                className="hover:cursor-pointer max-w-max flex gap-2 items-center 
                text-white bg-blue-500 py-2 px-3 rounded-lg hover:bg-white 
                duration-300 hover:text-blue-800 mb-4"
                to={'/blogs'}
              >
                Check all blogs
              </Link>
            </div>
            {
            blogError ?
              <p className="mx-auto text-center mt-4 px-4 text-3xl">
                {blogError}
              </p> 
            : blogLoading ? 
            <div className='animate-pulse mx-auto container px-4 my-4 flex flex-col items-center'>
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
            <div className="mt-4 container gap-4 flex flex-wrap mx-auto px-4 ">
            { blogs.length > 0 && blogs.map((blog) => (
              <Link to={`/blogs/${blog.id}`}>
                <div className="">
                  <BlogCards 
                    blog={blog}
                    handleDelete={handleDelete}
                  />
                </div>
              </Link>
            ))}
            { blogs.length >= 5 &&
              <Link
                className="hover:cursor-pointer"
                to={`/blogs?type=${continentData.continent_name}&page=1`}
              >
                <div 
                  className="max-w-max flex gap-2 items-center text-white bg-blue-800 py-2 px-3 rounded-lg
                          hover:bg-white duration-300 hover:text-blue-800"
                >
                  <p className="font-bold text-lg">
                    See more
                  </p>
                  <div>
                    <FaArrowRight />
                  </div>
                </div>
              </Link>
            }
            </div>
            }
          </div>
        }

          
        {/* News */}
        <div className="bg-orange-100 mx-0 lg:mx-2 py-7 lg:px-4 lg:rounded-3xl my-20">
          <div className="container gap-4 mx-auto px-4">
            <h1 className="text-6xl font-bold">
              {`Tales fresh off the press, straight from ${continentData.continent_name}!`}
            </h1>
            <p className="mt-4 text-lg text-justify">
              {`Stay in the know with ${continentData.continent_name}'s tourism news! 
              From travel tips to exciting attractions, our news section keeps you updated 
              on all things tourism-related. Explore the latest updates shaping 
              your next adventure in ${continentData.continent_name}.`}
            </p>
          </div>
          <div className="mt-4 container px-4 mx-auto">
            <News place={continentData.continent_name}/>
          </div>
        </div>

      </div>
    }
    </div>
  )
}
