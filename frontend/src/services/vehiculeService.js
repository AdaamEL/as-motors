import axios from "axios";

const API_URL = "https://as-motors.onrender.com/api/vehicules";

// ✅ Récupérer tous les véhicules (public)
export const getAllVehicules = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ✅ Récupérer un véhicule par ID
export const getVehiculeById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// ✅ Créer un nouveau véhicule (admin uniquement)
export const createVehicule = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Mettre à jour un véhicule (admin uniquement)
export const updateVehicule = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Supprimer un véhicule (admin uniquement)
export const deleteVehicule = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
