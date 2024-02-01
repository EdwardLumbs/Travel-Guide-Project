import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import UploadPicture from '../../components/UploadPicture.jsx';
import BlogTagsComponent from '../../components/BlogTagsComponent.jsx';

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
  const [tag, setTag] = useState([])
  const [coverPhoto, setCoverPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setTag(selected.map((data) => data.label))
  }, [selected])

  const handleChange = (value) => {
    const max = 1000
    const min = 100

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;

    const textContent = tempDiv.textContent || tempDiv.innerText;

    const words = textContent.trim().split(/\s+/);
    console.log(words.length)

    if (words.length < max || words.length > min ) {
      setError(null)
    }

    if (words.length > max) {
      setError('You exceeded the maximum number of words')
      const trimmedWords = words.slice(0, maxWords);
      value = trimmedWords.join(' ');
    }

    if (words.length < min) {
      setError('Write at least 100 words')
    }

    setContent(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!tag || !coverPhoto || !title) {
        setLoading(false)
        setError("You left some fields blank")
        setTimeout(() => {
          setError(null);
        }, 2000);
        return
      }

      const res = await fetch('/api/blogs/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          title,
          place_tag: tag,
          photo: coverPhoto,
          content
        }),
      }) 
      const data = await res.json()

      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }

      setLoading(false)
      navigate('/blogs')
      // create individual blog page

    } catch (error) {
      setError(error.message)
      setTimeout(() => {
        setError(null);
      }, 2000);
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
          required
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
          required
        />
        <ReactQuill 
          value={content} 
          modules={modules} 
          formats={formats}
          required
          onChange={(newValue) => handleChange(newValue)}
        />
        <p>
          Word Count: {content.trim() ? content.trim().split(/\s+/).length : 0} / 1000
        </p>

        {
          loading ? 
            <p>
              Loading...
            </p>
          :
          error ?
            <p>
              {error}
            </p>
          :
          <div>
            <button type='button'>
              Discard
            </button>
            <button>
              Post
            </button>
          </div>
        }
      </form>
    </div>
  )
}
