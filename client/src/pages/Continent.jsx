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

export default function Continent() {
  const { currentUser } = useSelector((state) => state.user);
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogError, setBlogError] = useState(null)
  const [blogs, setBlogs] = useState([])

  const { continent } = useParams();
  const {continentData, continentLoading, continentError} = useGetContinent(continent);
  const {continentCountries, continentCountriesLoading, continentCountriesError} = useGetContinentCountries(continent);
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(continentData)

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
  }, [continentData.continent, blogError])

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
        <p className="text-3xl">
          {continentError}
        </p>
      : continentLoading ? 
        <p className="text-3xl">
          Loading...
        </p>
      :
      <div className="">
        <div className="">
          <ImageHero image={continentData.continent_photo} />
          <div className="mt-4 font-bold container flex flex-col mx-auto px-4 h-[300px]">
              <p className="text-6xl">
                {continentData.continent_name} 
              </p>
              <p className="mt-4 text-justify">
                {continentData.continent_description}
              </p>
              {
                currentUser &&
                <>
                  <p 
                    className="hover:underline hover:cursor-pointer text-blue-600"
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

          </div>
        </div>

        {/* Countries */}
        <div className="bg-blue-100 py-7 mx-0 lg:mx-2 lg:px-4 lg:rounded-3xl">
          <div className="container gap-4 mx-auto px-4">
            <h1 className="text-4xl font-bold">
              Countries
            </h1>
            <p className="mt-4">
              {`Dive into the rich mosaic of ${continentData.continent_name}'s countries! Explore diverse 
              cultures, landscapes, and histories as we guide you through this 
              captivating continent's unique destinations.`}
            </p>
          </div>
          <div className="mt-4 container gap-4 flex flex-wrap mx-auto px-4 ">
            {
              continentCountriesError ?
                <p className="mx-auto px-4 text-3xl">
                  {continentCountriesError}
                </p> 
              : continentCountriesLoading ? 
                <p className="mx-auto px-4 text-3xl">
                  Loading...
                </p> : 
                
                continentCountries.map((country) => (
                  <Link to={`${country.country}`}>
                    <div className="">
                      <DestinationCard key={country.id} destination={country}/>
                    </div>
                  </Link>
                ))  
            }
            { continentCountries.length >= 4 &&
            <Link
              className="hover:cursor-pointer hover:underline"
              to={`/destinations?type=country&sort=ASC&page=1&continent=${continentData.continent_name}`}
            >See More
            </Link>
            }
          </div>
        </div>
        
        {/* Blogs */}
        {
          blogError ?
            <p className="mx-auto px-4 text-3xl">
              {blogError}
            </p> 
          : blogLoading ? 
            <p className="mx-auto px-4 text-3xl">
              Loading...
            </p> 
          : 
          <div className="container py-7 mx-auto px-4">
            <div className="mt-4 container gap-4 mx-auto">
              <h1 className="text-4xl font-bold">
                Blogs
              </h1>
              <p className="mt-4">
                {`Discover ${continentData.continent_name} through the eyes of fellow travelers! 
                Dive into our blog section filled with captivating stories, 
                adventures, and insights, offering a glimpse into the rich 
                tapestry of experiences waiting to be explored across this 
                remarkable continent.`}
              </p>
            </div>
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
            { blogs.length >= 4 &&
              <Link
                className="hover:cursor-pointer hover:underline"
                to={`/blogs?type=${continentData.continent_name}&page=1`}
              >See More
              </Link>
            }
            </div>
          </div>
        }

          
        {/* News */}
        <div className="bg-green-100 py-7 mx-0 lg:mx-2 lg:px-4 lg:rounded-3xl">
          <div className="mt-4 container gap-4 mx-auto px-4">
            <h1 className="text-4xl font-bold">
              News
            </h1>
            <p className="mt-4">
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
