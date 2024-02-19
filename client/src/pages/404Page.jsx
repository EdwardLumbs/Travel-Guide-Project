import {Link} from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="bg-cover h-screen flex flex-col w-full"
      style={{ backgroundImage: `url('/photos/error.jpg')` }}
    >
      <div className="text-white h-full gap-4 flex flex-col justify-center items-center">
        <h1 className="font-bold text-8xl">
          404 Error
        </h1>
        <p className="text-lg">
          Oops. Looks like you're trying to access a page that doesn't exist
        </p>
        <Link 
          to={'/'}
          className='mt-2 border px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white 
            font-semibold hover:bg-white duration-300 hover:text-blue-800'
        >
          Go back
        </Link>
      </div>
    </div>
  )
}
