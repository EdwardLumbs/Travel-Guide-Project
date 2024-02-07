import React from 'react'

export default function Hero({image}) {
  return (
    <div 
        className='relative bg-cover bg-center h-96 object-fill'  
        style={{ backgroundImage: `url(${image})` }}>
        <div className="container mx-auto px-4">

        </div>
    </div>
  )
}
