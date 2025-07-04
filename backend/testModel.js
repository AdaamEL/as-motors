const vehiculeModel = require('./models/vehiculeModel');

const testModel = async () => {
  try {
    const vehicule = await vehiculeModel.createVehicle({
      marque: 'Toyota',
      modele: 'Corolla',
      annee: 2022,
      prix_jour: 50,
      image: 'uploads/toyota-corolla.jpg',
      disponible: true,
    });
    console.log('Véhicule ajouté :', vehicule);
  } catch (err) {
    console.error('Erreur lors de l\'ajout du véhicule :', err);
  }
};

testModel();