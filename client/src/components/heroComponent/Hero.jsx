import React from 'react'

export default function Hero({image, content, home}) {
  console.log(home)
  return (
    <div 
      className={`relative bg-cover bg-center ${home ? 'h-[800px]' : 'h-[450px]'} object-fill`}  
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="flex items-center container h-full mx-auto px-4 py-7">
        <p className='text-6xl text-white font-bold'>
          {content}
        </p>
      </div>
    </div>
  )
}
