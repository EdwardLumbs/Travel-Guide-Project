import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, updatePasswordFailure, updatePasswordSuccess } from '../redux/slices/userSlice.js';
import { CiCirclePlus } from "react-icons/ci";

export default function EditProfile() {
  const {currentUser, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [disabled, setDisabled] = useState(false);

  console.log(formData)

  useEffect(() => {
    if (formData.newPassword != formData.confirmNewPassword){
      setDisabled(true)
      dispatch(updatePasswordFailure('New Password does not match'));
    } else {
      setDisabled(false);
      dispatch(updatePasswordSuccess());
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart)

      const res = await fetch(`/api/user/updateUser/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    } catch (error) {
      dispatch(updateUserFailure(err.message))
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    // change accent colors to color schema
    // change fonts and style
    <div className='bg-blue-50 w-full min-w-min max-w-7xl py-10 px-10 rounded-xl flex flex-col'>
      <h1 className='mb-5 text-3xl'>Edit Profile</h1>
      <form 
        onSubmit={handleSubmit}
        className='flex gap-4 min-w-min max-w-7xl'
      >
        {/* left */}
        <div className='flex flex-col gap-4 flex-1 w-[400px]'>
          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="text" 
            placeholder='Name' 
            id="username" 
            onChange={handleChange}
            defaultValue={currentUser.username}
          />

          <textarea
            type="text" 
            placeholder='Description'
            className='border border-black px-3 py-2 rounded-lg'
            id='description'
            onChange={handleChange}
            defaultValue={currentUser.description || ''}
          />

          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="password" 
            placeholder='Enter new password' 
            id="newPassword" 
            onChange={handleChange}
          />

          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="password" 
            placeholder='Confirm your new password' 
            id="confirmNewPassword" 
            onChange={handleChange}
          />

          {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>

        {/* right */}
        <div className='flex-1 flex gap-2 flex-col items-center justify-center'>
          <img 
            className='rounded-full h-40 w-40'
            src={currentUser.photo}
            alt="Profile Picture" 
          />
          <button 
            className='flex items-center gap-2 text-blue-400'
          >
            <CiCirclePlus className='scale-150'/>
            Upload New Profile Picture
          </button>

          <div className='flex gap-2 mt-4'>
            <button 
              disabled={disabled}
              className='disabled:opacity-80 border hover:cursor-pointer hover:text-blue-600 hover:bg-white duration-100 font-semibold border-black py-1 px-2 rounded-full bg-blue-600 text-white'
            >
              Save Changes
            </button>

            <button 
              type="button"
              className='border hover:cursor-pointer hover:text-red-600 hover:bg-white duration-100 font-semibold border-black py-1 px-2 rounded-full bg-red-600 text-white'
            >
              Cancel
            </button>

            <button 
              type="button"
              className='border hover:cursor-pointer hover:text-gray-600 hover:bg-white duration-100 font-semibold border-black py-1 px-2 rounded-full bg-gray-600 text-white'
            >
              Delete account
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
