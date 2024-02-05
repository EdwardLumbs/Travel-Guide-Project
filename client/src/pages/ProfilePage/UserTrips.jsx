import { useState } from 'react'
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
        currentDestination={null}
      />
      <div>
        Show your plans here
      </div>
    </div>

  )
}
