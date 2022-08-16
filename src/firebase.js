// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD0aJdaf8XMUASuUUbN2qXazhJM7XSEVng',
  authDomain: 'reactr-2cec5.firebaseapp.com',
  projectId: 'reactr-2cec5',
  storageBucket: 'reactr-2cec5.appspot.com',
  messagingSenderId: '725694903459',
  appId: '1:725694903459:web:d7dc67c570eeca420cfb16',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

export { firebaseApp, db };
