import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);

  const [ name, setName ] = React.useState('');
  const [ description, setDescription ] = React.useState('');

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]); 

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });

    props.onClose();
  } 

  return (
    <PopupWithForm 
        title='Редактировать профиль'
        btnTitle='Сохранить'
        name='edit'
        isOpen={props.isOpen}
        onClose={props.onClose}
        overlayClick={props.onOverlay}
        onSubmit={handleSubmit}
      >
        <input 
          id="name-input" 
          name="name" 
          type="text" 
          className="form__input form__input_text_name" 
          placeholder="Имя" 
          minLength="2" 
          maxLength="40" 
          required 
          onChange={handleChangeName}
          //value={name}
          defaultValue={name}
        />
        <span id="name-input-error" className="form__input-error"></span>

        <input 
          id="about-input" 
          name="about" 
          type="text" 
          className="form__input form__input_text_job" 
          placeholder="Род деятельности" 
          minLength="2" 
          maxLength="200" 
          required 
          onChange={handleChangeDescription}
          defaultValue={description}
        />
        <span id="about-input-error" className="form__input-error"></span>
      </PopupWithForm>
  )
}

export default EditProfilePopup;