import React from 'react';
import './registerPage.css';

const RegisterPage = () => {
    return (
      <div className="register-page">
        <div className="register-container">
          <h1>Inscription</h1>
          <form>
            <label>Nom :</label>
            <input type="text" placeholder="Entrez votre nom" />
            <label>Email :</label>
            <input type="email" placeholder="Entrez votre email" />
            <label>Mot de passe :</label>
            <input type="password" placeholder="Entrez votre mot de passe" />
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default RegisterPage;