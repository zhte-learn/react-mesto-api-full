class Api {
  constructor(config) {
    this._url = config.url;
    //this._headers = config.headers;
  }

  _handleResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  }

  getAllCards() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }

  getUserData() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      }

    })
    .then((res) => {
      return this._handleResult(res);
    })
  }
  
  addNewCard(data) {
    return fetch(`${this._url}/cards`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }

  updateUserData(data) {
    return fetch(`${this._url}/users/me`, {
      //method: "PATCH",
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      },
      //credentials: 'include',
      body: JSON.stringify(data),
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }

  /* updateAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      //method: "PATCH",
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }
 */
  updateAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      //method: "PATCH",
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      },
      //credentials: 'include',
      body: JSON.stringify(data),
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }

  addLike(id) {
    return fetch(`${this._url}/cards/likes/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }

  deleteLike(id) {
    return fetch(`${this._url}/cards/likes/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then((res) => {
      return this._handleResult(res);
    })
  }

  changeLikeCardStatus(id, isLiked) {
    if(isLiked) {
      return this.addLike(id);
    } else {
      return this.deleteLike(id);
    }
  }
}

const api = new Api({
  url: 'https://api.zhte-f.nomoredomains.icu',
  //url: 'http://localhost:3000',
});

export default api;