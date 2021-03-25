function PopupWithForm ( {title, children, btnTitle, name, isOpen, onClose, overlayClick, onSubmit} ) {

  return (
    <div className={ `popup popup_${name} ${isOpen && 'popup_opened'}` } onClick={overlayClick}>
      <div className="popup__container popup__container_with-form"> 
        <button
          className="popup__close"
          type="button"
          aria-label="Закрыть попап"
          onClick={onClose}>
        </button>
          
        <form className={`form form_${name}`} method="POST" name={`${name}Form`} noValidate onSubmit={onSubmit}>  
          <h3 className="popup__title form__title">{title}</h3>
          {children}
          <button className="form__button" type="submit">{btnTitle}</button>
        </form>

      </div>
    </div>
  )
}

export default PopupWithForm;
