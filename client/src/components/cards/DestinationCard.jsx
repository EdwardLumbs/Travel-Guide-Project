export default function DestinationCard({destination}) {
  console.log(destination);
  return (
    <div className='bg-white shadow-md hover:shadow-lg 
    transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
      <img 
        className='h-[320px] md:h-[220px] w-[500px] md:w-full object-cover hover:scale-105 transition-scale duration-300'
        src={destination.photo || destination.continent_photo} 
        alt="Cover Image" 
      />
      {destination.country && 
        <p className='text-lg px-4 pt-2 font-semibold'>
          {destination.continent_name}
        </p>
      }
      <p className={`${destination.country ? 'pb-2' : 'py-2'} text-2xl font-bold px-4`}>
        {destination.country || destination.continent_name}
      </p>
    </div>
  )
}
