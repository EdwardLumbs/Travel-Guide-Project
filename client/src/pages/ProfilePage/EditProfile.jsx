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
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css'
import UploadPicture from '../../components/UploadPicture.jsx';
import DeleteModal from '../../components/DeleteModal.jsx';

export default function EditProfile() {
  const {currentUser, error} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
  });
  const [disabled, setDisabled] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const [openedDeleteModalId, setOpenedDeleteModalId] = useState(null);

  const navigate = useNavigate()

  const openDeleteModal = (currentUserId) => {
    setOpenedDeleteModalId(currentUserId);
  };  

  const closeDeleteModal = () => {
    setOpenedDeleteModalId(null);
  };

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
        setTimeout(() => {
          dispatch(updateUserStart());
        }, 2000);
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
      setTimeout(() => {
        dispatch(updateUserStart());
      }, 2000);
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
    navigate('/login')
  }

  return (
    // change accent colors to color schematext-lg 
    // change fonts and style
    <div className='w-full min-w-min max-w-7xl p-7 rounded-xl flex flex-col'>
      <h1 className='text-5xl font-bold'>
        Edit Profile
      </h1>
      <form 
        onSubmit={handleSubmit}
        className='min-w-min max-w-7xl mt-4'
      >
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
        </div>

        <div className='flex flex-col gap-4 flex-1 w-full mt-4'>
          <input 
            className='text-lg border border-black px-3 py-2 rounded-lg'
            type="text" 
            placeholder='Name' 
            id="username" 
            onChange={handleChange}
            defaultValue={currentUser.username}
          />

          <textarea
            type="text" 
            placeholder='Description'
            className='text-lg border border-black px-3 py-2 rounded-lg'
            id='description'
            onChange={handleChange}
            defaultValue={currentUser.description || ''}
          />

          <input 
            className='text-lg border border-black px-3 py-2 rounded-lg'
            type="text" 
            placeholder='Enter the IATA code near you' 
            id="user_iata" 
            maxLength="3"
            onChange={handleChange}
            defaultValue={currentUser.user_iata || ''}
          />

          <input 
            className='text-lg border border-black px-3 py-2 rounded-lg'
            type="password" 
            placeholder='Enter new password' 
            id="newPassword" 
            onChange={handleChange}
          />

          <input 
            className='text-lg border border-black px-3 py-2 rounded-lg'
            type="password" 
            placeholder='Confirm your new password' 
            id="confirmNewPassword" 
            onChange={handleChange}
          />

          {error ? <p className='text-red-500 mt-5'>{error}</p> :
            uploadSuccess ? <p className='text-green-500 mt-5'>Upload Successful!</p> : ''
          }
        </div>

        <div className='flex flex-col gap-2 mt-4'>
          <button 
            disabled={disabled}
            className='text-lg w-full disabled:opacity-80 hover:cursor-pointer hover:text-blue-600 
              hover:bg-white duration-100 font-semibold border-black py-2 px-2 rounded-full 
              bg-blue-600 text-white'
          >
            Save Changes
          </button>
          <Link 
            to='/profile'
            className='text-lg hover:cursor-pointer hover:text-red-600 hover:bg-white 
                duration-100 font-semibold border-black py-2 px-2 rounded-full bg-red-600 
              text-white text-center'
          >
            <button 
              type="button"
            >
              Cancel
            </button>
          </Link>

          <DeleteModal  
            blogId={currentUser.id}
            isOpen={openedDeleteModalId === currentUser.id}
            onClose={closeDeleteModal}
            handleDelete={handleUserDelete}
          />
          
          <button 
            onClick={() => openDeleteModal(currentUser.id)}
            type="button"
            className='text-lg hover:cursor-pointer hover:text-gray-600 hover:bg-white duration-100 
              font-semibold border-black py-2 px-2 rounded-full bg-gray-600 text-white w-full'
          >
            Delete account
          </button>
        </div>
      </form>
    </div>
  )
}
