import React from 'react';
import './loginPage.css';

const LoginPage = () => {
    return (
      <div className="login-page">
        <div className="login-container">
          <h1>Connexion</h1>
          <form>
            <label>Email :</label>
            <input type="email" placeholder="Entrez votre email" />
            <label>Mot de passe :</label>
            <input type="password" placeholder="Entrez votre mot de passe" />
            <button type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default LoginPage;