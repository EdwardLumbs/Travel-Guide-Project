import { FcGoogle } from "react-icons/fc";

export default function OAuth() {

    const handleClick = () => {
        console.log('printed');
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
