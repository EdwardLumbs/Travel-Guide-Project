import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import useGetContinent from '../hooks/useGetContinent';
import useGetCountry from '../hooks/useGetCountry';

export default function SearchFilter({
        blog, 
        destination, 
        setBlogs, 
        setDestinations,
        setLoading, 
        setError,
        setPages,
        selectedOption,
        setSelectedOption}) 
    {
    const [searchTerm, setSearchTerm] = useState('');
    const [tags, setTags] = useState([]);
    const pageSize = 8;
  
    const navigate = useNavigate();
    const {continentData} = useGetContinent();
    const {country} = useGetCountry();

    useEffect(() => {
        if (Array.isArray(continentData) && Array.isArray(country)) {
          setTags([...continentData, ...country]);
        }
    }, [continentData, country]);


    useEffect(() => {
        const urlParams = getUrlParams();
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const sortFromUrl = urlParams.get('sort');
        const pageFromUrl = urlParams.get('page');
        const continentFromUrl = urlParams.get('continent');

        const filterQuery = urlParams.toString();
        console.log(searchTermFromUrl);
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl || '');
        } 
        console.log(searchTerm);
        
        if (typeFromUrl || sortFromUrl || pageFromUrl || continentFromUrl) {
            if (destination) {
                setSelectedOption({
                    type: typeFromUrl || 'country',
                    sort: sortFromUrl || 'ASC',
                    page: parseInt(pageFromUrl) || 1,
                    continent: continentFromUrl || ''
                });
            } else {
                setSelectedOption({
                    type: typeFromUrl || '',
                    page: parseInt(pageFromUrl) || 1,
                });
            };
        };
    
        const fetchSearchedLocation = async () => {
                setLoading(true);
                setPages(null);

                try {
                    const res = await fetch(`/api/destination/searchDestination/${searchTermFromUrl}`);
                    const searchedDestination = await res.json();
                    console.log(res);
                    
                    if (searchedDestination.success === false) {
                        setLoading(false);
                        setError(searchedDestination.message);
                    } else {
                        setLoading(false);
                        setError(null);
                        setDestinations(searchedDestination);
                    }
                } catch (error) {
                    console.log(error);
                    setError(error.message);
                    setLoading(false);
                }
        } 

        const fetchFilteredLocations = async (filterQuery) => {
                setLoading(true);
                if (typeFromUrl === 'country' && continentFromUrl) {
                    try {
                        const res = await fetch(`/api/destination/getContinentCountry?${filterQuery}`);
                        const destination = await res.json();
                        if (destination.success === false) {
                            setLoading(false);
                            setError(destination.message);
                        } else {
                            setLoading(false);
                            setError(null);
                            setDestinations(destination.location);
                            setPages(destination.totalItems / pageSize);
                        }
                    } catch (error) {
                        console.log(error);
                        setError(error.message);
                        setLoading(false);
                    };
                } else if (typeFromUrl === 'continent' && continentFromUrl) {
                    navigate('/destinations?type=continent&sort=ASC&page=1');
                } else {
                  try {
                    const res = await fetch(`/api/destination/filterCountries?${filterQuery}`);
                    const destination = await res.json();

                    if (destination.success === false) {
                        setLoading(false);
                        setError(destination.message);
                    } else {
                        setLoading(false);
                        setError(null);
                        setDestinations(destination.location);
                        setPages(destination.totalItems / pageSize);
                    }
                  } catch (error) {
                    console.log(error);
                    setError(error.message);
                    setLoading(false);
                  };
                }
        }
        const fetchSearchedBlogs = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/blogs/searchBlogs?${filterQuery}`);
                    const searchedBlogs = await res.json();
                    console.log(searchedBlogs);
                    if (searchedBlogs.success === false) {
                        setLoading(false);
                        setError(searchedBlogs.message);
                    } else {
                        setLoading(false);
                        setError(null);
                        setBlogs(searchedBlogs.blogs);
                        setPages(searchedBlogs.totalItems / pageSize);
                    }
                } catch (error) {
                    console.log(error);
                    setError(error.message);
                    setLoading(false);
                }
        }
        const fetchFilteredBlogs = async (filterQuery) => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/blogs/filteredBlogs?${filterQuery}`);
                    const blogs = await res.json();
                    if (blogs.success === false) {
                        setLoading(false);
                        setError(blogs.message);
                    } else {
                        setLoading(false);
                        setError(null);
                        setBlogs(blogs.blogs);
                        setPages(blogs.totalItems / pageSize);
                    }
                } catch (error) {
                    console.log(error);
                    setError(error.message);
                    setLoading(false);
                }
        }
        if (searchTermFromUrl && blog) {
            fetchSearchedBlogs();
        }
        
        if (typeFromUrl && blog) {
            console.log('clicked');
            fetchFilteredBlogs(filterQuery);
        } 
        
        if (searchTermFromUrl && destination) {
            fetchSearchedLocation();
        }
        
        if ((typeFromUrl || sortFromUrl) && destination) {
            fetchFilteredLocations(filterQuery);
        } 
        
    }, [location.search]);

    const getUrlParams = () => {
        const urlParams = new URLSearchParams(location.search);
        return urlParams;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }
    
    const handleOptionChange = (e) => {
        setSelectedOption((prevState) => ({
          ...prevState, 
          [e.target.id]: e.target.value,
        })
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const urlParams = getUrlParams();
        setSelectedOption({
            type: '',
            sort: '',
            page: '',
            continent: ''
        })
        urlParams.set('searchTerm', searchTerm);
        urlParams.delete('type');
        urlParams.delete('sort');
        if (blog) {
            urlParams.set('page', 1);
        } else {
            urlParams.delete('page');
        }
        urlParams.delete('continent');
        const searchQuery = urlParams.toString();
        navigate(blog ?
            `/blogs?${searchQuery}`
            :
            `/destinations?${searchQuery}`
            );
    };

    const handleOptionSubmit = (e) => {
        e.preventDefault();
        const urlParams = getUrlParams();
        setSearchTerm('');
        urlParams.delete('page');
        urlParams.delete('searchTerm');
        urlParams.set('type', selectedOption.type);
        if (destination) {
            urlParams.set('sort', selectedOption.sort);
            urlParams.set('continent', selectedOption.continent);
            if (selectedOption.type === 'continent') {
                urlParams.delete('continent');
            }
        }
        urlParams.set('page', 1);
        const searchQuery = urlParams.toString();
        navigate(blog ?
            `/blogs?${searchQuery}`
            :
            `/destinations?${searchQuery}`);
    };

  return (
    <div className='lg:flex lg:flex-col lg:gap-6 mb-4 mt-2 w-full'>
        <form 
            className='relative items-center lg:mb-1 mb-5'
            onSubmit={handleSearchSubmit}
        >
            <input 
                className='border hover:border-slate-600 duration-200  rounded-full p-2 pl-10 w-full lg:w-96 box-border'
                type="text" 
                id='searchTerm'
                placeholder={blog ? `Title` : `Search for a destination`}
                value={searchTerm}
                onChange={handleSearchChange}
                required
                autoComplete='off'
            />
            <button 
                type='submit'
                className='absolute left-3 top-1/2 transform -translate-y-1/2 scale-125 lg:top-5'
            >
                <FaSearch />
            </button>
        </form>
        <form 
            className=''
            onSubmit={handleOptionSubmit}
        >
          <div className='lg:flex lg:gap-6'>
            <div>
              <label className={`${blog ? 'mb-2' : ''} flex items-center`}>
                {blog ? `Filter by tag` : `Filter by type of Place`}
              </label>
              <select 
                value={selectedOption.type}
                className={`border hover:border-slate-600 duration-200 hover:cursor-pointer rounded-full ${blog ? 'mb-4' : 'my-2'} p-2 w-full md:w-96 lg:w-60`}
                id="type" 
                onChange={handleOptionChange}
                required
              >
                {!blog ?
                    <>
                        <option value="" disabled selected>Type</option>
                        <option value="country">Country</option>
                        <option value="continent">Continent</option>
                    </>
                : (
                    <>
                            <option value="" disabled selected>Select Tag</option>
                        {tags.map((tag) => 
                            <option value={tag.toLowerCase()}>{tag}</option>
                        )}
                    </>
                )
                }
              </select>
            </div>
            { destination && selectedOption.type === 'country' && 
              <div>
                <label className='flex items-center'>
                  Filter by Continent
                </label>
                <select 
                  value={selectedOption.continent}
                  className='border hover:border-slate-600 duration-200 hover:cursor-pointer rounded-full my-2 p-2 w-full md:w-96 lg:w-60'
                  id="continent" 
                  onChange={handleOptionChange}
                >
                  <option value="" selected>Any</option>
                  <option value="asia">Asia</option>
                  <option value="europe">Europe</option>
                  <option value="north america">North America</option>
                  <option value="south america">South America</option>
                  <option value="africa">Africa</option>
                  <option value="australia">Australia</option>
                </select>
              </div>
            }
          
          {!blog &&
              <div>
                  <label className='flex items-center'>
                      Sort places by
                  </label>
                  <select 
                      value={selectedOption.sort}
                      className='border hover:border-slate-600 duration-200 hover:cursor-pointer rounded-full mt-2 mb-4 p-2 w-full md:w-96 lg:w-60'
                      id="sort" 
                      onChange={handleOptionChange}
                      required
                  >
                      <option value="" disabled selected>Order</option>
                      <option value="ASC">A-Z</option>
                      <option value="DESC">Z-A</option>
                  </select>
              </div>
          }
          </div>
          <button
            type='submit'
            className='border px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
          >
            Filter
          </button>
          
        </form>
      
    </div>
  )
}
