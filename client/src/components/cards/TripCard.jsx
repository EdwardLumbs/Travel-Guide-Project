import { MdDelete } from "react-icons/md";

export default function TripCard({trip, openDeleteModal}) {

  console.log(trip)

  return (
    <div className='bg-white shadow-md hover:shadow-lg 
    transition-shadow overflow-hidden rounded-lg w-[250px] p-4'>
      <MdDelete 
          className="ml-auto h-6 w-6 text-red-900 duration-75 hover:text-red-600" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openDeleteModal();
          }}
      />
      <p className='mt-2 text-2xl font-bold line-clamp-1'>
        {trip.title}
      </p>
      <p className='mt-2 text-xl font-semibold'>
        Destination: {trip.destination}
      </p>
      <p className='mt-2 line-clamp-1'>
        Note: {trip.note}
      </p>
    </div>
  )
}
  