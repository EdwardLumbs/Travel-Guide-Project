import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import UploadPicture from '../components/UploadPicture.jsx';
import BlogTagsComponent from '../components/BlogTagsComponent.jsx';

const modules = {
  toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

const formats = [
'header',
'bold', 'italic', 'underline', 'strike', 'blockquote',
'list', 'bullet', 'indent',
'link', 'image'
];

const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/edward-travel-guide.appspot.com/o/1156px-Picture_icon_BLACK.svg.png?alt=media&token=ae839113-7d78-4df7-8f01-fcb929167ed5'

export default function CreateBlogPost() {
  const {currentUser} = useSelector((state) => state.user);

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selected, setSelected] = useState([])
  const [coverPhoto, setCoverPhoto] = useState(null)
  console.log(content)
  console.log(currentUser)
  console.log(selected)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/blogs/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          title,
          place_tag,
          photo: coverPhoto,
          content
        }),
      }) 
    } catch (error) {
      
    }
  }
  
  return (
    <div className=''>
      <form 
        onSubmit={handleSubmit}
        className='flex flex-col'
      >
        <input 
          type="title" 
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <img 
          className='h-40 w-40 object-cover'
          src={coverPhoto || defaultImage}
          alt="Cover Picture" 
        />
        <UploadPicture 
          setCoverPhoto={setCoverPhoto}
          formData={null}
          setFormData={null}
        />
        <BlogTagsComponent 
          selected={selected}
          setSelected={setSelected}
        />
        <ReactQuill 
          value={content} 
          modules={modules} 
          formats={formats}
          onChange={(newValue) => setContent(newValue)}
        />
        <button type='button'>
          Discard
        </button>
        <button>
          Post
        </button>
      </form>
    </div>
  )
}
