import React from 'react';
import signSuccess from '../images/sign-success.svg';
import signNotSuccess from '../images/sign-not-success.svg';

function InfoTooltip (props) {
  return (
    <div className={ `popup ${props.isOpen && 'popup_opened'}` } onClick={props.onOverlay}>
      <div className="popup__container popup__container_with-form popup__container_sign-message">
        <button
          className="popup__close"
          type="button"
          aria-label="Закрыть попап"
        >
        </button>

        <>
          <img src={props.isSuccess ? signSuccess : signNotSuccess} alt="Изображение статуса ошибки"></img>
          <p className="popup__text">{props.isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте еще раз'}</p>
        </>
      </div>
    </div>
  )
}

export default InfoTooltip;
