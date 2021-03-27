// For Firebase JS SDK v7.20.0 and later, measurementId is optionalno
import firebase from "firebase";

const firebaseapp = firebase.initializeApp({
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  apiKey: "AIzaSyD7PCssh2Wg7ntZbzwllL6cfZOA34BXW9A",
  authDomain: "memeapp-react.firebaseapp.com",
  projectId: "memeapp-react",
  storageBucket: "memeapp-react.appspot.com",
  messagingSenderId: "856588951330",
  appId: "1:856588951330:web:5962284921fff57107cf7b",
  measurementId: "G-SKVL59KC8Y"

})
const db = firebaseapp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export{db,auth,storage};
