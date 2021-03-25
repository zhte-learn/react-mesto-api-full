import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const [ placeName, setPlaceName ] = React.useState('');
  const [ placeUrl, setPlaceUrl ] = React.useState('');

  function handleChangePlaceName(e) {
    setPlaceName(e.target.value);
  }

  function handleChangePlaceUrl(e) {
    setPlaceUrl(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlaceSubmit({
      name: placeName,
      link: placeUrl,
    });

    props.onClose();
    
    setPlaceName('');
    setPlaceUrl('');
  }

  return(
    <PopupWithForm
        title='Новое место'
        btnTitle='Создать'
        name='add'
        isOpen={props.isOpen}
        onClose={props.onClose}
        overlayClick={props.onOverlay}
        onSubmit={handleSubmit}
      >
        <input
          id="name-input"
          name = "name"
          type="text"
          className="form__input form__input_text_place" 
          placeholder="Название"
          minLength="1"
          maxLength="30"
          required
          onChange={handleChangePlaceName}
          value={placeName}
        />
        <span id="name-input-error" className="form__input-error"></span>

        <input
          id="url-input"
          name = "link"
          type="url"
          className="form__input form__input_text_link" 
          placeholder="Ссылка на картинку"
          required
          onChange={handleChangePlaceUrl}
          value={placeUrl}
        />
        <span id="url-input-error" className="form__input-error"></span>       
      </PopupWithForm>
  )
}

export default AddPlacePopup;