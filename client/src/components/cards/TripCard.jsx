import { MdDelete } from "react-icons/md";

export default function TripCard({trip, handleDelete}) {

  console.log(trip)

  return (
    <div className='bg-white shadow-md hover:shadow-lg 
    transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
      <MdDelete 
          className="ml-auto h-6 w-6 text-red-900 duration-75 hover:text-red-600" 
          onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDelete(trip.id)
          }}
      />
      <p className='text-lg px-4 pt-2 font-semibold'>
        {trip.title}
      </p>
      <p className='text-lg px-4 pt-2 font-semibold'>
        {trip.destination}
      </p>
      <p className={`text-2xl font-bold px-4`}>
        {trip.note}
      </p>
    </div>
  )
}
  