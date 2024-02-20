import { MdOutlineClose } from "react-icons/md";

export default function DeleteModal({ blogId, isOpen, onClose, handleDelete }) {
    if (!isOpen) return null;
    console.log(blogId);

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className="bg-white max-w-max mx-4 lg:mx-0 p-7 rounded-md flex flex-col items-center">
                <MdOutlineClose 
                  onClick={onClose}
                  className='ml-auto scale-150 hover:cursor-pointer text-slate-600 hover:text-black'
                />
                <h1
                    className="mt-4 font-bold text-2xl"
                >
                    Are you sure you want to delete?
                </h1>
                <div className="flex flex-col w-full gap-1 mt-4">
                    <button    
                        className='border px-6 py-2 rounded-full border-red-800 bg-red-800 text-white font-semibold hover:bg-white duration-300 hover:text-red-800'                
                        onClick={() => handleDelete(blogId)}
                    >
                        Yes
                    </button>
                    <button
                        className='border px-6 py-2 rounded-full border-blue-800 bg-blue-800 text-white font-semibold hover:bg-white duration-300 hover:text-blue-800'
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}
