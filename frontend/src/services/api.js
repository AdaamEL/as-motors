import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL de votre backend

// Récupérer tous les véhicules
export const getVehicules = async () => {
  const response = await axios.get(`${API_URL}/vehicules`);
  return response.data;
};

// Récupérer un véhicule par ID
export const getVehiculeById = async (id) => {
  const response = await axios.get(`${API_URL}/vehicules/${id}`);
  return response.data;
};

// Ajouter un véhicule
export const addVehicule = async (vehicule) => {
  const response = await axios.post(`${API_URL}/vehicules`, vehicule);
  return response.data;
};

// Enregistrer un utilisateur
export const registerUser = async (user) => {
  const response = await axios.post(`${API_URL}/auth/register`, user);
  return response.data;
};

// Connecter un utilisateur
export const loginUser = async (user) => {
  const response = await axios.post(`${API_URL}/auth/login`, user);
  return response.data;
};

// Envoyer un message de contact
export const sendContactMessage = async (message) => {
  const response = await axios.post(`${API_URL}/contact`, message);
  return response.data;
};
