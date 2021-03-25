import React from 'react';
import { Link } from 'react-router-dom';


function Register (props) {
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  
  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onRegister(email, password);
  } 

  return (
    <div className="sign">
      <h1 className="sign__header">Регистрация</h1>
      <form className="sign__form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" value={email} onChange={handleChangeEmail}></input>
        <input type="password" placeholder="Пароль" value={password} onChange={handleChangePassword}></input>
        <button className="form__button form__button_white">Зарегистрироваться</button>
      </form>
      <p className="sign__text">Уже зарегистрированы? 
        <Link to="sign-in" className="sign__link">Войти</Link>
      </p>
    </div>
  )
}

export default Register;
