import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import 'materialize-css';
import {useHistory} from "react-router-dom";
import clsx from "clsx";
import {NotificationContainer, NotificationManager} from 'react-notifications';


import 'react-notifications/lib/notifications.css';


export default function AuthPage() {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { loading, request, error, clearError } = useHttp();
  const message = useMessage();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    repeat_password: '',
  });
  useEffect(() => {
    if(error !== null) {
      NotificationManager.error(error);
    }
    clearError();
  }, [error, message, clearError]);
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const registerHandler = async () => {
    if(form.password === form.repeat_password) {
      try {
        const data = await request('/api/auth/register', 'POST', { ...form });
        if(data.message !== null) {
          NotificationManager.success(data.message);
        }
        const _data = await request('/api/auth/login', 'POST', { ...form });
        auth.login(_data.token, _data.userId, false);
        setTimeout(() => {
          history.push('/');
        }, 1000)
      } catch (e) {
      }
    } else {
      setForm({ ...form, ['password']: '', ['repeat_password']: '' });
      NotificationManager.error('Паролі не співпадають');
    }
  };
  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      console.log(data)
      if(data.message !== null) {
        NotificationManager.success(data.message);
      }
      auth.login(data.token, data.userId, data.isAdmin);
      setTimeout(() => {
        history.push('/');
      }, 1000)
    } catch (e) {

    }
  };
  return (
    <main className="row">
      <NotificationContainer/>

      <div className="col s6 offset-s3 auth-wrapper">
        <div className="card blue darken-1">
          <div className="auth-tab-wrapper">
            <div className="auth-tab-tabs">
              <div className={clsx("tab", activeTab === 0 ? 'active' : '')} onClick={() => setActiveTab(0)}>Авторизація</div>
              <div className={clsx("tab", activeTab === 1 ? 'active' : '')} onClick={() => setActiveTab(1)}>Реєстрація</div>
            </div>
            <div className="auth-tab-content">
              <div className="card-content white-text">
                {activeTab === 0 ? <>
                  <div>
                    <div className="input-field">
                      <input
                          placeholder="Ваш Email"
                          id="email"
                          type="text"
                          name="email"
                          onChange={changeHandler}
                      />
                    </div>
                    <div className="input-field">
                      <input
                          placeholder="Ваш пароль"
                          id="password"
                          type="password"
                          name="password"
                          onChange={changeHandler}
                      />
                    </div>
                    <button className="btn yellow darken-4" onClick={loginHandler} disabled={loading}>
                      Увійти
                    </button>
                  </div>
                </> : ''}
                {activeTab === 1 ? <>
                  <div>
                    <div className="input-field">
                      <input
                          placeholder="Ваше ім'я"
                          id="name"
                          type="text"
                          name="name"
                          onChange={changeHandler}
                      />
                    </div>
                    <div className="input-field">
                      <input
                          placeholder="Ваш Email"
                          id="email"
                          type="text"
                          name="email"
                          onChange={changeHandler}
                      />
                    </div>
                    <div className="input-field">
                      <input
                          placeholder="Ваш пароль"
                          id="password"
                          type="password"
                          name="password"
                          onChange={changeHandler}
                      />
                    </div>
                    <div className="input-field">
                      <input
                          placeholder="Повторіть ваш пароль"
                          id="repeat_password"
                          type="password"
                          name="repeat_password"
                          onChange={changeHandler}
                      />
                    </div>
                    <button
                        className="btn grey lighten-1 black-text"
                        onClick={registerHandler}
                        disabled={loading}>
                      Зареєструватись
                    </button>
                  </div>
                </> : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
