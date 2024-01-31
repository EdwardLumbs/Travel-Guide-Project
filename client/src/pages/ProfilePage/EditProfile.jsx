import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  updatePasswordFailure, 
  updatePasswordSuccess, 
  deleteUserFailure, 
  deleteUserSuccess, 
  deleteUserStart } from '../../redux/slices/userSlice.js';
import { Link } from 'react-router-dom';
import '../../App.css'
import UploadPicture from '../../components/UploadPicture.jsx';

export default function EditProfile() {
  const {currentUser, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false)

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
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/updateUser/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return
      }
      
      dispatch(updateUserSuccess(data));
      updateUserSuccess(true);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
      }, 2000);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleChange = (e) => {
    if (e.target.id === 'user_iata') {
      setFormData({
        ...formData,
        'user_iata': e.target.value.toUpperCase()
      })
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }
  
  const handleUserDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.id}`, {
        method: 'DELETE'
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
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
          <label for="from">from</label>
          <input 
            className='border border-black px-3 py-2 rounded-lg'
            type="text" 
            placeholder='Name' 
            id="from" 
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
            type="text" 
            placeholder='Enter the IATA code near you' 
            id="user_iata" 
            maxLength="3"
            onChange={handleChange}
            defaultValue={currentUser.user_iata || ''}
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

          {error ? <p className='text-red-500 mt-5'>{error}</p> :
            uploadSuccess ? <p className='text-green-500 mt-5'>Upload Successful!</p> : ''
          }
        </div>

        {/* right */}
        <div className='flex-1 flex gap-2 flex-col items-center justify-center'>
          <img 
            className='rounded-full h-40 w-40 object-cover'
            src={formData.photo || currentUser.photo}
            alt="Profile Picture" 
          />
          <UploadPicture
            setCoverPhoto={null}
            formData = {formData}
            setFormData={setFormData}
          />

          <div className='flex gap-2 mt-4'>
            <button 
              disabled={disabled}
              className='disabled:opacity-80 border hover:cursor-pointer hover:text-blue-600 hover:bg-white duration-100 font-semibold border-black py-1 px-2 rounded-full bg-blue-600 text-white'
            >
              Save Changes
            </button>

            <Link to='/profile'>
              <button 
                type="button"
                className='border hover:cursor-pointer hover:text-red-600 hover:bg-white duration-100 font-semibold border-black py-1 px-2 rounded-full bg-red-600 text-white'
              >
                Cancel
              </button>
            </Link>
            
            <button 
              onClick={handleUserDelete}
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
