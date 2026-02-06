import api from './api';

// Plus d'URL en dur ! On utilise l'instance api qui pointe déjà vers /api
// L'appel devient api.get('/vehicules') ce qui donne http://localhost:5000/api/vehicules

const getAllVehicules = async () => {
  const response = await api.get('/vehicules');
  return response.data;
};

const getVehiculeById = async (id) => {
  const response = await api.get(`/vehicules/${id}`);
  return response.data;
};

const createReservation = async (reservationData) => {
  const response = await api.post('/reservations', reservationData);
  return response.data;
};

const getMyReservations = async () => {
  const response = await api.get('/reservations/my-reservations');
  return response.data;
};

const vehiculeService = {
  getAllVehicules,
  getVehiculeById,
  createReservation,
  getMyReservations
};

export { getAllVehicules, getVehiculeById, createReservation, getMyReservations };
export default vehiculeService;