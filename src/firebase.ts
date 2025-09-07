// src/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxaXpmrfciZh4HEhcCSjkSzo_XnaPUNoU",
  authDomain: "ai-image-editor-app.firebaseapp.com",
  projectId: "ai-image-editor-app",
  storageBucket: "ai-image-editor-app.firebasestorage.app",
  messagingSenderId: "247871205953",
  appId: "1:247871205953:web:db81a446add29190f5ccc0"
};

let firebaseApp;

// Check if a Firebase app has already been initialized
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

const auth = getAuth(firebaseApp);

export { auth };