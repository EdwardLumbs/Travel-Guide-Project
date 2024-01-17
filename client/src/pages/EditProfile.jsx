import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  updatePasswordFailure, 
  updatePasswordSuccess, 
  deleteUserFailure, 
  deleteUserSuccess, 
  deleteUserStart } from '../redux/slices/userSlice.js';
import { CiCirclePlus } from "react-icons/ci";
import { v4 } from 'uuid'
import { Link } from 'react-router-dom';

export default function EditProfile() {
  const {currentUser, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fileRef = useRef(null);

  const [formData, setFormData] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [imageFile, setImageFile] = useState(undefined);
  const [imageFilePercentage, setImageFilePercentage] = useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false)

  console.log(formData)

  useEffect(() => {
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  }, [imageFile]);

  const handleFileUpload = (imageFile) => {
    const storage = getStorage(app)
    const fileName = imageFile.name + v4()
    const storageRef = ref(storage, `profile-picture/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred /
        snapshot.totalBytes) * 100
        setImageFilePercentage(Math.round(progress))
      },
      (error) => {
      setImageFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
              setImageFileUploadError(false)
              setFormData({...formData, photo: downloadURL})
          }
        )
      }
    )

  }

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
      setUploadSuccess(true)
      dispatch(updateUserSuccess(data));
      updateUserSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
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
          {imageFileUploadError ? 
            <span className='text-red-700'>
              Error in Image Upload (image must be less than 2mb)
            </span> :
            imageFilePercentage > 0 && imageFilePercentage < 100 ? (
              <span className='text-slate-700'>
                {`Uploading ${imageFilePercentage}%`}
              </span>
            ) :
            imageFilePercentage === 100 ? (
              <span className='text-green-700'>
                Upload Successful!
              </span>
            ) : ""
          } 
          <input 
            onChange={(e) => setImageFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept='image/*' 
          />
          <button 
            type='button'
            onClick={() => fileRef.current.click()}
            className='flex items-center gap-2 text-blue-400 hover:opacity-80 hover:underline'
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
