import { useEffect, useState } from "react"

export default function BlogCards({blog}) {
    const [user, setUser] = useState([])
    console.log(user)

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
    }, [])

    return (
        <div className='bg-white shadow-md hover:shadow-lg 
        transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
            <img 
                className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                src={blog.photo} 
                alt="Cover Image" 
            />
            <p>
                author: {user.username}
            </p>
            <p className='text-2xl font-semibold line-clamp-3'>
                {blog.title}
            </p>
        </div>
    )
}
