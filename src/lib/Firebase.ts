import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';

const app = initializeApp({
  apiKey: 'AIzaSyAs4Oc6IlQzkT-s1lsLn7Xqy7DSvglj7Xs',
  authDomain: 'astute-charter-333612.firebaseapp.com',
  projectId: 'astute-charter-333612',
  storageBucket: 'astute-charter-333612.appspot.com',
  messagingSenderId: '690312459673',
  appId: '1:690312459673:web:588f537f337ad13d77cf08',
  measurementId: 'G-KST06B19EN',
});
const auth = initializeAuth(app);

export { auth as FirebaseAuth, app as FirebaseApp };
