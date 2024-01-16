export default function Profile() {
  const handleSignOut = () => {

  }

  return (
    <div className='h-screen flex justify-center pt-11'>
      <div className='bg-slate-50 h-80 w-full max-w-7xl px-10 rounded-xl flex flex-col items-center justify-center'>
        {/* profile details */}
        {/* change max width? */}
        {/* insert profile picture with props */}
        {/* change background to picture and profile color to color accents */}
        <div className='flex gap-20'>
          <div className='flex flex-col gap-5 justify-center items-center'>
            <img 
              src='./travel-photo.jpg' 
              alt="profile picture" 
              className='rounded-full h-40 w-40 object-cover'
            />
            <div className="flex gap-2">
              <button
                className="text-white hover:cursor-pointer hover:text-blue-600 font-semibold duration-100 hover:bg-white border border-black px-4 py-1 rounded-full bg-blue-600"
              >
                Edit Profile
              </button>
              <button
                className="text-white hover:cursor-pointer hover:text-red-600 font-semibold duration-100 hover:bg-white border border-black px-4 py-1 rounded-full bg-red-600"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
            
          </div>
          <div className='flex flex-col'>
            <h1 className='text-4xl basis-full'>Edward ewrfwe</h1>
            <p className='basis-full'>Lorem ipsum dolor sit amet consectetur adipisicing el</p>
            <div className='flex gap-8 flex-1 basis-full'>
              <div className='basis-full'>
                <p className='text-sm'>Travel Plans:</p>
                <p className='text-3xl'>0</p>
              </div>
              <div className='basis-full'>
                <p className='text-sm'>Blogs:</p>
                <p className='text-3xl'>0</p>
              </div>
              <div className='basis-full'>
                <p className='text-sm'>Reviews:</p>
                <p className='text-3xl'>0</p>
              </div>
            </div>
          </div>
          
  

        </div>

      </div>
    </div>
  )
}
