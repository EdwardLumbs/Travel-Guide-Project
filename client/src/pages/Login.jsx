import { Link } from "react-router-dom"
import OAuth from "../components/OAuth"

export default function Login() {
  return (
    // change accent colors based on the schema
    <div className='bg-green-200 h-screen flex justify-center items-center'>
      <div className='bg-white p-6 rounded-xl w-80'>
        <div className='flex flex-col gap-5 items-center border-b-2 border-slate-700 pb-6'>
          <div className="text-2xl">
            <span className="font-logo font-extrabold text-green-700">
              Edward's
            </span>
            <span className="font-logo text-green-700">
              TravelGuide
            </span>
          </div>
          <p className='text-xl'>
            Welcome Back!
          </p>
        </div>

        <form className='mt-6 flex flex-col gap-4 items-center'>
          <h1 className='font-semibold text-xl'>
            Log in
          </h1>
          <input 
            className='border p-3 rounded-lg border-slate-700 w-full'
            type="text" 
            placeholder='Email Address'
            id='email'
            required
          />
          <input 
            className='border p-3 rounded-lg border-slate-700 w-full'
            type="password" 
            placeholder='Password'
            id='password'
            required
          />
          <h1 className=''>
            or
          </h1>

          <OAuth/>

          <button className="bg-blue-700 w-full p-3 font-semibold rounded-xl text-white hover:opacity-95">
            CONTINUE
          </button>

        </form>

        <div className="flex gap-2 mt-5 justify-center">
          <p>Don't have an account?</p>
          <Link to='/sign-up'>
            <span className="text-blue-900 hover:text-blue-500">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
