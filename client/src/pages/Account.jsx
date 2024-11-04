import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom";
import {useAuth} from "../hooks/auth.hook";

import Axios from "axios";
import clsx from "clsx";
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default function Account({handleRequest}) {

    const auth = useContext(AuthContext);
    const history = useHistory();
    const {  userId } = useAuth();

    const [form, setForm] = useState({
        userId: userId,
        name: '',
        email: '',
        phone: '',
        deliveryCity: '',
        deliveryAddress: ''
    })
    const handleLogout = () => {
        auth.logout();
        history.push('/login');
        handleRequest();
    };

    const onLoadUserInfo = () => {
        Axios.get('/api/user-crud/get-user', {
            params: {
                userId: userId
            }
        }).then((response) => {
            let _form = Object.assign({}, form);

            const { email, phone, deliveryCity, deliveryAddress, name } = response.data.user;
            _form.userId = userId;
            _form.email = email;
            _form.name = name;
            _form.phone = phone;
            _form.deliveryCity = deliveryCity;
            _form.deliveryAddress = deliveryAddress;
            setForm(_form);
        });
    }

    const changeHandler = (event) => {
            setForm({ ...form, [event.target.name]: event.target.value });
    };

    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        repeat_new: ''
    })
    const passwordChangeHandler = (event) => {
        setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
    };

    const handleSaveAccountDetails = () => {
        Axios.put(`/api/user-crud/update/${userId}`,{...form}).then((response) => {
            NotificationManager.success(response.data.message);
        }, (error) => {
            NotificationManager.error(error?.data?.message ? error.data.message : (error?.message ? error.message : 'Помилка'));
        });
    }
    const handleSaveNewPassword = () => {
        if(passwordForm.new === passwordForm.repeat_new) {
            try {
                Axios.put(`/api/user-crud/update-password/${userId}`,{...passwordForm}).then((response) => {
                    NotificationManager.success(response.data.message);
                }, (error, response ) => {
                    NotificationManager.error(error?.data?.message ? error.data.message : (error?.message ? error.message : 'Помилка'));
                });
            } catch (e) {
            }
        } else {
            setPasswordForm({ ['current']: '', ['new']: '', ['repeat_new']: '' });
            NotificationManager.error('Паролі не співпадають');
        }
        /*Axios.put(`/api/user-crud/update/${userId}`,{...form}).then((response) => {
            alert(response.data.message);
        }, (error) => {
            alert(error.data.message);
        });*/
    }

    useEffect(() => {
        if(userId !== null)  {
            onLoadUserInfo();
        }
    }, [userId])

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="container">
            <NotificationContainer/>
            <div className="admin-menu admin-create account-page">
                <div className='account-page-tabs'>
                    <div className={clsx("account-page-tab", activeTab === 0 ? 'active' : '')} onClick={() => setActiveTab(0)}>Редагування</div>
                    <div className={clsx("account-page-tab", activeTab === 1 ? 'active' : '')} onClick={() => setActiveTab(1)}>Зміна паролю</div>
                    <div className={clsx("account-page-tab", activeTab === 2 ? 'active' : '')} onClick={() => setActiveTab(2)}>Історія замовлень</div>
                </div>
                <div className="account-page-tab-content">
                {activeTab === 0 ?
                <>
                    <label htmlFor="name" className='admin-menu-label'>
                        Name:
                        <input type="text" value={form.name} id='name' name='name' placeholder='Name' onChange={changeHandler}/>
                    </label>
                    <label htmlFor="email" className='admin-menu-label'>
                        Email:
                        <input type="text" disabled={true} value={form.email} id='email' name='email' placeholder='Email' />
                    </label>
                    <label htmlFor="phone" className='admin-menu-label'>
                        Телефон:
                        <input type="text" value={form.phone} id='phone' name='phone' placeholder='Телефон' onChange={changeHandler}/>
                    </label>
                    <label htmlFor="deliveryCity" className='admin-menu-label'>
                        Місто доставки:
                        <input type="text" value={form.deliveryCity} id='deliveryCity' name='deliveryCity' placeholder='Місто доставки' onChange={changeHandler}/>
                    </label>
                    <label htmlFor="deliveryAddress" className='admin-menu-label'>
                        Адреса доставки:
                        <input type="text " value={form.deliveryAddress} id='deliveryAddress' name='deliveryAddress' placeholder='Адреса доставки' onChange={changeHandler}/>
                    </label>
                    <div className="admin-menu-button admin-create-button" onClick={() => handleSaveAccountDetails()}> Зберегти зміни </div>
                </> : ''
                }
                {activeTab === 1 ?
                <>
                    <label htmlFor="name" className='admin-menu-label'>
                        Існуючий пароль:
                        <input type="password" value={passwordForm.current} id='current' name='current' placeholder='Існуючий пароль' onChange={passwordChangeHandler}/>
                    </label>
                    <label htmlFor="name" className='admin-menu-label'>
                        Новий пароль:
                        <input type="text" value={passwordForm.new} id='new' name='new' placeholder='Новий пароль' onChange={passwordChangeHandler}/>
                    </label>
                    <label htmlFor="name" className='admin-menu-label'>
                        Повторіть новий пароль:
                        <input type="text" value={passwordForm.repeat_new} id='repeat_new' name='repeat_new' placeholder='Повторіть новий пароль' onChange={passwordChangeHandler}/>
                    </label>
                    <div className="admin-menu-button admin-create-button" onClick={() => handleSaveNewPassword()}> Зберегти зміни </div>
                </> : ''
                }
                {activeTab === 2 ? '2' : ''}
                </div>

                <div className="admin-menu-button admin-create-button" onClick={() => handleLogout()}> Вийти з акаунту </div>
            </div>
        </div>
    )
}