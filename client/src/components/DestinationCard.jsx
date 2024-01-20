import { Link } from 'react-router-dom';

export default function DestinationCard({photo, name}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg 
    transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <img 
        className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        src={photo} 
        alt="Cover Image" 
      />
      <p>
        CONTINENT, CHANGE LATER
      </p>
    </div>
  )
}
