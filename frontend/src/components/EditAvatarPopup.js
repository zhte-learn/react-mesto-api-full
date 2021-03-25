import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const avatarLinkInput = React.createRef();

  function handleSubmit(e) {
    e.preventDefault();
  
    props.onUpdateAvatar({
      avatar: avatarLinkInput.current.value,
    });

    props.onClose();
    avatarLinkInput.current.value = '';
  } 

  return (
    <PopupWithForm
      title='Обновить аватар'
      btnTitle='Сохранить'
      name='update-avatar'
      isOpen={props.isOpen}
      onClose={props.onClose}
      overlayClick={props.onOverlay}
      onSubmit={handleSubmit}
    >  
      <input 
        id="url-input"
        name="avatar"
        type="url"
        className="form__input form__input_text_link" 
        placeholder="Ссылка на картинку"
        required
        ref={avatarLinkInput}
      />
      <span id="url-input-error" className="form__input-error"></span>  
    </PopupWithForm>
  ) 
}

export default EditAvatarPopup;