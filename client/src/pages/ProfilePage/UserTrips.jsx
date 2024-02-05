import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useGetCountry from '../../hooks/useGetCountry'
import useGetContinent from '../../hooks/useGetContinent'
import SearchFilterResults from '../../components/SearchFilterResults';
import Attractions from '../../components/Attractions'
import TripModal from '../../components/TripModal';

export default function UserTrips() {
  const [isModalOpen, setModalOpen] = useState(false);


  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  return (
    <div>
      <button onClick={openModal}>
        Plan a trip
      </button>
    
      <TripModal  
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      <div>
        Show your plans here
      </div>
    </div>

  )
}
