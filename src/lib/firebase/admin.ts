
// src/lib/firebase/admin.ts
import * as admin from 'firebase-admin';

// Funcție pentru a decoda stringul Base64 și a-l transforma în obiect JSON
const getServiceAccount = () => {
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountB64) {
    throw new Error('Variabila de mediu FIREBASE_SERVICE_ACCOUNT nu este setată sau nu este accesibilă pe server.');
  }
  try {
    const decodedString = Buffer.from(serviceAccountB64, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (error: any) {
    console.error("Eroare la decodarea sau parsarea cheii de serviciu Firebase:", error);
    throw new Error(`Cheia de serviciu Firebase este invalidă: ${error.message}`);
  }
};

let db: admin.firestore.Firestore;

function initializeAdminApp() {
  // Verificăm dacă aplicația a fost deja inițializată pentru a evita erorile.
  if (admin.apps.length > 0) {
    // Dacă da, folosim instanța existentă.
    if (!db) {
        db = admin.firestore();
    }
    return;
  }
  
  // Dacă nu, inițializăm o nouă aplicație.
  try {
    admin.initializeApp({
      credential: admin.credential.cert(getServiceAccount()),
    });
    console.log('Firebase Admin SDK a fost inițializat cu succes.');
    db = admin.firestore();
  } catch (error: any) {
    console.error("EROARE CRITICĂ: Nu s-a putut inițializa Firebase Admin SDK.", error);
    // Aruncăm eroarea mai departe pentru a opri procesele care depind de ea
    // și pentru a oferi un feedback clar în log-uri.
    throw new Error(`Eroare la inițializarea Firebase Admin: ${error.message}`);
  }
}

// Aceasta este funcția pe care o vor folosi toate rutele API
export function getAdminDb() {
  // Inițializează aplicația dacă nu este deja pornită.
  // Această funcție conține logica pentru a preveni re-inițializarea.
  initializeAdminApp();
  
  // Returnează instanța bazei de date.
  // Grație logicii de mai sus, 'db' va fi mereu definită aici dacă nu a apărut o eroare critică.
  return db;
}
