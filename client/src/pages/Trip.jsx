import React, { useEffect } from 'react'

export default function Trip() {

  useEffect(() => {
    const getTrip = async() => {
      try {
        const res = await fetch('/api/getTrip')
      } catch (error) {
        
      }
    }
  }, [])

  return (
    <div>UserTrip</div>
  )
}
