import React from 'react';
import PopupWithForm from './PopupWithForm';

function ConfirmDeletePopup(props) {
  function handleSubmit(e) {
    e.preventDefault();
    
    props.onConfirmDeleteSubmit(props.card);
    props.onClose();
  }
  
  return(
    <PopupWithForm
      title='Вы уверены?'
      btnTitle='Да'
      name='confirm'
      isOpen={props.isOpen}
      onClose={props.onClose}
      overlayClick={props.onOverlay}
      onSubmit={handleSubmit}
    />
  )
}

export default ConfirmDeletePopup;