import logo from '../images/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header (props) {
  const location = useLocation();
  
  function signOut() {
    localStorage.removeItem('token');
    props.setIsLoggedIn(false);
  }
  
  return (
    <header className="header">
      <div className="header__container">
        <a className="header__link" href="https://yandex.ru/">
          <img className="logo" src={logo} alt="Логотип Mesto" />
        </a>
        { props.isLoggedIn ? 
          <div className="header__nav">
            <p className="header__nav-item">{props.email}</p> 
            <Link onClick={signOut} to="sign-in" className="header__nav-item header__nav-item_link header__nav-item_dark">Выход</Link>
          </div> :              
          location.pathname === '/sign-in' ? 
            <Link to='sign-up' className="header__nav-item header__nav-item_link">Регистрация</Link> : 
            <Link to='sign-in' className="header__nav-item header__nav-item_link">Вход</Link>
         }
      </div>
    </header>
  )
}

export default Header;
