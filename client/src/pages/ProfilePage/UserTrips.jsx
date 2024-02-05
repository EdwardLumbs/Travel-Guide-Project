import { useState } from 'react'
import TripModal from '../../components/TripModal';
import { useSelector } from 'react-redux';

export default function UserTrips() {
  const {currentUser} = useSelector((state) => state.user);
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(currentUser)
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
        user_id={currentUser.id}
      />
      <div>
        Show your plans here
      </div>
    </div>

  )
}
