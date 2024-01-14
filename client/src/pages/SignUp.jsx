import { Link } from "react-router-dom"
import OAuth from "../components/OAuth"

export default function SignUp() {
  return (
    // change accent colors based on the schema
    <div className='bg-green-200 h-screen flex justify-center items-center'>
      <div className='bg-white p-6 rounded-xl w-80'>
        <div className='flex flex-col gap-5 items-center border-b-2 border-slate-700 pb-6'>
          <h1>
            EDWARD'S TRAVEL GUIDE
          </h1>
          <p className='text-xl'>
            Welcome!
          </p>
        </div>

        <form className='mt-6 flex flex-col gap-4 items-center'>
          <h1 className='font-semibold text-xl'>
            Sign Up
          </h1>
          <input 
            className='border p-3 rounded-md border-slate-700 w-full'
            type="text" 
            placeholder='Username'
            id='username'
            required
          />
          <input 
            className='border p-3 rounded-md border-slate-700 w-full'
            type="text" 
            placeholder='Email Address'
            id='email'
            required
          />
          <input 
            className='border p-3 rounded-md border-slate-700 w-full'
            type="password" 
            placeholder='Password'
            id='password'
            required
          />
          <h1 className=''>
            or
          </h1>

          <OAuth/>

          <button 
            className="bg-blue-700 w-full p-3 font-semibold rounded-xl text-white hover:opacity-95">
            CONTINUE
          </button>

        </form>

        <div className="flex gap-2 mt-5 justify-center">
          <p>Already have an account?</p>
          <Link to='/login'>
            <span className="text-blue-900 hover:text-blue-500">Log in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
