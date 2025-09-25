// Serviço para gerenciar dados da rifa com Firebase
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const COLLECTION_NAME = 'rifaData';

// Salvar reservas no Firebase
export const saveReservations = async (reservations) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, 'reservations');
    await setDoc(docRef, { data: reservations });
    console.log('Reservas salvas no Firebase');
  } catch (error) {
    console.error('Erro ao salvar reservas:', error);
    throw error;
  }
};

// Carregar reservas do Firebase
export const loadReservations = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, 'reservations');
    const docSnap = await getDocs(collection(db, COLLECTION_NAME));
    
    if (!docSnap.empty) {
      const data = docSnap.docs[0].data();
      return data.data || {};
    }
    return {};
  } catch (error) {
    console.error('Erro ao carregar reservas:', error);
    return {};
  }
};

// Salvar configuração da rifa
export const saveRifaConfig = async (config) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, 'config');
    await setDoc(docRef, { data: config });
    console.log('Configuração salva no Firebase');
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    throw error;
  }
};

// Carregar configuração da rifa
export const loadRifaConfig = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, 'config');
    const docSnap = await getDocs(collection(db, COLLECTION_NAME));
    
    if (!docSnap.empty) {
      const data = docSnap.docs[0].data();
      return data.data || {};
    }
    return {};
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    return {};
  }
};

// Escutar mudanças em tempo real
export const subscribeToReservations = (callback) => {
  const q = query(collection(db, COLLECTION_NAME));
  
  return onSnapshot(q, (querySnapshot) => {
    const data = {};
    querySnapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });
    callback(data);
  });
};
