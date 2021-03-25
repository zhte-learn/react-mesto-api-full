class Auth {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _handleResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  }

  register(email, password) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then((res) => {
      return this._handleResult(res);
    });
  }

  authorize(email, password) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => {
      return this._handleResult(res);
    })
    .then((data) => {
      localStorage.setItem('token', data.token);
      return data;
    });
  }

  getContent(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`,
      }
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }
}

const auth = new Auth({
  url: 'http://api.zhte-f.nomoredomains.icu',
  //url: 'http://localhost:3000',
  headers: {
    'content-type': 'application/json'
  }
});

export default auth;
