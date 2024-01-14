import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase'
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const navigate = useNavigate()

    const handleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username: result.user.displayName,
                  email: result.user.email,
                  photo: result.user.photoURL
                })
            })
      
            const data = await res.json()

            console.log(data);
            navigate('/')
        } catch (error) {
            console.log("Could not sign in with Google", error)
        }
    }

  return (
    <button 
        type="button"
        onClick={handleClick}
        className='flex items-center justify-center gap-3 border rounded-md p-3 w-full border-slate-700'
    >
        <FcGoogle className="scale-150"/>
        <p>
            Sign in with Google
        </p>
    </button>
  )
}
