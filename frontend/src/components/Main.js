import React from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main (props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__content"> 
          <div className="profile__avatar-container">  
            <div 
              className="profile__image" 
              style={{ backgroundImage: `url(${currentUser.avatar})` }} 
              alt={`Изображение ${currentUser.name}`}>
            </div>
            <button className="button button_action_update-avatar" onClick={props.onEditAvatar}></button>
          </div>
          <div className="profile__info">                       
            <h1 className="profile__name">{currentUser.name}</h1>
            <button className="button button_action_edit" onClick={props.onEditProfile} type="button" 
              aria-label="Открыть форму редактирования"></button>                      
            <p className="profile__job">{currentUser.about}</p>
          </div>
        </div>

        <button className="button button_action_add" onClick={props.onAddPlace} 
          type="button" aria-label="Добавить информацию"></button>
      </section>

      <section className="cards-grid">
        <ul className="cards-grid__list">
          {
            props.cards.map(({ _id, ...rest}) => (
              <Card key={_id} _id={_id} {...rest} 
                onCardClick={props.onCardClick} 
                onCardLike={props.onCardLike} 
                onCardDelete={props.onCardDelete}/>
            )
            )}
        </ul>
      </section>      
    </main>
  )
}

export default Main;
