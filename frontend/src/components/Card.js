import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card (props) {
  const currentUser = React.useContext(CurrentUserContext); 
  const isOwn = props.owner === currentUser._id;

  const cardDeleteButtonClassName = (
    `button button_action_remove ${isOwn && 'button_action_remove_active'}`
  ); 
  const isLiked = props.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = (
    `button button_action_like ${isLiked && 'button_action_like_active'}`
  );
  
  function handleClick() {
    props.onCardClick(props);
  }

  function handleLikeClick() {
    props.onCardLike(props);
  }

  function handleCardDelete() {
    props.onCardDelete(props);
  }

  return (
    <li className="cards-grid__item">
      <button 
        className={cardDeleteButtonClassName} 
        type="button" 
        aria-label="Удалить карточку"
        onClick={handleCardDelete}>
      </button>
      <figure className="cards-grid__figure">             
        <div className="cards-grid__image-wrapper">
          <img 
            className="cards-grid__image" 
            src={props.link}
            alt={`Изображение ${props.name}`}
            onClick={handleClick}
          />
        </div>
                                      
        <figcaption className="cards-grid__caption">
          <h2 className="cards-grid__caption-title">{props.name}</h2>
          <div className="cards-grid__like-container">
            <button 
              className={cardLikeButtonClassName} 
              type="button" 
              aria-label="Поставить лайк"
              onClick={handleLikeClick}>              
            </button>
            <span className="cards-grid__likes-counter">{props.likes.length}</span>
          </div>
        </figcaption>
      </figure>  
    </li>
  )
}

export default Card;
