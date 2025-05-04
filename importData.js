const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrgZO8kQa7puAr_01y0pi3BGFL-1jVTW0",
  authDomain: "kirayedaar-57bea.firebaseapp.com",
  projectId: "kirayedaar-57bea",
  storageBucket: "kirayedaar-57bea.firebasestorage.app",
  messagingSenderId: "308201874277",
  appId: "1:308201874277:web:cee2a90cc67ff1b1e1b78c",
  measurementId: "G-2X44K8FTKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to transform the data
function transformData(record) {
  return {
    bhk: parseInt(record.BHK),
    rent: parseInt(record.Rent),
    size: parseInt(record.Size),
    floor: record.Floor,
    areaType: record['Area Type'],
    areaLocality: record['Area Locality'],
    city: record.City,
    furnishingStatus: record['Furnishing Status'],
    tenantPreferred: record['Tenant Preferred'],
    bathroom: parseInt(record.Bathroom),
    pointOfContact: record['Point of Contact'],
    postedOn: record['Posted On'],
    createdAt: new Date().toISOString()
  };
}

// Function to import data
async function importData() {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync('House_Rent_Dataset.json', 'utf8'));
    
    // Import in batches of 500 to avoid overwhelming Firebase
    const batchSize = 500;
    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);
      const promises = batch.map(record => 
        addDoc(collection(db, 'rooms'), transformData(record))
      );
      
      try {
        await Promise.all(promises);
        console.log(`Imported batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(jsonData.length/batchSize)}`);
      } catch (error) {
        console.error('Error importing batch:', error);
      }
    }
    
    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Error reading or processing data:', error);
  }
}

// Run the import
importData(); 