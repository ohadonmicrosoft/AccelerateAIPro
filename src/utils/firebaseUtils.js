import { auth, db, storage, functions } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Authentication utilities
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Firestore utilities
export const createDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
    return docRef;
  } catch (error) {
    throw error;
  }
};

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    throw error;
  }
};

// Additional Firestore utilities
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    throw error;
  }
};

export const queryDocuments = async (collectionName, queryField, queryOperator, queryValue) => {
  try {
    const q = query(
      collection(db, collectionName), 
      where(queryField, queryOperator, queryValue)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Storage utilities
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    throw error;
  }
};

// User profile utilities
export const createUserProfile = async (userId, profileData) => {
  try {
    await createDocument('users', userId, {
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

// Real-time listeners
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (doc) => {
    callback(doc.exists() ? { id: doc.id, ...doc.data() } : null);
  });
}; 