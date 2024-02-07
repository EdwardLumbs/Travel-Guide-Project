export default function DestinationCard({destination}) {
  console.log(destination)
  return (
    <div className='bg-white shadow-md hover:shadow-lg 
    transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
      <img 
        className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        src={destination.photo || destination.continent_photo} 
        alt="Cover Image" 
      />
      {destination.country && 
        <p>
          {destination.continent_name}
        </p>
      }
      <p className='text-2xl font-semibold'>
        {destination.country || destination.continent_name}
      </p>
    </div>
  )
}
