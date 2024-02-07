import { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { CiCirclePlus } from "react-icons/ci";
import { v4 } from 'uuid';

export default function UploadPicture ({setCoverPhoto, formData, setFormData}) {
    const fileRef = useRef(null);
  
    const [imageFile, setImageFile] = useState(undefined);
    const [imageFilePercentage, setImageFilePercentage] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState(false);

    useEffect(() => {
        if (imageFile) {
          handleFileUpload(imageFile);
          console.log(imageFile)
        }
    }, [imageFile]);

    const handleFileUpload = (imageFile) => {
        const storage = getStorage(app)
        const fileName = imageFile.name + v4()
        console.log(fileName)
        let storageRef
        if (setFormData === null) {
            storageRef = ref(storage, `blog-picture/${fileName}`)
        } else {
            storageRef = ref(storage, `profile-picture/${fileName}`)
        }
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred /
              snapshot.totalBytes) * 100
              setImageFilePercentage(Math.round(progress))
            },
            (error) => {
                console.log(error)
                setImageFileUploadError(true)
                setTimeout(() => {
                    setImageFileUploadError(false)
                    setImageFilePercentage(0)
                  }, 2000);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                        if (setFormData === null) {
                            setCoverPhoto(downloadURL)
                        } else {
                            setFormData({...formData, photo: downloadURL})
                        }
                    }
                )
            }
        )
    }
    
    return (
        <div>
            {imageFileUploadError ? 
                <span className='text-red-700'>
                    {setFormData === null ? 
                        'Error in Image Upload (image must be less than 5mb)'
                        : 
                        'Error in Image Upload (image must be less than 2mb)'
                    }
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
                {setFormData ? 
                    'Upload New Profile Picture'
                :
                    'Upload Cover Photo'
                }
            </button>
        </div>
    )
}
