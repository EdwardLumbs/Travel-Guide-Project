import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { signUpStart, signUpSuccess, signUpFailure } from '../redux/slices/userSlice.js'
import OAuth from "../components/OAuth";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signUpStart())
      const res = await fetch('/api/auth/signup', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }) 
      const data = await res.json();

      if (data.success === false) {
        dispatch(signUpFailure(data.message))
        return;
      }

      console.log(data);

      try {
        const res = await fetch('/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
        const data = await res.json();
  
        if (data.success === false) {
          return;
        }
        
        dispatch(signUpSuccess(data))
        navigate('/profile');
        console.log(data);
  
      } catch (error) {
        dispatch(signUpFailure(error.message))
      }

    } catch (error) {
      dispatch(signUpFailure(error.message))
    }
  }


  return (
    // change accent colors based on the schema
    <div 
      className='bg-cover h-screen flex justify-center items-center'
      style={{ backgroundImage: `url('/photos/login.jpg')` }}
    >
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
            Welcome!
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className='mt-6 flex flex-col gap-4 items-center'
        >
          <h1 className='font-semibold text-xl'>
            Sign Up
          </h1>
          <input 
            className='border p-3 rounded-md border-slate-700 w-full'
            type="text" 
            placeholder='Username'
            id='username'
            onChange={handleChange}
            required
          />
          <input 
            className='border p-3 rounded-md border-slate-700 w-full'
            type="text" 
            placeholder='Email Address'
            id='email'
            onChange={handleChange}
            required
          />
          <input 
            className='border p-3 rounded-md border-slate-700 w-full'
            type="password" 
            placeholder='Password'
            id='password'
            onChange={handleChange}
            required
          />
          <h1 className=''>
            or
          </h1>

          <OAuth/>

          <button 
            disabled={loading}
            className="bg-blue-700 w-full p-3 font-semibold rounded-xl text-white hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'LOADING...' : 'CONTINUE'}
          </button>

          {error && <p className="text-red-500 mt-5 font-semibold">{error}</p>}

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
