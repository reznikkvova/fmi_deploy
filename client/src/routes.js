import React, {useEffect, useState} from 'react';
import { Switch, Redirect, Route } from 'react-router';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import AuthPage from './pages/Auth';
import Account from "./pages/Account";
import AdminPanel from "./pages/Admin/AdminPanel";
import AdminUpdateTire from "./pages/Admin/AdminUpdateTire";
import Axios from "axios";

export const useRoutes = (isAuthenticated, isAdmin, userId) => {

    const [itemsInCart, setItemInCart] = useState(0);
    const [params, setParams] = useState({});
    const [searchFromHome, setSearchFromHome] = useState(false);

    const handleSetParams = (par) => {
        setParams(par);
    }
    const handleSetSearchFromHome = (bool) => {
        setSearchFromHome(bool);
    }
    const handleUserLogout = () => {
        setItemInCart(0);
    }
    useEffect(() => {
        if(userId !== null) {
            handleRequest();
        }
    }, [userId])

    const handleRequest = () => {
      Axios.get('/api/cart/get-items-count', {
        params: {
          userId: userId
        }
      }).then((response) => {
                setItemInCart(response.data.count);
      });
    }

    return (
      <Switch>
        <>
            <div className="loading">
            </div>
          <Header isAdmin={isAdmin} itemsInCart={itemsInCart}/>
          <div className="content">
            <Route exact path="/">
              <Home handleSetParams={handleSetParams} handleSetSearchFromHome={handleSetSearchFromHome}/>
            </Route>
            <Route exact path="/tires">
              <Shop handleRequest={handleRequest} params={params} handleSetParams={handleSetParams} searchFromHome={searchFromHome} handleSetSearchFromHome={handleSetSearchFromHome}/>
            </Route>
            <Route exact path="/about-us">
              <About />
            </Route>
            <Route exact path="/contacts">
              <Contact />
            </Route>
            <Route exact path="/cart">
                {!isAuthenticated ? <Redirect to="/login" /> : <Cart handleRequest={handleRequest}/> }
            </Route>

              <Route exact path='/account'>
                  {!isAuthenticated ?
                      <Redirect to="/login" />
                      :
                      <Account handleRequest={handleRequest}
                               handleUserLogout={handleUserLogout}/> }
              </Route>


              <Route exact path='/login'>
                  {isAuthenticated ? <Redirect to="/account" /> : <AuthPage handleRequest={handleRequest}/> }
              </Route>
            <Route exact path='/admin'>
             {/*{isAdmin ? <AdminPanel/> : <Redirect to="/"/> }*/}
              <AdminPanel/>
            </Route>
            <Route exact path='/admin/edit/:id'>
             {/*{isAdmin ? <AdminPanel/> : <Redirect to="/"/> }*/}
              <AdminUpdateTire/>
            </Route>
          </div>
          <Footer />
        </>
      </Switch>
    );
};
