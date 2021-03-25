import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ImagePopup from './ImagePopup';
import api from '../utils/api.js';
import auth from '../utils/auth.js';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [ isEditProfilePopupOpen, setIsEditProfilePopupOpen ] = React.useState(false);
  const [ isAddPlacePopupOpen, setIsAddPlacePopupOpen ] = React.useState(false);
  const [ isEditAvatarPopupOpen, setIsEditAvatarPopupOpen ] = React.useState(false);
  const [ isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen ] = React.useState(false);
  const [ selectedCard, setSelectedCard ] = React.useState(null); 
  const [ cardToDelete, setCardToDelete ] = React.useState(null);
  const [ currentUser, setCurrentUser ] = React.useState('');
  const [ cards, setCards ] = React.useState([]);
  const [ isLoggedIn, setIsLoggedIn ] = React.useState(false);
  const [ isInfoTooltipOpen, setIsInfoTooltipOpen ] = React.useState(false);
  const [ isRegisterSuccess, setIsRegisterSuccess ] = React.useState(false);
  const [ email, setEmail ] = React.useState('');
  const history = useHistory();

  React.useEffect(() => {
    if (isLoggedIn) {
      api.getUserData()
      .then(userData => {
        setCurrentUser(userData);
      })
      .catch((error) => alert(error)) 
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (isLoggedIn) {
      api.getAllCards()
      .then(data => {
        setCards(data);
      })
      .catch((error) => alert(error))
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    const tockenCheck = () => {
      const token = localStorage.getItem('token');
      if (token) {
        auth.getContent(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push('/');
        })
        .catch(() => {
          history.push('/sign-in');
        })  
      }
    }

    tockenCheck();
  }, [history]);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      setCards(newCards);
    })
    .catch((error) => alert(error))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      const newCards = cards.filter((c) => c._id !== card._id);
      setCards(newCards);
    })
    .catch((error) => alert(error))
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const handleDeleteCardClick = (card) => {
    setIsConfirmDeletePopupOpen(true);
    setCardToDelete(card);  
  }

  const handleClosePopupOverlay = (event) => {
    const target = event.target;
    if(target.classList.contains('popup') || target.classList.contains('popup__close')) {
      closeAllPopups();
    }
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
    setCardToDelete(null);
  };

  React.useEffect(() => {
    function handleEsc (event) {
      if (event.keyCode === 27) 
        closeAllPopups();
    }
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    }
  })

  function handleUpdateUser(userData) {
    api.updateUserData(userData)
    .then((newUserData)=> {
      setCurrentUser(newUserData);
    })
    .catch((error) => alert(error))
  }

  function handleUpdateAvatar(data) {
    api.updateAvatar(data)
    .then((newData) => {
      setCurrentUser(newData);
    })
    .catch((error) => alert(error))
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data)
    .then((newCard) => {
      setCards([newCard, ...cards]); 
    })
    .catch((error) => alert(error))
  }

  function onRegister(email, password) {
    auth.register(email, password)
    .then((res) => {
      setIsRegisterSuccess(true);
      setIsInfoTooltipOpen(true);
      history.push('/sign-in'); 
    })
    .catch(() => {
      setIsRegisterSuccess(false);
      setIsInfoTooltipOpen(true);
    })
  }

  function onLogin(email, password) {
    auth.authorize(email, password)
    .then(() => {
      setIsLoggedIn(true);
      history.push('/');
    })
    .catch(() => {
      setIsRegisterSuccess(false);
      setIsInfoTooltipOpen(true);
    })
  }

  return (
    <CurrentUserContext.Provider value = {currentUser}>
    <div className="page">      
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        email={email}
      />

      <div className="page__container">
        <Switch>
          <Route path ='/sign-up'>
            <Register
              onRegister={onRegister}
            />
          </Route>
          <Route path = '/sign-in'>
            <Login
              onLogin={onLogin}
            />
          </Route>
          <ProtectedRoute 
            path = '/' 
            isLoggedIn={isLoggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteCardClick}
            cards={cards}
          />
        </Switch>  
          
        <Footer />

        <ImagePopup 
          card={selectedCard}
          onClose={closeAllPopups}
          overlayClick={handleClosePopupOverlay}
        />

        <EditProfilePopup 
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups} 
          onOverlay={handleClosePopupOverlay}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onOverlay={handleClosePopupOverlay}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup 
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups} 
          onOverlay={handleClosePopupOverlay}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />

        <ConfirmDeletePopup 
          isOpen={isConfirmDeletePopupOpen}
          onClose={closeAllPopups} 
          onOverlay={handleClosePopupOverlay}
          onConfirmDeleteSubmit={handleCardDelete}
          card={cardToDelete}
        />

        <InfoTooltip 
          isOpen={isInfoTooltipOpen}
          onOverlay={handleClosePopupOverlay}
          onClose={closeAllPopups}
          isSuccess={isRegisterSuccess}
        />        
      </div>
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
