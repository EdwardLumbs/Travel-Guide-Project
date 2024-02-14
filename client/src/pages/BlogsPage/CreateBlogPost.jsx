import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import UploadPicture from '../../components/UploadPicture';
import BlogTagsComponent from '../../components/BlogTagsComponent';
import Hero from '../../components/heroComponent/Hero';
import wordsCount from 'words-count';

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

const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/edward-travel-guide.appspot.com/o/1156px-Picture_icon_BLACK.svg.png?alt=media&token=ae839113-7d78-4df7-8f01-fcb929167ed5';

export default function CreateBlogPost() {
  const {currentUser} = useSelector((state) => state.user);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selected, setSelected] = useState([]);
  const [tag, setTag] = useState([]);
  const [count, setCount] = useState(0);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTag(selected.map((data) => data.label));
  }, [selected]);

  const handleChange = (value) => {
    const max = 1000
    const min = 100

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;

    const textContent = tempDiv.textContent || tempDiv.innerText;

    const words = textContent.trim().split(/\s+/);
    const wordsCountResult = wordsCount(words, {punctuationAsBreaker: true});
    console.log(wordsCountResult)
    setCount(wordsCountResult)

    if (wordsCountResult < max || wordsCountResult > min) {
      setError(null)
    }

    if (wordsCountResult > max) {
      setError('You exceeded the maximum number of words')
      const trimmedWords = words.slice(0, maxWords);
      value = trimmedWords.join(' ');
    }

    if (wordsCountResult < min && wordsCountResult !== 0) {
      setError('Write at least 100 words')
    }

    setContent(value);
  }

  const handleDiscard = () => {
    navigate('/blogs')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!tag || !coverPhoto || !title) {
        setLoading(false)
        setError("You left some fields blank")
        setTimeout(() => {
          setError(null);
        }, 2000);
        return
      };
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
        })
      }) ;
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }
      setLoading(false);
      navigate(`/blogs/${data.id}`);

    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  }
  
  return (
    <div className=''>
      <Hero image={"../photos/create-blog.jpg"}/>
      <div className='mt-5 container mx-auto px-4 mb-5'>
        <form 
          onSubmit={handleSubmit}
          className='lg:flex lg:gap-4'
        >
          <div className='hidden lg:flex max-h-max w-96 flex-col items-center justify-items-start'>
            <img 
              className='h-64 object-cover'
              src={coverPhoto || defaultImage}
              alt="Cover Picture" 
            />
            <UploadPicture 
              setCoverPhoto={setCoverPhoto}
              formData={null}
              setFormData={null}
            />
            <div className='mt-7 w-full flex flex-col gap-1'>
              <button
                disabled={loading || error}
                className='disabled:bg-slate-500 disabled:text-slate-400 disabled:border-slate-500 
                  border px-6 py-2 rounded-full 
                  border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
              >
                Post
              </button>
              <button 
                type='button'
                disabled={loading}
                onClick={handleDiscard}
                className='disabled:bg-slate-500 disabled:text-slate-400 disabled:border-slate-500
                  border px-6 py-2 rounded-full 
                border-red-800 bg-red-800 text-white font-semibold hover:bg-white duration-300 hover:text-red-800'
              >
                Discard
              </button>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <input 
              className='border placeholder-slate-500 border-slate-300 
                rounded-md p-2 text-lg font-bold w-full'
              type="title" 
              placeholder='Title'
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className='lg:hidden flex flex-col justify-center items-center'>
              <img 
                className='w-64 object-cover'
                src={coverPhoto || defaultImage}
                alt="Cover Picture" 
              />
              <UploadPicture 
                setCoverPhoto={setCoverPhoto}
                formData={null}
                setFormData={null}
              />
            </div>
            <div className='font-bold w-full'>
              <BlogTagsComponent 
                selected={selected}
                setSelected={setSelected}
                required
              />
            </div>
            <div>
              <ReactQuill 
                className=""
                value={content} 
                modules={modules} 
                formats={formats}
                required
                onChange={(newValue) => handleChange(newValue)}
              />
            </div>
            <div className='flex gap-4 items-center ml-auto'>
              <div>
                { loading ? 
                    <p>
                      Loading...
                    </p>
                  :
                  error &&
                    <p className='text-red-500 font-bold'>
                      {error}
                    </p>
                }
              </div>
              <p className='font-semibold text-sm text-gray-400'>
                Word Count: {count} / 1000
              </p>
            </div>
            
            <div className='lg:hidden'>
              <div className='mt-7 mr-auto flex flex-col gap-1'>
                <button
                  disabled={loading || error}
                  className='disabled:bg-slate-500 disabled:text-slate-400 disabled:border-slate-500 
                  border px-6 py-2 rounded-full 
                  border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
                >
                  Post
                </button>
                <button 
                  type='button'
                  disabled={loading}
                  className='border px-6 py-2 rounded-full border-red-800 bg-red-800 text-white font-semibold hover:bg-white duration-300 hover:text-red-800'
                >
                  Discard
                </button>
                
              </div>  
            </div>
          </div>
        </form>
      </div>
      
    </div>
  )
}
