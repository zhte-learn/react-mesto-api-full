function ImagePopup ({ card, onClose, overlayClick }) {

  return (
    <div className={`popup popup_pic ${(card != null) && 'popup_opened'}`} onClick={overlayClick}>
      <div className="popup__container">
        <button
          className="popup__close"
          type="button"
          aria-label="Закрыть попап"
          onClick={onClose}>
        </button>

        <figure className="figure-pic">         
          <img 
            className="figure-pic__image" 
            src={card ? card.link : ''}
            alt={card ? card.name : ''}
          />
          <figcaption className="figure-pic__figcaption">
            {card ? card.name : ''}
          </figcaption>
        </figure>
      </div>                                              
    </div>
  )
}

export default ImagePopup;