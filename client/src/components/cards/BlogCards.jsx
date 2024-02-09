import { useEffect, useState } from "react"

export default function BlogCards({blog}) {
    const [user, setUser] = useState([])

    useEffect(() => {
        const getUser = async () => {
            try {
                const res  = await fetch(`/api/user/getUser/${blog.user_id}`)
                const data = await res.json()
                setUser(data[0])
              } catch (error) {
                console.log(error.message)
              }
        }
        getUser()
    }, [])

    return (
        <div className='bg-white shadow-md hover:shadow-lg 
        transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
            <img 
                className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                src={blog.photo} 
                alt="Cover Image" 
            />
            <div className="flex flex-col gap-2 py-2">
                <div className="flex items-center mt-2 px-4">
                    <img 
                        className='h-9 w-9 object-cover rounded-full mr-2'
                        src={user.photo} 
                        alt="User Image" 
                    />
                    <p className="text-sm pt-2 font-semibold">
                        {/* add author photo */}
                        By: {user.username}
                    </p>
                </div>
                <p className='px-4 text-2xl font-bold line-clamp-3 mb-2'>
                    {blog.title}
                </p>
            </div>
        </div>
    )
}
