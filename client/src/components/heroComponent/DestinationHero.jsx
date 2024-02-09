export default function DestinationHero({image}) {
  return (
    <div 
      className='relative bg-cover h-[600px] lg:shadow-lg
      object-fill lg:rounded-3xl mx-0 lg:mt-4 lg:mx-4 lg:bg-top'  
      style={{ backgroundImage: `url(${image})` }}
    >
    </div>
  )
}
