import React from 'react';
import { useRoutes } from './routes';
import './assets/css/style.min.css';
import './assets/css/admin.css';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';

function App() {
    // Ініціалізація змінних
  const { token, login, logout, userId, isAdmin } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated, Boolean(isAdmin), userId);
  return (
      // Ініціалізація провайдеру авторизації
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        isAuthenticated,
        isAdmin: Boolean(isAdmin)
      }}>
         {/*Ініціалізація роутів, імпортованих з іншого файлу*/}
      {routes}
    </AuthContext.Provider>
  );
}

export default App;
